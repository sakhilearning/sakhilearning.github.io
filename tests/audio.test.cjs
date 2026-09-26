const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
(async function(){
  let started=0,audibleStarted=0,cloudCalls=0,serverCalls=0,localCalls=0;
  function FakeSource(){this.buffer=null;this.onended=null;} FakeSource.prototype.connect=function(){}; FakeSource.prototype.start=function(){started++;if(this.buffer&&this.buffer.duration)audibleStarted++;setTimeout(()=>this.onended&&this.onended(),1);}; FakeSource.prototype.stop=function(){this.onended&&this.onended();};
  function FakeGain(){this.gain={value:1};} FakeGain.prototype.connect=function(){};
  function AC(){this.state='running';this.destination={};} AC.prototype.resume=async function(){}; AC.prototype.createBuffer=()=>({}); AC.prototype.createBufferSource=()=>new FakeSource(); AC.prototype.createGain=()=>new FakeGain(); AC.prototype.decodeAudioData=async function(){return {duration:.2};};
  const lines=[
    'Which answer is best? Choice one is left. Choice two is right.',
    'Slow request should be cancelled.',
    'Latest request should play once.',
    'Why did the seed grow?',
    'Build the word pot.'
  ];
  const files=Object.fromEntries(lines.map((line,i)=>[line,'line-'+i+'.mp3']));
  async function fetch(url){
    url=String(url);
    if(url.endsWith('/manifest.json'))return {ok:true,status:200,json:async()=>({version:2,voice:'af_heart',files})};
    if(url.includes('/assets/audio/narration/')){
      localCalls++;
      if(url.endsWith('line-1.mp3'))await new Promise(resolve=>setTimeout(resolve,20));
      return {ok:true,status:200,headers:{get:()=> 'audio/mpeg'},arrayBuffer:async()=>new ArrayBuffer(512)};
    }
    if(url.endsWith('/speak')){serverCalls++;throw new Error('Bundled narration unexpectedly called the server');}
    throw new Error('Unexpected fetch '+url);
  }
  const ctx={window:{},document:{baseURI:'https://sakhilearning.github.io/',addEventListener(){}},location:{protocol:'https:',origin:'https://sakhilearning.github.io'},console,setTimeout,clearTimeout,Promise,ArrayBuffer,URL,Blob:function(){},AudioContext:AC,fetch,navigator:{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X)',platform:'MacIntel',maxTouchPoints:0}};
  ctx.window=ctx;ctx.SAKHI_PHONEME_MANIFEST={required:['m'],verified:[]};
  ctx.SakhiCloud={state:()=>({configured:true}),speak:async()=>{cloudCalls++;throw new Error('quota exhausted');}};
  vm.createContext(ctx);vm.runInContext(src('sakhi-audio.js'),ctx,{filename:'sakhi-audio.js'});
  if(!await ctx.SakhiAudio.unlock())throw new Error('Audio unlock failed');
  await ctx.SakhiAudio.prepare();
  await ctx.SakhiAudio.speak(lines[0]);
  const st=ctx.SakhiAudio.status();
  if(st.provider!=='kokoro-local'||st.naturalMode!=='kokoro-local-first'||st.naturalVoice!=='af_heart'||st.naturalSpeed!==.86||st.appleMobile||st.localClips<lines.length||serverCalls!==0)throw new Error('local Kokoro diagnostics incorrect: '+JSON.stringify(st));
  if(started<1||audibleStarted<1)throw new Error('Expected unlock and bundled narration playback');
  if(cloudCalls!==0)throw new Error('The cloud speech provider should not be required for narration');
  const audibleBefore=audibleStarted;
  const stale=ctx.SakhiAudio.speak(lines[1]);
  await new Promise(resolve=>setTimeout(resolve,2));
  const latest=ctx.SakhiAudio.speak(lines[2]);
  await Promise.all([stale,latest]);
  if(audibleStarted-audibleBefore!==1)throw new Error('Overlapping narration produced echo: '+(audibleStarted-audibleBefore)+' audible sources started');
  const concise=ctx.SakhiAudio.describeQuestion({template:'choice',prompt:'Which number comes next?',narration:'Look at the pattern.',choices:[2,3,4],narration_policy:'prompt_only'});
  if(concise!=='Look at the pattern.'||/Choice 1|Choice 2|Choice 3/.test(concise))throw new Error('Self-explanatory question reads visible options: '+concise);
  const firstPass=ctx.SakhiAudio.describeQuestion({template:'choice',prompt:'Why did the seed grow?',choices:['water and sun','candy'],narration_policy:'choices_on_repeat'});
  const repeatWithoutFlag=ctx.SakhiAudio.describeQuestion({template:'choice',prompt:'Why did the seed grow?',choices:['water and sun','candy'],narration_policy:'choices_on_repeat'},true);
  const accessibleRepeat=ctx.SakhiAudio.describeQuestion({template:'choice',prompt:'Which sound do you hear?',choices:['m','s'],narration_policy:'choices_on_repeat',requires_spoken_choices:true},true);
  if(firstPass!=='Why did the seed grow?'||repeatWithoutFlag!==firstPass||accessibleRepeat!=='Which sound do you hear? You can choose m or s.'||/Choice [123]/.test(accessibleRepeat))throw new Error('Balanced option narration failed');
  const build=ctx.SakhiAudio.describeQuestion({template:'build',prompt:'Build the word you hear.',narration:'Build the word pot.',tokens:['p','o','t','m','s']});
  if(build!=='Build the word pot.'||/Piece 1|Piece 2|Piece 3|is p\.|is o\.|is t\./.test(build))throw new Error('Word-building narration reads the tile bank and may confuse the learner: '+build);
  let phonemeBlocked=false;try{await ctx.SakhiAudio.playPhoneme('m');}catch(e){phonemeBlocked=e.kind==='MISSING_PHONEME';}
  if(!phonemeBlocked)throw new Error('Unverified isolated phoneme was not blocked');
  if(localCalls<3)throw new Error('Expected local narration files to be used');
  let ipadServerCalls=0,ipadSrc='';
  function FakeAudio(){this.preload='';this.src='';this.onplaying=null;this.onended=null;this.onerror=null;} FakeAudio.prototype.play=function(){ipadSrc=this.src;if(this.onplaying)this.onplaying();setTimeout(()=>this.onended&&this.onended(),1);return Promise.resolve();};FakeAudio.prototype.pause=function(){};
  const ipadFetch=async url=>{url=String(url);if(url.endsWith('/manifest.json'))return{ok:true,status:200,json:async()=>({version:2,voice:'af_heart',files})};if(url.includes('/assets/audio/narration/'))return{ok:true,status:200,headers:{get:()=> 'audio/mpeg'},arrayBuffer:async()=>new ArrayBuffer(512)};if(url.endsWith('/speak')){ipadServerCalls++;throw new Error('iPad called remote narration');}throw new Error('Unexpected iPad fetch '+url);};
  const ipad={window:{},document:{baseURI:'https://sakhilearning.github.io/',addEventListener(){}},location:{protocol:'https:',origin:'https://sakhilearning.github.io'},console,setTimeout,clearTimeout,Promise,ArrayBuffer,URL,Audio:FakeAudio,fetch:ipadFetch,navigator:{userAgent:'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)',platform:'iPad',maxTouchPoints:5}};ipad.window=ipad;ipad.SAKHI_PHONEME_MANIFEST={required:[],verified:[]};vm.createContext(ipad);vm.runInContext(src('sakhi-audio.js'),ipad,{filename:'sakhi-audio-ipad.js'});
  await ipad.SakhiAudio.speak(lines[0]);const ipadStatus=ipad.SakhiAudio.status();
  if(!ipadStatus.appleMobile||ipadStatus.provider!=='kokoro-local'||ipadStatus.engine!=='html-audio'||ipadServerCalls||!ipadSrc.endsWith('/assets/audio/narration/line-0.mp3'))throw new Error('iPad did not use direct local HTMLAudio playback: '+JSON.stringify(ipadStatus));
  console.log('Audio core passed: bundled af_heart narration starts locally, cancels overlap, and avoids numbered option reading.');
})().catch(e=>{console.error(e);process.exit(1);});
