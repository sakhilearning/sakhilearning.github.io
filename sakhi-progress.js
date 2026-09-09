/* Sakhi progress + reward ledger + atomic completion.
 *
 * Phase 11: an activity is finalised through exactly ONE function,
 * `completeActivity`. It writes attempts, recomputes skill evidence and mastery,
 * schedules spaced review, issues reward transactions, advances the session, and
 * returns one authoritative status block. There is no other write path, so a
 * partial failure cannot leave the learner half-updated.
 *
 * Mastery thresholds and review intervals are NOT invented here — they are read
 * from each skill's own `mastery_criteria` / `review_policy` in the curriculum
 * graph, so pedagogy lives with the curriculum and not in the client.
 */
window.SakhiProgress = (function () {
  'use strict';

  var LOCAL_KEY = 'sakhi.learner.state';
  var Cloud = window.SakhiCloud;

  var STATES = ['NOT_INTRODUCED', 'INTRODUCED', 'LEARNING', 'DEVELOPING', 'MOSTLY_MASTERED', 'MASTERED', 'REVIEW_NEEDED'];

  var DEFAULT_CRITERIA = { min_attempts: 4, target_accuracy: 0.8, independent_evidence: 3, multi_session: true };
  var DEFAULT_REVIEW = { learning_days: 1, developing_days: 3, mostly_mastered_days: 7, mastered_days: 18 };

  var state = null;

  function today() { return new Date().toISOString().slice(0, 10); }
  function nowIso() { return new Date().toISOString(); }
  function uuid() { return Cloud ? Cloud.uuid() : String(Date.now()) + Math.random(); }

  function blank() {
    return {
      learner_id: uuid(),
      curriculum_version: window.SakhiCurriculum ? window.SakhiCurriculum.ACTIVE_VERSION : null,
      profile: { display_name: 'Sakhi', active_theme: 'unicorn_meadow', typical_session_length: 20 },
      skills: {},          // skill_id -> evidence record
      sessions: [],
      attempts: [],        // recent attempts, trimmed
      rewards: [],         // the ledger; balances are derived, never stored
      review: {},          // skill_id -> due ISO date
      placement: null,     // result of the short placement run
      updated_at: nowIso()
    };
  }

  function load() {
    if (state) return state;
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(LOCAL_KEY) || 'null'); } catch (e) {}
    state = Object.assign(blank(), raw || {});
    ['sessions', 'attempts', 'rewards'].forEach(function (k) { if (!Array.isArray(state[k])) state[k] = []; });
    ['skills', 'review', 'profile'].forEach(function (k) { if (!state[k] || typeof state[k] !== 'object') state[k] = blank()[k]; });
    return state;
  }

  function persistLocal() {
    state.updated_at = nowIso();
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); } catch (e) { console.warn('[SakhiProgress] local persist failed', e); }
  }

  function evidence(skillId) {
    var s = load();
    if (!s.skills[skillId]) {
      s.skills[skillId] = {
        skill_id: skillId, mastery_state: 'NOT_INTRODUCED', mastery_score: 0,
        attempt_count: 0, independent_correct_count: 0, hinted_correct_count: 0, incorrect_count: 0,
        independent_accuracy: 0, sessions_seen: [], last_practiced_at: null, last_mastered_at: null,
        consecutive_successful_sessions: 0, consecutive_struggle_sessions: 0, difficulty_level: 1
      };
    }
    return s.skills[skillId];
  }

  function masteryOf(skillId) { var s = load(); return s.skills[skillId] ? s.skills[skillId].mastery_state : 'NOT_INTRODUCED'; }
  function bandFor(skillId) { var e = evidence(skillId); return Math.max(1, Math.min(5, e.difficulty_level || 1)); }

  function criteriaFor(skillId) {
    var sk = window.SakhiCurriculum && window.SakhiCurriculum.skill(skillId);
    return Object.assign({}, DEFAULT_CRITERIA, (sk && sk.mastery_criteria) || {});
  }
  function reviewPolicyFor(skillId) {
    var sk = window.SakhiCurriculum && window.SakhiCurriculum.skill(skillId);
    return Object.assign({}, DEFAULT_REVIEW, (sk && sk.review_policy) || {});
  }

  /* Mastery is evidence-based: independent correct answers count, hinted ones
   * count for less, and (when the skill demands it) the evidence has to span
   * more than one session before we will call it mastered. */
  function recompute(skillId) {
    var e = evidence(skillId), c = criteriaFor(skillId);
    var total = e.attempt_count || 0;
    if (!total) { e.mastery_state = 'NOT_INTRODUCED'; e.mastery_score = 0; return e; }

    var weighted = e.independent_correct_count + (e.hinted_correct_count * 0.5);
    var acc = weighted / total;
    e.independent_accuracy = total ? e.independent_correct_count / total : 0;
    e.mastery_score = Math.round(Math.min(1, acc) * 10000) / 10000;

    var enoughAttempts = total >= c.min_attempts;
    var enoughIndependent = e.independent_correct_count >= c.independent_evidence;
    var multiSessionOk = !c.multi_session || (e.sessions_seen || []).length >= 2;
    var hitsAccuracy = acc >= c.target_accuracy;

    if (enoughAttempts && enoughIndependent && hitsAccuracy && multiSessionOk) e.mastery_state = 'MASTERED';
    else if (enoughIndependent && hitsAccuracy) e.mastery_state = 'MOSTLY_MASTERED';
    else if (acc >= 0.6 && total >= 2) e.mastery_state = 'DEVELOPING';
    else if (total >= 1) e.mastery_state = 'LEARNING';

    /* A skill that was strong and has gone wobbly is flagged for review rather
     * than silently downgraded, so the parent view can explain it. */
    if (e.consecutive_struggle_sessions >= 2 && (e.mastery_state === 'MASTERED' || e.mastery_state === 'MOSTLY_MASTERED')) {
      e.mastery_state = 'REVIEW_NEEDED';
    }
    if (e.mastery_state === 'MASTERED' && !e.last_mastered_at) e.last_mastered_at = nowIso();
    return e;
  }

  function scheduleReview(skillId) {
    var e = evidence(skillId), p = reviewPolicyFor(skillId), days;
    switch (e.mastery_state) {
      case 'MASTERED': days = p.mastered_days; break;
      case 'MOSTLY_MASTERED': days = p.mostly_mastered_days; break;
      case 'DEVELOPING': days = p.developing_days; break;
      case 'REVIEW_NEEDED': days = 0; break;
      default: days = p.learning_days;
    }
    var due = new Date(Date.now() + days * 86400000).toISOString();
    load().review[skillId] = due;
    return due;
  }

  function reviewDue() {
    var s = load(), now = Date.now(), out = [];
    Object.keys(s.review).forEach(function (k) {
      if (new Date(s.review[k]).getTime() <= now && masteryOf(k) !== 'NOT_INTRODUCED') out.push(k);
    });
    return out;
  }

  /* ---- reward ledger ------------------------------------------------------ */
  /* Balances are always derived by summing the ledger. There is no settable
   * counter anywhere, which is what makes manual reward toggling impossible. */

  function balances() {
    return load().rewards.reduce(function (m, t) {
      m[t.reward_key] = (m[t.reward_key] || 0) + (t.amount || 0);
      return m;
    }, {});
  }

  function issueReward(txn) {
    var s = load();
    /* Idempotent: the same (attempt, reward_key) can only ever pay once, no
     * matter how many times an offline outbox replays it. */
    var dupe = s.rewards.some(function (r) {
      return r.transaction_id === txn.transaction_id ||
        (txn.attempt_id && r.attempt_id === txn.attempt_id && r.reward_key === txn.reward_key);
    });
    if (dupe) return null;
    s.rewards.push(txn);
    return txn;
  }

  /* ---- the single atomic completion path ---------------------------------- */

  /* result = {
   *   activity: <spec from SakhiActivities.generate>,
   *   sessionId, themeId,
   *   answers: [{ questionIndex, correct, hintsUsed, responseMs, response }]
   * }
   * Everything is computed first, then committed in one go. If any step throws,
   * nothing is written locally and nothing is queued to the cloud.
   */
  function completeActivity(result) {
    var s = load();
    var act = result.activity;
    var skillId = act.skill_id;
    var theme = window.SakhiThemes ? window.SakhiThemes.get(result.themeId) : null;

    /* ---- stage: compute everything into a pending batch (no mutation yet) -- */
    var stamp = nowIso();
    var attempts = result.answers.map(function (a, i) {
      return {
        attempt_id: a.attempt_id || uuid(),
        learner_id: s.learner_id,
        session_id: result.sessionId || null,
        activity_id: act.activity_id,
        domain: act.domain_id,
        skill_id: skillId,
        interaction_type: (act.questions[a.questionIndex] || {}).template || 'choice',
        difficulty: act.band,
        curriculum_level: act.band,
        question_or_task_id: act.activity_id + ':q' + a.questionIndex,
        expected_answer: (act.questions[a.questionIndex] || {}).answer,
        learner_response: a.response,
        result: a.correct ? 'CORRECT' : 'INCORRECT',
        independent_success: !!a.correct && !a.hintsUsed,
        hint_level_used: a.hintsUsed || 0,
        number_of_attempts: a.tries || 1,
        response_time_ms: a.responseMs || null,
        completed: true,
        challenge_mode: act.band >= 5,
        timestamp: stamp,
        curriculum_version: s.curriculum_version
      };
    });

    var correct = attempts.filter(function (a) { return a.result === 'CORRECT'; }).length;
    var independent = attempts.filter(function (a) { return a.independent_success; }).length;
    var hinted = correct - independent;
    var wrong = attempts.length - correct;
    var accuracy = attempts.length ? correct / attempts.length : 0;

    /* ---- commit: mutate state ---- */
    var e = evidence(skillId);
    e.attempt_count += attempts.length;
    e.independent_correct_count += independent;
    e.hinted_correct_count += hinted;
    e.incorrect_count += wrong;
    e.last_practiced_at = stamp;
    e.sessions_seen = (e.sessions_seen || []);
    if (result.sessionId && e.sessions_seen.indexOf(result.sessionId) === -1) e.sessions_seen.push(result.sessionId);
    if (accuracy >= 0.8) { e.consecutive_successful_sessions++; e.consecutive_struggle_sessions = 0; }
    else if (accuracy < 0.5) { e.consecutive_struggle_sessions++; e.consecutive_successful_sessions = 0; }

    /* Band moves with demonstrated independence, never with a theme choice. */
    if (accuracy === 1 && independent === attempts.length && e.difficulty_level < 5) e.difficulty_level++;
    else if (accuracy < 0.5 && e.difficulty_level > 1) e.difficulty_level--;

    recompute(skillId);
    var due = scheduleReview(skillId);

    s.attempts = s.attempts.concat(attempts).slice(-400);

    /* rewards, derived from real performance and named by the active theme */
    var issued = [];
    var primary = theme ? theme.rewards.primary : { key: 'magic_stars', label: 'Magic Stars' };
    var badge = theme ? theme.rewards.badge : { key: 'unicorn_gems', label: 'Unicorn Gems' };
    attempts.forEach(function (a) {
      if (a.result !== 'CORRECT') return;
      var t = issueReward({
        transaction_id: a.attempt_id + ':' + primary.key,
        learner_id: s.learner_id, session_id: a.session_id, attempt_id: a.attempt_id,
        reward_key: primary.key, reward_label: primary.label, amount: 1,
        reason: 'Correct answer in ' + act.skill_title, theme_id: result.themeId, skill_id: skillId,
        created_at: stamp
      });
      if (t) issued.push(t);
    });
    var completionId = act.activity_id + ':' + (result.sessionId || 'nosession');
    var badgeTxn = issueReward({
      transaction_id: completionId + ':' + badge.key,
      learner_id: s.learner_id, session_id: result.sessionId || null, attempt_id: null,
      reward_key: badge.key, reward_label: badge.label, amount: 1,
      reason: 'Finished ' + act.skill_title, theme_id: result.themeId, skill_id: skillId,
      created_at: stamp
    });
    if (badgeTxn) issued.push(badgeTxn);

    /* session bookkeeping */
    var ses = s.sessions.filter(function (x) { return x.session_id === result.sessionId; })[0];
    if (ses) {
      ses.activities_completed = (ses.activities_completed || 0) + 1;
      ses.skills_practiced = (ses.skills_practiced || []);
      if (ses.skills_practiced.indexOf(skillId) === -1) ses.skills_practiced.push(skillId);
    }

    persistLocal();

    /* ---- one queued cloud batch, after local commit succeeded ---- */
    if (Cloud) {
      Cloud.upsert('learning_attempts', attempts);
      Cloud.upsert('learner_skill_progress', [{
        learner_id: s.learner_id, skill_id: skillId, domain: act.domain_id,
        skill_name: act.skill_title, mastery_state: e.mastery_state, mastery_score: e.mastery_score,
        independent_accuracy: e.independent_accuracy, attempt_count: e.attempt_count,
        independent_correct_count: e.independent_correct_count, hinted_correct_count: e.hinted_correct_count,
        incorrect_count: e.incorrect_count, last_practiced_at: e.last_practiced_at,
        next_review_at: due, difficulty_level: e.difficulty_level,
        consecutive_successful_sessions: e.consecutive_successful_sessions,
        consecutive_struggle_sessions: e.consecutive_struggle_sessions
      }]);
      if (issued.length) Cloud.upsert('reward_transactions', issued);
      Cloud.upsert('review_schedule', [{ learner_id: s.learner_id, skill_id: skillId, due_at: due, reason: e.mastery_state }]);
    }

    /* ---- the unified authoritative status block ---- */
    return {
      skill_id: skillId,
      skill_title: act.skill_title,
      band: act.band,
      next_band: e.difficulty_level,
      correct: correct, independent: independent, hinted: hinted, incorrect: wrong,
      accuracy: accuracy,
      mastery_state: e.mastery_state,
      mastery_score: e.mastery_score,
      next_review_at: due,
      rewards_issued: issued.map(function (t) { return { key: t.reward_key, label: t.reward_label, amount: t.amount }; }),
      balances: balances(),
      cloud: Cloud ? Cloud.state() : { status: 'NOT_CONFIGURED' }
    };
  }

  function startSession(themeId) {
    var s = load();
    var ses = {
      session_id: uuid(), learner_id: s.learner_id, date: today(), started_at: nowIso(),
      theme: themeId, curriculum_version: s.curriculum_version,
      skills_practiced: [], activities_completed: 0, status: 'IN_PROGRESS'
    };
    s.sessions.push(ses);
    s.sessions = s.sessions.slice(-60);
    persistLocal();
    if (Cloud) Cloud.upsert('learning_sessions', [ses]);
    return ses;
  }

  function endSession(sessionId, summary) {
    var s = load();
    var ses = s.sessions.filter(function (x) { return x.session_id === sessionId; })[0];
    if (!ses) return null;
    ses.completed_at = nowIso();
    ses.duration = Math.round((new Date(ses.completed_at) - new Date(ses.started_at)) / 1000);
    ses.status = 'COMPLETED';
    ses.session_summary = summary || null;
    persistLocal();
    if (Cloud) Cloud.upsert('learning_sessions', [ses]);
    return ses;
  }

  function setTheme(themeId) {
    var s = load();
    s.profile.active_theme = themeId;
    persistLocal();
    if (Cloud) Cloud.upsert('learner_profiles', [{ learner_id: s.learner_id, active_theme: themeId }]);
    return themeId;
  }

  /* Adaptive mutates evidence and placement through evidence()/load(); it needs
   * a way to commit, or those changes die at the next reload. */
  function persist() {
    persistLocal();
    var s = load();
    if (Cloud) Cloud.upsert('learner_profiles', [{
      learner_id: s.learner_id, active_theme: s.profile.active_theme,
      adaptive_state: s.placement || {},
      domain_levels: Object.keys(s.skills).reduce(function (m, k) { m[k] = s.skills[k].difficulty_level; return m; }, {})
    }]);
    return s;
  }

  function snapshot() { return JSON.parse(JSON.stringify(load())); }
  function reset() { state = blank(); persistLocal(); return state; }

  return {
    STATES: STATES,
    load: load, snapshot: snapshot, reset: reset, persist: persist,
    evidence: evidence, masteryOf: masteryOf, bandFor: bandFor,
    recompute: recompute, scheduleReview: scheduleReview, reviewDue: reviewDue,
    balances: balances, completeActivity: completeActivity,
    startSession: startSession, endSession: endSession, setTheme: setTheme,
    criteriaFor: criteriaFor, reviewPolicyFor: reviewPolicyFor
  };
})();
