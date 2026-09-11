/* V3 engine regression harness: real curriculum/activity/progress/adaptive/trail code. */
const path = require('path').join(__dirname, '..') + '/';
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
global.crypto = require('crypto').webcrypto;
global.navigator = { onLine: false };
global.window = {};
global.window.addEventListener = () => {};
global.addEventListener = () => {};
global.fetch = async () => { throw new Error('network disabled in engine test'); };

require(path + 'sakhi-content.js');
require(path + 'sakhi-curriculum.js');
require(path + 'sakhi-themes.js');
require(path + 'sakhi-activities.js');
require(path + 'sakhi-progress.js');
require(path + 'sakhi-adaptive.js');
require(path + 'sakhi-trails.js');
require(path + 'sakhi-presentation.js');

const Cur = window.SakhiCurriculum;
const Act = window.SakhiActivities;
const Prog = window.SakhiProgress;
const Adapt = window.SakhiAdaptive;
const Trails = window.SakhiTrails;
const Present = window.SakhiPresentation;
Cur.loadFrom(require(path + 'curriculum-snapshot.json'));

let failures = 0;
function ok(label, condition, extra) {
  if (condition) console.log('  ok   ' + label);
  else { failures++; console.error('  FAIL ' + label + (extra === undefined ? '' : ' ' + JSON.stringify(extra))); }
}
function perfect(activity, fixedPrefix) {
  return activity.questions.map((q, i) => ({
    questionIndex: i, correct: true, hintsUsed: 0, tries: 1,
    responseMs: 1800, response: q.answer,
    attempt_id: fixedPrefix ? fixedPrefix + ':' + i : undefined
  }));
}
function hinted(activity) {
  return activity.questions.map((q, i) => ({questionIndex:i, correct:true, hintsUsed:1, tries:1, responseMs:5000, response:q.answer}));
}
function wrong(activity) {
  return activity.questions.map((q, i) => ({questionIndex:i, correct:false, hintsUsed:0, tries:2, responseMs:7000, response:'wrong'}));
}
function answersOf(a){ return a.questions.map(q => JSON.stringify(q.answer)); }

console.log('\n=== 1. Adaptive planner is read-only; placement commits through Progress ===');
Prog.reset();
const beforePlanner = JSON.stringify(Prog.snapshot());
const firstProbe = Adapt.nextProbe();
ok('new learner receives a placement probe', firstProbe && firstProbe.placement_probe === true, firstProbe);
ok('reading probe begins at mixed CVC, not alphabet drills', firstProbe && firstProbe.skill_id === 'reading.cvc_mixed', firstProbe);
ok('planner did not mutate progress while deciding', JSON.stringify(Prog.snapshot()) === beforePlanner);
const placementSession = Prog.startSession(Trails.forDomain('reading').theme_id, {plan_day_id:'placement'});
const pAct = Act.generate(firstProbe.skill_id, firstProbe.band, 'placement-reading');
const pRes = Prog.completeActivity({activity:pAct, sessionId:placementSession.session_id, themeId:Trails.forSkill(pAct.skill_id).theme_id, answers:perfect(pAct), placementProbe:true});
ok('successful probe creates placement result', pRes.placement && pRes.placement.passed, pRes.placement);
ok('prerequisite credit happens atomically in completeActivity', pRes.placement.credited.length > 0, pRes.placement);
ok('credited skills are marked inferred rather than taught', pRes.placement.credited.every(id => Prog.evidence(id).placement_credited === true));
const persisted = JSON.parse(store['sakhi.learner.state']);
ok('placement probe persisted', persisted.placement && persisted.placement.probes.length === 1);

console.log('\n=== 2. Four-probe placement completes without adaptive writes ===');
while (Adapt.placementActive()) {
  const probe = Adapt.nextProbe();
  if (!probe) break;
  const a = Act.generate(probe.skill_id, probe.band, 'placement-' + probe.skill_id);
  Prog.completeActivity({activity:a, sessionId:placementSession.session_id, themeId:Trails.forSkill(a.skill_id).theme_id, answers:perfect(a), placementProbe:true});
}
ok('placement completes at configured probe limit', Prog.load().placement.complete === true, Prog.load().placement);
ok('placement uses exactly four probes', Prog.load().placement.probes.length === Adapt.PROBE_LIMIT, Prog.load().placement.probes);

console.log('\n=== 3. Strong success accelerates only inside the same subject trail ===');
const last = pRes;
const readingPick = Adapt.nextInDomain('reading', {usedSkillIds:['reading.cvc_mixed'], lastResult:last});
ok('strong CVC result advances to a reading skill', readingPick && Cur.skill(readingPick.skill_id).domain_id === 'reading', readingPick);
ok('acceleration reason is explicit', readingPick && /accelerated/.test(readingPick.reason), readingPick);
const mathPick = Adapt.nextInDomain('math', {usedSkillIds:[], lastResult:last});
ok('a reading result cannot accelerate the math trail', !mathPick || !/accelerated/.test(mathPick.reason), mathPick);

console.log('\n=== 4. Trails are cosmetic downstream of curriculum selection ===');
const source = Act.generate('math.number_sense', 3, 'presentation-invariance');
const crystal = Present.decorateActivity(source, Trails.forDomain('math'));
const fakeAltTrail = JSON.parse(JSON.stringify(Trails.forDomain('math')));
fakeAltTrail.props.primary = 'X'; fakeAltTrail.props.secondary = 'Y';
const alternate = Present.decorateActivity(source, fakeAltTrail);
ok('presentation does not change skill id', crystal.skill_id === source.skill_id && alternate.skill_id === source.skill_id);
ok('presentation does not change difficulty', crystal.band === source.band && alternate.band === source.band);
ok('presentation does not change correct answers', JSON.stringify(answersOf(crystal)) === JSON.stringify(answersOf(alternate)) && JSON.stringify(answersOf(source)) === JSON.stringify(answersOf(crystal)));
ok('presentation may change only visual media', JSON.stringify(crystal.questions.map(q=>q.media)) !== JSON.stringify(alternate.questions.map(q=>q.media)));

