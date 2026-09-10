/* Structural coverage: every curriculum skill must generate a valid activity at
 * every difficulty band, deterministically. */
const path = require('path').join(__dirname, '..') + '/';
global.window = {};
require(path + 'sakhi-content.js');
require(path + 'sakhi-activities.js');
const A = window.SakhiActivities, C = window.SakhiContent;
const skills = require(path + 'curriculum-snapshot.json').skills.map(s => s.skill_id);

let problems = [], gen = 0;
const P = m => problems.push(m);

const missing = skills.filter(s => !C.has(s));
if (missing.length) P('skills with no content bank: ' + missing.join(', '));

for (const sk of skills) for (let band = 1; band <= 5; band++) for (const seed of ['s1', 's2', 's3']) {
  let a;
  try { a = A.generate(sk, band, seed); } catch (e) { P(`THROW ${sk} b${band}: ${e.message}`); continue; }
  gen++;
  if (a.questions.length !== 3) P(`${sk} b${band}: ${a.questions.length} questions`);
  a.questions.forEach((q, i) => {
    const at = `${sk} b${band} q${i} [${q.template}]`;
    if (!q.prompt) P(at + ': no prompt');
    if (!q.narration) P(at + ': no narration');
    if (!q.hints || q.hints.length < 3) P(at + ': needs 3 progressive hints');
    if (q.answer === undefined || q.answer === null) P(at + ': no answer');
    if (q.template === 'choice') {
      if (!q.choices) return P(at + ': no choices');
      if (!q.choices.map(String).includes(String(q.answer))) P(at + ': answer not among choices');
      if (new Set(q.choices.map(String)).size !== q.choices.length) P(at + ': duplicate choices');
    }
    if (q.template === 'build' || q.template === 'sequence') {
      if (!Array.isArray(q.answer)) return P(at + ': answer not an array');
      if (!q.tokens) return P(at + ': no tokens');
      const t = q.tokens.slice();
      for (const x of q.answer) { const j = t.indexOf(x); if (j < 0) { P(at + ': no token for ' + x); break; } t.splice(j, 1); }
    }
    if (q.template === 'sort') {
      if (!q.tokens || !q.buckets) return P(at + ': sort missing tokens/buckets');
      const ids = q.buckets.map(b => b.id);
      q.tokens.forEach(t => { if (!(t in q.answer)) P(at + ': unsorted token'); else if (!ids.includes(q.answer[t])) P(at + ': bad bucket'); });
    }
    if (q.template === 'match') {
      if (!q.left || !q.right) return P(at + ': match missing a side');
      const rids = q.right.map(r => r.id);
      q.left.forEach(l => { if (!(l.id in q.answer)) P(at + ': unmatched left'); else if (!rids.includes(q.answer[l.id])) P(at + ': bad match target'); });
    }
  });
}
// compose questions must carry tray data, or the counting template silently
// falls back to a multiple-choice card and the counting-out skill is lost
for (let band = 1; band <= 5; band++) {
  const a = A.generate('math.compose_to_10', band, 'tray');
  const withTray = a.questions.filter(q => q.tray);
  if (!withTray.length) P(`math.compose_to_10 band ${band}: no question carries tray data`);
  withTray.forEach(q => {
    if (typeof q.tray.start !== 'number' || typeof q.tray.goal !== 'number') P('tray missing start/goal');
    if (q.tray.goal - q.tray.start !== q.answer) P(`tray goal-start (${q.tray.goal - q.tray.start}) disagrees with answer (${q.answer})`);
    if (q.tray.start >= q.tray.goal) P('tray start is not below goal');
  });
}

const floatStarter = A.generate('science.float_sink', 1, 'visuals').questions.find(q => q.template === 'sort');
if (!floatStarter) P('science.float_sink starter: no sort question generated');
else {
  if (!floatStarter.tokens.includes('leaf')) P('science.float_sink starter: leaf token missing');
  if (!floatStarter.tokens.includes('rock')) P('science.float_sink starter: rock token missing');
  if (floatStarter.answer.leaf !== 'float') P('science.float_sink starter: leaf does not map to float');
  if (floatStarter.answer.rock !== 'sink') P('science.float_sink starter: rock does not map to sink');
  if (!floatStarter.tokenVisuals?.leaf?.image?.includes('leaf-water.webp')) P('science.float_sink starter: leaf image missing');
  if (!floatStarter.tokenVisuals?.rock?.image?.includes('rock-water.webp')) P('science.float_sink starter: rock image missing');
}

if (JSON.stringify(A.generate('reading.cvc_mixed', 3, 'x')) !== JSON.stringify(A.generate('reading.cvc_mixed', 3, 'x'))) P('generator is not deterministic');
if (JSON.stringify(A.generate('reading.cvc_mixed', 3, 'x')) === JSON.stringify(A.generate('reading.cvc_mixed', 3, 'y'))) P('seed does not change output');

console.log(`activities generated: ${gen} across ${skills.length} skills x 5 bands`);
console.log(problems.length ? problems.length + ' PROBLEM(S)' : 'ALL CHECKS PASSED');
problems.slice(0, 20).forEach(p => console.log('  - ' + p));
process.exit(problems.length ? 1 : 0);
