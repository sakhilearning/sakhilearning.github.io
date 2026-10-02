/* Activity routing and cross-sitting freshness.
 *
 * Two real defects motivated this suite:
 *
 * 1. The three domain catch-alls (science, logic, wellbeing) sat ABOVE the
 *    kind handlers in qFor, so every logic and wellbeing skill fell into a
 *    small domain bank and the memory / movement activities written below
 *    them were unreachable dead code.
 *
 * 2. Nineteen banks selected their item with [(questionIndex||0)%len], which
 *    only varies 0..4, so only the first few entries were ever reachable and
 *    the child met the same items in every sitting no matter how large the
 *    bank grew.
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

/* ---- 1. a kind handler must beat its domain catch-all ----
 * logic.memory declares kind "memory". If the logic catch-all runs first it
 * returns a generic multiple-choice item instead of the memory activity. */
const memory = Act.generate('logic.memory', 3, 'routing', [], {});
check('logic.memory reaches its own memory activity, not the logic catch-all',
  memory.questions.some(q => q.template === 'guided'),
  memory.questions.map(q => q.template));
check('the memory activity carries its memory visual',
  memory.questions.some(q => q.media && q.media.visual === 'memory'),
  memory.questions.map(q => (q.media && q.media.visual) || null));

/* Guard the ordering directly: no domain catch-all may precede a kind handler. */
const src = fs.readFileSync(path.join(root, 'sakhi-activities.js'), 'utf8');
const body = src.slice(src.indexOf('function qFor'), src.indexOf('function coachTip'));
const firstDomainFallback = body.search(/if\(skill\.domain_id===/);
const lastKindHandler = body.lastIndexOf("if(k===");
check('every kind handler is declared before the domain catch-alls',
  firstDomainFallback > lastKindHandler,
  { firstDomainFallback, lastKindHandler });

/* ---- 2. banks must not be indexed by question position alone ----
 * questionIndex only ranges over the questions in one lesson, so using it as
 * the sole index strands the rest of the bank. The surviving uses are "%2"
 * prompt-wording alternations, where the values still come from pick(r,...). */
const strandedIndexing = (body.match(/\[\(questionIndex\|\|0\)%(?!2\b)/g) || []).length;
check('no bank is selected by question position alone', strandedIndexing === 0, strandedIndexing);

/* ---- 3. a second sitting on the same skill must bring new questions ----
 * Carries the avoid list forward exactly as prepareMission does via
 * Prog.recentQuestionKeys, then counts sittings until a question repeats.
 * Open-ended activities are excluded: "write your own name" is meant to
 * recur, and there is no bank behind it to deepen. */
const OPEN_ENDED = new Set(['guided', 'trace']);
const MIN_FRESH_SITTINGS = 2;
const stale = [];
for (const sk of curriculum.skills) {
  let template = null;
  const avoid = new Set();
  let fresh = 0;
  for (let s = 0; s < 6; s++) {
    let a;
    try { a = Act.generate(sk.skill_id, 3, 'sitting' + s, [...avoid], {}); } catch (e) { break; }
    if (!template) template = a.questions[0].template;
    const keys = a.questions.map(q => q.question_key).filter(Boolean);
    if (!keys.length || keys.some(k => avoid.has(k))) break;
    keys.forEach(k => avoid.add(k));
    fresh++;
  }
  if (fresh < MIN_FRESH_SITTINGS && !OPEN_ENDED.has(template)) {
    stale.push(sk.skill_id + '(' + fresh + ', ' + template + ')');
  }
}
check(`every question-asking skill stays fresh for at least ${MIN_FRESH_SITTINGS} sittings`,
  stale.length === 0, stale.slice(0, 12));

/* ---- 4. generation stays deterministic for one seed ---- */
const once = Act.generate('math.number_bonds', 3, 'determinism', [], {});
const twice = Act.generate('math.number_bonds', 3, 'determinism', [], {});
check('the same seed produces the same lesson',
  JSON.stringify(once.questions.map(q => q.prompt + '|' + q.answer)) ===
  JSON.stringify(twice.questions.map(q => q.prompt + '|' + q.answer)));

if (failures.length) {
  console.error('activity-routing FAILED:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('activity-routing passed: kind handlers precede domain catch-alls, no position-indexed banks, every question-asking skill fresh for ' + MIN_FRESH_SITTINGS + '+ sittings, generation deterministic.');
