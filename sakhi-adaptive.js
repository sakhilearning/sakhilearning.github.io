/* Sakhi adaptive acceleration.
 *
 * Phase 6. Three jobs:
 *   1. A SHORT placement probe that starts partway up the ladder instead of at
 *      the alphabet, and credits the prerequisites a learner has clearly already
 *      passed. A child who reads mixed CVC words independently is never sent
 *      back to letter sounds.
 *   2. In-session acceleration: full independent success compresses review to a
 *      couple of confirming items and moves DOWN the progression inside the same
 *      sitting (cvc_mixed -> cvc_encode -> digraphs -> ...).
 *   3. Never closing a session early because the child was fast. Finishing
 *      quickly earns harder work, not a shorter day.
 *
 * This module reads the curriculum graph and the learner's evidence. It never
 * reads the theme.
 */
window.SakhiAdaptive = (function () {
  'use strict';

  var PROBE_LIMIT = 4;            // placement stays short by design
  var COMPRESSED_REVIEW_MAX = 3;  // "compress review down to 1-3 target items"
  var MIN_REVIEW_WHEN_STRONG = 1;

  /* Where a probe starts per domain: partway in, not at the entry point. */
  var PROBE_START = {
    reading: 'reading.cvc_mixed',
    math: 'math.compose_to_10',
    language: 'language.sequence',
    logic: 'logic.patterns',
    science: 'science.habitats',
    writing: 'writing.cvc_words'
  };

  function Cur() { return window.SakhiCurriculum; }
  function Prog() { return window.SakhiProgress; }
  function masteryOf(id) { return Prog().masteryOf(id); }

  /* ---- placement ---------------------------------------------------------- */

  function placementActive() {
    var s = Prog().load();
    return !s.placement || !s.placement.complete;
  }

  function beginPlacement() {
    var s = Prog().load();
    s.placement = { complete: false, probes: [], started_at: new Date().toISOString(), domains: Object.keys(PROBE_START) };
    Prog().load(); // ensure state object
    return s.placement;
  }

  /* The next probe: one per domain, at band 3 (independent) so that passing it
   * is real evidence rather than a scaffolded guess. */
  function nextProbe() {
    var s = Prog().load();
    if (!s.placement) beginPlacement();
    var done = s.placement.probes.map(function (p) { return p.skill_id; });
    var order = ['reading', 'math', 'logic', 'language', 'science', 'writing'];
    for (var i = 0; i < order.length && done.length < PROBE_LIMIT; i++) {
      var start = PROBE_START[order[i]];
      if (!start || done.indexOf(start) !== -1) continue;
      if (!Cur().skill(start)) continue;
      return { skill_id: start, band: 3, reason: 'placement probe' };
    }
    return null;
  }

  /* Credit the prerequisite closure of a skill the learner just demonstrated.
   * This is the specific behaviour that stops a strong reader being reset. */
  function creditPrerequisites(skillId, level) {
    var seen = {}, credited = [];
    (function walk(id) {
      Cur().prerequisites(id).forEach(function (p) {
        if (seen[p]) return;
        seen[p] = true;
        var e = Prog().evidence(p);
        var rank = Prog().STATES.indexOf(e.mastery_state);
        if (rank < Prog().STATES.indexOf(level)) {
          e.mastery_state = level;
          e.mastery_score = level === 'MASTERED' ? 0.95 : 0.85;
          e.difficulty_level = Math.max(e.difficulty_level, 3);
          e.placement_credited = true;
          credited.push(p);
        }
        walk(p);
      });
    })(skillId);
    return credited;
  }

  /* Record a probe result and decide whether placement is finished. */
  function recordProbe(skillId, accuracy, independent) {
    var s = Prog().load();
    if (!s.placement) beginPlacement();
    var passed = accuracy >= 0.8;
    var credited = [];
    if (passed) {
      /* Passed independently -> the whole prerequisite chain is credited as
       * mostly mastered, and the learner's working band for this skill rises. */
      credited = creditPrerequisites(skillId, independent ? 'MOSTLY_MASTERED' : 'DEVELOPING');
      var e = Prog().evidence(skillId);
      e.difficulty_level = Math.max(e.difficulty_level, independent ? 4 : 3);
    }
    s.placement.probes.push({ skill_id: skillId, accuracy: accuracy, passed: passed, independent: !!independent, credited: credited, at: new Date().toISOString() });
    if (s.placement.probes.length >= PROBE_LIMIT) {
      s.placement.complete = true;
      s.placement.completed_at = new Date().toISOString();
    }
    return { passed: passed, credited: credited, placementComplete: !!s.placement.complete };
  }

  function finishPlacement() {
    var s = Prog().load();
    if (!s.placement) beginPlacement();
    s.placement.complete = true;
    s.placement.completed_at = new Date().toISOString();
    return s.placement;
  }

  /* ---- session planning --------------------------------------------------- */

  /* Review items are capped so a strong learner spends the session moving
   * forward rather than re-proving things she already knows. */
  function reviewItems() {
    var due = Prog().reviewDue();
    if (!due.length) return [];
    var strong = due.filter(function (id) {
      var m = masteryOf(id);
      return m === 'MASTERED' || m === 'MOSTLY_MASTERED';
    });
    var cap = strong.length === due.length ? MIN_REVIEW_WHEN_STRONG : COMPRESSED_REVIEW_MAX;
    return due.slice(0, cap);
  }

  /* Pick the next thing to teach. Order of precedence:
   *   placement probe -> compressed review -> accelerated next -> frontier.
   * `lastResult` is the status block from SakhiProgress.completeActivity. */
  function nextActivity(opts) {
    opts = opts || {};
    var used = opts.usedSkillIds || [];

    if (placementActive()) {
      var probe = nextProbe();
      if (probe) return probe;
      finishPlacement();
    }

    /* Acceleration: a clean independent sweep means move straight on to what
     * this skill unlocks, inside the same session. */
    var last = opts.lastResult;
    if (last && last.accuracy === 1 && last.independent === (last.correct || 0) && last.correct > 0) {
      var nxt = Cur().nextAfter(last.skill_id, masteryOf);
      if (nxt && used.indexOf(nxt.skill_id) === -1) {
        /* Arrived here by a clean independent sweep: skip INTRO scaffolding,
         * but do not drop her straight into CHALLENGE on new material. */
        return { skill_id: nxt.skill_id, band: Math.max(2, Prog().bandFor(nxt.skill_id)), reason: 'accelerated: cleared ' + last.skill_id + ' independently' };
      }
    }

    var rev = reviewItems().filter(function (id) { return used.indexOf(id) === -1; });
    if (rev.length) return { skill_id: rev[0], band: Prog().bandFor(rev[0]), reason: 'spaced review' };

    /* Otherwise take the weakest-covered domain's frontier, so the day stays
     * balanced across reading / math / discovery. */
    var domains = Cur().domains().map(function (d) { return d.domain_id; });
    var scored = domains.map(function (d) {
      var f = Cur().frontier(d, masteryOf).filter(function (s) { return used.indexOf(s.skill_id) === -1; });
      var practisedToday = used.filter(function (u) { var sk = Cur().skill(u); return sk && sk.domain_id === d; }).length;
      return { domain: d, frontier: f, practisedToday: practisedToday };
    }).filter(function (x) { return x.frontier.length; });

    if (!scored.length) return null;
    scored.sort(function (a, b) { return a.practisedToday - b.practisedToday; });
    var choice = scored[0].frontier[0];
    return { skill_id: choice.skill_id, band: Prog().bandFor(choice.skill_id), reason: 'next in ' + scored[0].domain };
  }

  /* A session runs for its configured length. Finishing fast earns more work. */
  function shouldContinue(session, opts) {
    opts = opts || {};
    var minutes = (opts.sessionMinutes || (Prog().load().profile.typical_session_length) || 20);
    var elapsed = (Date.now() - new Date(session.started_at).getTime()) / 60000;
    if (elapsed >= minutes) return { continue: false, reason: 'session length reached' };
    var more = nextActivity({ usedSkillIds: opts.usedSkillIds || [], lastResult: opts.lastResult });
    if (!more) return { continue: false, reason: 'no further skill available' };
    return { continue: true, reason: 'time remaining', minutesLeft: Math.max(0, Math.round(minutes - elapsed)), next: more };
  }

  /* Plain-language reason for the parent dashboard. */
  function explain(pick) {
    if (!pick) return 'Nothing further is unlocked right now.';
    var sk = Cur().skill(pick.skill_id);
    var m = masteryOf(pick.skill_id);
    var name = sk ? sk.title : pick.skill_id;
    if (/placement/.test(pick.reason)) return 'Quick check on "' + name + '" so Sakhi starts at the right level instead of the beginning.';
    if (/accelerated/.test(pick.reason)) return name + ' — the previous skill was cleared with no hints, so Sakhi moved straight on.';
    if (/review/.test(pick.reason)) return name + ' — a short confirming review, then back to new work.';
    if (m === 'NOT_INTRODUCED') return name + ' — this is next in the path and the prerequisites are done.';
    return name + ' — building on evidence already collected.';
  }

  return {
    PROBE_LIMIT: PROBE_LIMIT,
    COMPRESSED_REVIEW_MAX: COMPRESSED_REVIEW_MAX,
    placementActive: placementActive,
    beginPlacement: beginPlacement,
    nextProbe: nextProbe,
    recordProbe: recordProbe,
    finishPlacement: finishPlacement,
    creditPrerequisites: creditPrerequisites,
    reviewItems: reviewItems,
    nextActivity: nextActivity,
    shouldContinue: shouldContinue,
    explain: explain
  };
})();
