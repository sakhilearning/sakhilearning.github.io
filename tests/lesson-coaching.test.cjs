/* Lesson coaching text and unresolved-mission safety.
 *
 * Two reported problems are covered here, both measured rather than grepped:
 *
 * 1. Every question in a lesson showed the same sentence, and the app printed it
 *    in two places at once, so a four-step lesson repeated one line eight times.
 *    Measured before the fix: identical across all questions in 282 of 282
 *    activities.
 * 2. "null is not an object (evaluating m.pick.skill_id)" — a mission's pick is
 *    resolved lazily, so any mission can hold pick:null until then.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const failures = [];
const check = (label, cond, extra) => {
  if (!cond) failures.push(label + (extra !== undefined ? '  <' + JSON.stringify(extra) + '>' : ''));
};

const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; }
};
global.sessionStorage = global.localStorage;
global.crypto = require('crypto').webcrypto;
global.navigator = { onLine: false };
global.fetch = () => Promise.reject(new Error('offline in tests'));
global.addEventListener = () => {};
global.window = { addEventListener: () => {} };
global.document = { addEventListener: () => {}, readyState: 'complete' };

const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'data/curriculum-v3.json'), 'utf8'));
global.window.SAKHI_CURRICULUM_DATA = curriculum;
for (const f of ['sakhi-curriculum.js', 'sakhi-progress.js', 'sakhi-content.js', 'sakhi-activities.js']) {
  require(path.join(root, f));
}
const Cur = global.window.SakhiCurriculum;
const Act = global.window.SakhiActivities;
Cur.load();

/* ---- 1. coaching text must move with the lesson ---- */

let sameThroughout = 0, generated = 0, missingTip = 0;
const genericFallback = 'Learn the idea with one supported example, then use it in a new situation.';
let genericSeen = 0;

for (const sk of curriculum.skills) {
  for (const band of [2, 3]) {
    let a;
    try { a = Act.generate(sk.skill_id, band, 'coach' + band, [], {}); }
    catch (e) { failures.push('generate threw for ' + sk.skill_id + ' b' + band + ': ' + e.message); continue; }
    generated++;
    const tips = a.questions.map(q => q.coach_tip || '');
    if (tips.some(t => !t)) missingTip++;
    if (new Set(tips).size === 1 && tips.length > 1) sameThroughout++;
    if (tips.some(t => t === genericFallback)) genericSeen++;
  }
}

check('activities were generated', generated > 200, generated);
check('every question carries a coaching line', missingTip === 0, missingTip);
check('a lesson never repeats one coaching line on every step', sameThroughout === 0, sameThroughout);
check('the single generic fallback sentence is gone', genericSeen === 0, genericSeen);

/* The later steps should say what is different about THAT step, so a learner
 * reading top to bottom is told something new each time. */
const sample = Act.generate('math.compare', 2, 'arc', [], { teachFirst: true });
const byPhase = {};
sample.questions.forEach(q => { byPhase[q.learning_phase] = q.coach_tip; });
check('the teaching phase carries subject-specific coaching',
  byPhase.learn && byPhase.learn !== byPhase.practice, byPhase);
check('practice and transfer do not share a line',
  !byPhase.practice || !byPhase.transfer || byPhase.practice !== byPhase.transfer, byPhase);

/* ---- 2. the coaching line is rendered in exactly one place ---- */

const app = fs.readFileSync(path.join(root, 'sakhi-app.js'), 'utf8');
const hintAreaWrites = app.match(/\$\('#hintArea'\)\.textContent=[^;]*/g) || [];
check('the hint area exists', hintAreaWrites.length > 0);
check('the hint area no longer prints coach_tip',
  !hintAreaWrites.some(w => /coach_tip/.test(w)), hintAreaWrites);
check('the companion card prints coach_tip', /#missionStory'\)\.textContent=q\(\)\.coach_tip/.test(app));

/* ---- 3. an unresolved mission must not crash a render ---- */

check('a safe accessor for the mission skill exists', /function missionSkillId\(m\)/.test(app));
check('missionSeed tolerates an unresolved pick',
  /function missionSeed\([^)]*\)\{var id=missionSkillId\(m\);if\(!id\)/.test(app));
check('prewarmTrail checks the pick, not just the mission',
  /if\(!m\|\|!missionSkillId\(m\)\)return Promise\.resolve\(null\)/.test(app));

/* Any remaining direct .pick. read must sit behind a guard in the same function.
 * Comments are stripped first, otherwise a comment describing the old crash
 * reads as an unguarded access. */
const code = app.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
const fnStarts = [...code.matchAll(/(?:async\s+)?function ([A-Za-z_]+)\(/g)].map(m => [m.index, m[1]]);
const ownerOf = pos => {
  let cur = ['?', 0];
  for (const [st, name] of fnStarts) { if (st <= pos) cur = [name, st]; else break; }
  return cur;
};
const unguarded = [];
for (const m of code.matchAll(/[A-Za-z_]+\.pick\.[a-z_]+/g)) {
  const before = code.slice(Math.max(0, m.index - 30), m.index);
  if (before.includes('.pick&&')) continue;
  const [name, start] = ownerOf(m.index);
  const body = code.slice(start, m.index);
  const guarded = /!m\.pick/.test(body) || /!missionSkillId/.test(body) || /m\.pick\)return/.test(body);
  if (!guarded) unguarded.push(name);
}
check('no mission pick is read without a guard in its function',
  unguarded.length === 0, [...new Set(unguarded)]);

if (failures.length) {
  console.error('lesson-coaching FAILED:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`lesson-coaching passed: ${generated} activities, none repeat one coaching line, coaching moves with the phase, it renders once, and unresolved missions are guarded.`);
