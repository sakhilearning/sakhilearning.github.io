/* Sakhi audio.
 *
 * Phase 8. Rules this module enforces:
 *   - The AudioContext is created and resumed from the child's FIRST tap on
 *     "Start Adventure", never lazily mid-activity, so nothing is swallowed by
 *     autoplay policy.
 *   - Narration for the current activity is preloaded; the next activity's audio
 *     is prefetched in the background.
 *   - "Hear again" replays from the local cache, never re-fetching.
 *   - Every route change stops all playback immediately, so two narrations can
 *     never overlap.
 *   - Faults are typed, not generic: blocked / silent / network / missing asset
 *     / unsupported. The UI can then say something true.
 *
 * Phase 7 note: isolated phonemes must come from the validated local bank, never
 * from TTS — a TTS engine says "tuh" for /t/, which actively teaches the wrong
 * thing. `phonemeReport()` names exactly which recordings are still missing, and
 * `playPhoneme` refuses to substitute speech synthesis for one.
 */
window.SakhiAudio = (function () {
  'use strict';

  /* The phonemes the curriculum actually needs. `file` null = not yet recorded. */
  var PHONEMES = {
    m: 'phoneme_m', s: 'phoneme_s', t: 'phoneme_t', p: 'phoneme_p', n: 'phoneme_n',
    k: 'phoneme_k', b: 'phoneme_b', d: 'phoneme_d', g: 'phoneme_g', f: 'phoneme_f',
    l: 'phoneme_l', r: 'phoneme_r', h: 'phoneme_h',
    a: 'phoneme_a', e: 'phoneme_e', i: 'phoneme_i', o: 'phoneme_o', u: 'phoneme_u',
    sh: 'phoneme_sh', ch: 'phoneme_ch', th: 'phoneme_th', wh: 'phoneme_wh',
    ck: 'phoneme_ck', ng: 'phoneme_ng'
  };
  var PHONEME_DIR = './assets/audio/phonemes/';
  var PHONEME_EXT = '.ogg';

  /* Which recordings actually exist on disk right now. Anything not listed here
   * is missing and must NOT be faked with speech synthesis. */
  var PHONEMES_PRESENT = ['t', 'p'];

  function AudioFault(kind, message, cause) {
    var e = new Error(message);
    e.name = 'AudioFault'; e.kind = kind; e.cause = cause;
    return e;
  }
  var FAULT = {
    UNSUPPORTED: 'UNSUPPORTED',       // browser has no speech/audio API at all
    BLOCKED: 'BLOCKED',               // autoplay policy: needs a user gesture
    SILENT: 'SILENT',                 // started but produced nothing (device muted / silent switch)
    NETWORK: 'NETWORK',               // provider or fetch failed
    MISSING_ASSET: 'MISSING_ASSET',   // the recording does not exist
    DISABLED: 'DISABLED'              // the parent turned audio off
  };

  var ctx = null;
  var unlocked = false;
  var enabled = true;
  var cache = {};              // url -> { buffer } | { failed: kind }
  var activeSources = [];
  var listeners = [];
  var lastFault = null;

  function onFault(fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; }
  function raise(kind, message, cause) {
    var f = AudioFault(kind, message, cause);
    lastFault = f;
    listeners.forEach(function (fn) { try { fn(f); } catch (e) {} });
    return f;
  }

  function supported() {
    return typeof window !== 'undefined' &&
      !!(window.AudioContext || window.webkitAudioContext) &&
      ('speechSynthesis' in window);
  }

  /* Call this from the FIRST real user gesture. Creating and resuming the
   * context here is what makes every later playback work on iPad. */
  function unlock() {
    if (unlocked) return Promise.resolve(true);
    if (!supported()) { raise(FAULT.UNSUPPORTED, 'This browser cannot play Sakhi audio.'); return Promise.resolve(false); }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      ctx = ctx || new AC();
      /* A zero-volume blip inside the gesture is what actually unlocks iOS. */
      var buf = ctx.createBuffer(1, 1, 22050);
      var src = ctx.createBufferSource();
      src.buffer = buf; src.connect(ctx.destination); src.start(0);
      if ('speechSynthesis' in window) {
        var u = new SpeechSynthesisUtterance(' ');
        u.volume = 0;
        speechSynthesis.speak(u);
      }
      return ctx.resume().then(function () {
        unlocked = ctx.state === 'running';
        if (!unlocked) raise(FAULT.BLOCKED, 'Audio is waiting for a tap before it can play.');
        return unlocked;
      }).catch(function (e) {
        raise(FAULT.BLOCKED, 'The browser blocked audio until the screen is tapped.', e);
        return false;
      });
    } catch (e) {
      raise(FAULT.UNSUPPORTED, 'Audio could not start on this device.', e);
      return Promise.resolve(false);
    }
  }

  function setEnabled(v) { enabled = !!v; if (!enabled) stopAll(); }
  function isEnabled() { return enabled; }
  function isUnlocked() { return unlocked; }

  /* Stop everything, right now. Called on every route change. */
  function stopAll() {
    try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {}
    activeSources.forEach(function (s) { try { s.stop(0); } catch (e) {} });
    activeSources = [];
  }

  /* ---- narration ---------------------------------------------------------- */

  var lastNarration = null;

  /* Speak instructional text. Text narration may use speech synthesis; isolated
   * phonemes may not (see playPhoneme). */
  function speak(text, opts) {
    opts = opts || {};
    if (!enabled) return Promise.reject(raise(FAULT.DISABLED, 'Audio is switched off in Parent settings.'));
    if (!('speechSynthesis' in window)) return Promise.reject(raise(FAULT.UNSUPPORTED, 'This browser has no speech support.'));
    stopAll();
    lastNarration = text;
    return new Promise(function (resolve, reject) {
      var u = new SpeechSynthesisUtterance(String(text));
      u.rate = opts.rate || 0.9;
      u.pitch = opts.pitch || 1.1;
      var started = false;
      u.onstart = function () { started = true; };
      u.onend = function () { resolve(true); };
      u.onerror = function (e) {
        /* 'interrupted'/'canceled' are our own stopAll, not a fault. */
        if (e && (e.error === 'interrupted' || e.error === 'canceled')) return resolve(false);
        reject(raise(FAULT.NETWORK, 'The voice could not be played.', e));
      };
      speechSynthesis.speak(u);
      /* If nothing ever starts, the output is almost certainly muted or blocked.
       * Reporting that specifically beats a generic "audio error". */
      setTimeout(function () {
        if (!started) {
          reject(raise(unlocked ? FAULT.SILENT : FAULT.BLOCKED,
            unlocked ? 'The voice started but nothing was heard — check the device volume and the silent switch.'
                     : 'Audio needs one tap on the screen before it can play.'));
        }
      }, 1200);
    });
  }

  /* "Hear again" must never re-fetch or re-synthesise from scratch. */
  function repeat() {
    if (lastNarration == null) return Promise.resolve(false);
    return speak(lastNarration);
  }

  /* ---- phoneme bank ------------------------------------------------------- */

  function phonemeUrl(sym) {
    var base = PHONEMES[sym];
    return base ? PHONEME_DIR + base + PHONEME_EXT : null;
  }
  function hasPhoneme(sym) { return PHONEMES_PRESENT.indexOf(sym) !== -1; }

  /* What is still missing, for the parent view and for CI. */
  function phonemeReport() {
    var all = Object.keys(PHONEMES);
    var present = all.filter(hasPhoneme);
    var missing = all.filter(function (s) { return !hasPhoneme(s); });
    return {
      required: all.length, present: present.length, missing: missing,
      complete: missing.length === 0,
      note: missing.length
        ? missing.length + ' of ' + all.length + ' phoneme recordings are missing. Isolated sounds are disabled for these; ' +
          'speech synthesis is deliberately NOT substituted because it adds a schwa ("tuh" for /t/).'
        : 'All required phonemes are present.'
    };
  }

  async function fetchBuffer(url) {
    if (cache[url]) {
      if (cache[url].failed) throw raise(cache[url].failed, 'This sound is unavailable.');
      return cache[url].buffer;
    }
    if (!ctx) { await unlock(); }
    if (!ctx) throw raise(FAULT.UNSUPPORTED, 'Audio is not available on this device.');
    var res;
    try { res = await fetch(url); }
    catch (e) { cache[url] = { failed: FAULT.NETWORK }; throw raise(FAULT.NETWORK, 'Could not download the sound.', e); }
    if (!res.ok) { cache[url] = { failed: FAULT.MISSING_ASSET }; throw raise(FAULT.MISSING_ASSET, 'That recording is not in the app yet.'); }
    var bytes = await res.arrayBuffer();
    var buffer = await ctx.decodeAudioData(bytes).catch(function (e) {
      cache[url] = { failed: FAULT.MISSING_ASSET };
      throw raise(FAULT.MISSING_ASSET, 'That recording could not be decoded.', e);
    });
    cache[url] = { buffer: buffer };
    return buffer;
  }

  /* Isolated phoneme playback. Refuses to fall back to speech synthesis. */
  async function playPhoneme(sym) {
    if (!enabled) throw raise(FAULT.DISABLED, 'Audio is switched off in Parent settings.');
    if (!PHONEMES[sym]) throw raise(FAULT.MISSING_ASSET, 'Unknown sound "' + sym + '".');
    if (!hasPhoneme(sym)) {
      throw raise(FAULT.MISSING_ASSET,
        'The pure /' + sym + '/ recording has not been added yet. Sakhi will not use a computer voice for a single sound, ' +
        'because it would say "' + sym + 'uh" and teach the wrong thing.');
    }
    var buf = await fetchBuffer(phonemeUrl(sym));
    stopAll();
    var src = ctx.createBufferSource();
    src.buffer = buf; src.connect(ctx.destination);
    activeSources.push(src);
    src.start(0);
    return new Promise(function (resolve) { src.onended = function () { resolve(true); }; });
  }

  /* ---- preload / prefetch -------------------------------------------------- */

  /* Warm whatever the given activity will need. Narration is speech-synthesised
   * so there is nothing to download; phoneme assets are fetched and decoded. */
  function preloadActivity(activity) {
    if (!activity || !enabled) return Promise.resolve({ warmed: 0 });
    var syms = [];
    activity.questions.forEach(function (q) {
      var m = String(q.narration || '').match(/\/(\w{1,2})\//g) || [];
      m.forEach(function (x) { var s = x.replace(/\//g, ''); if (PHONEMES[s] && hasPhoneme(s) && syms.indexOf(s) === -1) syms.push(s); });
    });
    return Promise.all(syms.map(function (s) {
      return fetchBuffer(phonemeUrl(s)).catch(function () { return null; });
    })).then(function (r) { return { warmed: r.filter(Boolean).length, symbols: syms }; });
  }

  /* Fire-and-forget warm of the NEXT activity while the child works on this one. */
  function prefetchActivity(activity) {
    if (!activity) return;
    if ('requestIdleCallback' in window) requestIdleCallback(function () { preloadActivity(activity); });
    else setTimeout(function () { preloadActivity(activity); }, 800);
  }

  /* Human-readable, cause-specific message for the UI. Never generic. */
  function describe(fault) {
    if (!fault) return null;
    switch (fault.kind) {
      case FAULT.BLOCKED: return { title: 'Tap once to turn on sound', body: 'Your browser waits for a tap before it plays audio.', action: 'Tap anywhere' };
      case FAULT.SILENT: return { title: 'Sound is on, but nothing is coming out', body: 'Check the volume and the side switch on the iPad.', action: 'Check volume' };
      case FAULT.NETWORK: return { title: 'The voice could not load', body: 'Sakhi could not reach the voice service. Reading still works without it.', action: 'Try again' };
      case FAULT.MISSING_ASSET: return { title: 'That sound is not in the app yet', body: fault.message, action: null };
      case FAULT.DISABLED: return { title: 'Audio is off', body: 'A grown-up switched audio off in Parent settings.', action: 'Open Parent settings' };
      case FAULT.UNSUPPORTED: return { title: 'This browser cannot play Sakhi audio', body: 'Try Safari or Chrome.', action: null };
      default: return { title: 'Sound problem', body: fault.message, action: null };
    }
  }

  return {
    FAULT: FAULT, PHONEMES: PHONEMES,
    supported: supported, unlock: unlock, isUnlocked: isUnlocked,
    setEnabled: setEnabled, isEnabled: isEnabled,
    speak: speak, repeat: repeat, stopAll: stopAll,
    playPhoneme: playPhoneme, hasPhoneme: hasPhoneme, phonemeReport: phonemeReport,
    preloadActivity: preloadActivity, prefetchActivity: prefetchActivity,
    onFault: onFault, describe: describe,
    lastFault: function () { return lastFault; }
  };
})();
