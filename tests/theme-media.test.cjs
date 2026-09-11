const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const presentation = read('sakhi-presentation.js');
const mediaRefs = [...presentation.matchAll(/\.\/(assets\/theme-media\/generated\/[^'"]+)/g)].map(match => match[1]);
const uniqueRefs = [...new Set(mediaRefs)];

if (uniqueRefs.length !== 9) {
  throw new Error(`Theme presentation should reference nine distinct generated scenes; found ${uniqueRefs.length}`);
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
