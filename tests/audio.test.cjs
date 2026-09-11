const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
(async function(){
  let spoken=[];
  function Utterance(text){this.text=String(text);this.volume=1;this.rate=1;this.pitch=1;this.lang='';this.voice=null;this.onstart=null;this.onend=null;this.onerror=null;}
  const synth={
    paused:false,speaking:false,pending:false,
    getVoices:()=>[{name:'Samantha',lang:'en-US'}],
    addEventListener:()=>{},removeEventListener:()=>{},resume(){this.paused=false;},cancel(){this.speaking=false;this.pending=false;},
    speak(u){spoken.push(u.text);this.speaking=true;setTimeout(()=>{if(u.onstart)u.onstart();this.speaking=false;if(u.onend)u.onend();},2);}
  };
  const ctx={window:{},console,setTimeout,clearTimeout,Promise,SpeechSynthesisUtterance:Utterance,speechSynthesis:synth};
  ctx.window=ctx;ctx.SAKHI_PHONEME_MANIFEST={required:['m'],verified:[]};ctx.SakhiCloud={state:()=>({configured:false})};
  vm.createContext(ctx);vm.runInContext(src('sakhi-audio.js'),ctx,{filename:'sakhi-audio.js'});
  if(!await ctx.SakhiAudio.unlock())throw new Error('Device-voice-only unlock failed');
  await ctx.SakhiAudio.speak('Welcome to Sakhi.');
  if(!spoken.includes('Welcome to Sakhi.'))throw new Error('Normal narration did not reach device voice fallback');
  if(ctx.SakhiAudio.status().provider!=='device')throw new Error('Device voice provider was not reported');
  const before=spoken.length;
  let phonemeBlocked=false;
  try{await ctx.SakhiAudio.playPhoneme('m');}catch(e){phonemeBlocked=e.kind==='MISSING_PHONEME';}
  if(!phonemeBlocked)throw new Error('Unverified isolated phoneme was not blocked');
  if(spoken.length!==before)throw new Error('Unverified isolated phoneme fell back to TTS');
  console.log('Audio core passed: device fallback speaks; unverified isolated phonemes never use TTS');
})().catch(e=>{console.error(e);process.exit(1);});