console.log('\n=== 5. Reward ledger is idempotent and balances are derived ===');
Prog.reset();
const s = Prog.startSession(Trails.forDomain('logic').theme_id);
const rewardAct = Act.generate('logic.classify', 2, 'reward-idempotency');
const fixedAnswers = perfect(rewardAct, 'fixed-attempt');
const r1 = Prog.completeActivity({activity:rewardAct, sessionId:s.session_id, themeId:Trails.forSkill(rewardAct.skill_id).theme_id, answers:fixedAnswers});
const balances1 = Prog.balances();
const r2 = Prog.completeActivity({activity:rewardAct, sessionId:s.session_id, themeId:Trails.forSkill(rewardAct.skill_id).theme_id, answers:fixedAnswers});
const balances2 = Prog.balances();
ok('first successful completion issues rewards', r1.rewards_issued.length > 0, r1.rewards_issued);
ok('identical replay issues no duplicate rewards', r2.rewards_issued.length === 0, r2.rewards_issued);
ok('replay leaves balances unchanged', JSON.stringify(balances1) === JSON.stringify(balances2), {balances1,balances2});
ok('balances equal sums of ledger transactions', Object.values(balances2).reduce((a,b)=>a+b,0) === Prog.load().rewards.reduce((a,r)=>a+(r.amount||0),0));

console.log('\n=== 6. Mastery requires real, multi-session independent evidence ===');
Prog.reset();
const weakS = Prog.startSession(Trails.forDomain('math').theme_id);
const weak = Act.generate('math.count_sequence_20', 1, 'weak');
const weakRes = Prog.completeActivity({activity:weak, sessionId:weakS.session_id, themeId:Trails.forDomain('math').theme_id, answers:wrong(weak)});
ok('wrong work does not produce mastery', weakRes.mastery_state === 'LEARNING', weakRes.mastery_state);
ok('poor performance stays at lowest band', weakRes.next_band === 1, weakRes.next_band);
ok('struggling skill is scheduled for near review', new Date(weakRes.next_review_at).getTime() - Date.now() <= 2*86400000, weakRes.next_review_at);
const hintedA = Act.generate('math.count_sequence_20', 1, 'hinted');
const hintedRes = Prog.completeActivity({activity:hintedA, sessionId:weakS.session_id, themeId:Trails.forDomain('math').theme_id, answers:hinted(hintedA)});
ok('hinted correctness does not jump to mastery', hintedRes.mastery_state !== 'MASTERED', hintedRes.mastery_state);

Prog.reset();
const masterySkill = 'logic.classify';
const ms1 = Prog.startSession(Trails.forDomain('logic').theme_id);
let a = Act.generate(masterySkill, 2, 'm1');
Prog.completeActivity({activity:a, sessionId:ms1.session_id, themeId:Trails.forDomain('logic').theme_id, answers:perfect(a)});
ok('one session alone is not full mastery', Prog.masteryOf(masterySkill) !== 'MASTERED', Prog.masteryOf(masterySkill));
const ms2 = Prog.startSession(Trails.forDomain('logic').theme_id);
for (let i=0;i<2;i++) {
  a = Act.generate(masterySkill, 2, 'm2-' + i);
  Prog.completeActivity({activity:a, sessionId:ms2.session_id, themeId:Trails.forDomain('logic').theme_id, answers:perfect(a)});
}
const mev = Prog.evidence(masterySkill);
ok('multi-session independent evidence reaches consolidated/mastered state', ['MOSTLY_MASTERED','MASTERED'].includes(mev.mastery_state), mev);
ok('evidence contains at least two sessions', mev.sessions_seen.length >= 2, mev.sessions_seen);

console.log('\n=== 7. Weekly summary keeps correctness and independence separate ===');
const ws = Prog.weeklySummary(7);
ok('weekly summary reports attempts', ws.attempts > 0, ws);
ok('correct and independent are distinct fields', Object.prototype.hasOwnProperty.call(ws,'correct') && Object.prototype.hasOwnProperty.call(ws,'independent'), ws);
ok('independent never exceeds correct', ws.independent <= ws.correct, ws);

console.log('\n=== 8. Status block has all parent/adaptive fields ===');
const ss = Prog.startSession(Trails.forDomain('science').theme_id);
const statusAct = Act.generate('science.senses', 2, 'status');
const status = Prog.completeActivity({activity:statusAct, sessionId:ss.session_id, themeId:Trails.forDomain('science').theme_id, answers:perfect(statusAct)});
['skill_id','band','next_band','correct','independent','hinted','incorrect','accuracy','mastery_state','mastery_score','next_review_at','rewards_issued','balances','cloud'].forEach(k => ok('status includes '+k, Object.prototype.hasOwnProperty.call(status,k), status));
Prog.endSession(ss.session_id, 'test complete');
const completedWeek = Prog.weeklySummary(7);
ok('weekly summary reports unique completed practice days', completedWeek.practice_days === 1, completedWeek);

if (failures) {
  console.error('\nENGINE TEST FAILED: ' + failures + ' check(s)');
  process.exit(1);
}
console.log('\nENGINE TEST PASSED');
