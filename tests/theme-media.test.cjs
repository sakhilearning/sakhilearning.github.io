const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const presentation = read('sakhi-presentation.js');
const attribution = read('assets/theme-media/ATTRIBUTION.md');
const mediaRefs = [...presentation.matchAll(/\.\/(assets\/theme-media\/public\/[^'"]+)/g)].map(match => match[1]);
const uniqueRefs = [...new Set(mediaRefs)];

if (!uniqueRefs.length) {
  throw new Error('Theme presentation should reference local public-source media');
}

for (const ref of uniqueRefs) {
  const absolute = path.join(root, ref);
  if (!fs.existsSync(absolute)) throw new Error(`Theme media file is missing: ${ref}`);
  const stat = fs.statSync(absolute);
  if (stat.size < 1024) throw new Error(`Theme media file is unexpectedly tiny: ${ref}`);
  if (!attribution.includes(path.basename(ref))) throw new Error(`Attribution is missing for ${ref}`);
}

const scannedFiles = [
  'index.html',
  'sakhi-presentation.js',
  'sakhi-production.css',
  'sw.js'
];

for (const file of scannedFiles) {
  const source = read(file);
  if (/https?:\/\/(?!creativecommons\.org|commons\.wikimedia\.org|opengameart\.org)/.test(source)) {
    throw new Error(`${file} should not hotlink runtime image assets`);
  }
  if (source.includes('unicorn-icon.svg') || source.includes('SakhiArt') || source.includes('sakhi-art.js')) {
    throw new Error(`${file} still references the removed unicorn/vector art assets`);
  }
}

console.log(`Theme media passed: ${uniqueRefs.length} local licensed assets are referenced, attributed, and free of removed unicorn art`);
