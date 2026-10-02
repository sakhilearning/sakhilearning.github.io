/* Content depth: item banks must stay deep enough that a lesson never asks the
 * same thing twice, and a second sitting on the same skill still feels fresh.
 *
 * Measured before this suite existed: the median skill could produce only 4
 * distinct tasks, 106 of 141 skills had fewer than 12, and 14 skills repeated a
 * task inside a single lesson.
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
const Act = global.window.SakhiActivities;
global.window.SakhiCurriculum.load();

/* A "task" is prompt plus answer. Build-style tasks reuse one prompt and vary
 * the target, so prompt alone would wrongly flag them. */
const task = q => String(q.prompt || '') + '|' + JSON.stringify(q.answer === undefined ? null : q.answer);

/* ---- 1. a lesson must never ask the same task twice ---- */
const repeatsWithinLesson = [];
for (const sk of curriculum.skills) {
  let a;
  try { a = Act.generate(sk.skill_id, 3, 'depth', [], {}); } catch (e) { failures.push('generate threw for ' + sk.skill_id + ': ' + e.message); continue; }
  const t = a.questions.map(task);
  if (new Set(t).size !== t.length) repeatsWithinLesson.push(sk.skill_id);
}
check('no skill repeats a task inside one lesson', repeatsWithinLesson.length === 0, repeatsWithinLesson.slice(0, 8));

/* ---- 2. quiz-style skills must have a usable bank ----
 * The floor applies to skills that ASK questions. Hands-on templates (guided,
 * trace) are open-ended activities — "write your own name", "design something
 * that rolls" — where there is no bank to deepen and padding one would invent
 * busywork. They are listed so the exemption stays visible rather than silent. */
const MIN_TASKS = 6;
const OPEN_ENDED = new Set(['guided', 'trace']);
const thin = [], exempt = [];
for (const sk of curriculum.skills) {
  const seen = new Set();
  let template = null;
  for (let s = 0; s < 25; s++) {
    let a;
    try { a = Act.generate(sk.skill_id, 3, 'bank' + s, [], {}); } catch (e) { break; }
    if (!template) template = a.questions[0].template;
    a.questions.forEach(q => seen.add(task(q)));
  }
  if (seen.size >= MIN_TASKS) continue;
  if (OPEN_ENDED.has(template)) exempt.push(sk.skill_id);
  else thin.push(sk.skill_id + '(' + seen.size + ', ' + template + ')');
}
check(`every question-asking skill offers at least ${MIN_TASKS} distinct tasks`, thin.length === 0, thin.slice(0, 12));
/* Guard the exemption itself: if it ever covers most of the curriculum, the
 * floor has stopped meaning anything. */
check('the open-ended exemption stays small', exempt.length <= 20, exempt.length);

/* ---- 3. the comprehension collections carry real depth ---- */
const C = global.window.SakhiContent;
const FLOORS = { STORIES: 10, SEQUENCES: 10, PREDICTIONS: 10, MAIN_IDEAS: 9, CAUSES: 9, INFERENCES: 9, VOCAB: 10 };
for (const [name, floor] of Object.entries(FLOORS)) {
  const coll = C && C[name];
  check(`${name} holds at least ${floor} items`, Array.isArray(coll) && coll.length >= floor,
    Array.isArray(coll) ? coll.length : 'missing');
}

/* Listening and comprehension passages must actually be passages, not labels. */
if (Array.isArray(C && C.STORIES)) {
  const tooShort = C.STORIES.filter(s => !s.text || s.text.length < 40).length;
  check('every story is a real passage, not a fragment', tooShort === 0, tooShort);
  const missingQ = C.STORIES.filter(s => !s.q || !s.a || !Array.isArray(s.options)).length;
  check('every story carries a question, answer and options', missingQ === 0, missingQ);
  const answerNotInOptions = C.STORIES.filter(s => s.options && s.options.indexOf(s.a) < 0).length;
  check('every story answer appears among its options', answerNotInOptions === 0, answerNotInOptions);
}

/* ---- 4. no authored item may have its answer missing from the choices ---- */
let badChoice = 0, checked = 0;
for (const sk of curriculum.skills) {
  for (const band of [2, 4]) {
    let a;
    try { a = Act.generate(sk.skill_id, band, 'opt' + band, [], {}); } catch (e) { continue; }
    a.questions.forEach(q => {
      if (q.template !== 'choice' || !Array.isArray(q.choices)) return;
      checked++;
      if (!q.choices.map(String).includes(String(q.answer))) badChoice++;
    });
  }
}
check('every multiple-choice answer is among its own choices', badChoice === 0, badChoice);
check('choice questions were actually exercised', checked > 200, checked);

if (failures.length) {
  console.error('content-depth FAILED:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`content-depth passed: ${curriculum.skills.length} skills, no within-lesson repeats, every question-asking skill at least ${MIN_TASKS} tasks (${exempt.length} open-ended exempt), comprehension collections stocked, ${checked} choice questions valid.`);
