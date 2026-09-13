window.SakhiAudio=(function(){
'use strict';
var enabled=true,unlocked=false,ctx=null,currentSource=null,currentAudio=null,currentObjectUrl=null,keepAliveSource=null,keepAliveGain=null,lastText='',listeners=[],manifest=null;
var lastProvider='none',lastError=null;
var naturalTts=null,naturalPromise=null,naturalState='idle',naturalError=null,naturalProgress=0,naturalCache={};
var lastDiag={provider:'none',engine:'none',httpStatus:null,mime:'',bytes:0,decode:false,playbackStarted:false,cached:false,lastError:null};
var AC=window.AudioContext||window.webkitAudioContext;
var NATURAL_IMPORT='./vendor/kokoro-runtime.js';
var NATURAL_MODEL='onnx-community/Kokoro-82M-v1.0-ONNX';
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
  try{if(currentSource&&currentSource.stop)currentSource.stop(0);}catch(e){}currentSource=null;
  try{if(currentAudio){currentAudio.pause();currentAudio.src='';}}catch(e){}currentAudio=null;
  if(currentObjectUrl){try{URL.revokeObjectURL(currentObjectUrl);}catch(e){}currentObjectUrl=null;}
}
function stopKeepAlive(){try{if(keepAliveSource)keepAliveSource.stop(0);}catch(e){}keepAliveSource=null;keepAliveGain=null;}
function finishPlayback(provider,engine){lastProvider=provider;lastError=null;lastDiag.provider=provider;lastDiag.engine=engine;lastDiag.playbackStarted=true;lastDiag.lastError=null;}
function playWithHtmlAudio(bytes,mime,provider){
  if(typeof Audio==='undefined'||typeof Blob==='undefined'||!window.URL||!URL.createObjectURL)throw fault('UNSUPPORTED','This browser cannot play Sakhi narration.');
  return new Promise(function(resolve,reject){
    try{
      var blob=new Blob([bytes],{type:mime||'audio/mpeg'}),url=URL.createObjectURL(blob),a=new Audio();
      currentAudio=a;currentObjectUrl=url;a.preload='auto';a.src=url;
      a.onplaying=function(){finishPlayback(provider,'html-audio');};
      a.onended=function(){if(currentAudio===a)currentAudio=null;if(currentObjectUrl===url){try{URL.revokeObjectURL(url);}catch(e){}currentObjectUrl=null;}resolve(true);};
      a.onerror=function(e){reject(fault('PLAYBACK','Sakhi narration could not play on this device.',e));};
      var p=a.play();if(p&&typeof p.catch==='function')p.catch(function(e){reject(fault('PLAYBACK','Tap Hear again once to start Sakhi voice.',e));});
    }catch(e){reject(fault('PLAYBACK','Sakhi narration could not start.',e));}
  });
}
async function playBytes(bytes,meta,provider){
  meta=meta||{};provider=provider||'recording';
  lastDiag.provider=provider;lastDiag.httpStatus=meta.httpStatus||null;lastDiag.mime=meta.mime||'';lastDiag.bytes=bytes&&bytes.byteLength||0;lastDiag.cached=!!meta.cached;lastDiag.decode=false;lastDiag.playbackStarted=false;lastDiag.lastError=null;
  if(!bytes||bytes.byteLength<100)throw fault('EMPTY_AUDIO','Sakhi voice returned no playable audio.');
  ensureContext();
  if(ctx){
    try{
      if(ctx.state==='suspended')await ctx.resume();
      var buf=await ctx.decodeAudioData(bytes.slice(0));lastDiag.decode=true;
      return await new Promise(function(resolve,reject){
        var src=ctx.createBufferSource();currentSource=src;src.buffer=buf;src.connect(ctx.destination);
        src.onended=function(){if(currentSource===src)currentSource=null;resolve(true);};
        try{src.start(0);finishPlayback(provider,'webaudio');}catch(e){reject(fault('PLAYBACK','Sakhi narration could not start.',e));}
      });
    }catch(e){
      console.warn('[Sakhi audio] WebAudio playback failed; trying HTML Audio.',e&&e.message||e);
    }
  }
  return playWithHtmlAudio(bytes,meta.mime||'audio/mpeg',provider);
}
function canUseNatural(){return typeof document!=='undefined'&&typeof location!=='undefined'&&location.protocol!=='file:'&&typeof Promise!=='undefined';}
function delay(ms){return new Promise(function(resolve){setTimeout(resolve,ms);});}
async function prepareServerVoice(){
  naturalState='loading';naturalError=null;naturalProgress=8;
  var deadline=Date.now()+300000,lastError=null;
  while(Date.now()<deadline){
    try{
      var r=await fetch(SAKHI_TTS_URL+'/health',{cache:'no-store',mode:'cors'}),h=await r.json();
      if(!r.ok)throw new Error('Voice health HTTP '+r.status);
      if(h&&h.ready){naturalTts={kind:'kokoro-server',voice:NATURAL_VOICE};naturalState='ready';naturalError=null;naturalProgress=100;return naturalTts;}
      if(h&&h.status==='error')throw new Error(h.error||'Kokoro server initialization failed.');
      naturalProgress=h&&h.status==='loading'?78:35;
    }catch(e){lastError=e;naturalProgress=Math.max(naturalProgress,18);}
    await delay(4000);
  }
  throw lastError||new Error('Kokoro server did not become ready in time.');
}
function loadNaturalVoice(){
  if(naturalTts)return Promise.resolve(naturalTts);
  if(naturalPromise)return naturalPromise;
  if(!canUseNatural())return Promise.reject(new Error('Local voice is unavailable in this environment.'));
  if(APPLE_MOBILE){naturalPromise=prepareServerVoice().catch(function(e){naturalState='failed';naturalError=e;naturalPromise=null;throw e;});return naturalPromise;}
  naturalState='loading';naturalError=null;naturalProgress=1;
  naturalPromise=import(NATURAL_IMPORT).then(function(mod){
    if(!mod||!mod.KokoroTTS)throw new Error('Kokoro voice engine did not load.');
    return mod.KokoroTTS.from_pretrained(NATURAL_MODEL,{dtype:'q8',device:'wasm',progress_callback:function(p){if(p&&typeof p.progress==='number')naturalProgress=Math.max(naturalProgress,Math.min(99,Math.round(p.progress)));}});
  }).then(function(tts){naturalTts=tts;naturalState='ready';naturalError=null;naturalProgress=100;return tts;}).catch(function(e){naturalState='failed';naturalError=e;naturalPromise=null;throw e;});
  return naturalPromise;
}
function warmNaturalVoice(){
  if(!canUseNatural())return Promise.reject(new Error('Local voice is unavailable in this environment.'));
  if(naturalState==='ready')return Promise.resolve(naturalTts);
  if(naturalState==='loading')return naturalPromise;
  return loadNaturalVoice();
}
async function playNaturalResult(audio){
  ensureContext();if(ctx&&ctx.state==='suspended')await ctx.resume();if(ctx)startKeepAlive();
  var samples=audio&&(audio.audio||audio.data),rate=audio&&(audio.sampling_rate||audio.sample_rate||24000);
  if(samples&&ctx){
    var buf=ctx.createBuffer(1,samples.length,rate);buf.getChannelData(0).set(samples);
    return new Promise(function(resolve,reject){var src=ctx.createBufferSource(),gain=ctx.createGain(),now=ctx.currentTime||0,duration=buf.duration||samples.length/rate;currentSource=src;src.buffer=buf;src.connect(gain);gain.connect(ctx.destination);if(gain.gain&&gain.gain.setValueAtTime){gain.gain.setValueAtTime(.01,now);gain.gain.linearRampToValueAtTime(1,now+.035);gain.gain.setValueAtTime(1,Math.max(now+.04,now+duration-.05));gain.gain.linearRampToValueAtTime(.01,now+duration);}else gain.gain.value=1;src.onended=function(){if(currentSource===src)currentSource=null;resolve(true);};try{src.start(0);finishPlayback('kokoro','webaudio-local');lastDiag.mime='audio/pcm';lastDiag.bytes=samples.byteLength||samples.length*4;lastDiag.decode=true;}catch(e){reject(fault('PLAYBACK','Sakhi local voice could not start.',e));}});
  }
  if(audio&&typeof audio.toBlob==='function'){var blob=audio.toBlob();return playWithHtmlAudio(await blob.arrayBuffer(),blob.type||'audio/wav','kokoro');}
  throw fault('PLAYBACK','Sakhi local voice returned no playable audio.');
}
async function speakServerPart(text){
  var cached=naturalCache[text];
  if(cached){await playBytes(cached.bytes,{httpStatus:200,mime:cached.mime,cached:true},'kokoro-server');return true;}
  var r=await fetch(SAKHI_TTS_URL+'/speak',{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text,voice:NATURAL_VOICE,speed:NATURAL_SPEED})});
  var mime=(r.headers&&r.headers.get?r.headers.get('content-type'):'')||'audio/wav';
  if(!r.ok){var detail='';try{detail=await r.text();}catch(e){}throw new Error('Kokoro voice HTTP '+r.status+(detail?' · '+detail.slice(0,160):''));}
  if(mime.toLowerCase().indexOf('audio/')!==0)throw new Error('Kokoro voice returned '+mime);
  var bytes=await r.arrayBuffer();naturalCache[text]={bytes:bytes,mime:mime};
  await playBytes(bytes,{httpStatus:r.status,mime:mime,cached:false},'kokoro-server');return true;
}
function childChunks(text){
  var sentences=String(text||'').match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[],chunks=[],part='';
  sentences.forEach(function(sentence){sentence=sentence.trim();if(!sentence)return;if(part&&(part.length+sentence.length+1)>210){chunks.push(part);part=sentence;}else part+=(part?' ':'')+sentence;});
  if(part)chunks.push(part);return chunks.length?chunks:[String(text||'')];
}
async function naturalSpeak(text){
  var tts=await loadNaturalVoice(),chunks=childChunks(text),allCached=true;
  if(APPLE_MOBILE){for(var a=0;a<chunks.length;a++){await speakServerPart(chunks[a]);if(a<chunks.length-1)await delay(180);}return true;}
  for(var i=0;i<chunks.length;i++){var part=chunks[i],audio=naturalCache[part];if(!audio){allCached=false;audio=await tts.generate(part,{voice:NATURAL_VOICE,speed:NATURAL_SPEED});naturalCache[part]=audio;}await playNaturalResult(audio);if(i<chunks.length-1)await new Promise(function(resolve){setTimeout(resolve,180);});}
  lastDiag.cached=allCached;return true;
}
async function speakText(text){
  text=String(text||'').trim();if(!text)return true;
  stopAll();resetDiag();
  if(!await unlock())throw fault('BLOCKED','Tap Hear again once to enable Sakhi voice.');
  try{await loadNaturalVoice();return await naturalSpeak(text);}
  catch(e){throw fault('VOICE_UNAVAILABLE','The free Sakhi voice could not finish loading. Check the connection and try again.',e);}
}
async function speak(text){if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');lastText=String(text||'');return speakText(lastText);}
function spokenValue(value){
  var map={'🌸':'flower','🦋':'butterfly','⭐':'star','🌈':'rainbow','➡️':'right arrow','⬅️':'left arrow','⬆️':'up arrow'};
  var text=String(value);Object.keys(map).forEach(function(symbol){text=text.split(symbol).join(map[symbol]);});
  return text.replace(/\/([a-z]+)\//gi,'$1 sound').replace(/\s*=\s*\?/g,' equals what number?').replace(/−/g,' minus ').replace(/\+/g,' plus ').replace(/\s+/g,' ').trim();
}
function listValues(values,label){return values.map(function(value,index){return label+' '+(index+1)+' is '+spokenValue(value)+'.';}).join(' ');}
function describeQuestion(question){
  var prompt=spokenValue(question.prompt||''),guide=spokenValue(question.narration||''),parts=[];
  if(question.media&&question.media.passage)parts.push(guide||prompt);else{if(prompt)parts.push(prompt);if(guide&&guide.toLowerCase()!==prompt.toLowerCase())parts.push(guide);}
  if(question.media&&question.media.count)parts.push('Tap each treasure once as you count.');
  if(question.media&&question.media.groups)parts.push('Look at both groups, put them together, and count all the treasures.');
  if(question.media&&question.media.subtract)parts.push('Tap the treasures as you take some away, then count what remains.');
  if(question.template==='choice'&&Array.isArray(question.choices)){parts.push('Listen to every choice. '+listValues(question.choices,'Choice')+' Now tap the best answer.');}
  else if(question.template==='build'&&Array.isArray(question.tokens)){parts.push('Your letter pieces are ready. '+listValues(question.tokens,'Piece')+' Tap the pieces in order, then tap Check.');}
  else if(question.template==='sequence'&&Array.isArray(question.tokens)){parts.push('Your word cards are ready. '+listValues(question.tokens,'Card')+' Put them in the right order, then tap Check.');}
  else if(question.template==='trace')parts.push('Use one finger. Start at the dot and follow the glowing path slowly. Then tap Check.');
  else if(question.template==='practice')parts.push('Take your time. When you finish, tap Check.');
  return parts.join(' ').replace(/\s+/g,' ').trim();
}
async function narrate(question){
  if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');if(!question)return false;
  lastText=describeQuestion(question);var segs=Array.isArray(question.audioSegments)?question.audioSegments:null;
  if(!segs||!segs.length)return speakText(lastText);
  for(var i=0;i<segs.length;i++){
    var seg=segs[i]||{};
    if(seg.type==='phoneme'){
      try{await playPhoneme(seg.symbol);}catch(e){if(e.kind==='MISSING_PHONEME'){console.warn('[Sakhi phoneme]',e.message);continue;}throw e;}
    }else if(seg.text){await speakText(seg.text);}
  }
  return true;
}
function repeat(){return lastText?speak(lastText):Promise.resolve(false);}
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
function status(){return{enabled:enabled,unlocked:unlocked,provider:lastProvider,lastError:lastError,engine:lastDiag.engine,httpStatus:lastDiag.httpStatus,mime:lastDiag.mime,bytes:lastDiag.bytes,decode:lastDiag.decode,playbackStarted:lastDiag.playbackStarted,cached:lastDiag.cached,naturalState:naturalState,naturalMode:APPLE_MOBILE?'kokoro-server':'kokoro-local',naturalVoice:NATURAL_VOICE,naturalSpeed:NATURAL_SPEED,naturalProgress:naturalProgress,naturalError:naturalError&&naturalError.message||null,appleMobile:APPLE_MOBILE};}
if(typeof document!=='undefined')document.addEventListener('touchend',function(){if(enabled&&ctx&&ctx.state==='suspended')ctx.resume().then(startKeepAlive).catch(function(){});},{passive:true});
return{unlock:unlock,prepare:loadNaturalVoice,warm:warmNaturalVoice,speak:speak,narrate:narrate,repeat:repeat,describeQuestion:describeQuestion,stopAll:stopAll,playPhoneme:playPhoneme,phonemeReport:report,onFault:onFault,setEnabled:setEnabled,isEnabled:function(){return enabled;},isUnlocked:function(){return unlocked;},status:status};
})();
