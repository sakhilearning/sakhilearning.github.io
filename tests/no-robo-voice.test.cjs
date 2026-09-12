const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const files=fs.readdirSync(root).filter(f=>/\.js$/.test(f));
const bad=[];
for(const f of files){const s=fs.readFileSync(path.join(root,f),'utf8');if(/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech/i.test(s))bad.push(f);}
if(bad.length)throw new Error('Browser/system TTS is forbidden in production: '+bad.join(', '));
const audio=fs.readFileSync(path.join(root,'sakhi-audio.js'),'utf8');
if(!/SakhiCloud\.speak/.test(audio)||!/playWithHtmlAudio/.test(audio)||!/premiumCache/.test(audio))throw new Error('ElevenLabs-only playback path is incomplete');
console.log('No-robo-voice gate passed: production contains no browser/system TTS.');
