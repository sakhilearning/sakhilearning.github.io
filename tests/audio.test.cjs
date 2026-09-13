const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
(async function(){
  let started=0,cloudCalls=0;
  function FakeSource(){this.buffer=null;this.onended=null;} FakeSource.prototype.connect=function(){}; FakeSource.prototype.start=function(){started++;setTimeout(()=>this.onended&&this.onended(),1);}; FakeSource.prototype.stop=function(){};
  function FakeGain(){this.gain={value:1};} FakeGain.prototype.connect=function(){};
  function AC(){this.state='running';this.destination={};} AC.prototype.resume=async function(){}; AC.prototype.createBuffer=()=>({}); AC.prototype.createBufferSource=()=>new FakeSource(); AC.prototype.createGain=()=>new FakeGain(); AC.prototype.decodeAudioData=async function(){return {duration:.2};};
  let nativeSpoken=0;
  function Utterance(text){this.text=text;this.voice=null;this.lang='';this.rate=1;this.pitch=1;this.volume=1;this.onend=null;this.onerror=null;}
  const speechSynthesis={getVoices:()=>[{name:'Ava',lang:'en-US'}],addEventListener(){},cancel(){},speak(u){nativeSpoken++;setTimeout(()=>u.onend&&u.onend(),1);}};
  const ctx={window:{},document:{addEventListener(){}},location:{protocol:'https:'},console,setTimeout,clearTimeout,Promise,ArrayBuffer,URL:{revokeObjectURL(){},createObjectURL(){return'blob:test';}},Blob:function(){},AudioContext:AC,SpeechSynthesisUtterance:Utterance,speechSynthesis,navigator:{userAgent:'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)',platform:'iPad',maxTouchPoints:5}};
  ctx.window=ctx;ctx.SAKHI_PHONEME_MANIFEST={required:['m'],verified:[]};
  ctx.SakhiCloud={state:()=>({configured:true}),speak:async()=>{cloudCalls++;throw new Error('quota exhausted');}};
  vm.createContext(ctx);vm.runInContext(src('sakhi-audio.js'),ctx,{filename:'sakhi-audio.js'});
  if(!await ctx.SakhiAudio.unlock())throw new Error('Audio unlock failed');
  await ctx.SakhiAudio.prepare();
  await ctx.SakhiAudio.speak('Which answer is best? Choice one is left. Choice two is right.');
  const st=ctx.SakhiAudio.status();
  if(st.provider!=='apple-voice'||st.naturalMode!=='apple-system'||st.naturalVoice!=='Ava'||st.naturalSpeed!==.78||!st.appleMobile||nativeSpoken<1)throw new Error('iPad voice diagnostics incorrect: '+JSON.stringify(st));
  if(started<2)throw new Error('Expected the iPad WebAudio unlock and keep-alive buffers');
  if(cloudCalls!==0)throw new Error('The zero-credit cloud provider should not be required for narration');
  const detailed=ctx.SakhiAudio.describeQuestion({template:'choice',prompt:'Which number comes next?',narration:'Look at the pattern.',choices:[2,3,4]});
  for(const phrase of ['Which number comes next?','Look at the pattern.','Choice 1 is 2.','Choice 2 is 3.','Choice 3 is 4.','tap the best answer'])if(!detailed.includes(phrase))throw new Error('Detailed child narration is missing: '+phrase+' in '+detailed);
  let phonemeBlocked=false;try{await ctx.SakhiAudio.playPhoneme('m');}catch(e){phonemeBlocked=e.kind==='MISSING_PHONEME';}
  if(!phonemeBlocked)throw new Error('Unverified isolated phoneme was not blocked');
  console.log('Audio core passed: detailed Kokoro desktop narration and the no-cost iPad voice path avoid cloud credits; unverified phonemes are blocked.');
})().catch(e=>{console.error(e);process.exit(1);});
