const fs=require('fs');
const path=require('path');

const jsFiles=fs.readdirSync('.').filter(f=>f.endsWith('.js'));
const allowedDirectSpeech=new Set(['speech-service.js']);
const violations=[];

for(const file of jsFiles){
  const src=fs.readFileSync(file,'utf8');
  if(!allowedDirectSpeech.has(file)&&/(SpeechSynthesisUtterance|speechSynthesis\.)/.test(src)){
    violations.push(`${file}: browser speech must go through SpeechService`);
  }
  if(file!=='speech-service.js'&&/window\.SpeechService\s*=/.test(src)){
    violations.push(`${file}: must not redefine SpeechService`);
  }
  if(/Listen to the sound\. \$\{k\}|starts with \$\{x\.sound\}|Guard legacy Sound Garden handlers|stopImmediatePropagation\(\).*sound-orb/s.test(src)){
    violations.push(`${file}: contains legacy/override phonics audio behavior`);
  }
}

if(fs.existsSync('phonics-audio-fix.js')){
  violations.push('phonics-audio-fix.js: patch layer must not exist; fix callers at source');
}

const kid=fs.readFileSync('kid-upgrade.js','utf8');
for(const required of ['speech().speakPhoneme(k)','speech().speakPhoneme(value)','speech().speakInstruction(a.spoken_instruction)']){
  if(!kid.includes(required))violations.push(`kid-upgrade.js missing canonical call: ${required}`);
}

const service=fs.readFileSync('speech-service.js','utf8');
for(const api of ['speakInstruction','speakCharacter','speakPhoneme','speakWord','speakStory','speakFeedback','stopSpeech','repeatSpeech']){
  if(!service.includes(api))violations.push(`speech-service.js missing ${api}`);
}

if(violations.length){
  console.error('Audio architecture validation failed:\n- '+violations.join('\n- '));
  process.exit(1);
}
console.log('Audio architecture valid: SpeechService is the single speech owner.');
