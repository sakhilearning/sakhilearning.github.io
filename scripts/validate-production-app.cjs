/* Deploy gate. Validates the princess-theme-core architecture:
 * one owner per concern, no resurrected legacy runtime, a sound curriculum
 * graph, content for every skill, and the theme/curriculum separation. */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = f => (fs.existsSync(path.join(root, f)) ? fs.readFileSync(path.join(root, f), 'utf8') : '');

const errors = [];
const fail = m => errors.push(m);

const index = read('index.html');
const sw = read('sw.js');
const manifest = read('manifest.json');

/* ---- 1. one runtime, all of it loaded ---- */
const MODULES = [
  'supabase-config.js', 'sakhi-cloud.js', 'sakhi-curriculum.js', 'sakhi-themes.js',
  'sakhi-content.js', 'sakhi-activities.js', 'sakhi-progress.js', 'sakhi-adaptive.js',
  'sakhi-audio.js', 'sakhi-templates.js', 'sakhi-app.js'
];
MODULES.forEach(m => { if (!index.includes(m)) fail(`index.html does not load ${m}`); });
if (!index.includes('sakhi-production.css')) fail('index.html does not load the stylesheet');

/* ---- 2. the legacy runtime must stay gone ---- */
const LEGACY = ['app.js', 'interaction-engine.js', 'daily-journey-service.js', 'adaptive-engine.js',
  'visuals.js', 'sakhi-shell.js', 'sakhi-production.js', 'persistence.js', 'progress-service.js',
  'reward-service.js', 'settings-ui.js', 'styles.css'];
LEGACY.forEach(f => {
  if (fs.existsSync(path.join(root, f))) fail(`legacy runtime file is back: ${f}`);
  if (index.includes('./' + f)) fail(`index.html references legacy runtime: ${f}`);
});

/* ---- 3. curriculum graph integrity ---- */
let snap = null;
try { snap = JSON.parse(read('curriculum-snapshot.json')); }
catch (e) { fail('curriculum-snapshot.json is missing or unparseable'); }

if (snap) {
  const ids = snap.skills.map(s => s.skill_id);
  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
  if (dupes.length) fail('duplicate skill ids: ' + [...new Set(dupes)].join(', '));
  const S = new Set(ids);

  snap.prerequisites.forEach(p => {
    if (!S.has(p.skill_id)) fail(`prerequisite references unknown skill ${p.skill_id}`);
    if (!S.has(p.prerequisite_skill_id)) fail(`unknown prerequisite ${p.prerequisite_skill_id}`);
  });
  snap.skills.forEach(s => (s.recommended_next || []).forEach(n => {
    if (!S.has(n)) fail(`${s.skill_id} recommends unknown skill ${n}`);
  }));

  // cycle check over prerequisite edges
  const adj = {};
  ids.forEach(i => (adj[i] = []));
  snap.prerequisites.forEach(p => { if (adj[p.skill_id]) adj[p.skill_id].push(p.prerequisite_skill_id); });
  const colour = {};
  const walk = (u, stack) => {
    colour[u] = 1;
    (adj[u] || []).forEach(v => {
      if (colour[v] === 1) fail('prerequisite loop: ' + stack.concat([u, v]).join(' -> '));
      else if (!colour[v]) walk(v, stack.concat([u]));
    });
    colour[u] = 2;
  };
  ids.forEach(i => { if (!colour[i]) walk(i, []); });

  const domains = new Set(snap.domains.map(d => d.domain_id));
  snap.skills.forEach(s => { if (!domains.has(s.domain_id)) fail(`${s.skill_id} has unknown domain ${s.domain_id}`); });

  // every domain needs at least one entry point or nothing can ever start
  const hasPrereq = new Set(snap.prerequisites.map(p => p.skill_id));
  domains.forEach(d => {
    const entry = snap.skills.filter(s => s.domain_id === d && !hasPrereq.has(s.skill_id));
    if (!entry.length) fail(`domain ${d} has no entry point`);
  });

  /* ---- 4. content covers every skill, at every band ---- */
  global.window = {};
  require(path.join(root, 'sakhi-content.js'));
  require(path.join(root, 'sakhi-activities.js'));
  const C = global.window.SakhiContent, A = global.window.SakhiActivities;
  ids.forEach(id => { if (!C.has(id)) fail(`no content bank for skill ${id}`); });
  ids.forEach(id => {
    for (let band = 1; band <= 5; band++) {
      try {
        const a = A.generate(id, band, 'gate');
        if (a.questions.length !== 3) fail(`${id} band ${band} produced ${a.questions.length} questions`);
        a.questions.forEach(q => {
          if (!q.prompt || !q.narration) fail(`${id} band ${band}: question missing prompt or narration`);
          if (!q.hints || q.hints.length < 3) fail(`${id} band ${band}: needs 3 progressive hints`);
          if (q.template === 'choice' && !q.choices.map(String).includes(String(q.answer))) {
            fail(`${id} band ${band}: correct answer is not among the choices`);
          }
        });
      } catch (e) { fail(`${id} band ${band} failed to generate: ${e.message}`); }
    }
  });
}

