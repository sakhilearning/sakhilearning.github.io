/* Sakhi curriculum graph — the single source of truth for what gets taught.
 *
 * The graph lives in Supabase (curriculum_domains / _strands / _skills /
 * skill_prerequisites, anon-readable reference data). `curriculum-snapshot.json`
 * is a committed mirror of the active version so the app still works offline and
 * so the graph is diffable in git.
 *
 * Nothing in here knows about themes. Theme selection is cosmetic and must never
 * reach this module — that separation is what keeps "Sakhi picks the skill" true.
 */
window.SakhiCurriculum = (function () {
  'use strict';

  var ACTIVE_VERSION = '2026.09.08-v2';
  var graph = null;

  function index(g) {
    var byId = {}, byDomain = {}, prereqOf = {}, unlocks = {};
    g.skills.forEach(function (s) {
      byId[s.skill_id] = s;
      (byDomain[s.domain_id] = byDomain[s.domain_id] || []).push(s);
      prereqOf[s.skill_id] = [];
      unlocks[s.skill_id] = [];
    });
    g.prerequisites.forEach(function (p) {
      if (!byId[p.skill_id] || !byId[p.prerequisite_skill_id]) return;
      prereqOf[p.skill_id].push(p.prerequisite_skill_id);
      unlocks[p.prerequisite_skill_id].push(p.skill_id);
    });
    Object.keys(byDomain).forEach(function (d) {
      byDomain[d].sort(function (a, b) {
        return (a.difficulty_level - b.difficulty_level) || (a.sort_order - b.sort_order);
      });
    });
    g.byId = byId; g.byDomain = byDomain; g.prereqOf = prereqOf; g.unlocks = unlocks;
    return g;
  }

  function normalise(raw) {
    return index({
      curriculum_version: raw.curriculum_version || ACTIVE_VERSION,
      domains: (raw.domains || []).slice().sort(function (a, b) { return a.sort_order - b.sort_order; }),
      strands: raw.strands || [],
      skills: (raw.skills || []).filter(function (s) { return s.active !== false; }),
      prerequisites: raw.prerequisites || [],
      source: raw.source || 'snapshot'
    });
  }

  /* Load order: Supabase (authoritative) -> cached copy -> bundled snapshot.
   * The bundled snapshot guarantees the app is never dead in the water. */
  async function load() {
    if (graph) return graph;
    var C = window.SakhiCloud;
    var q = '&curriculum_version=eq.' + ACTIVE_VERSION;
    if (C) {
      try {
        var parts = await Promise.all([
          C.request('/rest/v1/curriculum_domains?select=*' + q),
          C.request('/rest/v1/curriculum_strands?select=*' + q),
          C.request('/rest/v1/curriculum_skills?select=*' + q),
          C.request('/rest/v1/skill_prerequisites?select=*' + q)
        ]);
        if (parts[2] && parts[2].length) {
          var live = { curriculum_version: ACTIVE_VERSION, domains: parts[0], strands: parts[1], skills: parts[2], prerequisites: parts[3], source: 'supabase' };
          C.cachePut('curriculum.' + ACTIVE_VERSION, live);
          graph = normalise(live);
          return graph;
        }
      } catch (e) {
        var cached = C.cacheValue('curriculum.' + ACTIVE_VERSION);
        if (cached) { cached.source = 'cache'; graph = normalise(cached); return graph; }
      }
    }
    var res = await fetch('./curriculum-snapshot.json');
    var snap = await res.json();
    snap.source = 'snapshot';
    graph = normalise(snap);
    return graph;
  }

  /* Test/offline seam: build the graph from an already-fetched snapshot object
   * without touching the network. Used by the Node test harness. */
  function loadFrom(raw) { graph = normalise(raw); return graph; }

  function get() { return graph; }
  function skill(id) { return graph && graph.byId[id] || null; }
  function domains() { return graph ? graph.domains : []; }
  function skillsIn(domainId) { return graph && graph.byDomain[domainId] || []; }
  function prerequisites(id) { return graph && graph.prereqOf[id] || []; }
  function unlockedBy(id) { return graph && graph.unlocks[id] || []; }

  /* A skill is available once every prerequisite has real evidence behind it.
   * `masteryOf(skillId)` is supplied by the progress layer, so this module stays
   * free of any storage or theme concern. */
  function isAvailable(id, masteryOf) {
    var pres = prerequisites(id);
    if (!pres.length) return true;
    return pres.every(function (p) {
      var m = masteryOf(p);
      return m === 'MOSTLY_MASTERED' || m === 'MASTERED' || m === 'DEVELOPING';
    });
  }

  /* Ordered frontier for one domain: what this learner could work on now,
   * easiest first. Purely structural — no theme, no cosmetics. */
  function frontier(domainId, masteryOf) {
    return skillsIn(domainId).filter(function (s) {
      var m = masteryOf(s.skill_id);
      /* Consolidated skills are not new work. Re-offering them here is what
       * sends a strong reader back to the alphabet; spaced review owns them. */
      if (m === 'MASTERED' || m === 'MOSTLY_MASTERED') return false;
      return isAvailable(s.skill_id, masteryOf);
    });
  }

  /* Where the learner should go after finishing `id`: prefer the curriculum's
   * own recommended_next, fall back to whatever this skill unlocks. */
  function nextAfter(id, masteryOf) {
    var s = skill(id);
    if (!s) return null;
    var candidates = (s.recommended_next || []).concat(unlockedBy(id));
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      if (!skill(c)) continue;
      var m = masteryOf(c);
      if (m !== 'MASTERED' && isAvailable(c, masteryOf)) return skill(c);
    }
    return null;
  }

  return {
    ACTIVE_VERSION: ACTIVE_VERSION,
    load: load, loadFrom: loadFrom, get: get,
    skill: skill, domains: domains, skillsIn: skillsIn,
    prerequisites: prerequisites, unlockedBy: unlockedBy,
    isAvailable: isAvailable, frontier: frontier, nextAfter: nextAfter
  };
})();
