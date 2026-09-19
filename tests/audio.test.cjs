const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
(async function(){
  let started=0,audibleStarted=0,cloudCalls=0;
  function FakeSource(){this.buffer=null;this.onended=null;} FakeSource.prototype.connect=function(){}; FakeSource.prototype.start=function(){started++;if(this.buffer&&this.buffer.duration)audibleStarted++;setTimeout(()=>this.onended&&this.onended(),1);}; FakeSource.prototype.stop=function(){this.onended&&this.onended();};
  function FakeGain(){this.gain={value:1};} FakeGain.prototype.connect=function(){};
  function AC(){this.state='running';this.destination={};} AC.prototype.resume=async function(){}; AC.prototype.createBuffer=()=>({}); AC.prototype.createBufferSource=()=>new FakeSource(); AC.prototype.createGain=()=>new FakeGain(); AC.prototype.decodeAudioData=async function(){return {duration:.2};};
  let healthCalls=0,speechCalls=0;
  async function fetch(url,opts={}){
    if(url.endsWith('/health')){healthCalls++;await new Promise(resolve=>setTimeout(resolve,50));return {ok:true,status:200,json:async()=>({status:'ready',ready:true})};}
    if(url.endsWith('/speak')){speechCalls++;const body=JSON.parse(opts.body);if(body.voice!=='af_heart'||body.speed!==.86)throw new Error('Wrong server voice request');if(body.text.includes('Slow request'))await new Promise(resolve=>setTimeout(resolve,20));return {ok:true,status:200,headers:{get:()=> 'audio/wav'},arrayBuffer:async()=>new ArrayBuffer(512),text:async()=>''};}
    throw new Error('Unexpected fetch '+url);
  }
  const ctx={window:{},document:{addEventListener(){}},location:{protocol:'https:'},console,setTimeout,clearTimeout,Promise,ArrayBuffer,URL:{revokeObjectURL(){},createObjectURL(){return'blob:test';}},Blob:function(){},AudioContext:AC,fetch,navigator:{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X)',platform:'MacIntel',maxTouchPoints:0}};
  ctx.window=ctx;ctx.SAKHI_PHONEME_MANIFEST={required:['m'],verified:[]};
  ctx.SakhiCloud={state:()=>({configured:true}),speak:async()=>{cloudCalls++;throw new Error('quota exhausted');}};
  vm.createContext(ctx);vm.runInContext(src('sakhi-audio.js'),ctx,{filename:'sakhi-audio.js'});
  if(!await ctx.SakhiAudio.unlock())throw new Error('Audio unlock failed');
  const prepareStarted=Date.now();await ctx.SakhiAudio.prepare();if(Date.now()-prepareStarted>20)throw new Error('Voice readiness still blocks on the slow health endpoint');
  await ctx.SakhiAudio.speak('Which answer is best? Choice one is left. Choice two is right.');
  const st=ctx.SakhiAudio.status();
  if(st.provider!=='kokoro-server'||st.naturalMode!=='kokoro-server'||st.naturalVoice!=='af_heart'||st.naturalSpeed!==.86||st.appleMobile||healthCalls<1||speechCalls!==1)throw new Error('cross-device server Kokoro diagnostics incorrect: '+JSON.stringify(st));
  if(started<1)throw new Error('Expected the WebAudio unlock buffer');
  if(cloudCalls!==0)throw new Error('The zero-credit cloud provider should not be required for narration');
  const audibleBefore=audibleStarted;
  const stale=ctx.SakhiAudio.speak('Slow request should be cancelled.');
  await new Promise(resolve=>setTimeout(resolve,2));
  const latest=ctx.SakhiAudio.speak('Latest request should play once.');
  await Promise.all([stale,latest]);
  if(audibleStarted-audibleBefore!==1)throw new Error('Overlapping narration produced echo: '+(audibleStarted-audibleBefore)+' audible sources started');
  const detailed=ctx.SakhiAudio.describeQuestion({template:'choice',prompt:'Which number comes next?',narration:'Look at the pattern.',choices:[2,3,4]});
  for(const phrase of ['Which number comes next?','Look at the pattern.','Choice 1 is 2.','Choice 2 is 3.','Choice 3 is 4.','tap the best answer'])if(!detailed.includes(phrase))throw new Error('Detailed child narration is missing: '+phrase+' in '+detailed);
  let phonemeBlocked=false;try{await ctx.SakhiAudio.playPhoneme('m');}catch(e){phonemeBlocked=e.kind==='MISSING_PHONEME';}
  if(!phonemeBlocked)throw new Error('Unverified isolated phoneme was not blocked');
  console.log('Audio core passed: server af_heart narration on every device avoids browser freezes and cloud credits; unverified phonemes are blocked.');
})().catch(e=>{console.error(e);process.exit(1);});