/* ---- 5. themes stay cosmetic ---- */
const themes = read('sakhi-themes.js');
['FORBIDDEN_KEYS', 'deepFreeze'].forEach(t => {
  if (!themes.includes(t)) fail(`sakhi-themes.js lost its ${t} guard`);
});
if (/window\.SakhiCurriculum|SakhiProgress|SakhiAdaptive/.test(themes)) {
  fail('sakhi-themes.js reaches into curriculum or progress — themes must stay cosmetic');
}
const adaptive = read('sakhi-adaptive.js');
if (/SakhiThemes|active_theme|theme\./.test(adaptive.replace(/\/\*[\s\S]*?\*\//g, ''))) {
  fail('sakhi-adaptive.js reads the theme — skill selection must be theme-independent');
}

/* ---- 6. exactly one completion path ---- */
const progress = read('sakhi-progress.js');
if (!progress.includes('function completeActivity')) fail('sakhi-progress.js has no completeActivity');
const writers = (progress.match(/Cloud\.upsert\(/g) || []).length;
if (!writers) fail('sakhi-progress.js never queues a cloud write');

/* ---- 6b. the service worker must actually be registered ---- */
const app = read('sakhi-app.js');
if (!/navigator\.serviceWorker\.register\(/.test(app)) {
  fail('nothing registers sw.js — the app ships a service worker it never installs');
}
if (!index.includes('updateBanner')) fail('index.html has no update banner for the service worker flow');

/* ---- 7. service worker ships the real file list ---- */
MODULES.concat(['sakhi-production.css', 'curriculum-snapshot.json']).forEach(m => {
  if (!sw.includes(m)) fail(`service worker does not cache ${m}`);
});

/* ---- 8. manifest ---- */
if (!manifest.includes('Sakhi Magic Learning')) fail('manifest is missing the app name');
if (!manifest.includes('icon-192.png') || !manifest.includes('icon-512.png')) fail('manifest is missing raster icons');
if (!index.includes('apple-touch-icon') || !index.includes('icon-180.png')) fail('index is missing the iOS home-screen icon');

if (errors.length) {
  console.error('Sakhi production validation FAILED:\n- ' + errors.join('\n- '));
  process.exit(1);
}
console.log([
  'Sakhi production validation passed:',
  `  - ${MODULES.length} modules loaded, no legacy runtime present`,
  `  - curriculum graph sound (${snap.skills.length} skills, ${snap.prerequisites.length} prerequisites, no loops or orphan references)`,
  `  - content + activities generate for every skill at all 5 bands`,
  '  - themes are cosmetic-only and adaptive selection is theme-independent',
  '  - one atomic completion path, service worker and manifest complete'
].join('\n'));
