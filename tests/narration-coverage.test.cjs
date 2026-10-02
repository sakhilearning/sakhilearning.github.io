/* Every line the app can speak must be bundled and generated.
 *
 * On iPad a line missing from the pack throws rather than falling back to
 * remote TTS, so the child gets silence instead of instruction. This suite used
 * to re-implement what gets spoken, normalizing `spoken_instruction ||
 * narration || prompt` with its own copy of the symbol replacements. The
 * runtime composes something else -- an explanation, a worked example, a guide,
 * each spoken as its own utterance -- so the suite agreed with a collector that
 * was guessing the same wrong thing, and teaching narration shipped completely
 * unbundled underneath both.
 *
 * It now enumerates through the same module the collector uses, which drives
 * the runtime's own questionSegments and childChunks.
 */
const fs = require('fs');
const path = require('path');
const { collect } = require('../scripts/narration-lines.cjs');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const required = JSON.parse(read('assets/audio/narration/texts-v5.json'));
const manifest = JSON.parse(read('assets/audio/narration/manifest.json'));
const listed = new Set(required);

/* 1. the recorded list must still cover everything the runtime can speak */
const reachable = collect();
const unlisted = reachable.filter(text => !listed.has(text));
if (unlisted.length) {
  throw new Error(`${unlisted.length} runtime lines are missing from texts-v5.json — run npm run narration:collect:\n` + unlisted.slice(0, 12).join('\n'));
}

/* 2. the clip name is a hash of voice + speed + text, so changing either
 * constant renames every clip: the pack would look complete while the service
 * worker still served the old files. 285 clips already carry names from a
 * superseded pipeline, which is how that drift shows up. */
const generator = read('scripts/generate-narration.mjs');
const constant = name => {
  const m = generator.match(new RegExp('const ' + name + " = '?([^';]+)'?;"));
  return m && m[1].trim();
};
if (constant('VOICE') !== manifest.voice) throw new Error(`Generator voice ${constant('VOICE')} does not match the bundled pack (${manifest.voice})`);
if (Number(constant('SPEED')) !== Number(manifest.speed)) throw new Error(`Generator speed ${constant('SPEED')} does not match the bundled pack (${manifest.speed})`);
if (!String(manifest.model || '').includes('int8') || constant('DTYPE') !== 'q8') throw new Error(`Generator quantization ${constant('DTYPE')} does not match the bundled pack (${manifest.model})`);

/* 3. every listed line must actually have a clip on disk */
const missingFiles = required.filter(text => !manifest.files[text] || !fs.existsSync(path.join(root, 'assets/audio/narration', manifest.files[text])));
if (missingFiles.length) throw new Error(`${missingFiles.length} required narration clips are not bundled — run npm run narration:generate`);

console.log(`Narration coverage passed: ${required.length} local Kokoro lines cover every spoken segment across 141 skills × 5 bands, taught and untaught.`);
