const fs=require('fs');

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
  if(/phonics-audio-fix\.js|loadPhonicsAudioFix/.test(src)){
    violations.push(`${file}: references deleted phonics patch layer`);
  }
}

if(fs.existsSync('phonics-audio-fix.js')){
  violations.push('phonics-audio-fix.js: patch layer must not exist; fix callers at source');
}

const kid=fs.readFileSync('kid-upgrade.js','utf8');
for(const required of ['speech().speakPhoneme(k)','speech().speakPhoneme(value)','speech().speakInstruction(a.spoken_instruction)']){
  if(!kid.includes(required))violations.push(`kid-upgrade.js missing canonical call: ${required}`);
}

const engine=fs.readFileSync('interaction-engine.js','utf8');
if(!engine.includes('window.SpeechService.speakInstruction(text)')){
  violations.push('interaction-engine.js must delegate spoken instructions to SpeechService');
}

const service=fs.readFileSync('speech-service.js','utf8');
for(const api of ['speakInstruction','speakCharacter','speakPhoneme','speakWord','speakStory','speakFeedback','stopSpeech','repeatSpeech','unlockAudio','getStatus']){
  if(!service.includes(api))violations.push(`speech-service.js missing ${api}`);
}
if(/getStoredAccessToken|access_token|currentSession/.test(service)){
  violations.push('speech-service.js must not require parent authentication for child narration');
}
if(!service.includes("'apikey':cfg.supabaseAnonKey")){
  violations.push('speech-service.js must send the public Supabase client key to the TTS gateway');
}
if(!service.includes("lastProvider='elevenlabs'")){
  violations.push('speech-service.js must record successful ElevenLabs playback');
}
if(!service.includes('AudioContext')&&!service.includes('webkitAudioContext')){
  violations.push('speech-service.js must include mobile-safe WebAudio playback support');
}

if(violations.length){
  console.error('Audio architecture validation failed:\n- '+violations.join('\n- '));
  process.exit(1);
}
console.log('Audio architecture valid: one SpeechService, no patch layer, child narration can reach ElevenLabs without parent login.');
