(function(){
'use strict';
const REGISTRY=Object.freeze({
  t:{phoneme_id:'phoneme_t',grapheme:'t',ipa:'t',audio_asset:'./assets/audio/phonemes/phoneme_t.ogg',validation_status:'SOURCE_VERIFIED',source:'Wikimedia Commons — Voiceless alveolar plosive [t]',license:'CC BY-SA 3.0 / GFDL',notes:'Clean isolated stop source; no schwa fallback.'},
  p:{phoneme_id:'phoneme_p',grapheme:'p',ipa:'p',audio_asset:'./assets/audio/phonemes/phoneme_p.ogg',validation_status:'SOURCE_VERIFIED',source:'Wikimedia Commons — Voiceless bilabial plosive [p]',license:'CC BY-SA 3.0 / GFDL',notes:'Clean isolated stop source; no schwa fallback.'}
});
const REQUIRED=['m','s','t','p','n','k','b','d','g','f','l','r','h','a','e','i','o','u','sh','ch','th','wh','ck','ng'];
let current=null,state='UNINITIALIZED',lastId=null;
function emit(type,detail={}){window.SakhiRuntimeLog?.log?.(type,detail);window.dispatchEvent(new CustomEvent('sakhi-phoneme-state',{detail:{state,...detail}}));}
function stop(){if(current){try{current.pause();current.currentTime=0}catch(_){}current=null}if(state==='PLAYING')state='READY';}
function status(id){const meta=REGISTRY[String(id||'').toLowerCase()];return meta?{...meta,available:true}:{phoneme_id:`phoneme_${id}`,validation_status:'MISSING',available:false}}
async function preload(id){const meta=REGISTRY[String(id||'').toLowerCase()];if(!meta)return false;return new Promise(resolve=>{const a=new Audio();a.preload='auto';a.src=meta.audio_asset;a.oncanplaythrough=()=>resolve(true);a.onerror=()=>resolve(false);a.load()})}
async function play(id){const key=String(id||'').toLowerCase().replace(/^phoneme_/,'').trim(),meta=REGISTRY[key];lastId=key;stop();if(!meta||meta.validation_status!=='SOURCE_VERIFIED'){state='PLAYBACK_ERROR';emit('PHONEME_MISSING',{phoneme_id:`phoneme_${key}`});return false}const a=new Audio(meta.audio_asset);a.preload='auto';current=a;state='PLAYING';emit('PHONEME_AUDIO_STARTED',{phoneme_id:meta.phoneme_id,asset:meta.audio_asset});try{await a.play();return await new Promise(resolve=>{a.onended=()=>{if(current===a)current=null;state='READY';emit('PHONEME_AUDIO_PLAYED',{phoneme_id:meta.phoneme_id});resolve(true)};a.onerror=()=>{if(current===a)current=null;state='PLAYBACK_ERROR';emit('PHONEME_AUDIO_FAILED',{phoneme_id:meta.phoneme_id,reason:'media_error'});resolve(false)}})}catch(e){if(current===a)current=null;state=e?.name==='NotAllowedError'?'BLOCKED_BY_BROWSER':'PLAYBACK_ERROR';emit('PHONEME_AUDIO_FAILED',{phoneme_id:meta.phoneme_id,reason:String(e?.message||e),state});return false}}
function qa(){return REQUIRED.map(id=>status(id))}
window.SAKHI_PHONEME_REGISTRY=REGISTRY;window.SAKHI_PHONEME_AUDIO=Object.freeze(Object.fromEntries(Object.entries(REGISTRY).map(([k,v])=>[k,v.audio_asset])));
window.PhonemeAudioService=Object.freeze({play,preload,stop,status,qa,registry:REGISTRY,required:REQUIRED,getState:()=>state,lastPlayed:()=>lastId,policy:'validated-local-assets-only'});
})();
