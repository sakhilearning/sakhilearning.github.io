window.SakhiVoicePractice=(function(){
'use strict';
var active=null,activeUrl=null,stopTimer=null;
function revoke(){if(activeUrl){try{URL.revokeObjectURL(activeUrl);}catch(e){}activeUrl=null;}}
function stopTracks(stream){try{(stream&&stream.getTracks?stream.getTracks():[]).forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}}
function supported(){return!!(typeof navigator!=='undefined'&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&window.MediaRecorder);}
function makeButton(text,cls){var b=document.createElement('button');b.type='button';b.className=cls||'voice-practice-button';b.textContent=text;return b;}
function panel(root){
  var box=document.createElement('section');box.className='voice-practice';box.setAttribute('aria-label','Optional voice practice');
  var copy=document.createElement('div');copy.className='voice-practice-copy';copy.innerHTML='<b>Hear yourself ✨</b><span>Optional practice. Your recording stays on this device and never changes your score.</span>';
  var controls=document.createElement('div');controls.className='voice-practice-controls';
  var record=makeButton('🎙️ Record my voice');var play=makeButton('▶ Hear it back');play.hidden=true;var discard=makeButton('↻ Try again','voice-practice-button quiet');discard.hidden=true;
  var status=document.createElement('small');status.className='voice-practice-status';status.setAttribute('aria-live','polite');
  controls.appendChild(record);controls.appendChild(play);controls.appendChild(discard);box.appendChild(copy);box.appendChild(controls);box.appendChild(status);root.appendChild(box);
  if(!supported()){record.disabled=true;status.textContent='Voice practice is not available in this browser. The lesson works normally without it.';return box;}
  var audio=null,generation=0;
  function clearRecording(message){
    generation++;
    clearTimeout(stopTimer);stopTimer=null;
    var rec=active;active=null;
    if(rec){try{if(rec.state!=='inactive')rec.stop();}catch(e){}stopTracks(rec.stream);}
    revoke();if(audio){try{audio.pause();audio.src='';}catch(e){}audio=null;}
    play.hidden=true;discard.hidden=true;record.hidden=false;record.disabled=false;record.textContent='🎙️ Record my voice';status.textContent=message||'';
  }
  function stopCurrent(){
    var rec=active;if(!rec)return;
    clearTimeout(stopTimer);stopTimer=null;
    record.disabled=true;record.textContent='Finishing…';status.textContent='Saving this try on your device…';
    try{if(rec.state!=='inactive')rec.stop();else stopTracks(rec.stream);}catch(e){stopTracks(rec.stream);active=null;record.disabled=false;record.textContent='🎙️ Record my voice';status.textContent='The microphone stopped. You can try again.';}
  }
  async function startRecording(){
    var mine=++generation;record.disabled=true;status.textContent='Opening the microphone…';revoke();
    if(audio){try{audio.pause();audio.src='';}catch(e){}audio=null;}
    play.hidden=true;discard.hidden=true;
    try{
      var stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      if(mine!==generation){stopTracks(stream);return;}
      var chunks=[],rec=new MediaRecorder(stream);rec.stream=stream;active=rec;
      rec.ondataavailable=function(e){if(e.data&&e.data.size)chunks.push(e.data);};
      rec.onerror=function(){if(active===rec)active=null;stopTracks(stream);record.disabled=false;record.textContent='🎙️ Record my voice';status.textContent='The microphone stopped. You can keep learning without voice practice.';};
      rec.onstop=function(){
        clearTimeout(stopTimer);stopTimer=null;stopTracks(stream);if(active===rec)active=null;
        if(mine!==generation)return;
        if(!chunks.length){record.disabled=false;record.textContent='🎙️ Record my voice';status.textContent='No recording was captured. You can try once more.';return;}
        var blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});revoke();activeUrl=URL.createObjectURL(blob);audio=new Audio(activeUrl);
        record.hidden=true;record.disabled=false;play.hidden=false;discard.hidden=false;status.textContent='Ready. Hear your voice, then decide if you want another try.';
      };
      rec.start();record.disabled=false;record.textContent='■ Stop recording';status.textContent='Recording… say it in your own voice.';
      stopTimer=setTimeout(function(){if(active===rec&&rec.state!=='inactive')stopCurrent();},30000);
    }catch(e){if(mine!==generation)return;record.disabled=false;record.textContent='🎙️ Record my voice';status.textContent='Microphone permission is optional. You can keep learning without it.';}
  }
  record.addEventListener('click',function(){if(active&&active.state!=='inactive')stopCurrent();else startRecording();});
  play.addEventListener('click',function(){if(!audio)return;try{audio.currentTime=0;var p=audio.play();status.textContent='Listening to your recording…';audio.onended=function(){status.textContent='Nice listening. Keep it, or try the sentence one more time.';};if(p&&p.catch)p.catch(function(){status.textContent='Playback is unavailable right now. Your lesson is not affected.';});}catch(e){status.textContent='Playback is unavailable right now. Your lesson is not affected.';}});
  discard.addEventListener('click',function(){clearRecording('Ready for another try whenever you are.');});
  box._sakhiVoiceCleanup=function(){clearRecording('');};
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
