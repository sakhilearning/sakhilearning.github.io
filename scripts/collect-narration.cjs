/* Write the list of every line the app can speak, for the narration generator.
 * The enumeration itself lives in narration-lines.cjs, shared with the suite
 * that guards the pack, so the two cannot drift apart. */
const fs = require('fs');
const path = require('path');
const { collect } = require('./narration-lines.cjs');

const root = path.join(__dirname, '..');
const output = collect();
const target = path.join(root, 'assets/audio/narration/texts-v5.json');
if (process.argv.includes('--count')) {
  const current = JSON.parse(fs.readFileSync(target, 'utf8'));
  console.log(`Would collect ${output.length} lines (currently ${current.length}).`);
  process.exit(0);
}
fs.writeFileSync(target, JSON.stringify(output, null, 2));
console.log(`Collected ${output.length} spoken lines from the runtime narration path.`);
