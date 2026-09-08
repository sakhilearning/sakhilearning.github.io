(function(){
'use strict';

function phonemeId(value){
  return String(value||'').trim().toLowerCase().replace(/^phoneme_/,'');
}

async function playPurePhoneme(value){
  const id=phonemeId(value);
  if(!id)return;
  try{
    if(window.SpeechService?.stopSpeech)window.SpeechService.stopSpeech();
    if(window.SpeechService?.speakPhoneme){
      await window.SpeechService.speakPhoneme(id);
      return;
    }
  }catch(e){console.warn('Phoneme playback fallback',e);}

  const fallback={m:'mmmm',s:'ssss',f:'ffff',n:'nnnn',l:'llll',r:'rrrr',h:'hhh',t:'t',p:'p',k:'k',b:'b',d:'d',g:'g',a:'aaa',e:'eh',i:'ih',o:'ah',u:'uh'};
  const text=fallback[id]||id;
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.lang='en-US';u.rate=.68;u.pitch=1.0;u.volume=1;
  speechSynthesis.speak(u);
}

// Capture before legacy Sound Garden handlers. Letter buttons must play ONLY the sound.
document.addEventListener('click',function(e){
  const orb=e.target.closest?.('.sound-orb');
  if(orb){
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    playPurePhoneme(orb.dataset.sound);
    document.querySelectorAll('.sound-orb').forEach(b=>b.classList.toggle('playing',b===orb));
    setTimeout(()=>orb.classList.remove('playing'),700);
    return;
  }

  const tile=e.target.closest?.('.tile-sound');
  if(tile){
    const value=phonemeId(tile.dataset.value);
    if(/^[a-z]$/.test(value)){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      playPurePhoneme(value);
    }
    return;
  }

  const playFive=e.target.closest?.('.sound-all');
  if(playFive){
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    (async()=>{
      for(const id of ['m','s','t','p','a']){
        await playPurePhoneme(id);
        await new Promise(r=>setTimeout(r,850));
      }
    })();
  }
},true);

// Expose the corrected behavior for any inline/new callers as well.
window.playLetterSound=playPurePhoneme;
})();
