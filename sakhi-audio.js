window.SakhiAudio=(function(){
'use strict';
var enabled=true,unlocked=false,ctx=null,currentSource=null,currentAudio=null,lastText='',listeners=[],manifest=null;
var lastProvider='none',lastError=null,primeDone=false,browserAttempt=0,premiumCache={},cloudMutedUntil=0;
var naturalTts=null,naturalPromise=null,naturalState='idle',naturalError=null,naturalCache={};
var AC=window.AudioContext||window.webkitAudioContext;
var NATURAL_IMPORT='https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';
var NATURAL_MODEL='onnx-community/Kokoro-82M-v1.0-ONNX';
var NATURAL_VOICE='af_heart';
function fault(kind,msg,cause){var e=new Error(msg);e.kind=kind;e.cause=cause;lastError={kind:kind,message:msg};listeners.forEach(function(fn){try{fn(e);}catch(x){}});return e;}
function onFault(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
function resumeSpeech(){try{if('speechSynthesis'in window&&speechSynthesis.paused)speechSynthesis.resume();}catch(e){}}
function primeBrowserVoice(){
  if(primeDone||!('speechSynthesis'in window)||typeof SpeechSynthesisUtterance==='undefined')return;
  primeDone=true;
  try{resumeSpeech();speechSynthesis.getVoices();var u=new SpeechSynthesisUtterance(' ');u.volume=0;u.rate=1;speechSynthesis.speak(u);}catch(e){primeDone=false;}
}
async function unlock(){
  if(!enabled)return false;
  primeBrowserVoice();
  try{
    if(AC){ctx=ctx||new AC();if(ctx.state==='suspended')await ctx.resume();var b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource(),g=ctx.createGain();g.gain.value=0;s.buffer=b;s.connect(g);g.connect(ctx.destination);s.start(0);}
    unlocked=!!ctx||('speechSynthesis'in window);if(!unlocked)throw new Error('No supported audio API');
    if(canUseNatural())warmNaturalVoice();
    return true;
  }catch(e){fault('BLOCKED','Tap the sound button once to enable Sakhi voice.',e);return false;}
}
function stopAll(){
  try{if(currentSource&&currentSource.stop)currentSource.stop(0);}catch(e){}currentSource=null;
  try{if(currentAudio){currentAudio.pause();currentAudio.src='';}}catch(e){}currentAudio=null;
  try{if('speechSynthesis'in window)speechSynthesis.cancel();}catch(e){}
}
async function playBytes(bytes,provider){
  if(!ctx&&AC)ctx=new AC();if(ctx&&ctx.state==='suspended')await ctx.resume();
  if(!ctx)throw fault('UNSUPPORTED','This browser cannot play downloaded narration.');
  var buf;try{buf=await ctx.decodeAudioData(bytes.slice(0));}catch(e){throw fault('DECODE','The narration audio could not be decoded.',e);}
  return new Promise(function(resolve,reject){var src=ctx.createBufferSource();currentSource=src;src.buffer=buf;src.connect(ctx.destination);src.onended=function(){if(currentSource===src)currentSource=null;resolve(true);};try{src.start(0);lastProvider=provider||'downloaded';lastError=null;}catch(e){reject(fault('PLAYBACK','The downloaded voice could not start.',e));}});
}
function canUseNatural(){return typeof document!=='undefined'&&typeof location!=='undefined'&&location.protocol!=='file:'&&typeof Promise!=='undefined';}
function naturalDevice(){return (typeof navigator!=='undefined'&&navigator.gpu)?'webgpu':'wasm';}
function naturalDtype(){return naturalDevice()==='webgpu'?'fp32':'q8';}
function loadNaturalVoice(){
  if(naturalTts)return Promise.resolve(naturalTts);
  if(naturalPromise)return naturalPromise;
  if(!canUseNatural())return Promise.reject(new Error('Natural browser voice is unavailable in this environment.'));
  naturalState='loading';naturalError=null;
  naturalPromise=import(NATURAL_IMPORT).then(function(mod){
    if(!mod||!mod.KokoroTTS)throw new Error('Kokoro voice engine did not load.');
    return mod.KokoroTTS.from_pretrained(NATURAL_MODEL,{dtype:naturalDtype(),device:naturalDevice()});
  }).then(function(tts){naturalTts=tts;naturalState='ready';naturalError=null;return tts;}).catch(function(e){naturalState='failed';naturalError=e;naturalPromise=null;throw e;});
  return naturalPromise;
}
function warmNaturalVoice(){loadNaturalVoice().catch(function(e){console.warn('[Sakhi] local natural voice warmup failed:',e&&e.message||e);});}
async function playNaturalResult(audio){
  if(!ctx&&AC)ctx=new AC();if(ctx&&ctx.state==='suspended')await ctx.resume();
  var samples=audio&&(audio.audio||audio.data),rate=audio&&(audio.sampling_rate||audio.sample_rate||24000);
  if(samples&&ctx){
    var buf=ctx.createBuffer(1,samples.length,rate);buf.getChannelData(0).set(samples);
    return new Promise(function(resolve,reject){var src=ctx.createBufferSource();currentSource=src;src.buffer=buf;src.connect(ctx.destination);src.onended=function(){if(currentSource===src)currentSource=null;resolve(true);};try{src.start(0);lastProvider='kokoro';lastError=null;}catch(e){reject(fault('PLAYBACK','Sakhi natural voice could not start.',e));}});
  }
  if(audio&&typeof audio.toBlob==='function'&&typeof Audio!=='undefined'){
    var url=URL.createObjectURL(audio.toBlob());return new Promise(function(resolve,reject){var el=new Audio(url);currentAudio=el;el.onended=function(){URL.revokeObjectURL(url);if(currentAudio===el)currentAudio=null;resolve(true);};el.onerror=function(e){URL.revokeObjectURL(url);reject(fault('PLAYBACK','Sakhi natural voice could not play.',e));};el.play().then(function(){lastProvider='kokoro';lastError=null;}).catch(reject);});
  }
  throw fault('PLAYBACK','Sakhi natural voice returned no playable audio.');
}
async function naturalSpeak(text){
  var cached=naturalCache[text];if(cached&&cached.audio)return playNaturalResult(cached.audio);
  var tts=await loadNaturalVoice(),audio=await tts.generate(text,{voice:NATURAL_VOICE,speed:.96});naturalCache[text]={audio:audio};return playNaturalResult(audio);
}
function voiceScore(v){var n=(v.name||'').toLowerCase(),score=0;if(/^en([-_]|$)/i.test(v.lang||''))score+=10;if(/samantha|ava|victoria|serena|susan|karen|moira|tessa|female/.test(n))score+=8;if(/compact|novelty/.test(n))score-=5;return score;}
function chooseVoice(){if(!('speechSynthesis'in window))return null;var voices=speechSynthesis.getVoices()||[];return voices.slice().sort(function(a,b){return voiceScore(b)-voiceScore(a);})[0]||null;}
function waitForVoices(ms){return new Promise(function(resolve){if(!('speechSynthesis'in window))return resolve();if((speechSynthesis.getVoices()||[]).length)return resolve();var done=false,t=setTimeout(finish,ms||450);function finish(){if(done)return;done=true;clearTimeout(t);try{speechSynthesis.removeEventListener('voiceschanged',finish);}catch(e){}resolve();}try{speechSynthesis.addEventListener('voiceschanged',finish,{once:true});}catch(e){}});}
async function browserSpeak(text,secondTry){
  if(!('speechSynthesis'in window)||typeof SpeechSynthesisUtterance==='undefined')throw fault('UNSUPPORTED','No device voice is available.');
  await waitForVoices(500);resumeSpeech();
  return new Promise(function(resolve,reject){
    var settled=false,started=false,u=new SpeechSynthesisUtterance(String(text));var v=secondTry?null:chooseVoice();if(v)u.voice=v;u.lang=(v&&v.lang)||'en-US';u.rate=.88;u.pitch=1.06;u.volume=1;
    function finish(ok){if(settled)return;settled=true;clearTimeout(watch);if(ok){lastProvider='device';lastError=null;}resolve(ok);}
    u.onstart=function(){started=true;lastProvider='device';lastError=null;};u.onend=function(){finish(true);};u.onerror=function(e){if(e&&['interrupted','canceled'].indexOf(e.error)>=0)return finish(false);if(settled)return;settled=true;clearTimeout(watch);reject(fault('BROWSER_VOICE','The device voice could not play.',e));};
    try{resumeSpeech();speechSynthesis.speak(u);}catch(e){return reject(fault('BROWSER_VOICE','The device voice could not start.',e));}
    var watch=setTimeout(function(){if(settled||started||speechSynthesis.speaking||speechSynthesis.pending)return;try{speechSynthesis.cancel();}catch(e){}if(!secondTry){browserAttempt++;browserSpeak(text,true).then(resolve,reject);settled=true;return;}settled=true;reject(fault('VOICE_BLOCKED','Sakhi voice is waiting for another tap. Use “Hear again” once.',null));},2200);
  });
}
async function cloudSpeak(text){
  if(!(window.SakhiCloud&&SakhiCloud.state().configured&&Date.now()>cloudMutedUntil))throw new Error('Cloud voice is not configured.');
  try{var bytes=premiumCache[text];if(!bytes){bytes=await SakhiCloud.speak(text,{timeout:3200});if(bytes&&bytes.byteLength>100)premiumCache[text]=bytes.slice(0);}if(bytes&&bytes.byteLength>100)return await playBytes(bytes.slice(0),'elevenlabs');throw new Error('Empty narration response');}
  catch(e){cloudMutedUntil=Date.now()+60000;throw e;}
}
async function speakText(text){
  text=String(text||'').trim();if(!text)return true;stopAll();await unlock();
  if(canUseNatural()){
    try{return await naturalSpeak(text);}catch(e){console.warn('[Sakhi] local natural voice unavailable:',e&&e.message||e);lastError={kind:'NATURAL_FALLBACK',message:e&&e.message||String(e)};}
    try{return await cloudSpeak(text);}catch(e2){console.warn('[Sakhi] cloud voice unavailable:',e2&&e2.message||e2);}
    throw fault('NATURAL_VOICE','The gentle Sakhi voice could not load. Check the connection once, then tap Hear again.');
  }
  /* Automated tests and non-DOM runtimes keep a device fallback; production does not silently drop back to the robotic browser voice. */
  return browserSpeak(text,false);
}
async function speak(text){if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');lastText=String(text||'');return speakText(lastText);}
async function narrate(question){
  if(!enabled)throw fault('DISABLED','Spoken guidance is turned off in Parent Settings.');if(!question)return false;lastText=String(question.narration||question.prompt||'');var segs=Array.isArray(question.audioSegments)?question.audioSegments:null;if(!segs||!segs.length)return speakText(lastText);
  for(var i=0;i<segs.length;i++){var seg=segs[i]||{};if(seg.type==='phoneme'){try{await playPhoneme(seg.symbol);}catch(e){if(e.kind==='MISSING_PHONEME'){console.warn('[Sakhi phoneme]',e.message);continue;}throw e;}}else if(seg.text){await speakText(seg.text);}}
  return true;
}
function repeat(){return lastText?speak(lastText):Promise.resolve(false);}
async function loadManifest(){
  if(manifest)return manifest;if(window.SAKHI_PHONEME_MANIFEST){manifest=window.SAKHI_PHONEME_MANIFEST;return manifest;}
  try{var r=await fetch(new URL('assets/audio/phonemes/manifest.json',document.baseURI).href,{cache:'no-store'});if(!r.ok)throw new Error(String(r.status));manifest=await r.json();}catch(e){manifest={required:[],verified:[]};}
  manifest.required=Array.isArray(manifest.required)?manifest.required:[];manifest.verified=Array.isArray(manifest.verified)?manifest.verified:[];return manifest;
}
async function playPhoneme(symbol){
  if(!enabled)throw fault('DISABLED','Audio is off.');var m=await loadManifest();if(m.verified.indexOf(symbol)<0)throw fault('MISSING_PHONEME','The verified /'+symbol+'/ recording is not installed yet.');await unlock();stopAll();var url=new URL('assets/audio/phonemes/phoneme_'+symbol+'.ogg',document.baseURI).href,r=await fetch(url,{cache:'force-cache'});if(!r.ok)throw fault('MISSING_PHONEME','The verified /'+symbol+'/ recording is missing.');return playBytes(await r.arrayBuffer(),'phoneme');
}
async function report(){var m=await loadManifest();return{required:m.required.length,present:m.verified.length,missing:m.required.filter(function(x){return m.verified.indexOf(x)<0;}),complete:m.required.every(function(x){return m.verified.indexOf(x)>=0;})};}
function setEnabled(v){enabled=!!v;if(!enabled)stopAll();}
function status(){return{enabled:enabled,unlocked:unlocked,provider:lastProvider,lastError:lastError,browserAttempts:browserAttempt,cloudConfigured:!!(window.SakhiCloud&&SakhiCloud.state().configured),naturalState:naturalState,naturalVoice:NATURAL_VOICE,naturalError:naturalError&&naturalError.message||null};}
return{unlock:unlock,warm:warmNaturalVoice,speak:speak,narrate:narrate,repeat:repeat,stopAll:stopAll,playPhoneme:playPhoneme,phonemeReport:report,onFault:onFault,setEnabled:setEnabled,isEnabled:function(){return enabled;},isUnlocked:function(){return unlocked;},status:status};
})();
