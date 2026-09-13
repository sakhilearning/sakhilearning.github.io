const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
const audio=fs.readFileSync(path.join(root,'sakhi-audio.js'),'utf8');
for(const token of ['kokoro-js@1.2.1','KokoroTTS.from_pretrained','af_heart','naturalSpeak','browserSpeak'])if(!audio.includes(token))throw new Error('Free resilient voice path is incomplete: '+token);
if(/SakhiCloud\.speak\(/.test(audio))throw new Error('Narration must not depend on the exhausted paid speech provider');
console.log('Voice gate passed: free local Kokoro is primary and a no-silence device fallback is present.');
