/* Node harness: simulate a learner through the real engine. */
const path = require('path').join(__dirname, '..') + '/';

// minimal browser shims
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
global.crypto = require('crypto').webcrypto;
global.navigator = { onLine: false };   // force local-only: no cloud writes
global.window = {};
global.fetch = () => { throw new Error('no network in harness'); };
global.addEventListener = () => {};
global.window.addEventListener = () => {};

require(path + 'sakhi-content.js');
require(path + 'sakhi-curriculum.js');
require(path + 'sakhi-themes.js');
require(path + 'sakhi-activities.js');
require(path + 'sakhi-progress.js');
require(path + 'sakhi-adaptive.js');

const Cur = window.SakhiCurriculum, Act = window.SakhiActivities;
const Prog = window.SakhiProgress, Adapt = window.SakhiAdaptive;
Cur.loadFrom(require(path + 'curriculum-snapshot.json'));

let fails = 0;
function ok(label, cond, extra) {
  if (cond) console.log('  ok   ' + label);
  else { fails++; console.log('  FAIL ' + label + (extra !== undefined ? '  <' + JSON.stringify(extra) + '>' : '')); }
}

/* Answer an activity at a given ability: 'perfect' = all correct, no hints. */
function answerAll(act, mode) {
  return act.questions.map((q, i) => {
    if (mode === 'perfect') return { questionIndex: i, correct: true, hintsUsed: 0, responseMs: 2200, response: q.answer };
    if (mode === 'hinted') return { questionIndex: i, correct: true, hintsUsed: 1, responseMs: 8000, response: q.answer };
    if (mode === 'struggle') return { questionIndex: i, correct: i === 0, hintsUsed: 2, responseMs: 15000, response: null };
    return { questionIndex: i, correct: false, hintsUsed: 0, responseMs: 9000, response: null };
  });
}

console.log('\n=== 1. A phonics-strong learner takes placement ===');
const ses = Prog.startSession('unicorn_meadow');
ok('placement is active for a new learner', Adapt.placementActive());
const probe1 = Adapt.nextProbe();
ok('first probe starts partway up, not at the alphabet', probe1.skill_id === 'reading.cvc_mixed', probe1);
ok('probe runs at band 3 (independent)', probe1.band === 3);

const probeAct = Act.generate(probe1.skill_id, probe1.band, ses.session_id);
const probeRes = Prog.completeActivity({ activity: probeAct, sessionId: ses.session_id, themeId: 'unicorn_meadow', answers: answerAll(probeAct, 'perfect') });
const rec = Adapt.recordProbe(probe1.skill_id, probeRes.accuracy, probeRes.independent === probeRes.correct);
ok('probe passed', rec.passed);
ok('prerequisites were credited, not retaught', rec.credited.length > 0, rec.credited);
ok('  letter_sounds credited', Prog.masteryOf('reading.letter_sounds') !== 'NOT_INTRODUCED', Prog.masteryOf('reading.letter_sounds'));
ok('  short_vowels credited', Prog.masteryOf('reading.short_vowels') !== 'NOT_INTRODUCED', Prog.masteryOf('reading.short_vowels'));
ok('  blend_segment credited', Prog.masteryOf('reading.blend_segment') !== 'NOT_INTRODUCED', Prog.masteryOf('reading.blend_segment'));

const readingFrontier = Cur.frontier('reading', Prog.masteryOf).map(s => s.skill_id);
ok('letter_sounds is NOT offered again', !readingFrontier.includes('reading.letter_sounds'), readingFrontier);

console.log('\n=== 1b. Placement survives a reload (regression) ===');
/* The credits and the probe record live in state mutated through evidence()/
 * load(); if adaptive does not commit them, they die at the next reload and the
 * learner is sent straight back to the alphabet. Assert they reached storage. */
const persisted = JSON.parse(store['sakhi.learner.state']);
ok('probe is written to storage', (persisted.placement.probes || []).length === 1, persisted.placement.probes);
ok('credited prerequisites are written to storage',
  ['reading.letter_sounds', 'reading.short_vowels', 'reading.blend_segment']
    .every(k => persisted.skills[k] && persisted.skills[k].mastery_state === 'MOSTLY_MASTERED'),
  Object.keys(persisted.skills));
ok('credits are marked as placement-derived, not taught',
  persisted.skills['reading.letter_sounds'].placement_credited === true);

console.log('\n=== 2. In-session acceleration down the literacy progression ===');
Adapt.finishPlacement();
let used = ['reading.cvc_mixed'];
let last = probeRes;
const chain = ['reading.cvc_mixed'];
for (let i = 0; i < 4; i++) {
  const pick = Adapt.nextActivity({ usedSkillIds: used, lastResult: last });
  if (!pick) break;
  const a = Act.generate(pick.skill_id, pick.band, ses.session_id + ':' + i);
  last = Prog.completeActivity({ activity: a, sessionId: ses.session_id, themeId: 'unicorn_meadow', answers: answerAll(a, 'perfect') });
  used.push(pick.skill_id);
  chain.push(pick.skill_id + '  [b' + pick.band + '] (' + pick.reason + ')');
}
chain.forEach(c => console.log('     -> ' + c));
const advanced = chain.some(c => c.startsWith('reading.cvc_encode'));
ok('advanced cvc_mixed -> cvc_encode inside one session', advanced, chain);
ok('acceleration was the stated reason', chain.some(c => /accelerated/.test(c)), chain);

console.log('\n=== 3. Session does not close early when the child is fast ===');
const cont = Adapt.shouldContinue(ses, { usedSkillIds: used, lastResult: last, sessionMinutes: 20 });
ok('session keeps going after fast completions', cont.continue === true, cont);
ok('  and names what is next', !!cont.next, cont);
const spent = Adapt.shouldContinue({ started_at: new Date(Date.now() - 21 * 60000).toISOString() }, { usedSkillIds: used, sessionMinutes: 20 });
ok('session does close once its configured length is reached', spent.continue === false, spent);

