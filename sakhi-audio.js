window.SakhiAudio=(function(){
'use strict';
var enabled=true,unlocked=false,ctx=null,currentSource=null,currentAudio=null,currentObjectUrl=null,lastText='',listeners=[],manifest=null,premiumCache={};
var lastProvider='none',lastError=null;
var lastDiag={provider:'none',engine:'none',httpStatus:null,mime:'',bytes:0,decode:false,playbackStarted:false,cached:false,lastError:null};
var AC=window.AudioContext||window.webkitAudioContext;
function resetDiag(){lastDiag={provider:lastProvider,engine:'none',httpStatus:null,mime:'',bytes:0,decode:false,playbackStarted:false,cached:false,lastError:null};}
function fault(kind,msg,cause){var e=new Error(msg);e.kind=kind;e.cause=cause;lastError={kind:kind,message:msg};lastDiag.lastError=lastError;listeners.forEach(function(fn){try{fn(e);}catch(x){}});return e;}
function onFault(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
async function unlock(){
  if(!enabled)return false;
  try{
    if(AC){
      ctx=ctx||new AC();
      if(ctx.state==='suspended')await ctx.resume();
      var b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource(),g=ctx.createGain();
      g.gain.value=0;s.buffer=b;s.connect(g);g.connect(ctx.destination);s.start(0);
      unlocked=true;return true;
    }
    if(typeof Audio!=='undefined'){unlocked=true;return true;}
    throw new Error('No supported audio playback API');
  }catch(e){fault('BLOCKED','Tap Hear again once to enable Sakhi voice.',e);return false;}
}
function stopAll(){
  try{if(currentSource&&currentSource.stop)currentSource.stop(0);}catch(e){}currentSource=null;
  try{if(currentAudio){currentAudio.pause();currentAudio.src='';}}catch(e){}currentAudio=null;
  if(currentObjectUrl){try{URL.revokeObjectURL(currentObjectUrl);}catch(e){}currentObjectUrl=null;}
}
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
  meta=meta||{};provider=provider||'elevenlabs';
  lastDiag.provider=provider;lastDiag.httpStatus=meta.httpStatus||null;lastDiag.mime=meta.mime||'';lastDiag.bytes=bytes&&bytes.byteLength||0;lastDiag.cached=!!meta.cached;lastDiag.decode=false;lastDiag.playbackStarted=false;lastDiag.lastError=null;
  if(!bytes||bytes.byteLength<100)throw fault('EMPTY_AUDIO','Sakhi voice returned no playable audio.');
  if(!ctx&&AC)ctx=new AC();
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
      console.warn('[Sakhi audio] WebAudio playback failed; trying the same ElevenLabs recording with HTML Audio.',e&&e.message||e);
    }
  }
  return playWithHtmlAudio(bytes,meta.mime||'audio/mpeg',provider);
}
async function speakText(text){
  text=String(text||'').trim();if(!text)return true;
  stopAll();resetDiag();
  if(!await unlock())throw fault('BLOCKED','Tap Hear again once to enable Sakhi voice.');
  if(!(window.SakhiCloud&&SakhiCloud.state().configured))throw fault('VOICE_UNAVAILABLE','Sakhi voice is not connected yet. A grown-up can check Audio in Parents.');
  var cached=premiumCache[text],resp;
  try{
    if(cached){resp={bytes:cached.bytes.slice(0),httpStatus:cached.httpStatus,mime:cached.mime,cached:true};}
    else{
      resp=await SakhiCloud.speak(text);
      var raw=resp&&resp.bytes?resp.bytes:resp;
      if(raw&&raw.byteLength>100){premiumCache[text]={bytes:raw.slice(0),httpStatus:resp.httpStatus||200,mime:resp.mime||'audio/mpeg'};}
    }
    var bytes=resp&&resp.bytes?resp.bytes:resp;
    return await playBytes(bytes,{httpStatus:resp&&resp.httpStatus||200,mime:resp&&resp.mime||'audio/mpeg',cached:!!(resp&&resp.cached)},'elevenlabs');
  }catch(e){
    if(e&&e.kind)throw e;
    throw fault('VOICE_UNAVAILABLE','Sakhi\'s voice is resting. Tap Hear again in a moment.',e);
  }
}
async function speak(text){if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');lastText=String(text||'');return speakText(lastText);}
async function narrate(question){
  if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');if(!question)return false;
  lastText=String(question.narration||question.prompt||'');var segs=Array.isArray(question.audioSegments)?question.audioSegments:null;
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
function setEnabled(v){enabled=!!v;if(!enabled)stopAll();}
function status(){return{enabled:enabled,unlocked:unlocked,provider:lastProvider,lastError:lastError,cloudConfigured:!!(window.SakhiCloud&&SakhiCloud.state().configured),engine:lastDiag.engine,httpStatus:lastDiag.httpStatus,mime:lastDiag.mime,bytes:lastDiag.bytes,decode:lastDiag.decode,playbackStarted:lastDiag.playbackStarted,cached:lastDiag.cached};}
return{unlock:unlock,speak:speak,narrate:narrate,repeat:repeat,stopAll:stopAll,playPhoneme:playPhoneme,phonemeReport:report,onFault:onFault,setEnabled:setEnabled,isEnabled:function(){return enabled;},isUnlocked:function(){return unlocked;},status:status};
})();
