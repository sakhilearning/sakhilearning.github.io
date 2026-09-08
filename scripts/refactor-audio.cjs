const fs=require('fs');

function replaceOnce(source,from,to,label){
  if(!source.includes(from))throw new Error(`Could not find ${label}`);
  return source.replace(from,to);
}

let kid=fs.readFileSync('kid-upgrade.js','utf8');
kid=replaceOnce(kid,
`const KID_AUDIO={
  m:{label:'m',sound:'mmmm',word:'moon'},s:{label:'s',sound:'ssss',word:'sun'},t:{label:'t',sound:'t',word:'top'},p:{label:'p',sound:'p',word:'pig'},a:{label:'a',sound:'aaa',word:'apple'},
  n:{label:'n',sound:'nnnn',word:'nest'},f:{label:'f',sound:'ffff',word:'fish'},l:{label:'l',sound:'llll',word:'leaf'},h:{label:'h',sound:'hhh',word:'hat'},r:{label:'r',sound:'rrrr',word:'rainbow'}
};`,
`const KID_AUDIO={
  m:{label:'m',word:'moon'},s:{label:'s',word:'sun'},t:{label:'t',word:'top'},p:{label:'p',word:'pig'},a:{label:'a',word:'apple'},
  n:{label:'n',word:'nest'},f:{label:'f',word:'fish'},l:{label:'l',word:'leaf'},h:{label:'h',word:'hat'},r:{label:'r',word:'rainbow'}
};`,
'KID_AUDIO metadata');

kid=replaceOnce(kid,
`function safeSpeak(text){
  if(!('speechSynthesis' in window)||!text)return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.rate=.78;u.pitch=1.08;u.lang='en-US';speechSynthesis.speak(u);
}
function playLetterSound(k){
  const x=KID_AUDIO[k];if(!x)return;
  const phrase=k==='t'||k==='p'?\`Listen to the sound. \${k}. \${k}. \${k}. \${x.word}.\`:\`Listen. \${x.sound}. \${x.word} starts with \${x.sound}.\`;
  safeSpeak(phrase);
  document.querySelectorAll('.sound-orb').forEach(b=>b.classList.toggle('playing',b.dataset.sound===k));
  setTimeout(()=>document.querySelectorAll('.sound-orb').forEach(b=>b.classList.remove('playing')),700);
}
window.playLetterSound=playLetterSound;`,
`function speech(){
  if(!window.SpeechService)throw new Error('SpeechService must load before kid-upgrade.js');
  return window.SpeechService;
}
async function playLetterSound(k){
  if(!KID_AUDIO[k])return false;
  document.querySelectorAll('.sound-orb').forEach(b=>b.classList.toggle('playing',b.dataset.sound===k));
  try{return await speech().speakPhoneme(k);}
  finally{document.querySelectorAll('.sound-orb').forEach(b=>b.classList.remove('playing'));}
}
window.playLetterSound=playLetterSound;`,
'legacy Sound Garden speech');

kid=kid.replace('st.order[slotIndex]=value;st.tileIds[slotIndex]=id;sync();safeSpeak(value);','st.order[slotIndex]=value;st.tileIds[slotIndex]=id;sync();speech().speakPhoneme(value);');
kid=kid.replace("m.querySelectorAll('.tile-sound').forEach(b=>b.addEventListener('click',()=>safeSpeak(`Sound: ${b.dataset.value}`)));","m.querySelectorAll('.tile-sound').forEach(b=>b.addEventListener('click',()=>speech().speakPhoneme(b.dataset.value)));" );
kid=kid.replace('safeSpeak(a.spoken_instruction);','speech().speakInstruction(a.spoken_instruction);');
if(/SpeechSynthesisUtterance|speechSynthesis\./.test(kid))throw new Error('kid-upgrade.js still owns browser speech');
if(/starts with \$\{x\.sound\}|Listen to the sound/.test(kid))throw new Error('legacy phonics narration still present');
if(/safeSpeak/.test(kid))throw new Error('safeSpeak still present in kid-upgrade.js');
fs.writeFileSync('kid-upgrade.js',kid);

let engine=fs.readFileSync('interaction-engine.js','utf8');
engine=replaceOnce(engine,
`function speakInstruction(text){
 if(!('speechSynthesis' in window))return;
 window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.rate=.86;u.pitch=1.08;u.lang='en-US';window.speechSynthesis.speak(u);
}`,
`function speakInstruction(text){
 if(!window.SpeechService)throw new Error('SpeechService must load before interaction-engine.js');
 return window.SpeechService.speakInstruction(text);
}`,
'interaction-engine speech owner');
if(/SpeechSynthesisUtterance|speechSynthesis\./.test(engine))throw new Error('interaction-engine.js still owns browser speech');
fs.writeFileSync('interaction-engine.js',engine);

let service=fs.readFileSync('speech-service.js','utf8');
const guardStart=service.indexOf('async function playPurePhoneme');
const guardEnd=service.indexOf('window.SpeechService={');
if(guardStart!==-1&&guardEnd!==-1&&guardEnd>guardStart){service=service.slice(0,guardStart)+service.slice(guardEnd);}
if(service.includes('Guard legacy Sound Garden handlers'))throw new Error('legacy capture guard still present');
fs.writeFileSync('speech-service.js',service);

if(fs.existsSync('phonics-audio-fix.js'))fs.unlinkSync('phonics-audio-fix.js');

let sw=fs.readFileSync('sw.js','utf8');
sw=sw.replace(/const CACHE='sakhi-magic-learning-v\d+';/,"const CACHE='sakhi-magic-learning-v13';")
     .replace(",'./phonics-audio-fix.js'",'');
fs.writeFileSync('sw.js',sw);

console.log('Audio refactor completed: SpeechService is authoritative.');
