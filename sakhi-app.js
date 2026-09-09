/* Sakhi app shell.
 *
 * Phase 14: the child-led loop is the default and needs no adult.
 *   launch -> "Start Adventure" (this tap unlocks audio) -> Sakhi picks the
 *   skill -> template task -> atomic commit -> Sakhi picks the next -> rewards.
 * Nothing in that path asks a grown-up to score, script or configure anything.
 *
 * Phase 12/13: the parent view answers four questions in ten seconds and then
 * gets out of the way; the detail lives in tabs below the fold.
 */
(function () {
  'use strict';

  var Cur = window.SakhiCurriculum, Themes = window.SakhiThemes, Act = window.SakhiActivities,
      Prog = window.SakhiProgress, Adapt = window.SakhiAdaptive, Audio = window.SakhiAudio,
      Tpl = window.SakhiTemplates, Cloud = window.SakhiCloud;

  var PASS = '071621';
  var $ = function (s) { return document.querySelector(s); };
  var el = function (t, c, x) { var n = document.createElement(t); if (c) n.className = c; if (x != null) n.textContent = x; return n; };
  var clear = function (n) { while (n && n.firstChild) n.removeChild(n.firstChild); };

  var view = 'home';
  var parentUnlocked = sessionStorage.sakhiParent === '1';
  var session = null, current = null, controller = null, upcoming = null;
  var hintLevel = 0, tries = 0, qIndex = 0, answers = [], usedSkills = [], lastResult = null;
  var questionStartedAt = 0;

  function theme() { return Themes.get(Prog.load().profile.active_theme); }

  /* ---------- navigation ---------- */

  function show(v) {
    Audio.stopAll();                       // Phase 8: never let audio cross a route
    if (v === 'parent' && !parentUnlocked) {
      var p = prompt('Parent passcode');
      if (p !== PASS) { if (p !== null) toast('That passcode did not match 🔒'); return; }
      parentUnlocked = true; sessionStorage.sakhiParent = '1';
    }
    view = v;
    document.querySelectorAll('[data-nav]').forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.nav === v || (v === 'activity' && b.dataset.nav === 'home'));
    });
    document.querySelectorAll('.view').forEach(function (n) { n.classList.toggle('is-active', n.dataset.view === v); });
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('is-visible');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('is-visible'); }, 2200);
  }

  function renderStats() {
    var b = Prog.balances(), t = theme();
    $('#statPrimary').textContent = (t.rewards.primary.icon || '⭐') + ' ' + (b[t.rewards.primary.key] || 0);
    $('#statBadge').textContent = (t.rewards.badge.icon || '💎') + ' ' + (b[t.rewards.badge.key] || 0);
  }

  function render() {
    Themes.apply(Prog.load().profile.active_theme);
    renderStats();
    ({ home: renderHome, activity: renderActivity, rewards: renderRewards,
       parent: renderParent, paths: renderPaths, themes: renderThemes }[view] || renderHome)();
  }

  /* ---------- home: one button, child-led ---------- */

  function renderHome() {
    var t = theme();
    $('#homeCompanion').textContent = t.icon;
    $('#homeWorld').textContent = t.name;
    $('#homeTagline').textContent = t.tagline;
    $('#homeWelcome').textContent = t.narration.welcome;

    var placement = Adapt.placementActive();
    $('#startAdventure').textContent = placement ? '▶ Start' : '▶ Start Today’s Adventure';
    var pick = Adapt.nextActivity({ usedSkillIds: [], lastResult: null });
    $('#homeNext').textContent = placement
      ? 'Sakhi will find the right starting point first.'
      : Adapt.explain(pick);
  }

  /* ---------- the session loop ---------- */

  async function startAdventure() {
    /* THE first tap: unlock audio here and nowhere else. */
    await Audio.unlock();
    session = Prog.startSession(theme().id);
    usedSkills = []; lastResult = null; upcoming = null;
    await nextActivity();
  }

  async function nextActivity() {
    var pick = Adapt.nextActivity({ usedSkillIds: usedSkills, lastResult: lastResult });
    if (!pick) return finishSession('Everything unlocked for today is done.');
    current = upcoming && upcoming.skill_id === pick.skill_id
      ? upcoming.activity
      : Act.generate(pick.skill_id, pick.band, session.session_id + ':' + usedSkills.length);
    current._pick = pick;
    qIndex = 0; answers = []; hintLevel = 0; tries = 0;
    upcoming = null;
    show('activity');
    await Audio.preloadActivity(current);          // Phase 8: activity 1 preloaded
    speakQuestion();
    prefetchNext(pick);
  }

  /* Phase 8: warm the NEXT activity while the child works on this one. */
  function prefetchNext(pick) {
    var peek = Adapt.nextActivity({ usedSkillIds: usedSkills.concat([pick.skill_id]), lastResult: null });
    if (!peek) return;
    var a = Act.generate(peek.skill_id, peek.band, session.session_id + ':' + (usedSkills.length + 1));
    upcoming = { skill_id: peek.skill_id, activity: a };
    Audio.prefetchActivity(a);
  }

  function q() { return current.questions[qIndex]; }

  function speakQuestion() {
    Audio.speak(q().narration).catch(function (f) { showAudioFault(f); });
  }

  var faultsShown = {};
  function showAudioFault(fault) {
    var d = Audio.describe(fault);
    if (!d) return;
    if (faultsShown[fault.kind]) return;   // say it once, not once per question
    faultsShown[fault.kind] = true;
    var box = $('#audioFault');
    clear(box);
    box.appendChild(el('b', null, d.title));
    box.appendChild(el('span', null, d.body));
    box.classList.add('is-visible');
    clearTimeout(box._timer);
    box._timer = setTimeout(function () { box.classList.remove('is-visible'); }, 6000);
  }

  function renderActivity() {
    if (!current) return show('home');
    var t = theme(), question = q();
    $('#activityWorld').textContent = t.name;
    $('#activitySkill').textContent = current.skill_title;
    $('#activityBand').textContent = 'Level ' + current.band + ' · ' + current.band_name;
    $('#activityProgress').textContent = (qIndex + 1) + ' of ' + current.questions.length;
    $('#activityWhy').textContent = Adapt.explain(current._pick);
    $('#companionLine').textContent = t.companion + ': ' + t.narration.encourage;

    hintLevel = current.support.hintUpFront ? 1 : 0;
    tries = 0;
    questionStartedAt = Date.now();
    renderHint();

    controller = Tpl.render($('#interaction'), question, {
      onHear: function () { Audio.repeat().catch(showAudioFault); },
      onImmediate: function (res) { grade(res.correct, res.response); },
      onProgress: function () { $('#checkBtn').disabled = !controller.isReady(); }
    });
    $('#checkBtn').hidden = !!controller.immediate;
    $('#checkBtn').disabled = !controller.isReady();
    $('#resetBtn').hidden = !!controller.immediate;
  }

  function renderHint() {
    var box = $('#hintBox');
    clear(box);
    var hints = q().hints || [];
    for (var i = 0; i < hintLevel && i < hints.length; i++) {
      box.appendChild(el('div', 'hint', '💡 ' + hints[i]));
    }
    $('#hintBtn').disabled = hintLevel >= hints.length;
  }

  function useHint() {
    var hints = q().hints || [];
    if (hintLevel >= hints.length) return;
    hintLevel++;
    renderHint();
    Audio.speak(hints[hintLevel - 1]).catch(showAudioFault);
  }

  function grade(correct, response) {
    tries++;
    if (!correct && tries < 2) {
      /* One free retry with a hint before it counts against her. */
      if (hintLevel < (q().hints || []).length) { hintLevel++; renderHint(); }
      Audio.speak(theme().narration.encourage).catch(function () {});
      setTimeout(function () { controller.reset(); $('#checkBtn').disabled = true; }, 900);
      return;
    }
    answers.push({
      questionIndex: qIndex, correct: correct, hintsUsed: hintLevel,
      responseMs: Date.now() - questionStartedAt, response: response, tries: tries
    });
    Audio.speak(correct ? theme().narration.celebrate : 'Let us look at that one again later.').catch(function () {});
    setTimeout(function () {
      if (qIndex < current.questions.length - 1) { qIndex++; renderActivity(); speakQuestion(); }
      else finishActivity();
    }, 1000);
  }

  function finishActivity() {
    /* Phase 11: the one atomic commit. */
    var status = Prog.completeActivity({
      activity: current, sessionId: session.session_id,
      themeId: theme().id, answers: answers
    });
    lastResult = status;
    usedSkills.push(current.skill_id);

    if (Adapt.placementActive()) {
      Adapt.recordProbe(current.skill_id, status.accuracy, status.independent === status.correct);
    }

    renderStats();   // the counters must move the moment the reward is shown
    var t = theme();
    var milestone = t.milestones[Math.min(t.milestones.length - 1, usedSkills.length - 1)];
    $('#doneTitle').textContent = t.rewards.badge.icon + ' ' + current.skill_title + ' done!';
    $('#doneBody').textContent = milestone;
    clear($('#doneRewards'));
    status.rewards_issued.forEach(function (r) {
      $('#doneRewards').appendChild(el('span', 'reward-chip', '+' + r.amount + ' ' + r.label));
    });

    var cont = Adapt.shouldContinue(session, { usedSkillIds: usedSkills, lastResult: status });
    $('#doneNext').textContent = cont.continue
      ? 'Next: ' + (Cur.skill(cont.next.skill_id) || {}).title
      : 'That is today’s adventure complete.';
    $('#doneContinue').textContent = cont.continue ? 'Keep going →' : 'See my rewards ⭐';
    $('#doneContinue').onclick = function () {
      $('#doneOverlay').classList.remove('is-visible');
      if (cont.continue) nextActivity(); else finishSession();
    };
    $('#doneOverlay').classList.add('is-visible');
  }

  function finishSession(note) {
    if (session) Prog.endSession(session.session_id, note || null);
    session = null;
    show('rewards');
  }

  /* ---------- rewards ---------- */

  function renderRewards() {
    var t = theme(), b = Prog.balances();
    $('#rewardWorld').textContent = t.icon + ' ' + t.name;
    var grid = $('#rewardGrid');
    clear(grid);
    var keys = Object.keys(b);
    if (!keys.length) grid.appendChild(el('p', 'muted', 'Start an adventure to collect your first reward.'));
    keys.forEach(function (k) {
      var row = Prog.load().rewards.filter(function (r) { return r.reward_key === k; })[0] || {};
      var card = el('div', 'reward-card');
      card.appendChild(el('div', 'reward-icon', k.indexOf('star') > -1 ? '⭐' : (row.reward_label || '').slice(0, 2)));
      card.appendChild(el('b', null, String(b[k])));
      card.appendChild(el('small', null, row.reward_label || k));
      grid.appendChild(card);
    });
    var s = Prog.load();
    $('#rewardStory').textContent = s.sessions.length
      ? 'You have finished ' + s.sessions.filter(function (x) { return x.status === 'COMPLETED'; }).length + ' adventures so far.'
      : '';
  }

  /* ---------- Phase 12: the ten-second parent view ---------- */

  function renderParent() {
    var s = Prog.load();
    var pick = Adapt.nextActivity({ usedSkillIds: [], lastResult: null });
    var skill = pick && Cur.skill(pick.skill_id);

    $('#pGoal').textContent = skill ? skill.title : 'Everything unlocked is complete';
    $('#pWhy').textContent = Adapt.explain(pick);

    /* "How she is doing" from real rows only — never a fabricated number. */
    var evs = Object.keys(s.skills).map(function (k) { return s.skills[k]; });
    var practised = evs.filter(function (e) { return e.attempt_count > 0; });
    var attempts = practised.reduce(function (n, e) { return n + e.attempt_count; }, 0);
    var indep = practised.reduce(function (n, e) { return n + e.independent_correct_count; }, 0);
    var acc = attempts ? Math.round(indep / attempts * 100) : null;

    var health = $('#pHealth');
    clear(health);
    health.appendChild(el('span', 'label', 'How she is doing'));
    if (!attempts) {
      health.appendChild(el('b', null, 'No practice recorded yet'));
      health.appendChild(el('small', null, 'Numbers appear here after the first adventure.'));
    } else {
      var band = acc >= 75 ? ['Going well', 'is-good'] : acc >= 50 ? ['Working at it', 'is-ok'] : ['Needs support', 'is-low'];
      health.className = 'insight ' + band[1];
      health.appendChild(el('b', null, band[0]));
      health.appendChild(el('small', null, indep + ' of ' + attempts + ' answered independently (' + acc + '%) across ' + practised.length + ' skills'));
    }

    var next = $('#pWeek');
    clear(next);
    Cur.domains().forEach(function (d) {
      var f = Cur.frontier(d.domain_id, Prog.masteryOf)[0];
      var row = el('div', 'week-row');
      row.appendChild(el('span', 'week-domain', d.title));
      row.appendChild(el('span', 'week-skill', f ? f.title : 'all current work complete'));
      next.appendChild(row);
    });

    /* Cloud status: honest, four-valued, never a fake "synced". */
    var cs = Cloud ? Cloud.state() : { status: 'NOT_CONFIGURED', pending: 0 };
    var cloudBox = $('#pCloud');
    clear(cloudBox);
    var LABEL = {
      CONNECTED: ['Cloud progress: CONNECTED', 'Saving to your account.'],
      NOT_CONNECTED: ['Cloud progress: NOT CONNECTED', 'Progress is saved on this device only. Sign in to sync across devices.'],
      OFFLINE: ['Cloud progress: NOT CONNECTED', 'This device is offline. Work is saved here and will upload when you reconnect.'],
      NOT_CONFIGURED: ['Cloud progress: NOT CONNECTED', 'No cloud account is set up for this build.']
    }[cs.status] || ['Cloud progress: NOT CONNECTED', ''];
    cloudBox.className = 'insight ' + (cs.status === 'CONNECTED' ? 'is-good' : 'is-low');
    cloudBox.appendChild(el('span', 'label', 'Cloud progress'));
    cloudBox.appendChild(el('b', null, LABEL[0]));
    cloudBox.appendChild(el('small', null, LABEL[1] + (cs.pending ? ' ' + cs.pending + ' change(s) waiting to upload.' : '')));

    renderParentDetail();
  }

  function renderParentDetail() {
    var s = Prog.load();

    /* recent history, from stored attempts */
    var hist = $('#pHistory');
    clear(hist);
    var recent = s.attempts.slice(-15).reverse();
    if (!recent.length) hist.appendChild(el('li', null, 'No attempts recorded yet.'));
    recent.forEach(function (a) {
      var li = el('li');
      li.appendChild(el('b', null, (Cur.skill(a.skill_id) || {}).title || a.skill_id));
      li.appendChild(el('small', null,
        new Date(a.timestamp).toLocaleString() + ' · ' + a.result.toLowerCase() +
        (a.hint_level_used ? ' · ' + a.hint_level_used + ' hint(s)' : ' · independent') +
        ' · level ' + a.difficulty));
      hist.appendChild(li);
    });

    /* phoneme audit — Phase 7 status, stated plainly */
    var rep = Audio.phonemeReport();
    var pa = $('#pAudio');
    clear(pa);
    pa.className = 'insight ' + (rep.complete ? 'is-good' : 'is-low');
    pa.appendChild(el('b', null, 'Phoneme recordings: ' + rep.present + ' of ' + rep.required));
    pa.appendChild(el('small', null, rep.note));

    /* settings */
    var set = $('#pSettings');
    clear(set);
    var audioLabel = el('label', 'switch');
    var audioBox = document.createElement('input');
    audioBox.type = 'checkbox'; audioBox.checked = Audio.isEnabled();
    audioBox.onchange = function () { Audio.setEnabled(audioBox.checked); };
    audioLabel.appendChild(audioBox);
    audioLabel.appendChild(el('span', null, 'Spoken instructions'));
    set.appendChild(audioLabel);

    var exportBtn = el('button', 'btn-soft', 'Export progress backup');
    exportBtn.onclick = function () {
      var blob = new Blob([JSON.stringify(Prog.snapshot(), null, 2)], { type: 'application/json' });
      var u = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = u; a.download = 'sakhi-progress-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click(); URL.revokeObjectURL(u);
    };
    set.appendChild(exportBtn);
  }

  /* ---------- Phase 13: path maps ---------- */

  function renderPaths() {
    var wrap = $('#pathWrap');
    clear(wrap);
    Cur.domains().forEach(function (d) {
      var sec = el('section', 'path-domain');
      sec.appendChild(el('h3', null, d.title));
      sec.appendChild(el('p', 'muted', d.description));
      var track = el('div', 'path-track');
      Cur.skillsIn(d.domain_id).forEach(function (sk) {
        var m = Prog.masteryOf(sk.skill_id);
        var mark, cls;
        if (m === 'MASTERED' || m === 'MOSTLY_MASTERED') { mark = '✓'; cls = 'is-done'; }
        else if (m === 'NOT_INTRODUCED') {
          var open = Cur.isAvailable(sk.skill_id, Prog.masteryOf);
          mark = open ? '○' : '🔒'; cls = open ? 'is-next' : 'is-locked';
        } else { mark = '◐'; cls = 'is-current'; }
        var node = el('button', 'path-node ' + cls);
        node.type = 'button';
        node.appendChild(el('span', 'path-mark', mark));
        node.appendChild(el('span', 'path-name', sk.title));
        node.appendChild(el('span', 'path-level', 'L' + sk.difficulty_level));
        node.onclick = function () { openSkillModal(sk); };
        track.appendChild(node);
      });
      sec.appendChild(track);
      wrap.appendChild(sec);
    });
  }

  function openSkillModal(sk) {
    var e = Prog.evidence(sk.skill_id);
    var body = $('#modalBody');
    clear(body);
    body.appendChild(el('h2', null, sk.title));
    body.appendChild(el('p', null, sk.description));
    function row(k, v) {
      var r = el('div', 'modal-row');
      r.appendChild(el('span', 'modal-k', k));
      r.appendChild(el('span', 'modal-v', v));
      body.appendChild(r);
    }
    row('Why it matters', sk.age_guidance || 'Kindergarten foundation skill.');
    row('Status', e.mastery_state.replace(/_/g, ' ').toLowerCase());
    row('Evidence', e.attempt_count
      ? e.independent_correct_count + ' independent of ' + e.attempt_count + ' attempts'
      : 'not practised yet');
    row('Working level', 'Level ' + (e.difficulty_level || 1) + ' of 5');
    var pres = Cur.prerequisites(sk.skill_id).map(function (p) { return (Cur.skill(p) || {}).title || p; });
    row('Needs first', pres.length ? pres.join(', ') : 'nothing — this is a starting point');
    var nxt = Cur.unlockedBy(sk.skill_id).map(function (p) { return (Cur.skill(p) || {}).title || p; });
    row('Leads to', nxt.length ? nxt.join(', ') : 'end of this strand');
    if (e.placement_credited) row('Note', 'Credited from the placement check rather than re-taught.');
    $('#modal').classList.add('is-visible');
  }

  /* ---------- theme picker (cosmetic only, and says so) ---------- */

  function renderThemes() {
    var grid = $('#themeGrid');
    clear(grid);
    var activeId = Prog.load().profile.active_theme;
    Themes.all().forEach(function (t) {
      var card = el('button', 'theme-card' + (t.id === activeId ? ' is-active' : ''));
      card.type = 'button';
      card.style.background = 'linear-gradient(135deg,' + t.palette.a + ',' + t.palette.b + ',' + t.palette.c + ')';
      card.appendChild(el('div', 'theme-icon', t.icon));
      card.appendChild(el('b', null, t.name));
      card.appendChild(el('small', null, t.tagline));
      card.appendChild(el('em', null, 'Rewards: ' + t.rewards.primary.label + ' & ' + t.rewards.badge.label));
      card.onclick = function () {
        Prog.setTheme(t.id);
        toast(t.companion + ' is your guide now ✨');
        render();
      };
      grid.appendChild(card);
    });
  }

  /* ---------- boot ---------- */

  async function boot() {
    await Cur.load();
    Prog.load();

    document.querySelectorAll('[data-nav]').forEach(function (b) {
      b.onclick = function () { show(b.dataset.nav); };
    });
    $('#startAdventure').onclick = startAdventure;
    $('#checkBtn').onclick = function () {
      var res = controller.check();
      if (res) grade(res.correct, res.response);
    };
    $('#resetBtn').onclick = function () { controller.reset(); $('#checkBtn').disabled = true; };
    $('#hintBtn').onclick = useHint;
    $('#hearAgain').onclick = function () { Audio.repeat().catch(showAudioFault); };
    $('#activityQuit').onclick = function () { if (session) finishSession('Left early.'); else show('home'); };
    $('#modalClose').onclick = function () { $('#modal').classList.remove('is-visible'); };
    $('#modal').onclick = function (e) { if (e.target === $('#modal')) $('#modal').classList.remove('is-visible'); };

    Audio.onFault(showAudioFault);
    document.addEventListener('visibilitychange', function () { if (document.hidden) Audio.stopAll(); });
    if (Cloud) { Cloud.probe(); Cloud.onChange(function () { if (view === 'parent') renderParent(); }); }

    show('home');
  }

  window.SakhiApp = { boot: boot, show: show, state: function () { return Prog.snapshot(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
