const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
function read(file){return fs.readFileSync(path.join(root,file),'utf8');}
function stripComments(source){return String(source||'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:])\/\/.*$/gm,'$1');}

const experience=stripComments(read('sakhi-experience.js'));
for(const [pattern,label] of [
  [/\bMutationObserver\b/,'MutationObserver'],
  [/\.querySelector(?:All)?\s*\(/,'querySelector/querySelectorAll'],
  [/\.getElementById\s*\(/,'getElementById'],
  [/\.(?:innerHTML|outerHTML|textContent|innerText)\s*=/,'direct DOM text/html assignment'],
  [/\.classList\s*\./,'classList mutation'],
  [/\.setAttribute\s*\(/,'setAttribute mutation']
]){
  assert(!pattern.test(experience),`sakhi-experience.js must not own rendered DOM through ${label}`);
}
assert(/window\.SakhiExperience\s*=/.test(experience),'sakhi-experience.js should only publish the SakhiExperience metadata contract');
assert(/integrated\s*:\s*true/.test(experience),'retired experience layer must stay marked integrated:true');
assert(/ownsDom\s*:\s*false/.test(experience),'retired experience layer must stay marked ownsDom:false');

const school=stripComments(read('sakhi-schoolwork.js'));
assert(!/window\.SakhiActivities\s*=/.test(school),'schoolwork must not replace window.SakhiActivities; canonical owners must keep object identity');
assert(!/window\.SakhiTemplates\s*=/.test(school),'schoolwork must not replace window.SakhiTemplates; canonical owners must keep object identity');
assert(!/\b__schoolworkWrapped\b/.test(school),'schoolwork must not revive the old wrapped-copy install path');
assert(!/\bwrapped\s*=\s*\{\}/.test(school),'schoolwork must not clone SakhiActivities into a wrapper object');
assert(!/\bnext\s*=\s*\{\}/.test(school),'schoolwork must not clone SakhiTemplates into a wrapper object');
assert(!/\bA\.generate\s*=/.test(school),'schoolwork must not replace SakhiActivities.generate; the canonical generator owns generation');
assert(!/\bA\.canGenerate\s*=/.test(school),'schoolwork must not replace SakhiActivities.canGenerate');
assert(!/\bT\.render\s*=/.test(school),'schoolwork must not replace SakhiTemplates.render; the canonical renderer owns routing');
assert(/function install\(\)\{return true;\}/.test(school),'schoolwork install must remain a no-op compatibility bridge');

console.log('source-architecture: ok');
