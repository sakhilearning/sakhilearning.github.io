/* V3 structural activity coverage. Every active curriculum skill must generate
 * valid, deterministic, theme-free activities at all five difficulty bands. */
const path = require('path').join(__dirname, '..') + '/';
global.window = {};
require(path + 'sakhi-content.js');
require(path + 'sakhi-curriculum.js');
window.SakhiCurriculum.loadFrom(require(path + 'curriculum-snapshot.json'));
require(path + 'sakhi-activities.js');
const A = window.SakhiActivities, C = window.SakhiContent;
const skills = require(path + 'curriculum-snapshot.json').skills.filter(s => s.active !== false).map(s => s.skill_id);
let problems = [], generated = 0;
const fail = m => problems.push(m);

const missing = skills.filter(s => !C.has(s));
if (missing.length) fail('skills with no content bank: ' + missing.join(', '));

function validateQuestion(q, at) {
  if (!q.prompt) fail(at + ': no prompt');
  if (!q.narration) fail(at + ': no narration');
  if (!q.hints || q.hints.length < 3) fail(at + ': needs 3 progressive hints');
  if (q.answer === undefined || q.answer === null) fail(at + ': no answer');
  if (q.template === 'choice') {
    if (!Array.isArray(q.choices) || !q.choices.length) return fail(at + ': no choices');
    if (!q.choices.map(String).includes(String(q.answer))) fail(at + ': answer not among choices');
    if (new Set(q.choices.map(String)).size !== q.choices.length) fail(at + ': duplicate choices');
  }
  if (q.template === 'build' || q.template === 'sequence') {
    if (!Array.isArray(q.answer)) return fail(at + ': answer not an array');
    if (!Array.isArray(q.tokens)) return fail(at + ': no tokens');
    const tokens = q.tokens.slice();
    for (const x of q.answer) { const j = tokens.indexOf(x); if (j < 0) { fail(at + ': no token for ' + x); break; } tokens.splice(j, 1); }
  }
  if (q.template === 'sort') {
    if (!Array.isArray(q.tokens) || !Array.isArray(q.buckets)) return fail(at + ': sort missing tokens/buckets');
    const ids = q.buckets.map(b => b.id);
    q.tokens.forEach(t => { if (!(t in q.answer)) fail(at + ': unsorted token'); else if (!ids.includes(q.answer[t])) fail(at + ': bad bucket'); });
  }
  if (q.template === 'match') {
    if (!Array.isArray(q.left) || !Array.isArray(q.right)) return fail(at + ': match missing a side');
    const rids = q.right.map(r => r.id);
    q.left.forEach(l => { if (!(l.id in q.answer)) fail(at + ': unmatched left'); else if (!rids.includes(q.answer[l.id])) fail(at + ': bad match target'); });
  }
  if (q.template === 'trace' && (!q.media || q.media.letter === undefined)) fail(at + ': trace missing guide symbol');
}

for (const skill of skills) {
  for (let band = 1; band <= 5; band++) {
    for (let seed = 0; seed < 20; seed++) {
      let a;
      try { a = A.generate(skill, band, 'qa-' + seed); } catch (e) { fail(`THROW ${skill} b${band}: ${e.message}`); continue; }
      generated++;
      if (!a || a.skill_id !== skill) fail(`${skill} b${band}: wrong activity skill`);
      if (!a.questions || a.questions.length !== 3) { fail(`${skill} b${band}: expected 3 questions`); continue; }
      a.questions.forEach((q, i) => validateQuestion(q, `${skill} b${band} q${i} [${q.template}]`));
    }
  }
}

for (const skill of ['reading.cvc_mixed','math.number_sense','reading.print_concepts','math.solid_shapes']) {
  const x = JSON.stringify(A.generate(skill, 3, 'same'));
  const y = JSON.stringify(A.generate(skill, 3, 'same'));
  if (x !== y) fail(skill + ': generator is not deterministic');
}

// Ensure the activity engine itself never reads presentation/theme state.
const fs = require('fs');
const source = fs.readFileSync(path + 'sakhi-activities.js', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
if (/SakhiThemes|SakhiTrails|active_theme/.test(source)) fail('activity generator reads theme/trail state');

console.log(`activities generated: ${generated} across ${skills.length} skills x 5 bands x 20 seeds`);
console.log(problems.length ? `${problems.length} PROBLEM(S)` : 'ALL CHECKS PASSED');
problems.slice(0, 30).forEach(p => console.log('  - ' + p));
process.exit(problems.length ? 1 : 0);
