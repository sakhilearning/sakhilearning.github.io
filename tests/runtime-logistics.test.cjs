const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const cloud = read('sakhi-cloud.js');
if (!cloud.includes('CFG.speechFunctionUrl') || !cloud.includes('CFG.ttsEndpoint')) {
  throw new Error('Cloud speech must support both speechFunctionUrl and ttsEndpoint');
}
if (!cloud.includes("SPEECH_URL||(BASE+'/functions/v1/sakhi-speech')")) {
  throw new Error('Cloud speech should prefer a configured endpoint and fall back to sakhi-speech');
}
if (!cloud.includes('httpStatus:r.status') || !cloud.includes("mime:mime||'audio/mpeg'")) {
  throw new Error('Cloud speech diagnostics are incomplete');
}

const audio = read('sakhi-audio.js');
if (/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech/i.test(audio)) {
  throw new Error('Browser or system TTS must not appear in production audio');
}
for (const token of ['SakhiCloud.speak', 'playWithHtmlAudio', 'premiumCache', 'decodeAudioData']) {
  if (!audio.includes(token)) throw new Error(`Premium audio path is missing ${token}`);
}

const app = read('sakhi-app.js');
if (!app.includes("answer==='071621'")) throw new Error('Parent passcode changed');
if (!app.includes('[data-trail-domain]') || !app.includes('startTrail')) throw new Error('Trail cards are not wired for interaction');

const manifest = JSON.parse(read('assets/audio/phonemes/manifest.json'));
for (const symbol of manifest.verified) {
  const file = path.join(root, 'assets/audio/phonemes', `phoneme_${symbol}.ogg`);
  if (!fs.existsSync(file)) throw new Error(`Verified phoneme is missing its audio file: ${symbol}`);
}
if (!manifest.verified.includes('p') || !manifest.verified.includes('t')) {
  throw new Error('Preserved /p/ and /t/ phonemes should be marked verified');
}

const sw = read('sw.js');
if (!/sakhi-v3-3\.1\.1/.test(sw)) throw new Error('Service worker cache was not bumped');
if (!sw.includes("cache:'no-store'")) throw new Error('Navigation requests should bypass stale HTTP caches');
for (const file of [
  'assets/theme-media/generated/home-unicorn-storytime.webp',
  'assets/theme-media/generated/reading-enchanted-library.webp',
  'assets/theme-media/generated/math-ice-gems.webp',
  'assets/theme-media/generated/science-mermaid-lagoon.webp'
]) {
  if (!read('sakhi-presentation.js').includes(file)) throw new Error(`Presentation layer does not use ${file}`);
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Generated scene is missing: ${file}`);
}
for (const file of ['index.html', 'sw.js', 'scripts/build.cjs', 'sakhi-presentation.js']) {
  if (read(file).includes('sakhi-art.js') || read(file).includes('SakhiArt')) {
    throw new Error(`${file} should not reference the removed unicorn/vector art runtime`);
  }
}
if (!sw.includes('self.skipWaiting()') || !sw.includes('self.clients.claim()')) {
  throw new Error('Service worker should activate fresh deployment assets immediately');
}

console.log('Runtime logistics passed: premium-only audio, clickable trails, protected parent gate, fresh navigation, and generated scenes are deploy-safe');
