/* Sakhi audio.
 *
 * The voice is ElevenLabs, reached through the `sakhi-tts` Supabase edge
 * function. Browser speech synthesis is a FALLBACK ONLY, for when the provider
 * is unreachable or the device is offline — it is noticeably robotic and is not
 * what this app should sound like to a child.
 *
 * Rules this module enforces:
 *   - The audio element and AudioContext are primed inside the child's FIRST tap
 *     on "Start Adventure", so nothing is swallowed by autoplay policy.
 *   - Narration is fetched once per (profile, kind, text) and cached as a blob.
 *     "Hear again" replays that blob; it never re-synthesises or re-downloads.
 *   - The current activity's narration is warmed ahead of time and the next
 *     activity's is prefetched, because a cold provider call costs about a
 *     second and a five-year-old will not wait for it.
 *   - Every route change stops playback, so two narrations cannot overlap.
 *   - Faults are typed, never generic.
 *
 * Isolated phonemes must come from the validated local bank, never from any TTS:
 * an engine says "tuh" for /t/, which teaches the wrong sound. `playPhoneme`
 * refuses to substitute.
 */
window.SakhiAudio = (function () {
  'use strict';

  var PHONEMES = {
    m: 'phoneme_m', s: 'phoneme_s', t: 'phoneme_t', p: 'phoneme_p', n: 'phoneme_n',
    k: 'phoneme_k', b: 'phoneme_b', d: 'phoneme_d', g: 'phoneme_g', f: 'phoneme_f',
    l: 'phoneme_l', r: 'phoneme_r', h: 'phoneme_h',
    a: 'phoneme_a', e: 'phoneme_e', i: 'phoneme_i', o: 'phoneme_o', u: 'phoneme_u',
    sh: 'phoneme_sh', ch: 'phoneme_ch', th: 'phoneme_th', wh: 'phoneme_wh',
    ck: 'phoneme_ck', ng: 'phoneme_ng',
    j: 'phoneme_j', v: 'phoneme_v', w: 'phoneme_w', y: 'phoneme_y', z: 'phoneme_z',
    kw: 'phoneme_kw', ks: 'phoneme_ks'
  };
  var PHONEME_DIR = './assets/audio/phonemes/';
  var PHONEME_EXT = '.ogg';
  var PHONEMES_PRESENT = ['t', 'p'];

  var FAULT = {
    UNSUPPORTED: 'UNSUPPORTED',
    BLOCKED: 'BLOCKED',
    SILENT: 'SILENT',
    NETWORK: 'NETWORK',
    MISSING_ASSET: 'MISSING_ASSET',
    DISABLED: 'DISABLED'
  };

  var ctx = null, unlocked = false, enabled = true;
  var player = null;                 // the one HTMLAudioElement, primed on first tap
  var blobCache = {}, inflight = {}; // narration blobs, keyed profile|kind|text
  var phonemeCache = {};
  var activeSources = [];
  var listeners = [], lastFault = null, lastRequest = null;
  var voice = 'elevenlabs';          // or 'fallback' once the provider has failed

  function cfg() { return window.RAINBOW_CONFIG || {}; }
  function onFault(fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }
  function raise(kind, message, cause) {
    var e = new Error(message); e.name = 'AudioFault'; e.kind = kind; e.cause = cause;
    lastFault = e;
    listeners.forEach(function (fn) { try { fn(e); } catch (err) {} });
    return e;
  }

  function supported() {
    return typeof window !== 'undefined' && typeof Audio !== 'undefined';
  }

  /* Read narration the way a person would. Without this the provider literally
   * reads out the slashes in "/m/". */
  function normalise(text) {
    var s = String(text == null ? '' : text).trim();
    if (!s) return '';
    s = s.replace(/\/([a-z]{1,2})\//gi, function (_, p) { return 'the ' + p.toLowerCase() + ' sound'; });
    return s.replace(/\s+/g, ' ');
  }

  /* Call from the FIRST real user gesture. Priming a muted play() here is what
   * makes every later playback work on iPad. */
  function unlock() {
    if (unlocked) return Promise.resolve(true);
    if (!supported()) { raise(FAULT.UNSUPPORTED, 'This browser cannot play Sakhi audio.'); return Promise.resolve(false); }
    try {
      player = player || new Audio();
      player.preload = 'auto';
      player.playsInline = true;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { ctx = ctx || new AC(); if (ctx.resume) ctx.resume().catch(function () {}); }
      if ('speechSynthesis' in window) {
        var u = new SpeechSynthesisUtterance(' '); u.volume = 0;
        try { speechSynthesis.speak(u); } catch (e) {}
      }
      var silent = new Audio('data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAACAAACcQCA');
      silent.muted = true;
      return silent.play().then(function () {
        silent.pause(); unlocked = true; return true;
      }).catch(function (e) {
        if (e && e.name === 'NotAllowedError') {
          raise(FAULT.BLOCKED, 'Audio is waiting for a tap before it can play.');
          return false;
        }
        unlocked = true;   // some browsers reject the data URI but allow real audio
        return true;
      });
    } catch (e) {
      raise(FAULT.UNSUPPORTED, 'Audio could not start on this device.', e);
      return Promise.resolve(false);
    }
  }

  function setEnabled(v) { enabled = !!v; if (!enabled) stopAll(); }
  function isEnabled() { return enabled; }
  function isUnlocked() { return unlocked; }
  function voiceInUse() { return voice; }

  function stopAll() {
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {}
    if (player) { try { player.pause(); player.currentTime = 0; } catch (e) {} }
    activeSources.forEach(function (s) { try { s.stop(0); } catch (e) {} });
    activeSources = [];
  }

  /* ---- ElevenLabs narration ------------------------------------------------ */

  function key(text, kind, profile) { return profile + '|' + kind + '|' + text; }

  function fetchVoice(text, kind, profile) {
    var c = cfg();
    if (!c.ttsEndpoint || !c.supabaseAnonKey) {
      return Promise.reject(raise(FAULT.NETWORK, 'The Sakhi voice is not configured in this build.'));
    }
    var k = key(text, kind, profile);
    if (blobCache[k]) return Promise.resolve(blobCache[k]);
    if (inflight[k]) return inflight[k];

    /* The edge function returns 502 under concurrent cold load, so a single
     * retry after a short pause turns a dropped line into a warmed one. */
    var TRANSIENT = [429, 500, 502, 503, 504];
    function attempt(triesLeft) {
      return fetch(c.ttsEndpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'apikey': c.supabaseAnonKey,
          'x-client-info': 'sakhi-magic-learning/7'
        },
        body: JSON.stringify({ text: text, kind: kind, profile: profile })
      }).then(function (r) {
        if (!r.ok) {
          if (triesLeft > 0 && TRANSIENT.indexOf(r.status) !== -1) {
            return new Promise(function (res) { setTimeout(res, 600); }).then(function () { return attempt(triesLeft - 1); });
          }
          throw raise(FAULT.NETWORK, 'The Sakhi voice service answered ' + r.status + '.');
        }
        var type = r.headers.get('content-type') || '';
        if (type.indexOf('audio/') === -1) throw raise(FAULT.NETWORK, 'The voice service returned ' + (type || 'an unknown type') + '.');
        return r.blob();
      });
    }

    var task = attempt(2).then(function (blob) {
      /* A few bytes of "audio" is an error page with the wrong header. */
      if (blob.size < 500) throw raise(FAULT.NETWORK, 'The voice service returned too little audio.');
      blobCache[k] = blob;
      return blob;
    }).catch(function (e) {
      if (e && e.name === 'AudioFault') throw e;
      throw raise(FAULT.NETWORK, 'Could not reach the Sakhi voice service.', e);
    });

    inflight[k] = task;
    task.catch(function () {}).then(function () { delete inflight[k]; });
    return task;
  }

  function playBlob(blob) {
    stopAll();
    var url = URL.createObjectURL(blob);
    player = player || new Audio();
    player.playsInline = true;
    player.src = url;
    return player.play().then(function () {
      return new Promise(function (resolve) {
        player.onended = function () { URL.revokeObjectURL(url); resolve(true); };
        player.onerror = function () { URL.revokeObjectURL(url); resolve(false); };
      });
    }).catch(function (e) {
      URL.revokeObjectURL(url);
      throw raise(e && e.name === 'NotAllowedError' ? FAULT.BLOCKED : FAULT.SILENT,
        e && e.name === 'NotAllowedError'
          ? 'Audio needs one tap on the screen before it can play.'
          : 'The voice started but nothing was heard — check the volume and the side switch.', e);
    });
  }

  /* Browser speech synthesis. Only reached when the provider fails. */
  function fallbackSpeak(text) {
    if (!('speechSynthesis' in window)) return Promise.reject(raise(FAULT.UNSUPPORTED, 'This browser has no speech support.'));
    stopAll();
    return new Promise(function (resolve, reject) {
      var u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9; u.pitch = 1.1;
      var started = false;
      u.onstart = function () { started = true; };
      u.onend = function () { resolve(true); };
      u.onerror = function (e) {
        if (e && (e.error === 'interrupted' || e.error === 'canceled')) return resolve(false);
        reject(raise(FAULT.NETWORK, 'The voice could not be played.', e));
      };
      speechSynthesis.speak(u);
      setTimeout(function () {
        if (!started) reject(raise(unlocked ? FAULT.SILENT : FAULT.BLOCKED,
          unlocked ? 'The voice started but nothing was heard — check the volume and the side switch.'
                   : 'Audio needs one tap on the screen before it can play.'));
      }, 1200);
    });
  }

  function speak(text, opts) {
    opts = opts || {};
    if (!enabled) return Promise.reject(raise(FAULT.DISABLED, 'Audio is switched off in Parent settings.'));
    var clean = normalise(text);
    if (!clean) return Promise.resolve(false);
    var kind = opts.kind || 'instruction', profile = opts.profile || 'sakhi';
    lastRequest = { text: clean, kind: kind, profile: profile };

    return fetchVoice(clean, kind, profile).then(function (blob) {
      voice = 'elevenlabs';
      return playBlob(blob);
    }).catch(function (e) {
      /* Autoplay blocking is not a provider problem; do not downgrade the voice. */
      if (e && e.kind === FAULT.BLOCKED) throw e;
      voice = 'fallback';
      return fallbackSpeak(clean);
    });
  }

  /* "Hear again" replays the cached blob — no refetch, no re-synthesis. */
  function repeat() {
    if (!lastRequest) return Promise.resolve(false);
    if (lastRequest.question) return speakQuestion(lastRequest.question);
    if (lastRequest.structured) return speakStructured(lastRequest.structured, lastRequest.opts || {});
    if (lastRequest.phoneme) return playPhoneme(lastRequest.phoneme);
    var k = key(lastRequest.text, lastRequest.kind, lastRequest.profile);
    if (blobCache[k]) return playBlob(blobCache[k]).catch(function () { return fallbackSpeak(lastRequest.text); });
    return speak(lastRequest.text, lastRequest);
  }

  /* ---- phoneme bank -------------------------------------------------------- */

  function phonemeUrl(sym) { var b = PHONEMES[sym]; return b ? PHONEME_DIR + b + PHONEME_EXT : null; }
  function hasPhoneme(sym) { return PHONEMES_PRESENT.indexOf(sym) !== -1; }
  function hasRemotePhonemeGateway() { return !!(cfg().ttsEndpoint && cfg().supabaseAnonKey); }

  function phonemeReport() {
    var all = Object.keys(PHONEMES);
    var missing = all.filter(function (s) { return !hasPhoneme(s); });
    return {
      required: all.length,
      localVerified: all.length - missing.length,
      present: all.length - missing.length,
      missing: missing,
      remoteGateway: hasRemotePhonemeGateway(),
      complete: missing.length === 0,
      note: missing.length
        ? (all.length - missing.length) + ' of ' + all.length + ' sounds have local recordings. ' +
          (hasRemotePhonemeGateway()
            ? 'Missing local sounds use the dedicated ElevenLabs phoneme gateway, never browser TTS. A parent should still validate each isolated sound once before relying on it for instruction.'
            : 'The remaining sounds need validated recordings; browser TTS is never used for an isolated phoneme.')
        : 'All required phonemes have local validated recordings.'
    };
  }

  function playLocalPhoneme(sym) {
    lastRequest = { phoneme: sym, source: 'local' };
    var url = phonemeUrl(sym);
    if (phonemeCache[url]) return playBlob(phonemeCache[url]);
    return fetch(url).then(function (r) {
      if (!r.ok) throw raise(FAULT.MISSING_ASSET, 'That recording is not in the app yet.');
      return r.blob();
    }).then(function (b) { phonemeCache[url] = b; return playBlob(b); });
  }

  function playRemotePhoneme(sym) {
    if (!hasRemotePhonemeGateway()) return Promise.reject(raise(FAULT.MISSING_ASSET, 'No validated source is configured for /' + sym + '/.'));
    lastRequest = { phoneme: sym, source: 'remote' };
    return fetchVoice(sym, 'phoneme', 'sakhi').then(function (blob) {
      voice = 'elevenlabs';
      return playBlob(blob);
    });
  }

  /* Local validated recordings are preferred. The dedicated server phoneme
   * route is the only fallback; generic speech synthesis is never allowed for
   * an isolated sound. */
  function playPhoneme(sym) {
    sym = String(sym || '').replace(/^\//, '').replace(/\/$/, '').toLowerCase();
    if (!enabled) return Promise.reject(raise(FAULT.DISABLED, 'Audio is switched off in Parent settings.'));
    if (!PHONEMES[sym]) return Promise.reject(raise(FAULT.MISSING_ASSET, 'Unknown sound "' + sym + '".'));
    return hasPhoneme(sym) ? playLocalPhoneme(sym) : playRemotePhoneme(sym);
  }

  function pause(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function playPhonemes(symbols) {
    return (symbols || []).reduce(function (p, sym) {
      return p.then(function () { return playPhoneme(sym); }).then(function () { return pause(90); });
    }, Promise.resolve());
  }

  /* Narration may contain /m/ style tokens. Parse them before normalisation so
   * a pure sound is played by the phoneme source rather than being spoken as a
   * letter name. */
  function speakStructured(text, opts) {
    opts = opts || {};
    var raw = String(text == null ? '' : text), re = /\/([a-z]{1,2})\//ig, parts = [], last = 0, m;
    while ((m = re.exec(raw))) {
      if (m.index > last) parts.push({ type: 'text', value: raw.slice(last, m.index) });
      parts.push({ type: 'phoneme', value: m[1].toLowerCase() });
      last = re.lastIndex;
    }
    if (last < raw.length) parts.push({ type: 'text', value: raw.slice(last) });
    if (!parts.some(function (x) { return x.type === 'phoneme'; })) return speak(raw, opts);
    lastRequest = { structured: raw, opts: opts };
    return parts.reduce(function (p, part) {
      return p.then(function () {
        if (part.type === 'phoneme') return playPhoneme(part.value);
        var clean = String(part.value).replace(/^[\s,.;:!?-]+|[\s,.;:!?-]+$/g, '').trim();
        return clean ? speak(clean, opts) : true;
      }).then(function () { return pause(70); });
    }, Promise.resolve()).then(function (r) { lastRequest = { structured: raw, opts: opts }; return r; });
  }

  function speakQuestion(question) {
    if (!question) return Promise.resolve(false);
    var text = question.narration || question.prompt || '';
    if (question.audio && Array.isArray(question.audio.phonemes) && question.audio.phonemes.length) {
      return speak(text, { kind: 'instruction', profile: 'sakhi' }).then(function () {
        return pause(120);
      }).then(function () { return playPhonemes(question.audio.phonemes); }).then(function (r) { lastRequest = { question: question }; return r; });
    }
    return speakStructured(text, { kind: 'instruction', profile: 'sakhi' }).then(function (r) { lastRequest = { question: question }; return r; });
  }

  /* ---- preload / prefetch -------------------------------------------------- */

  /* Warm every narration line in an activity. A cold provider call is about a
   * second; warmed, playback starts immediately. */
  function preloadActivity(activity) {
    if (!activity || !enabled) return Promise.resolve({ warmed: 0 });
    var lines = activity.questions.map(function (q) { return normalise(String(q.narration || '').replace(/\/([a-z]{1,2})\//ig, '')); }).filter(Boolean);
    if (!lines.length) return Promise.resolve({ warmed: 0, of: 0 });

    /* One at a time. Firing all three at once reliably drew a 502 for one of
     * them, and the child would then hear the robotic fallback mid-activity.
     * The first line is awaited because it is the one about to be spoken; the
     * rest queue up behind it while she is answering. */
    function chain(rest) {
      return rest.reduce(function (p, l) {
        return p.then(function (n) {
          return fetchVoice(l, 'instruction', 'sakhi').then(function () { return n + 1; }, function () { return n; });
        });
      }, Promise.resolve(0));
    }

    return fetchVoice(lines[0], 'instruction', 'sakhi').then(function () {
      chain(lines.slice(1));
      return { warmed: 1, of: lines.length, rest: 'warming' };
    }, function () {
      chain(lines.slice(1));
      return { warmed: 0, of: lines.length, rest: 'warming' };
    });
  }

  function prefetchActivity(activity) {
    if (!activity) return;
    var run = function () { preloadActivity(activity); };
    if ('requestIdleCallback' in window) requestIdleCallback(run); else setTimeout(run, 800);
  }

  function describe(fault) {
    if (!fault) return null;
    switch (fault.kind) {
      case FAULT.BLOCKED: return { title: 'Tap once to turn on sound', body: 'Your browser waits for a tap before it plays audio.', action: 'Tap anywhere' };
      case FAULT.SILENT: return { title: 'Sound is on, but nothing is coming out', body: 'Check the volume and the side switch on the iPad.', action: 'Check volume' };
      case FAULT.NETWORK: return { title: 'Sakhi’s voice could not load', body: 'Using the backup voice for now. Reading still works.', action: 'Try again' };
      case FAULT.MISSING_ASSET: return { title: 'That sound is not in the app yet', body: fault.message, action: null };
      case FAULT.DISABLED: return { title: 'Audio is off', body: 'A grown-up switched audio off in Parent settings.', action: 'Open Parent settings' };
      case FAULT.UNSUPPORTED: return { title: 'This browser cannot play Sakhi audio', body: 'Try Safari or Chrome.', action: null };
      default: return { title: 'Sound problem', body: fault.message, action: null };
    }
  }

  function status() {
    return {
      voice: voice, unlocked: unlocked, enabled: enabled,
      configured: !!(cfg().ttsEndpoint && cfg().supabaseAnonKey),
      cachedLines: Object.keys(blobCache).length,
      phonemes: phonemeReport()
    };
  }

  return {
    FAULT: FAULT, PHONEMES: PHONEMES,
    supported: supported, unlock: unlock, isUnlocked: isUnlocked,
    setEnabled: setEnabled, isEnabled: isEnabled,
    speak: speak, speakStructured: speakStructured, speakQuestion: speakQuestion, playPhonemes: playPhonemes, repeat: repeat, stopAll: stopAll, normalise: normalise,
    playPhoneme: playPhoneme, hasPhoneme: hasPhoneme, phonemeReport: phonemeReport,
    preloadActivity: preloadActivity, prefetchActivity: prefetchActivity,
    onFault: onFault, describe: describe, status: status, voiceInUse: voiceInUse,
    lastFault: function () { return lastFault; }
  };
})();
