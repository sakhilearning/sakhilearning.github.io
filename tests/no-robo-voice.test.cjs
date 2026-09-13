const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const audio=fs.readFileSync(path.join(root,'sakhi-audio.js'),'utf8');
for(const token of ['./vendor/kokoro-runtime.js','KokoroTTS.from_pretrained','af_heart','NATURAL_SPEED=.86','naturalSpeak','describeQuestion','startKeepAlive','prepare:loadNaturalVoice'])if(!audio.includes(token))throw new Error('Kokoro-only voice path is incomplete: '+token);
if(/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech|browserSpeak/.test(audio))throw new Error('Robotic browser speech must not exist in the release');
if(/SakhiCloud\.speak\(/.test(audio))throw new Error('Narration must not depend on the exhausted paid speech provider');
const entry=fs.readFileSync(path.join(root,'scripts/kokoro-browser-entry.js'),'utf8');
if(!/numThreads\s*=\s*1/.test(entry)||!/proxy\s*=\s*false/.test(entry))throw new Error('The iPad-safe single-thread runtime is not configured');
console.log('Voice gate passed: slower detailed Kokoro is the only voice, with an iPad-safe single-thread runtime.');
