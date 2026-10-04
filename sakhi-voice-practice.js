window.SakhiVoicePractice=(function(){
'use strict';
var active=null,activeUrl=null,stopTimer=null;
function revoke(){if(activeUrl){try{URL.revokeObjectURL(activeUrl);}catch(e){}activeUrl=null;}}
function stopTracks(stream){try{(stream&&stream.getTracks?stream.getTracks():[]).forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}}
function supported(){return!!(navigator&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);}
function makeButton(text,cls){var b=document.createElement('button');b.type='button';b.className=cls||'voice-practice-button';b.textContent=text;return b;}
function panel(root){
  var box=document.createElement('section');box.className='voice-practice';box.setAttribute('aria-label','Optional voice practice');
  var copy=document.createElement('div');copy.className='voice-practice-copy';copy.innerHTML='<b>Hear yourself ✨</b><span>Optional practice. Your recording stays on this device and never changes your score.</span>';
  var controls=document.createElement('div');controls.className='voice-practice-controls';
  var record=makeButton('🎙️ Record my voice');var play=makeButton('▶ Hear it back');play.hidden=true;var discard=makeButton('↻ Try again','voice-practice-button quiet');discard.hidden=true;
  var status=document.createElement('small');status.className='voice-practice-status';status.setAttribute('aria-live','polite');
  controls.appendChild(record);controls.appendChild(play);controls.appendChild(discard);box.appendChild(copy);box.appendChild(controls);box.appendChild(status);root.appendChild(box);
  if(!supported()){record.disabled=true;status.textContent='Voice practice is not available in this browser. The lesson works normally without it.';return box;}
  var audio=null;
  function reset(message){
    clearTimeout(stopTimer);stopTimer=null;
    if(active){try{if(active.state!=='inactive')active.stop();}catch(e){}stopTracks(active.stream);active=null;}
    revoke();if(audio){try{audio.pause();}catch(e){}audio=null;}
    play.hidden=true;discard.hidden=true;record.hidden=false;record.disabled=false;record.textContent='🎙️ Record my voice';status.textContent=message||'';
  }
  record.addEventListener('click',async function(){
    reset('');record.disabled=true;status.textContent='Opening the microphone…';
    try{
      var stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      var chunks=[],rec=new MediaRecorder(stream);active=rec;rec.stream=stream;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
      rec.onerror=function(){stopTracks(stream);active=null;reset('The microphone stopped. You can keep learning without voice practice.');};
      rec.onstop=function(){
        clearTimeout(stopTimer);stopTimer=null;stopTracks(stream);active=null;
        if(!chunks.length){reset('No recording was captured. You can try once more.');return;}
        var blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});revoke();activeUrl=URL.createObjectURL(blob);audio=new Audio(activeUrl);
        record.hidden=true;record.disabled=false;play.hidden=false;discard.hidden=false;status.textContent='Ready. Hear your voice, then decide if you want another try.';
      };
      rec.start();record.disabled=false;record.textContent='■ Stop recording';status.textContent='Recording… say it in your own voice.';
      record.onclick=function(){if(rec.state!=='inactive')rec.stop();record.onclick=null;};
      stopTimer=setTimeout(function(){if(rec.state!=='inactive')rec.stop();},30000);
    }catch(e){record.disabled=false;status.textContent='Microphone permission is optional. You can keep learning without it.';}
  });
  play.addEventListener('click',function(){if(!audio)return;try{audio.currentTime=0;audio.play();status.textContent='Listening to your recording…';audio.onended=function(){status.textContent='Nice listening. Keep it, or try the sentence one more time.';};}catch(e){status.textContent='Playback is unavailable right now. Your lesson is not affected.';}});
  discard.addEventListener('click',function(){reset('Ready for another try whenever you are.');});
  box._sakhiVoiceCleanup=function(){reset('');};
  return box;
}
function cleanup(root){try{var old=root&&root.querySelector&&root.querySelector('.voice-practice');if(old&&old._sakhiVoiceCleanup)old._sakhiVoiceCleanup();}catch(e){}}
function install(){
  var T=window.SakhiTemplates;if(!T||typeof T.render!=='function'||T.__voicePractice)return false;
  var original=T.render;
  T.render=function(root,q,ctx){cleanup(root);var out=original.apply(T,arguments);if(q&&q.voice_practice)panel(root);return out;};
  T.__voicePractice=true;return true;
}
return{install:install,supported:supported,cleanup:cleanup};
})();
window.SakhiVoicePractice.install();
