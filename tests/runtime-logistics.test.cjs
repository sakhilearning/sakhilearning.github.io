const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const cloud = read('sakhi-cloud.js');
if (!cloud.includes('CFG.ttsEndpoint')) throw new Error('Cloud speech must use configured ttsEndpoint');
if (!cloud.includes('AbortController')) throw new Error('Cloud speech needs a timeout so audio fallback is not blocked');
if (!cloud.includes("TTS||BASE+'/functions/v1/sakhi-speech'")) throw new Error('Cloud speech should prefer ttsEndpoint and only fall back to sakhi-speech when no endpoint is configured');

const audio = read('sakhi-audio.js');
if (audio.includes("cloud.status==='CONNECTED'")) throw new Error('Narration should try premium TTS when configured, even before parent sync is connected');
if (!audio.includes('timeout:3200')) throw new Error('Premium TTS should get a short child-friendly timeout before fallback');
if (!audio.includes('cloudMutedUntil')) throw new Error('Cloud speech failures should be muted temporarily after fallback');
if (!audio.includes('speechSynthesis.resume')) throw new Error('Browser speech should resume before speaking');

const manifest = JSON.parse(read('assets/audio/phonemes/manifest.json'));
for (const symbol of manifest.verified) {
  const file = path.join(root, 'assets/audio/phonemes', `phoneme_${symbol}.ogg`);
  if (!fs.existsSync(file)) throw new Error(`Verified phoneme is missing its audio file: ${symbol}`);
}
if (!manifest.verified.includes('p') || !manifest.verified.includes('t')) {
  throw new Error('Preserved /p/ and /t/ phonemes should be marked verified');
}

const sw = read('sw.js');
if (!/public-media-theme-20260911/.test(sw)) throw new Error('Service worker cache was not bumped for the public media theme build');
for (const file of ['phoneme_p.ogg', 'phoneme_t.ogg', 'manifest.json']) {
  if (!sw.includes(file)) throw new Error(`Service worker does not cache ${file}`);
}
for (const file of [
  'assets/theme-media/public/meadow-bart-cc0.jpg',
  'assets/theme-media/public/underwater-scribe-cc0.png',
  'assets/theme-media/public/neuschwanstein-wikimedia.jpg'
]) {
  if (!sw.includes(file)) throw new Error(`Service worker does not cache ${file}`);
}
for (const file of ['index.html', 'sw.js', 'scripts/build.cjs', 'sakhi-presentation.js']) {
  if (read(file).includes('sakhi-art.js') || read(file).includes('SakhiArt')) {
    throw new Error(`${file} should not reference the removed unicorn/vector art runtime`);
  }
}
if (!sw.includes('self.skipWaiting()') || !sw.includes('self.clients.claim()')) {
  throw new Error('Service worker should activate fresh deployment assets immediately');
}

console.log('Runtime logistics passed: audio endpoint, fallback, public media cache, and removed art runtime are deploy-safe');