console.log('\n=== 4. Reward ledger is idempotent and derived ===');
const before = JSON.parse(JSON.stringify(Prog.balances()));
const replayAct = Act.generate('reading.cvc_mixed', 3, ses.session_id);
const answers = answerAll(replayAct, 'perfect').map(a => Object.assign({}, a, { attempt_id: 'FIXED-' + a.questionIndex }));
const r1 = Prog.completeActivity({ activity: replayAct, sessionId: ses.session_id, themeId: 'unicorn_meadow', answers });
const afterFirst = JSON.parse(JSON.stringify(Prog.balances()));
const r2 = Prog.completeActivity({ activity: replayAct, sessionId: ses.session_id, themeId: 'unicorn_meadow', answers });
const afterReplay = Prog.balances();
ok('first completion paid rewards', r1.rewards_issued.length > 0);
ok('replaying the identical completion pays nothing', r2.rewards_issued.length === 0, r2.rewards_issued);
ok('balances unchanged by the replay', JSON.stringify(afterFirst) === JSON.stringify(afterReplay), { afterFirst, afterReplay });
ok('balances are derived by summing the ledger',
  Prog.load().rewards.reduce((n, t) => n + t.amount, 0) === Object.values(afterReplay).reduce((a, b) => a + b, 0));

console.log('\n=== 5. Theme changes reward NAMES only, never the skill ===');
const pickUnicorn = Adapt.nextActivity({ usedSkillIds: [], lastResult: null });
Prog.setTheme('ice_palace');
const pickIce = Adapt.nextActivity({ usedSkillIds: [], lastResult: null });
ok('same skill chosen under a different theme', pickUnicorn.skill_id === pickIce.skill_id, { pickUnicorn, pickIce });
const iceAct = Act.generate(pickIce.skill_id, pickIce.band, 'themecheck');
const iceRes = Prog.completeActivity({ activity: iceAct, sessionId: ses.session_id, themeId: 'ice_palace', answers: answerAll(iceAct, 'perfect') });
ok('reward is named by the theme', iceRes.rewards_issued.some(r => r.key === 'snow_crystals' || r.key === 'ice_trophies'), iceRes.rewards_issued);

console.log('\n=== 6. Mastery reflects real evidence ===');
Prog.reset();
Cur.loadFrom(require(path + 'curriculum-snapshot.json'));
const s2 = Prog.startSession('unicorn_meadow');
const weakAct = Act.generate('math.number_sense', 1, 'weak');
const weakRes = Prog.completeActivity({ activity: weakAct, sessionId: s2.session_id, themeId: 'unicorn_meadow', answers: answerAll(weakAct, 'wrong') });
ok('all-wrong does not produce mastery', weakRes.mastery_state === 'LEARNING', weakRes.mastery_state);
ok('all-wrong pays no reward', weakRes.rewards_issued.filter(r => r.key === 'magic_stars').length === 0, weakRes.rewards_issued);
ok('band steps down after a poor run', weakRes.next_band === 1, weakRes.next_band);
ok('review is scheduled soon for a struggling skill',
  new Date(weakRes.next_review_at).getTime() - Date.now() < 2 * 86400000, weakRes.next_review_at);

const hintAct = Act.generate('math.number_sense', 1, 'hinted');
const hintRes = Prog.completeActivity({ activity: hintAct, sessionId: s2.session_id, themeId: 'unicorn_meadow', answers: answerAll(hintAct, 'hinted') });
ok('hinted correct answers count for less than independent',
  hintRes.mastery_state !== 'MASTERED', hintRes.mastery_state);

// multi-session requirement, on a skill with a clean history
const CLEAN = 'logic.classify';
const sA = Prog.startSession('unicorn_meadow');
const a1 = Act.generate(CLEAN, 2, 'ind1');
Prog.completeActivity({ activity: a1, sessionId: sA.session_id, themeId: 'unicorn_meadow', answers: answerAll(a1, 'perfect') });
const midway = Prog.evidence(CLEAN).mastery_state;
ok('one perfect session alone is not mastery', midway !== 'MASTERED', midway);
const sB = Prog.startSession('unicorn_meadow');
for (let i = 0; i < 2; i++) {
  const a = Act.generate(CLEAN, 2, 'ind' + i);
  Prog.completeActivity({ activity: a, sessionId: sB.session_id, themeId: 'unicorn_meadow', answers: answerAll(a, 'perfect') });
}
const ev = Prog.evidence(CLEAN);
ok('mastery reached only with multi-session independent evidence',
  ['MOSTLY_MASTERED', 'MASTERED'].includes(ev.mastery_state), ev.mastery_state);
ok('  and it saw more than one session', ev.sessions_seen.length >= 2, ev.sessions_seen.length);

console.log('\n=== 7. Status block is complete ===');
const need = ['skill_id', 'band', 'next_band', 'correct', 'independent', 'accuracy', 'mastery_state', 'next_review_at', 'rewards_issued', 'balances', 'cloud'];
ok('completeActivity returns one unified block', need.every(k => k in hintRes), need.filter(k => !(k in hintRes)));
ok('  and reports cloud status honestly (never a fake "synced")',
  ['NOT_CONFIGURED', 'NOT_CONNECTED', 'OFFLINE'].includes(hintRes.cloud.status), hintRes.cloud.status);

console.log('\n' + (fails ? fails + ' CHECK(S) FAILED' : 'ALL CHECKS PASSED'));
process.exit(fails ? 1 : 0);
