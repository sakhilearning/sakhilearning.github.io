const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const html = read('index.html');
const css = read('sakhi-production.css');
const app = read('sakhi-app.js');

const views = [...html.matchAll(/data-view="([^"]+)"/g)].map(match => match[1]);
const navTargets = [...html.matchAll(/data-nav="([^"]+)"/g)].map(match => match[1]);
const viewSet = new Set(views);

for (const required of ['home', 'activity', 'map', 'rewards', 'parent']) {
  if (!viewSet.has(required)) throw new Error(`Missing app view: ${required}`);
}

for (const nav of navTargets) {
  if (!viewSet.has(nav)) throw new Error(`Navigation target has no matching view: ${nav}`);
}

if (!/function show\(v\).*document\.body\.dataset\.view=v/s.test(app)) {
  throw new Error('Navigation should update body data-view for layout state');
}

if (!/body\[data-view="activity"\]\s+\.bottom-nav\s*\{[^}]*display:\s*none/s.test(css)) {
  throw new Error('Bottom navigation should hide during activities to avoid overlap');
}

if (!/@keyframes\s+pageIn/.test(css) || !/transition:/.test(css)) {
  throw new Error('The UI should include page motion and transition styling');
}

if (!/id="parentGate"/.test(html) || !/Try the grown-up question again/.test(app)) {
  throw new Error('Parent dashboard needs an explicit failure path for the grown-up gate');
}

if (!/id="celebrate"/.test(html) || !/classList\.add\('show'\)/.test(app)) {
  throw new Error('Activity completion should show the reward celebration overlay');
}

console.log('Navigation smoke passed: views, nav targets, activity layout state, parent failure path, and reward overlay are wired');
