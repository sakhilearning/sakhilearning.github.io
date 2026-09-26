window.SakhiAudio=(function(){
'use strict';
var enabled=true,unlocked=false,ctx=null,currentSource=null,currentAudio=null,currentObjectUrl=null,keepAliveSource=null,keepAliveGain=null,lastText='',lastQuestion=null,listeners=[],manifest=null,narrationManifest=null,narrationManifestPromise=null,playbackEpoch=0;
var lastProvider='none',lastError=null;
var naturalTts=null,naturalPromise=null,naturalState='idle',naturalError=null,naturalProgress=0,naturalCache={},naturalInflight={},VOICE_CACHE='sakhi-voice-v5';
var lastDiag={provider:'none',engine:'none',httpStatus:null,mime:'',bytes:0,decode:false,playbackStarted:false,cached:false,lastError:null};
var AC=window.AudioContext||window.webkitAudioContext;
var NATURAL_VOICE='af_heart';
var NATURAL_SPEED=.86;
var SAKHI_TTS_URL='https://interview.amarikit.com/api/sakhi-tts';
var APPLE_MOBILE=typeof navigator!=='undefined'&&(/iPad|iPhone|iPod/.test(navigator.userAgent||'')||((navigator.platform||'')==='MacIntel'&&(navigator.maxTouchPoints||0)>1));
function resetDiag(){lastDiag={provider:lastProvider,engine:'none',httpStatus:null,mime:'',bytes:0,decode:false,playbackStarted:false,cached:false,lastError:null};}
function fault(kind,msg,cause){var e=new Error(msg);e.kind=kind;e.cause=cause;lastError={kind:kind,message:msg};lastDiag.lastError=lastError;listeners.forEach(function(fn){try{fn(e);}catch(x){}});return e;}
function onFault(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
function ensureContext(){if(!ctx&&AC){try{ctx=new AC({latencyHint:'playback'});}catch(e){ctx=new AC();}}return ctx;}
function startKeepAlive(){
  if(!APPLE_MOBILE||!ctx||keepAliveSource)return;
  try{
    var rate=ctx.sampleRate||24000,b=ctx.createBuffer(1,rate,rate),s=ctx.createBufferSource(),g=ctx.createGain();
    g.gain.value=0;s.buffer=b;s.loop=true;s.connect(g);g.connect(ctx.destination);s.start(0);keepAliveSource=s;keepAliveGain=g;
  }catch(e){console.warn('[Sakhi] iPad audio keep-alive unavailable:',e&&e.message||e);}
}
async function unlock(){
  if(!enabled)return false;
  try{
    if(AC){
      ensureContext();
      if(ctx.state==='suspended')await ctx.resume();
      var b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource(),g=ctx.createGain();
      g.gain.value=0;s.buffer=b;s.connect(g);g.connect(ctx.destination);s.start(0);
      startKeepAlive();
      unlocked=true;warmNaturalVoice().catch(function(e){console.warn('[Sakhi] Kokoro preload:',e&&e.message||e);});return true;
    }
    if(typeof Audio!=='undefined'){unlocked=true;warmNaturalVoice().catch(function(e){console.warn('[Sakhi] Kokoro preload:',e&&e.message||e);});return true;}
    throw new Error('No supported audio playback API');
  }catch(e){fault('BLOCKED','Tap Hear again once to enable Sakhi voice.',e);return false;}
}
function stopAll(){
  playbackEpoch++;
  try{if(currentSource&&currentSource.stop)currentSource.stop(0);}catch(e){}currentSource=null;
  try{if(currentAudio){currentAudio.pause();currentAudio.src='';}}catch(e){}currentAudio=null;
  if(currentObjectUrl){try{URL.revokeObjectURL(currentObjectUrl);}catch(e){}currentObjectUrl=null;}
}
function stopKeepAlive(){try{if(keepAliveSource)keepAliveSource.stop(0);}catch(e){}keepAliveSource=null;keepAliveGain=null;}
function finishPlayback(provider,engine){lastProvider=provider;lastError=null;lastDiag.provider=provider;lastDiag.engine=engine;lastDiag.playbackStarted=true;lastDiag.lastError=null;}
function isCurrent(requestId){return requestId===undefined||requestId===playbackEpoch;}
function playWithHtmlAudio(bytes,mime,provider,requestId){
  if(!isCurrent(requestId))return Promise.resolve(false);
  if(typeof Audio==='undefined'||typeof Blob==='undefined'||!window.URL||!URL.createObjectURL)throw fault('UNSUPPORTED','This browser cannot play Sakhi narration.');
  return new Promise(function(resolve,reject){
    try{
      if(!isCurrent(requestId)){resolve(false);return;}var blob=new Blob([bytes],{type:mime||'audio/mpeg'}),url=URL.createObjectURL(blob),a=new Audio();
      currentAudio=a;currentObjectUrl=url;a.preload='auto';a.src=url;
      a.onplaying=function(){finishPlayback(provider,'html-audio');};
      a.onended=function(){if(currentAudio===a)currentAudio=null;if(currentObjectUrl===url){try{URL.revokeObjectURL(url);}catch(e){}currentObjectUrl=null;}resolve(true);};
      a.onerror=function(e){reject(fault('PLAYBACK','Sakhi narration could not play on this device.',e));};
      var p=a.play();if(p&&typeof p.catch==='function')p.catch(function(e){reject(fault('PLAYBACK','Tap Hear again once to start Sakhi voice.',e));});
    }catch(e){reject(fault('PLAYBACK','Sakhi narration could not start.',e));}
  });
}
function playWithHtmlAudioUrl(url,provider,requestId){
  if(!isCurrent(requestId))return Promise.resolve(false);
  if(typeof Audio==='undefined')throw fault('UNSUPPORTED','This browser cannot play Sakhi narration.');
  return new Promise(function(resolve,reject){
    try{
      if(!isCurrent(requestId)){resolve(false);return;}var a=new Audio();currentAudio=a;a.preload='auto';a.src=url;
      a.onplaying=function(){finishPlayback(provider,'html-audio');};
      a.onended=function(){if(currentAudio===a)currentAudio=null;resolve(true);};
      a.onerror=function(e){reject(fault('PLAYBACK','Sakhi narration could not play on this device.',e));};
      var p=a.play();if(p&&typeof p.catch==='function')p.catch(function(e){reject(fault('PLAYBACK','Tap Hear again once to start Sakhi voice.',e));});
    }catch(e){reject(fault('PLAYBACK','Sakhi narration could not start.',e));}
  });
}
async function playBytes(bytes,meta,provider,requestId){
  meta=meta||{};provider=provider||'recording';
  if(!isCurrent(requestId))return false;
  lastDiag.provider=provider;lastDiag.httpStatus=meta.httpStatus||null;lastDiag.mime=meta.mime||'';lastDiag.bytes=bytes&&bytes.byteLength||0;lastDiag.cached=!!meta.cached;lastDiag.decode=false;lastDiag.playbackStarted=false;lastDiag.lastError=null;
  if(!bytes||bytes.byteLength<100)throw fault('EMPTY_AUDIO','Sakhi voice returned no playable audio.');
  if(APPLE_MOBILE)return playWithHtmlAudio(bytes,meta.mime||'audio/mpeg',provider,requestId);
  ensureContext();
  if(ctx){
    try{
      if(ctx.state==='suspended')await ctx.resume();
      var buf=await ctx.decodeAudioData(bytes.slice(0));if(!isCurrent(requestId))return false;lastDiag.decode=true;
      return await new Promise(function(resolve,reject){
        var src=ctx.createBufferSource();currentSource=src;src.buffer=buf;src.connect(ctx.destination);
        src.onended=function(){if(currentSource===src)currentSource=null;resolve(true);};
        try{if(!isCurrent(requestId)){resolve(false);return;}src.start(0);finishPlayback(provider,'webaudio');}catch(e){reject(fault('PLAYBACK','Sakhi narration could not start.',e));}
      });
    }catch(e){
      console.warn('[Sakhi audio] WebAudio playback failed; trying HTML Audio.',e&&e.message||e);
    }
  }
  return playWithHtmlAudio(bytes,meta.mime||'audio/mpeg',provider,requestId);
}
function canUseNatural(){return typeof document!=='undefined'&&typeof location!=='undefined'&&location.protocol!=='file:'&&typeof Promise!=='undefined';}
function delay(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
async function loadNarrationManifest(){
  if(narrationManifest)return narrationManifest;if(narrationManifestPromise)return narrationManifestPromise;
  if(window.SAKHI_NARRATION_MANIFEST){var embedded=window.SAKHI_NARRATION_MANIFEST.files||window.SAKHI_NARRATION_MANIFEST;Object.keys(embedded).forEach(function(text){var normalized=spokenValue(text);if(normalized&&!embedded[normalized])embedded[normalized]=embedded[text];});narrationManifest=embedded;return narrationManifest;}
  narrationManifestPromise=fetch(new URL('assets/audio/narration/manifest.json',document.baseURI).href,{cache:'force-cache'}).then(function(r){if(!r.ok)throw new Error('Bundled narration manifest '+r.status);return r.json();}).then(function(m){var files=m&&m.files||{};Object.keys(files).forEach(function(text){var normalized=spokenValue(text);if(normalized&&!files[normalized])files[normalized]=files[text];});narrationManifest=files;return narrationManifest;}).catch(function(e){narrationManifestPromise=null;throw e;});
  return narrationManifestPromise;
}
async function prepareServerVoice(){
  naturalState='loading';naturalProgress=35;
  var local=await loadNarrationManifest(),count=Object.keys(local||{}).length;if(!count)throw new Error('Bundled Sakhi narration is missing.');
  naturalState='ready';naturalError=null;naturalProgress=100;naturalTts={kind:'kokoro-local-first',voice:NATURAL_VOICE,localClips:count};
  return naturalTts;
}
function loadNaturalVoice(){
  if(naturalTts)return Promise.resolve(naturalTts);
  if(naturalPromise)return naturalPromise;
  if(!canUseNatural())return Promise.reject(new Error('Sakhi server voice is unavailable in this environment.'));
  naturalPromise=prepareServerVoice().catch(function(e){naturalState='failed';naturalError=e;naturalPromise=null;throw e;});
  return naturalPromise;
}
function warmNaturalVoice(){
  if(!canUseNatural())return Promise.reject(new Error('Sakhi server voice is unavailable in this environment.'));
  if(naturalState==='ready')return Promise.resolve(naturalTts);
  if(naturalState==='loading')return naturalPromise;
  return loadNaturalVoice();
}
function textHash(text){var h=2166136261,s=NATURAL_VOICE+'|'+NATURAL_SPEED+'|'+text;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
async function persistentGet(text){if(!('caches'in window))return null;try{var c=await caches.open(VOICE_CACHE),r=await c.match(new Request(location.origin+'/__sakhi_voice_cache__/'+textHash(text)));if(!r)return null;return{bytes:await r.arrayBuffer(),mime:r.headers.get('content-type')||'audio/wav',httpStatus:200,persistent:true};}catch(e){return null;}}
async function persistentPut(text,item){if(!('caches'in window)||!item||!item.bytes)return;try{var c=await caches.open(VOICE_CACHE),req=new Request(location.origin+'/__sakhi_voice_cache__/'+textHash(text));await c.put(req,new Response(item.bytes.slice(0),{headers:{'Content-Type':item.mime||'audio/wav','X-Sakhi-Voice':NATURAL_VOICE}}));}catch(e){}}
async function fetchLocalPart(text){
  var files=await loadNarrationManifest(),name=files&&files[text];if(!name)return null;
  var url=new URL('assets/audio/narration/'+name,document.baseURI).href,r=await fetch(url,{cache:'force-cache'});if(!r.ok)throw new Error('Bundled narration '+r.status);
  var mime=(r.headers&&r.headers.get?r.headers.get('content-type'):'')||'audio/mpeg',bytes=await r.arrayBuffer();if(bytes.byteLength<100)throw new Error('Bundled narration is empty.');
  return{bytes:bytes,mime:mime,httpStatus:r.status,persistent:true,provider:'kokoro-local',url:url};
}
async function fetchServerPart(text){
  if(naturalCache[text])return naturalCache[text];
  if(naturalInflight[text])return naturalInflight[text];
  naturalInflight[text]=(async function(){
    var local=await fetchLocalPart(text);if(local){naturalCache[text]=local;return local;}
    var saved=await persistentGet(text);if(saved){saved.provider='kokoro-cache';naturalCache[text]=saved;return saved;}
    if(APPLE_MOBILE)throw new Error('This line is not in the instant iPad narration pack.');
    var ctrl=typeof AbortController!=='undefined'?new AbortController():null,timer=ctrl?setTimeout(function(){ctrl.abort();},3200):null;
    try{var r=await fetch(SAKHI_TTS_URL+'/speak',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text,voice:NATURAL_VOICE,speed:NATURAL_SPEED}),signal:ctrl&&ctrl.signal});var mime=(r.headers&&r.headers.get?r.headers.get('content-type'):'')||'audio/wav';if(!r.ok){var detail='';try{detail=await r.text();}catch(e){}throw new Error('Kokoro voice HTTP '+r.status+(detail?' · '+detail.slice(0,160):''));}if(mime.toLowerCase().indexOf('audio/')!==0)throw new Error('Kokoro voice returned '+mime);var item={bytes:await r.arrayBuffer(),mime:mime,httpStatus:r.status,provider:'kokoro-server'};naturalCache[text]=item;persistentPut(text,item);return item;}finally{if(timer)clearTimeout(timer);}
  })();
  try{return await naturalInflight[text];}finally{delete naturalInflight[text];}
}
async function speakServerPart(text,requestId){
  var wasCached=!!naturalCache[text],item=await fetchServerPart(text);if(!isCurrent(requestId))return false;
  var provider=item.provider||'kokoro-server';lastDiag.provider=provider;lastDiag.httpStatus=item.httpStatus||200;lastDiag.mime=item.mime||'audio/mpeg';lastDiag.bytes=item.bytes&&item.bytes.byteLength||0;lastDiag.cached=wasCached||item.persistent;
  /* iPad must play the bytes already warmed by prefetch. Reopening the URL here
     caused a second media request and the page-to-page pause families reported. */
  return playBytes(item.bytes,{httpStatus:item.httpStatus||200,mime:item.mime,cached:wasCached||item.persistent},provider,requestId);
}
function childChunks(text){
  var sentences=String(text||'').match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[],chunks=[],part='';
  sentences.forEach(function(sentence){sentence=sentence.trim();if(!sentence)return;if(part&&(part.length+sentence.length+1)>210){chunks.push(part);part=sentence;}else part+=(part?' ':'')+sentence;});
  if(part)chunks.push(part);return chunks.length?chunks:[String(text||'')];
}
async function naturalSpeak(text,requestId){
  await loadNaturalVoice();
  var chunks=childChunks(text);
  for(var i=0;i<chunks.length;i++){if(!isCurrent(requestId))return false;await speakServerPart(chunks[i],requestId);if(i<chunks.length-1)await delay(180);}
  return isCurrent(requestId);
}
async function speakText(text){
  text=String(text||'').trim();if(!text)return true;
  stopAll();var requestId=playbackEpoch;resetDiag();
  if(!await unlock())throw fault('BLOCKED','Tap Hear again once to enable Sakhi voice.');
  try{await loadNaturalVoice();if(!isCurrent(requestId))return false;return await naturalSpeak(text,requestId);}
  catch(e){throw fault('VOICE_UNAVAILABLE','This prompt is shown on screen because its narration is not available yet.',e);}
}
async function speak(text){if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');lastText=String(text||'');return speakText(lastText);}
function spokenValue(value){
  var map={'🌸':'flower','🦋':'butterfly','⭐':'star','🌈':'rainbow','🌙':'moon','🔴':'red circle','🔵':'blue circle','🟡':'yellow circle','🦄':'unicorn','🐚':'shell','🐠':'fish','⬜':'empty square','➡️':'right arrow','⬅️':'left arrow','⬆️':'up arrow'};
  var text=String(value);Object.keys(map).forEach(function(symbol){text=text.split(symbol).join(map[symbol]);});
  return text.replace(/\/([a-z]+)\//gi,'$1 sound').replace(/\s*=\s*\?/g,' equals what number?').replace(/−/g,' minus ').replace(/\+/g,' plus ').replace(/\s+/g,' ').trim();
}
function listValues(values){var clean=values.map(spokenValue);if(clean.length<2)return clean[0]||'';if(clean.length===2)return clean[0]+' or '+clean[1];return clean.slice(0,-1).join(', ')+', or '+clean[clean.length-1];}
function shouldReadChoices(question,repeatMode){
  var policy=question&&question.narration_policy||'prompt_only';
  return policy==='choices_always'||(policy==='choices_on_repeat'&&!!repeatMode);
}
function describeQuestion(question,repeatMode){
  var prompt=spokenValue(question.prompt||''),guide=spokenValue(question.spoken_instruction||question.narration||''),parts=[guide||prompt];
  if(question.template==='choice'&&question.requires_spoken_choices===true&&Array.isArray(question.choices)&&shouldReadChoices(question,repeatMode))parts.push('You can choose '+listValues(question.choices)+'.');
  return parts.join(' ').replace(/\s+/g,' ').trim();
}
async function prefetch(question){
  if(!enabled||!question)return false;
  try{
    await loadNaturalVoice();var texts=[],segs=Array.isArray(question.audioSegments)?question.audioSegments:null;
    if(segs&&segs.length)segs.forEach(function(seg){if(seg&&seg.text)texts.push(seg.text);});else{texts.push(describeQuestion(question,false));if(question.narration_policy==='choices_on_repeat')texts.push(describeQuestion(question,true));}
    var chunks=[];texts.forEach(function(text){childChunks(text).forEach(function(part){if(part&&chunks.indexOf(part)<0)chunks.push(part);});});
    await Promise.all(chunks.map(fetchServerPart));return true;
  }catch(e){console.warn('[Sakhi] Narration prefetch:',e&&e.message||e);return false;}
}
async function prefetchActivity(activity){if(!activity||!Array.isArray(activity.questions))return false;await Promise.all(activity.questions.map(prefetch));return true;}
async function playTransitionCue(){
  if(!enabled)return false;if(!await unlock())return false;stopAll();var requestId=playbackEpoch;
  try{var url=new URL('assets/audio/sakhi-ready-next.wav',document.baseURI).href,r=await fetch(url,{cache:'force-cache'});if(!r.ok)throw new Error('Transition cue '+r.status);return playBytes(await r.arrayBuffer(),{httpStatus:r.status,mime:r.headers&&r.headers.get?r.headers.get('content-type')||'audio/wav':'audio/wav',cached:true},'kokoro-local',requestId);}catch(e){console.warn('[Sakhi] Immediate cue unavailable:',e&&e.message||e);return false;}
}
async function narrate(question,options){
  if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');if(!question)return false;
  options=options||{};lastQuestion=question;lastText=describeQuestion(question,!!options.repeat);var segs=Array.isArray(question.audioSegments)?question.audioSegments:null;
  if(!segs||!segs.length)return speakText(lastText);
  for(var i=0;i<segs.length;i++){
    var seg=segs[i]||{};
    if(seg.type==='phoneme'){
      try{await playPhoneme(seg.symbol);}catch(e){if(e.kind==='MISSING_PHONEME'){console.warn('[Sakhi phoneme]',e.message);continue;}throw e;}
    }else if(seg.text){await speakText(seg.text);}
  }
  return true;
}
function repeat(){return lastQuestion?narrate(lastQuestion,{repeat:true}):(lastText?speak(lastText):Promise.resolve(false));}
async function loadManifest(){
  if(manifest)return manifest;if(window.SAKHI_PHONEME_MANIFEST){manifest=window.SAKHI_PHONEME_MANIFEST;return manifest;}
  try{var r=await fetch(new URL('assets/audio/phonemes/manifest.json',document.baseURI).href,{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));manifest=await r.json();}catch(e){manifest={required:[],verified:[]};}
  manifest.required=Array.isArray(manifest.required)?manifest.required:[];manifest.verified=Array.isArray(manifest.verified)?manifest.verified:[];return manifest;
}
async function playPhoneme(symbol){
  if(!enabled)throw fault('DISABLED','Audio is off.');var m=await loadManifest();
  if(m.verified.indexOf(symbol)<0)throw fault('MISSING_PHONEME','The verified /'+symbol+'/ recording is not installed yet.');
  if(!await unlock())throw fault('BLOCKED','Tap once to enable audio.');stopAll();
  var url=new URL('assets/audio/phonemes/phoneme_'+symbol+'.ogg',document.baseURI).href,r=await fetch(url,{cache:'force-cache'});
  if(!r.ok)throw fault('MISSING_PHONEME','The verified /'+symbol+'/ recording is missing.');
  return playBytes(await r.arrayBuffer(),{httpStatus:r.status,mime:r.headers&&r.headers.get?r.headers.get('content-type')||'audio/ogg':'audio/ogg'},'phoneme');
}
async function report(){var m=await loadManifest();return{required:m.required.length,present:m.verified.length,missing:m.required.filter(function(x){return m.verified.indexOf(x)<0;}),complete:m.required.every(function(x){return m.verified.indexOf(x)>=0;})};}
function setEnabled(v){enabled=!!v;if(!enabled){stopAll();stopKeepAlive();}}
function status(){return{enabled:enabled,unlocked:unlocked,provider:lastProvider,lastError:lastError,engine:lastDiag.engine,httpStatus:lastDiag.httpStatus,mime:lastDiag.mime,bytes:lastDiag.bytes,decode:lastDiag.decode,playbackStarted:lastDiag.playbackStarted,cached:lastDiag.cached,naturalState:naturalState,naturalMode:'kokoro-local-first',naturalVoice:NATURAL_VOICE,naturalSpeed:NATURAL_SPEED,naturalProgress:naturalProgress,naturalError:naturalError&&naturalError.message||null,localClips:narrationManifest?Object.keys(narrationManifest).length:0,appleMobile:APPLE_MOBILE};}
if(typeof document!=='undefined')document.addEventListener('touchend',function(){if(enabled&&ctx&&ctx.state==='suspended')ctx.resume().then(startKeepAlive).catch(function(){});},{passive:true});
return{unlock:unlock,prepare:loadNaturalVoice,warm:warmNaturalVoice,prefetch:prefetch,prefetchActivity:prefetchActivity,playTransitionCue:playTransitionCue,speak:speak,narrate:narrate,repeat:repeat,describeQuestion:describeQuestion,stopAll:stopAll,playPhoneme:playPhoneme,phonemeReport:report,onFault:onFault,setEnabled:setEnabled,isEnabled:function(){return enabled;},isUnlocked:function(){return unlocked;},status:status};
})();
