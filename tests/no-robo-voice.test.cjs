const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const audio=fs.readFileSync(path.join(root,'sakhi-audio.js'),'utf8');
for(const token of ['./vendor/kokoro-runtime.js','KokoroTTS.from_pretrained','af_heart','NATURAL_SPEED=.86','naturalSpeak','describeQuestion','startKeepAlive','prepare:loadNaturalVoice','speakApplePart'])if(!audio.includes(token))throw new Error('Free cross-device voice path is incomplete: '+token);
if(!/APPLE_MOBILE[\s\S]*speechSynthesis/.test(audio)||!/naturalMode:APPLE_MOBILE\?'apple-system':'kokoro-local'/.test(audio))throw new Error('Apple speech must be limited to the iOS fallback path');
if(/SakhiCloud\.speak\(/.test(audio))throw new Error('Narration must not depend on the exhausted paid speech provider');
const entry=fs.readFileSync(path.join(root,'scripts/kokoro-browser-entry.js'),'utf8');
if(!/numThreads\s*=\s*1/.test(entry)||!/proxy\s*=\s*false/.test(entry))throw new Error('The iPad-safe single-thread runtime is not configured');
console.log('Voice gate passed: detailed Kokoro remains on desktop and the iOS-only no-cost Apple voice avoids the unsupported WASM model.');
