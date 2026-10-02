/* Generate the app-local Kokoro narration pack so child pages never wait on
 * remote TTS. On iPad a line that is missing from this pack throws rather than
 * falling back, so every runtime line in texts-v5.json must be bundled here.
 *
 * This replaced a Python generator that needed kokoro_onnx, onnxruntime and
 * numpy plus hand-supplied model and voice files, none of which the project
 * declares. kokoro-js is already a devDependency -- it is what builds
 * vendor/kokoro-runtime.js for the browser -- so the pack and the in-app voice
 * now come from one declared dependency and one set of constants.
 *
 * Voice, speed, clip naming and the encoder settings must match the clips
 * already bundled, or regenerating renames every file and the child hears two
 * different voices inside one lesson.
 *
 * Usage: node scripts/generate-narration.mjs [--limit N]
 * Safe to interrupt and re-run: finished clips are kept and skipped.
 */
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { KokoroTTS } from 'kokoro-js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/audio/narration');
const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const DTYPE = 'q8';                     /* the bundled pack is Kokoro-82M v1.0 int8 */
const VOICE = 'af_heart';
const SPEED = 0.86;
const BITRATE = '56k';

const limitArg = process.argv.indexOf('--limit');
const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

const manifestPath = path.join(OUT, 'manifest.json');
const manifest = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : { version: 2, files: {} };
const files = manifest.files || {};
const texts = JSON.parse(readFileSync(path.join(OUT, 'texts-v5.json'), 'utf8'));

/* Clip names are content addressed, so a changed voice or speed is a new file
 * rather than a silent overwrite of a clip the service worker already cached. */
const clipName = text =>
  createHash('sha256').update(VOICE + String(SPEED) + text).digest('hex').slice(0, 20) + '.mp3';

const writeManifest = () => writeFileSync(manifestPath, JSON.stringify({
  version: 2, voice: VOICE, model: 'Kokoro-82M v1.0 int8', speed: SPEED, files
}, null, 0));

/* Matches the encoder the bundled clips were made with: mono 56k mp3, peaks
 * limited just under full scale, and a short fade so playback never clicks. */
function encodeMp3(samples, rate, destination) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-v', 'error', '-y',
      '-f', 'f32le', '-ar', String(rate), '-ac', '1', '-i', 'pipe:0',
      '-af', 'alimiter=limit=0.90:level=false,afade=t=in:d=0.025',
      '-codec:a', 'libmp3lame', '-b:a', BITRATE, destination]);
    let err = '';
    ff.stderr.on('data', d => { err += d; });
    ff.on('error', reject);
    ff.on('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg exited ' + code + ' ' + err.trim())));
    ff.stdin.on('error', reject);
    ff.stdin.end(Buffer.from(new Float32Array(samples).buffer));
  });
}

const missing = texts.filter(t => !files[t] || !existsSync(path.join(OUT, files[t])));
const queue = missing.slice(0, limit === Infinity ? missing.length : limit);
console.log(`${texts.length} runtime lines; ${texts.length - missing.length} already bundled; generating ${queue.length}.`);
if (!queue.length) { writeManifest(); process.exit(0); }

const tts = await KokoroTTS.from_pretrained(MODEL, { dtype: DTYPE, device: 'cpu' });
let done = 0;
for (const text of queue) {
  const name = clipName(text);
  const destination = path.join(OUT, name);
  if (!existsSync(destination)) {
    const audio = await tts.generate(text, { voice: VOICE, speed: SPEED });
    const samples = audio.audio;
    let peak = 0;
    for (const v of samples) {
      if (!Number.isFinite(v)) throw new Error('Non-finite audio for: ' + text);
      const a = Math.abs(v);
      if (a > peak) peak = a;
    }
    /* A silent clip is worse than a missing one: the gate would pass and the
     * child would simply get no instruction. */
    if (!samples.length || peak < 0.01) throw new Error('Empty or silent voice for: ' + text);
    await encodeMp3(samples, audio.sampling_rate, destination);
  }
  files[text] = name;
  done++;
  if (done % 25 === 0 || done === queue.length) {
    writeManifest();
    console.log(`${done}/${queue.length} narration lines ready`);
  }
}
writeManifest();
console.log(`Complete: ${Object.keys(files).length} narration mappings written.`);
