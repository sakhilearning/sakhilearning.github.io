const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
(async function(){
  let started=0,spoken=0,cloudCalls=0;
  function FakeSource(){this.buffer=null;this.onended=null;} FakeSource.prototype.connect=function(){}; FakeSource.prototype.start=function(){started++;setTimeout(()=>this.onended&&this.onended(),1);}; FakeSource.prototype.stop=function(){};
  function FakeGain(){this.gain={value:1};} FakeGain.prototype.connect=function(){};
  function AC(){this.state='running';this.destination={};} AC.prototype.resume=async function(){}; AC.prototype.createBuffer=()=>({}); AC.prototype.createBufferSource=()=>new FakeSource(); AC.prototype.createGain=()=>new FakeGain(); AC.prototype.decodeAudioData=async function(){return {duration:.2};};
  function Utterance(text){this.text=text;this.volume=1;this.rate=1;this.pitch=1;}
  const speech={paused:false,speaking:false,pending:false,getVoices:()=>[{name:'Ava Premium',lang:'en-US'}],resume(){},cancel(){},speak(u){spoken++;speech.speaking=true;setTimeout(()=>{if(u.onstart)u.onstart();speech.speaking=false;if(u.onend)u.onend();},1);},addEventListener(){},removeEventListener(){}};
  const ctx={window:{},console,setTimeout,clearTimeout,Promise,ArrayBuffer,URL:{revokeObjectURL(){},createObjectURL(){return'blob:test';}},Blob:function(){},AudioContext:AC,SpeechSynthesisUtterance:Utterance,speechSynthesis:speech};
  ctx.window=ctx;ctx.SAKHI_PHONEME_MANIFEST={required:['m'],verified:[]};
  ctx.SakhiCloud={state:()=>({configured:true}),speak:async()=>{cloudCalls++;throw new Error('quota exhausted');}};
  vm.createContext(ctx);vm.runInContext(src('sakhi-audio.js'),ctx,{filename:'sakhi-audio.js'});
  if(!await ctx.SakhiAudio.unlock())throw new Error('Audio unlock failed');
  await ctx.SakhiAudio.speak('Welcome to Sakhi.');
  const st=ctx.SakhiAudio.status();
  if(st.provider!=='device'||st.engine!=='speech-synthesis'||!st.playbackStarted)throw new Error('Resilient audio diagnostics incorrect: '+JSON.stringify(st));
  if(started<1||spoken<1)throw new Error('Expected unlock buffer and immediate on-device narration');
  if(cloudCalls!==0)throw new Error('The zero-credit cloud provider should not be required for narration');
  let phonemeBlocked=false;try{await ctx.SakhiAudio.playPhoneme('m');}catch(e){phonemeBlocked=e.kind==='MISSING_PHONEME';}
  if(!phonemeBlocked)throw new Error('Unverified isolated phoneme was not blocked');
  console.log('Audio core passed: narration survives cloud quota exhaustion; unverified phonemes are blocked.');
})().catch(e=>{console.error(e);process.exit(1);});
