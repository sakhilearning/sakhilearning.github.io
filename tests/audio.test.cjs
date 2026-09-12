const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
(async function(){
  let started=0;
  function FakeSource(){this.buffer=null;this.onended=null;} FakeSource.prototype.connect=function(){}; FakeSource.prototype.start=function(){started++;setTimeout(()=>this.onended&&this.onended(),1);}; FakeSource.prototype.stop=function(){};
  function FakeGain(){this.gain={value:1};} FakeGain.prototype.connect=function(){};
  function AC(){this.state='running';this.destination={};} AC.prototype.resume=async function(){}; AC.prototype.createBuffer=()=>({}); AC.prototype.createBufferSource=()=>new FakeSource(); AC.prototype.createGain=()=>new FakeGain(); AC.prototype.decodeAudioData=async function(){return {duration:.2};};
  const ctx={window:{},console,setTimeout,clearTimeout,Promise,ArrayBuffer,URL:{revokeObjectURL(){},createObjectURL(){return'blob:test';}},Blob:function(){},AudioContext:AC};
  ctx.window=ctx;ctx.SAKHI_PHONEME_MANIFEST={required:['m'],verified:[]};
  ctx.SakhiCloud={state:()=>({configured:true}),speak:async()=>({bytes:new ArrayBuffer(256),httpStatus:200,mime:'audio/mpeg'})};
  vm.createContext(ctx);vm.runInContext(src('sakhi-audio.js'),ctx,{filename:'sakhi-audio.js'});
  if(!await ctx.SakhiAudio.unlock())throw new Error('Audio unlock failed');
  await ctx.SakhiAudio.speak('Welcome to Sakhi.');
  const st=ctx.SakhiAudio.status();
  if(st.provider!=='elevenlabs'||st.engine!=='webaudio'||!st.playbackStarted||st.httpStatus!==200)throw new Error('Premium audio diagnostics incorrect: '+JSON.stringify(st));
  if(started<2)throw new Error('Expected unlock buffer plus narration playback');
  let phonemeBlocked=false;try{await ctx.SakhiAudio.playPhoneme('m');}catch(e){phonemeBlocked=e.kind==='MISSING_PHONEME';}
  if(!phonemeBlocked)throw new Error('Unverified isolated phoneme was not blocked');
  console.log('Audio core passed: ElevenLabs bytes play through WebAudio; unverified phonemes are blocked.');
})().catch(e=>{console.error(e);process.exit(1);});
