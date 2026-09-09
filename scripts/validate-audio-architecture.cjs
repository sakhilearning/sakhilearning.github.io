const fs=require('fs');
const jsFiles=fs.readdirSync('.').filter(f=>f.endsWith('.js'));
const violations=[];
for(const file of jsFiles){
  const src=fs.readFileSync(file,'utf8');
  if(file!=='speech-service.js'&&/(SpeechSynthesisUtterance|speechSynthesis\.)/.test(src))violations.push(`${file}: direct browser speech bypasses SpeechService`);
  if(file!=='speech-service.js'&&/window\.SpeechService\s*=/.test(src))violations.push(`${file}: redefines SpeechService`);
  if(file!=='phoneme-audio.js'&&/window\.PhonemeAudioService\s*=/.test(src))violations.push(`${file}: redefines PhonemeAudioService`);
  if(/phonics-audio-fix\.js|loadPhonicsAudioFix|Mmmmoon/.test(src))violations.push(`${file}: legacy phonics audio behavior returned`);
}
if(fs.existsSync('phonics-audio-fix.js'))violations.push('obsolete phonics-audio-fix.js must not exist');
const speech=fs.readFileSync('speech-service.js','utf8');
for(const api of ['speakInstruction','speakCharacter','speakPhoneme','speakWord','speakStory','speakFeedback','stopSpeech','repeatSpeech','initializeFromGesture','prepare','getStatus'])if(!speech.includes(api))violations.push(`SpeechService missing ${api}`);
if(/AudioContext|webkitAudioContext/.test(speech))violations.push('ordinary narration must prefer HTML media, not Web Audio');
if(!/new Audio\(/.test(speech))violations.push('SpeechService must own HTMLAudio narration playback');
if(/SpeechSynthesisUtterance|speechSynthesis\./.test(speech))violations.push('SpeechService must not silently use robotic browser speech');
if(!speech.includes('PhonemeAudioService?.play'))violations.push('SpeechService.speakPhoneme must delegate to PhonemeAudioService');
if(/kind\s*===\s*['"]phoneme['"]|kind:\s*['"]phoneme['"]/.test(speech))violations.push('SpeechService must not send isolated phonemes to narration TTS');
if(/getStoredAccessToken|access_token|currentSession/.test(speech))violations.push('child narration must not require parent authentication');
if(!speech.includes("'apikey':cfg.supabaseAnonKey"))violations.push('SpeechService must use configured public TTS gateway key');
const phoneme=fs.readFileSync('phoneme-audio.js','utf8');
for(const api of ['play','preload','stop','status','qa'])if(!phoneme.includes(api))violations.push(`PhonemeAudioService missing ${api}`);
if(!phoneme.includes("policy:'validated-local-assets-only'"))violations.push('PhonemeAudioService must be validated-local-assets-only');
for(const id of ['t','p']){if(!new RegExp(`${id}:\\{[^}]*validation_status:'SOURCE_VERIFIED'`).test(phoneme))violations.push(`phoneme ${id} is not SOURCE_VERIFIED`);if(!phoneme.includes(`phoneme_${id}.ogg`))violations.push(`phoneme ${id} missing local audio asset`)}
const engine=fs.readFileSync('interaction-engine.js','utf8');if(!/SpeechService\?\.speakInstruction\?\.\(/.test(engine)&&!engine.includes('SpeechService.speakInstruction('))violations.push('interaction engine must delegate instructions to SpeechService');
const kid=fs.readFileSync('kid-upgrade.js','utf8');if(!/speakPhoneme\(letter\)/.test(kid))violations.push('Sound Garden must call SpeechService.speakPhoneme');
if(violations.length){console.error('Audio architecture validation failed:\n- '+violations.join('\n- '));process.exit(1)}
console.log('Audio architecture valid: one HTML-media SpeechService, one local PhonemeAudioService, and no neural/browser phoneme fallback.');
