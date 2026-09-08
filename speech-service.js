(function(){
'use strict';

const cache=new Map();
let current=null,lastRequest=null,lastProvider='none',audioContext=null,contextUnlocked=false;
const profiles={sakhi:{rate:.86,pitch:1.06},ice:{rate:.82,pitch:1.02},ocean:{rate:.88,pitch:1.08},book:{rate:.80,pitch:1},luna:{rate:.9,pitch:1.1}};

function normalizeNarration(text){
 let s=String(text||'').trim();
 if(!s)return s;
 s=s.replace(/\bMmmmoon\b/gi,'Moon').replace(/\bSsssun\b/gi,'Sun');
 s=s.replace(/\bmmm\b/gi,'the m sound').replace(/\bsss\b/gi,'the s sound').replace(/\baaa\b/gi,'the short a sound');
 s=s.replace(/\/([a-z])\//gi,(_,p)=>`the ${p.toLowerCase()} sound`);
 s=s.replace(/\bthe ([a-z]) sound sound\b/gi,'the $1 sound');
 return s.replace(/\s+/g,' ');
}
function ensureAudioContext(){if(audioContext)return audioContext;const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;try{audioContext=new Ctx()}catch(_){audioContext=null}return audioContext}
async function unlockAudio(){const ctx=ensureAudioContext();if(ctx&&ctx.state==='suspended'){try{await ctx.resume()}catch(_){}}contextUnlocked=!!ctx&&ctx.state==='running';return contextUnlocked}
['pointerdown','touchstart','keydown'].forEach(t=>document.addEventListener(t,()=>unlockAudio(),{capture:true,passive:true,once:true}));
function stopSpeech(){try{window.speechSynthesis?.cancel()}catch(_){}if(current?.stop){try{current.stop()}catch(_){}}if(current instanceof HTMLAudioElement){try{current.pause();current.currentTime=0}catch(_){}}current=null}
function selectBrowserVoice(){const v=window.speechSynthesis?.getVoices?.()||[];return v.find(x=>/samantha|ava|allison|victoria|serena|karen|female/i.test(x.name)&&/^en/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))}
function browserSpeak(text,profile='sakhi'){if(!text||!('speechSynthesis'in window))return Promise.resolve(false);stopSpeech();lastProvider='browser-emergency-fallback';return new Promise(resolve=>{const u=new SpeechSynthesisUtterance(text),p=profiles[profile]||profiles.sakhi;u.lang='en-US';u.rate=p.rate;u.pitch=p.pitch;u.volume=1;const voice=selectBrowserVoice();if(voice)u.voice=voice;u.onend=()=>{current=null;resolve(true)};u.onerror=()=>{current=null;resolve(false)};current=u;window.speechSynthesis.speak(u)})}
async function fetchNeural(text,kind,profile){const cfg=window.RAINBOW_CONFIG||{};if(!cfg.ttsEndpoint||!cfg.supabaseAnonKey)throw new Error('Sakhi TTS is not configured');const key=`${profile}|${kind}|${text}`;if(cache.has(key))return cache.get(key);const r=await fetch(cfg.ttsEndpoint,{method:'POST',headers:{'content-type':'application/json','apikey':cfg.supabaseAnonKey,'x-client-info':'sakhi-magic-learning/3'},body:JSON.stringify({text,kind,profile})});if(!r.ok){let detail='';try{detail=await r.text()}catch(_){}throw new Error(`Sakhi TTS failed (${r.status}) ${detail.slice(0,180)}`)}const type=r.headers.get('content-type')||'';if(!type.includes('audio/'))throw new Error(`Sakhi TTS returned ${type||'unknown content type'}`);const blob=await r.blob();if(blob.size<500)throw new Error('Sakhi TTS returned too little audio');cache.set(key,blob);return blob}
async function playBlob(blob){stopSpeech();const ctx=ensureAudioContext();if(ctx){try{if(ctx.state==='suspended')await ctx.resume();const bytes=await blob.arrayBuffer(),buffer=await ctx.decodeAudioData(bytes.slice(0)),source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);current=source;return await new Promise((resolve,reject)=>{source.onended=()=>{if(current===source)current=null;resolve(true)};try{source.start(0)}catch(e){reject(e)}})}catch(e){console.warn('WebAudio playback fallback',e)}}const url=URL.createObjectURL(blob),a=new Audio(url);a.preload='auto';current=a;try{await a.play();return await new Promise(resolve=>{a.onended=()=>{URL.revokeObjectURL(url);if(current===a)current=null;resolve(true)};a.onerror=()=>{URL.revokeObjectURL(url);if(current===a)current=null;resolve(false)}})}catch(e){URL.revokeObjectURL(url);if(current===a)current=null;throw e}}
async function neuralSpeak(text,kind='instruction',profile='sakhi'){text=String(text||'').trim();if(!text)return false;lastRequest={text,kind,profile};stopSpeech();try{const blob=await fetchNeural(text,kind,profile);lastProvider=kind==='phoneme'?'elevenlabs-phoneme':'elevenlabs';await playBlob(blob);return true}catch(e){console.error('Sakhi neural audio error',e);lastProvider='error';return false}}
async function speak(text,{kind='instruction',profile='sakhi'}={}){const clean=kind==='phoneme'?String(text||'').trim():normalizeNarration(text);const ok=await neuralSpeak(clean,kind,profile);return ok?true:browserSpeak(clean,profile)}
async function speakPhoneme(id){const clean=String(id||'').toLowerCase().replace(/^phoneme_/,'').trim();if(!clean)return false;lastRequest={phoneme:clean};const ok=await neuralSpeak(clean,'phoneme','sakhi');if(!ok){lastProvider='phoneme-unavailable';window.dispatchEvent(new CustomEvent('sakhi-audio-error',{detail:{kind:'phoneme',id:clean}}));return false}return true}
function repeatSpeech(){if(!lastRequest)return Promise.resolve(false);if(lastRequest.phoneme)return speakPhoneme(lastRequest.phoneme);return speak(lastRequest.text,{kind:lastRequest.kind,profile:lastRequest.profile})}
function pause(){if(current instanceof HTMLAudioElement)current.pause();else try{window.speechSynthesis?.pause()}catch(_){}}
function resume(){if(current instanceof HTMLAudioElement)return current.play();try{window.speechSynthesis?.resume()}catch(_){}return Promise.resolve()}
function getStatus(){return{provider:lastProvider,audioContext:audioContext?.state||'unavailable',neuralConfigured:!!window.RAINBOW_CONFIG?.ttsEndpoint,architecture:'single-service-v3'}}
window.SpeechService={speakInstruction:(t,p='sakhi')=>speak(t,{kind:'instruction',profile:p}),speakCharacter:(t,p='sakhi')=>speak(t,{kind:'character',profile:p}),speakPhoneme,speakWord:(t,p='sakhi')=>speak(t,{kind:'word',profile:p}),speakStory:(t,p='book')=>speak(t,{kind:'story',profile:p}),speakFeedback:(t,p='sakhi')=>speak(t,{kind:'feedback',profile:p}),stopSpeech,repeatSpeech,pause,resume,speak,unlockAudio,getStatus,normalizeNarration};
})();