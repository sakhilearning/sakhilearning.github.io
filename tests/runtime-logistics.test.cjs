const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const cloud = read('sakhi-cloud.js');
if (!cloud.includes('CFG.ttsEndpoint')) throw new Error('Cloud speech must use configured ttsEndpoint');
if (!cloud.includes('AbortController')) throw new Error('Cloud speech needs a timeout so audio fallback is not blocked');
if (!cloud.includes("TTS||BASE+'/functions/v1/sakhi-speech'")) throw new Error('Cloud speech should prefer ttsEndpoint and only fall back to sakhi-speech when no endpoint is configured');

const audio = read('sakhi-audio.js');
if (!audio.includes("cloud.status==='CONNECTED'")) throw new Error('Narration should not call cloud speech before parent sync is connected');
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
if (!/audio-logistics-20260911/.test(sw)) throw new Error('Service worker cache was not bumped');
for (const file of ['phoneme_p.ogg', 'phoneme_t.ogg', 'manifest.json']) {
  if (!sw.includes(file)) throw new Error(`Service worker does not cache ${file}`);
}
if (!sw.includes('self.skipWaiting()') || !sw.includes('self.clients.claim()')) {
  throw new Error('Service worker should activate fresh deployment assets immediately');
}

console.log('Runtime logistics passed: audio endpoint, fallback, phoneme manifest, and service worker cache are deploy-safe');
