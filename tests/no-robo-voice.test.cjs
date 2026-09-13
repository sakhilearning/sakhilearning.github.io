const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const audio=fs.readFileSync(path.join(root,'sakhi-audio.js'),'utf8');
for(const token of ['kokoro-js@1.2.1','KokoroTTS.from_pretrained','af_heart','naturalSpeak','prepare:loadNaturalVoice'])if(!audio.includes(token))throw new Error('Kokoro-only voice path is incomplete: '+token);
if(/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech|browserSpeak/.test(audio))throw new Error('Robotic browser speech must not exist in the release');
if(/SakhiCloud\.speak\(/.test(audio))throw new Error('Narration must not depend on the exhausted paid speech provider');
console.log('Voice gate passed: free local Kokoro is the only narration voice; robotic device speech is absent.');
