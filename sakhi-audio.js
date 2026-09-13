window.SakhiAudio=(function(){
'use strict';
var enabled=true,unlocked=false,ctx=null,currentSource=null,currentAudio=null,currentObjectUrl=null,lastText='',listeners=[],manifest=null;
var lastProvider='none',lastError=null,primeDone=false,browserAttempt=0;
var naturalTts=null,naturalPromise=null,naturalState='idle',naturalError=null,naturalProgress=0,naturalCache={};
var lastDiag={provider:'none',engine:'none',httpStatus:null,mime:'',bytes:0,decode:false,playbackStarted:false,cached:false,lastError:null};
var AC=window.AudioContext||window.webkitAudioContext;
var NATURAL_IMPORT='https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';
var NATURAL_MODEL='onnx-community/Kokoro-82M-v1.0-ONNX';
var NATURAL_VOICE='af_heart';
function resetDiag(){lastDiag={provider:lastProvider,engine:'none',httpStatus:null,mime:'',bytes:0,decode:false,playbackStarted:false,cached:false,lastError:null};}
function fault(kind,msg,cause){var e=new Error(msg);e.kind=kind;e.cause=cause;lastError={kind:kind,message:msg};lastDiag.lastError=lastError;listeners.forEach(function(fn){try{fn(e);}catch(x){}});return e;}
function onFault(fn){listeners.push(fn);return function(){listeners=listeners.filter(function(x){return x!==fn;});};}
function resumeSpeech(){try{if('speechSynthesis'in window&&speechSynthesis.paused)speechSynthesis.resume();}catch(e){}}
function primeBrowserVoice(){
  if(primeDone||!('speechSynthesis'in window)||typeof SpeechSynthesisUtterance==='undefined')return;
  primeDone=true;
  try{resumeSpeech();speechSynthesis.getVoices();var u=new SpeechSynthesisUtterance(' ');u.volume=0;u.rate=1;speechSynthesis.speak(u);}catch(e){primeDone=false;}
}
async function unlock(){
  if(!enabled)return false;
  /* This must happen synchronously inside the child's tap for Safari/iOS. */
  primeBrowserVoice();
  try{
    if(AC){
      ctx=ctx||new AC();
      if(ctx.state==='suspended')await ctx.resume();
      var b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource(),g=ctx.createGain();
      g.gain.value=0;s.buffer=b;s.connect(g);g.connect(ctx.destination);s.start(0);
      unlocked=true;warmNaturalVoice();return true;
    }
    if(typeof Audio!=='undefined'||'speechSynthesis'in window){unlocked=true;warmNaturalVoice();return true;}
    throw new Error('No supported audio playback API');
  }catch(e){fault('BLOCKED','Tap Hear again once to enable Sakhi voice.',e);return false;}
}
function stopAll(){
  try{if(currentSource&&currentSource.stop)currentSource.stop(0);}catch(e){}currentSource=null;
  try{if(currentAudio){currentAudio.pause();currentAudio.src='';}}catch(e){}currentAudio=null;
  if(currentObjectUrl){try{URL.revokeObjectURL(currentObjectUrl);}catch(e){}currentObjectUrl=null;}
  try{if('speechSynthesis'in window)speechSynthesis.cancel();}catch(e){}
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
function canUseNatural(){return typeof document!=='undefined'&&typeof location!=='undefined'&&location.protocol!=='file:'&&typeof Promise!=='undefined';}
function loadNaturalVoice(){
  if(naturalTts)return Promise.resolve(naturalTts);
  if(naturalPromise)return naturalPromise;
  if(!canUseNatural())return Promise.reject(new Error('Local voice is unavailable in this environment.'));
  naturalState='loading';naturalError=null;naturalProgress=1;
  naturalPromise=import(NATURAL_IMPORT).then(function(mod){
    if(!mod||!mod.KokoroTTS)throw new Error('Kokoro voice engine did not load.');
    return mod.KokoroTTS.from_pretrained(NATURAL_MODEL,{dtype:'q8',device:'wasm',progress_callback:function(p){if(p&&typeof p.progress==='number')naturalProgress=Math.max(naturalProgress,Math.min(99,Math.round(p.progress)));}});
  }).then(function(tts){naturalTts=tts;naturalState='ready';naturalError=null;naturalProgress=100;return tts;}).catch(function(e){naturalState='failed';naturalError=e;naturalPromise=null;throw e;});
  return naturalPromise;
}
function warmNaturalVoice(){if(!canUseNatural()||naturalState==='ready'||naturalState==='loading')return;loadNaturalVoice().catch(function(e){console.warn('[Sakhi] free local voice warmup failed:',e&&e.message||e);});}
async function playNaturalResult(audio){
  if(!ctx&&AC)ctx=new AC();if(ctx&&ctx.state==='suspended')await ctx.resume();
  var samples=audio&&(audio.audio||audio.data),rate=audio&&(audio.sampling_rate||audio.sample_rate||24000);
  if(samples&&ctx){
    var buf=ctx.createBuffer(1,samples.length,rate);buf.getChannelData(0).set(samples);
    return new Promise(function(resolve,reject){var src=ctx.createBufferSource();currentSource=src;src.buffer=buf;src.connect(ctx.destination);src.onended=function(){if(currentSource===src)currentSource=null;resolve(true);};try{src.start(0);finishPlayback('kokoro','webaudio-local');lastDiag.mime='audio/pcm';lastDiag.bytes=samples.byteLength||samples.length*4;lastDiag.decode=true;}catch(e){reject(fault('PLAYBACK','Sakhi local voice could not start.',e));}});
  }
  if(audio&&typeof audio.toBlob==='function'){var blob=audio.toBlob();return playWithHtmlAudio(await blob.arrayBuffer(),blob.type||'audio/wav','kokoro');}
  throw fault('PLAYBACK','Sakhi local voice returned no playable audio.');
}
async function naturalSpeak(text){
  var cached=naturalCache[text];if(cached)return playNaturalResult(cached);
  var tts=await loadNaturalVoice(),audio=await tts.generate(text,{voice:NATURAL_VOICE,speed:.96});
  naturalCache[text]=audio;return playNaturalResult(audio);
}
function voiceScore(v){
  var n=(v.name||'').toLowerCase(),score=0;
  if(/^en([-_]|$)/i.test(v.lang||''))score+=30;else score-=30;
  if(/ava.*premium|samantha.*premium|zoe.*premium/.test(n))score+=70;
  if(/ava|samantha|allison|serena|susan|moira|tessa|victoria|karen|fiona|female/.test(n))score+=35;
  if(/enhanced|premium|natural/.test(n))score+=18;
  if(/compact|novelty|whisper|organ|trinoids|zarvox/.test(n))score-=80;
  return score;
}
function chooseVoice(){if(!('speechSynthesis'in window))return null;var voices=speechSynthesis.getVoices()||[];return voices.slice().sort(function(a,b){return voiceScore(b)-voiceScore(a);})[0]||null;}
function waitForVoices(ms){return new Promise(function(resolve){if(!('speechSynthesis'in window))return resolve();if((speechSynthesis.getVoices()||[]).length)return resolve();var done=false,t=setTimeout(finish,ms||450);function finish(){if(done)return;done=true;clearTimeout(t);try{speechSynthesis.removeEventListener('voiceschanged',finish);}catch(e){}resolve();}try{speechSynthesis.addEventListener('voiceschanged',finish,{once:true});}catch(e){}});}
async function browserSpeak(text,secondTry){
  if(!('speechSynthesis'in window)||typeof SpeechSynthesisUtterance==='undefined')throw fault('UNSUPPORTED','No on-device voice is available.');
  await waitForVoices(500);resumeSpeech();
  return new Promise(function(resolve,reject){
    var settled=false,started=false,u=new SpeechSynthesisUtterance(String(text)),v=secondTry?null:chooseVoice();if(v)u.voice=v;u.lang=(v&&v.lang)||'en-US';u.rate=.90;u.pitch=1.07;u.volume=1;
    function finish(ok){if(settled)return;settled=true;clearTimeout(watch);if(ok){finishPlayback('device','speech-synthesis');lastDiag.mime='device/voice';}resolve(ok);}
    u.onstart=function(){started=true;finishPlayback('device','speech-synthesis');lastDiag.mime='device/voice';};u.onend=function(){finish(true);};
    u.onerror=function(e){if(e&&['interrupted','canceled'].indexOf(e.error)>=0)return finish(false);if(settled)return;settled=true;clearTimeout(watch);reject(fault('DEVICE_VOICE','The temporary on-device voice could not play.',e));};
    try{resumeSpeech();speechSynthesis.speak(u);}catch(e){return reject(fault('DEVICE_VOICE','The temporary on-device voice could not start.',e));}
    var watch=setTimeout(function(){if(settled||started||speechSynthesis.speaking||speechSynthesis.pending)return;try{speechSynthesis.cancel();}catch(e){}if(!secondTry){browserAttempt++;settled=true;browserSpeak(text,true).then(resolve,reject);return;}settled=true;reject(fault('VOICE_BLOCKED','Tap Hear again once to enable sound.'));},2200);
  });
}
async function speakText(text){
  text=String(text||'').trim();if(!text)return true;
  stopAll();resetDiag();
  if(!await unlock())throw fault('BLOCKED','Tap Hear again once to enable Sakhi voice.');
  if(naturalTts){try{return await naturalSpeak(text);}catch(e){naturalState='failed';naturalError=e;console.warn('[Sakhi] free local voice unavailable; using gentle device voice:',e&&e.message||e);}}
  warmNaturalVoice();
  /* First use speaks immediately while the free Kokoro model finishes its one-time local load. */
  var pendingNatural=naturalPromise;
  try{return await browserSpeak(text,false);}
  catch(deviceError){
    /* Devices without a usable system voice must not require a second tap. Keep the
       original narration pending and play it automatically when Kokoro is ready. */
    if(pendingNatural){
      try{await pendingNatural;return await naturalSpeak(text);}
      catch(naturalFailure){throw fault('VOICE_UNAVAILABLE','The free Sakhi voice could not finish loading. Check the connection and tap Hear again.',naturalFailure);}
    }
    throw deviceError;
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
function status(){return{enabled:enabled,unlocked:unlocked,provider:lastProvider,lastError:lastError,engine:lastDiag.engine,httpStatus:lastDiag.httpStatus,mime:lastDiag.mime,bytes:lastDiag.bytes,decode:lastDiag.decode,playbackStarted:lastDiag.playbackStarted,cached:lastDiag.cached,naturalState:naturalState,naturalVoice:NATURAL_VOICE,naturalProgress:naturalProgress,naturalError:naturalError&&naturalError.message||null,browserAttempts:browserAttempt};}
return{unlock:unlock,warm:warmNaturalVoice,speak:speak,narrate:narrate,repeat:repeat,stopAll:stopAll,playPhoneme:playPhoneme,phonemeReport:report,onFault:onFault,setEnabled:setEnabled,isEnabled:function(){return enabled;},isUnlocked:function(){return unlocked;},status:status};
})();
