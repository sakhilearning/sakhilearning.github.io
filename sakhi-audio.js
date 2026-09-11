window.SakhiAudio=(function(){
'use strict';
var enabled=true,unlocked=false,ctx=null,current=null,lastText='',listeners=[],manifest=null;
var AC=window.AudioContext||window.webkitAudioContext;
function fault(kind,msg,cause){var e=new Error(msg);e.kind=kind;e.cause=cause;listeners.forEach(function(fn){try{fn(e);}catch(x){}});return e;}
function onFault(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
async function unlock(){
  if(!enabled)return false;
  if(unlocked&&(!ctx||ctx.state==='running'))return true;
  try{
    if(AC){
      ctx=ctx||new AC();
      if(ctx.state==='suspended')await ctx.resume();
      var b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource(),g=ctx.createGain();
      g.gain.value=0;s.buffer=b;s.connect(g);g.connect(ctx.destination);s.start(0);
    }
    unlocked=true;return true;
  }catch(e){fault('BLOCKED','Tap Start again to enable sound.',e);return false;}
}
function stopAll(){try{if(current&&current.stop)current.stop(0);}catch(e){}current=null;try{if('speechSynthesis'in window)speechSynthesis.cancel();}catch(e){}}
async function playBytes(bytes){
  if(!ctx&&AC)ctx=new AC();if(ctx&&ctx.state==='suspended')await ctx.resume();
  if(!ctx)throw fault('UNSUPPORTED','This browser cannot play Sakhi audio.');
  var buf;try{buf=await ctx.decodeAudioData(bytes.slice(0));}catch(e){throw fault('DECODE','The narration audio could not be decoded.',e);}
  return new Promise(function(resolve,reject){var src=ctx.createBufferSource();current=src;src.buffer=buf;src.connect(ctx.destination);src.onended=function(){if(current===src)current=null;resolve(true);};try{src.start(0);}catch(e){reject(fault('PLAYBACK','The voice could not start.',e));}});
}
function chooseVoice(){
  if(!('speechSynthesis'in window))return null;
  var voices=speechSynthesis.getVoices()||[];
  var en=voices.filter(function(v){return /^en([-_]|$)/i.test(v.lang||'');});
  return en.find(function(v){return /samantha|ava|victoria|female|susan|karen|moira|tessa/i.test(v.name||'');})||en[0]||voices[0]||null;
}
function browserSpeak(text){
  return new Promise(function(resolve,reject){
    if(!('speechSynthesis'in window))return reject(fault('UNSUPPORTED','No browser voice is available.'));
    var u=new SpeechSynthesisUtterance(String(text)),v=chooseVoice();if(v)u.voice=v;u.rate=.9;u.pitch=1.05;
    u.onend=function(){resolve(true);};u.onerror=function(e){if(e&&['interrupted','canceled'].indexOf(e.error)>=0)return resolve(false);reject(fault('BROWSER_VOICE','Browser voice failed.',e));};
    try{speechSynthesis.speak(u);}catch(e){reject(fault('BROWSER_VOICE','Browser voice could not start.',e));}
  });
}
async function speak(text){
  if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');
  lastText=String(text);stopAll();await unlock();
  if(window.SakhiCloud&&SakhiCloud.state().configured){
    try{var bytes=await SakhiCloud.speak(lastText);return await playBytes(bytes);}catch(e){console.warn('[Sakhi] premium voice unavailable; using device voice',e.message);}
  }
  return browserSpeak(lastText);
}
function repeat(){return lastText?speak(lastText):Promise.resolve(false);}
async function loadManifest(){
  if(manifest)return manifest;
  if(window.SAKHI_PHONEME_MANIFEST){manifest=window.SAKHI_PHONEME_MANIFEST;return manifest;}
  try{var r=await fetch(new URL('assets/audio/phonemes/manifest.json',document.baseURI).href,{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));manifest=await r.json();}catch(e){manifest={required:[],verified:[]};}
  manifest.required=Array.isArray(manifest.required)?manifest.required:[];manifest.verified=Array.isArray(manifest.verified)?manifest.verified:[];return manifest;
}
async function playPhoneme(symbol){
  if(!enabled)throw fault('DISABLED','Audio is off.');var m=await loadManifest();
  if(m.verified.indexOf(symbol)<0)throw fault('MISSING_PHONEME','The verified /'+symbol+'/ recording is not installed yet.');
  await unlock();var url=new URL('assets/audio/phonemes/phoneme_'+symbol+'.ogg',document.baseURI).href,r=await fetch(url);
  if(!r.ok)throw fault('MISSING_PHONEME','The verified /'+symbol+'/ recording is missing.');return playBytes(await r.arrayBuffer());
}
async function report(){var m=await loadManifest();return{required:m.required.length,present:m.verified.length,missing:m.required.filter(function(x){return m.verified.indexOf(x)<0;}),complete:m.required.every(function(x){return m.verified.indexOf(x)>=0;})};}
function setEnabled(v){enabled=!!v;if(!enabled)stopAll();}
return{unlock:unlock,speak:speak,repeat:repeat,stopAll:stopAll,playPhoneme:playPhoneme,phonemeReport:report,onFault:onFault,setEnabled:setEnabled,isEnabled:function(){return enabled;},isUnlocked:function(){return unlocked;}};
})();
