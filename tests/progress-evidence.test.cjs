/* Behavioral cover for the learner-evidence writes.
 *
 * 4.5.2 shipped `if(!key)return null,id=...,row={...}` in recordQuestion. The
 * semicolon had become a comma, so `id` and `row` were only ever assigned on the
 * early-return path and referencing `row` afterwards threw ReferenceError. The
 * call site in check() was unguarded, so the throw unwound the whole handler and
 * the Check button did nothing on every press — the child could not advance.
 *
 * Every existing suite passed, because they all assert on source patterns and
 * that typo is syntactically valid. These checks CALL the functions instead.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const failures = [];
const check = (label, cond, extra) => {
  if (!cond) failures.push(label + (extra !== undefined ? '  <' + JSON.stringify(extra) + '>' : ''));
};

/* minimal browser shims */
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

require(path.join(root, 'sakhi-progress.js'));
const Prog = global.window.SakhiProgress;

check('sakhi-progress.js exposes recordQuestion', typeof Prog.recordQuestion === 'function');

if (typeof Prog.recordQuestion === 'function') {
  const payload = {
    session_id: 'sess-1', activity_id: 'act-1', skill_id: 'math.count_to_20',
    domain_id: 'math', question_index: 0, question_key: 'count-20-a',
    correct: true, hints: 0, tries: 1, response_ms: 1200, difficulty: 2
  };

  /* The shipped bug: this threw instead of returning a row. */
  let row = null, threw = null;
  try { row = Prog.recordQuestion(payload); } catch (e) { threw = e.message; }
  check('recordQuestion does not throw on a normal answer', threw === null, threw);
  check('recordQuestion returns the stored row', row && typeof row === 'object', row);
  if (row) {
    check('row id combines activity, index and key', row.id === 'act-1:0:count-20-a', row.id);
    check('row keeps the result', row.correct === true, row.correct);
    check('row keeps the skill and domain', row.skill_id === 'math.count_to_20' && row.domain_id === 'math', row);
    check('row is timestamped', typeof row.at === 'string' && row.at.length > 0, row.at);
  }

  /* It must land in history, since the parent view reads from there. */
  const history = (Prog.load().question_history) || [];
  check('the answer reaches question_history', history.length === 1, history.length);

  /* Re-answering the same question updates rather than duplicating. */
  let second = null;
  try { second = Prog.recordQuestion(Object.assign({}, payload, { correct: false, tries: 2 })); }
  catch (e) { failures.push('re-answering threw: ' + e.message); }
  const after = (Prog.load().question_history) || [];
  check('re-answering replaces the row instead of duplicating', after.length === 1, after.length);
  check('the replacement keeps the newer result', second && second.correct === false, second && second.correct);

  /* A payload with no question_key must bow out quietly, not explode. */
  let empty = undefined, emptyThrew = null;
  try { empty = Prog.recordQuestion({}); } catch (e) { emptyThrew = e.message; }
  check('a payload without question_key returns null', empty === null, empty);
  check('a payload without question_key does not throw', emptyThrew === null, emptyThrew);

  let undef = undefined, undefThrew = null;
  try { undef = Prog.recordQuestion(undefined); } catch (e) { undefThrew = e.message; }
  check('recordQuestion(undefined) does not throw', undefThrew === null, undefThrew);
  check('recordQuestion(undefined) returns null', undef === null, undef);
}

/* Defense in depth: even if evidence writing fails again, the child must still
 * be able to move on, so the call site has to be guarded. */
const app = fs.readFileSync(path.join(root, 'sakhi-app.js'), 'utf8');
check('check() wraps recordQuestion so a telemetry fault cannot block advancing',
  /try\{if\(Prog\.recordQuestion\)Prog\.recordQuestion\(/.test(app));

/* The exact corruption, so it cannot come back via another edit. */
const progressSrc = fs.readFileSync(path.join(root, 'sakhi-progress.js'), 'utf8');
check('recordQuestion does not re-introduce `return null,` comma chaining',
  !/return\s+null\s*,\s*id\s*=/.test(progressSrc));

for (const file of fs.readdirSync(root).filter(f => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(root, file), 'utf8');
  if (/return\s+[A-Za-z0-9_]+\s*,\s*[A-Za-z_][A-Za-z0-9_]*\s*=\s*[[{]/.test(src)) {
    failures.push(file + ' chains assignments off a return — the 4.5.2 Check-button corruption');
  }
}

if (failures.length) {
  console.error('progress-evidence FAILED:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('progress-evidence passed: answers are recorded, re-answers replace, bad payloads are safe, and the check() call site is guarded.');
