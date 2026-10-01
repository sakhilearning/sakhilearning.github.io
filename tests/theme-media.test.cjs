const fs = require('fs');
const vm = require('vm');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const presentation = read('sakhi-presentation.js');
const mediaRefs = [...presentation.matchAll(/\.\/(assets\/theme-media\/generated(?:-v4)?\/[^'"]+)/g)].map(match => match[1]);
const uniqueRefs = [...new Set(mediaRefs)];

const ctx={window:{},SakhiTrails:{get:domain=>({name:domain,palette:['#fff','#eee','#ddd'],companion:'Guide'}),chapter:()=> 'Chapter'}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(presentation,ctx);
const stepMedia=[0,1,2].map(i=>ctx.SakhiPresentation.mediaFor('science','Animal diets','choice',i).src);
if(new Set(stepMedia).size!==3)throw new Error('Consecutive science steps must rotate through distinct generated scenes');
const cueText=[0,1,2,3].map(i=>ctx.SakhiPresentation.storyCue('math','Compare numbers',i).text);
if(new Set(cueText).size!==4)throw new Error('Consecutive lesson steps must not repeat the same coaching sentence');

if (uniqueRefs.length < 11) {
  throw new Error(`Theme presentation should reference at least eleven distinct generated scenes; found ${uniqueRefs.length}`);
}

for (const ref of uniqueRefs) {
  const absolute = path.join(root, ref);
  if (!fs.existsSync(absolute)) throw new Error(`Theme media file is missing: ${ref}`);
  const stat = fs.statSync(absolute);
  if (stat.size < 1024) throw new Error(`Theme media file is unexpectedly tiny: ${ref}`);
}

const scannedFiles = [
  'index.template.html',
  'sakhi-presentation.js',
  'sakhi-production.css',
  'sw.js'
];

for (const file of scannedFiles) {
  const source = read(file);
  if (/https?:\/\/[^'"\s)]+\.(?:png|jpe?g|webp|gif|svg)(?:[?#][^'"\s)]*)?/i.test(source)) {
    throw new Error(`${file} should not hotlink runtime image assets`);
  }
  if (source.includes('unicorn-icon.svg') || source.includes('SakhiArt') || source.includes('sakhi-art.js')) {
    throw new Error(`${file} still references the removed unicorn/vector art assets`);
  }
}

console.log(`Theme media passed: ${uniqueRefs.length} supplied generated scenes are local, distinct, and free of removed placeholder art`);
