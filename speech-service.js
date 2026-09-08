(function(){
'use strict';

const cache=new Map();
let current=null;
let lastRequest=null;
let lastProvider='none';
let audioContext=null;
let contextUnlocked=false;

const profiles={
  sakhi:{rate:.86,pitch:1.06},
  ice:{rate:.82,pitch:1.02},
  ocean:{rate:.88,pitch:1.08},
  book:{rate:.80,pitch:1.0},
  luna:{rate:.9,pitch:1.1}
};

const phonemeFallback={
  m:'mmmm',s:'ssss',f:'ffff',n:'nnnn',l:'llll',r:'rrrr',h:'hhh',
  t:'t',p:'p',k:'k',b:'b',d:'d',g:'g',
  a:'aaa',i:'ih',o:'ah',e:'eh',u:'uh'
};

function ensureAudioContext(){
  if(audioContext)return audioContext;
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx)return null;
  try{audioContext=new Ctx();}catch(_){audioContext=null;}
  return audioContext;
}

async function unlockAudio(){
  const ctx=ensureAudioContext();
  if(ctx&&ctx.state==='suspended'){
    try{await ctx.resume();}catch(_){}
  }
  contextUnlocked=!!ctx&&ctx.state==='running';
  return contextUnlocked;
}

['pointerdown','touchstart','keydown'].forEach(type=>{
  document.addEventListener(type,()=>{unlockAudio();},{capture:true,passive:true,once:true});
});

function stopSpeech(){
  try{window.speechSynthesis?.cancel();}catch(_){}
  if(current?.stop){try{current.stop();}catch(_){}}
  if(current instanceof HTMLAudioElement){
    try{current.pause();current.currentTime=0;}catch(_){}
  }
  current=null;
}

function selectBrowserVoice(){
  const voices=window.speechSynthesis?.getVoices?.()||[];
  return voices.find(v=>/samantha|ava|allison|victoria|serena|karen|female/i.test(v.name)&&/^en/i.test(v.lang))
    ||voices.find(v=>/^en/i.test(v.lang));
}

function browserSpeak(text,profile='sakhi'){
  if(!text||!('speechSynthesis' in window))return Promise.resolve(false);
  stopSpeech();
  lastProvider='browser-fallback';
  return new Promise(resolve=>{
    const u=new SpeechSynthesisUtterance(text);
    const p=profiles[profile]||profiles.sakhi;
    u.lang='en-US';u.rate=p.rate;u.pitch=p.pitch;u.volume=1;
    const preferred=selectBrowserVoice();if(preferred)u.voice=preferred;
    u.onend=()=>{current=null;resolve(true)};
    u.onerror=()=>{current=null;resolve(false)};
    current=u;
    window.speechSynthesis.speak(u);
  });
}

async function fetchNeural(text,kind,profile){
  const cfg=window.RAINBOW_CONFIG||{};
  if(!cfg.ttsEndpoint||!cfg.supabaseAnonKey)return null;
  const key=`${profile}|${kind}|${text}`;
  if(cache.has(key))return cache.get(key);

  const r=await fetch(cfg.ttsEndpoint,{
    method:'POST',
    headers:{
      'content-type':'application/json',
      'apikey':cfg.supabaseAnonKey,
      'x-client-info':'sakhi-magic-learning/1'
    },
    body:JSON.stringify({text,kind,profile})
  });
  if(!r.ok){
    let detail='';try{detail=await r.text();}catch(_){}
    throw new Error(`Sakhi neural TTS failed (${r.status}) ${detail.slice(0,160)}`);
  }
  const type=r.headers.get('content-type')||'';
  if(!type.includes('audio/'))throw new Error(`Sakhi neural TTS returned ${type||'unknown content type'}`);
  const blob=await r.blob();
  if(blob.size<500)throw new Error('Sakhi neural TTS returned an unexpectedly small audio response');
  cache.set(key,blob);
  return blob;
}

async function playBlob(blob){
  stopSpeech();
  const ctx=ensureAudioContext();
  if(ctx){
    try{
      if(ctx.state==='suspended'&&contextUnlocked)await ctx.resume();
      const bytes=await blob.arrayBuffer();
      const buffer=await ctx.decodeAudioData(bytes.slice(0));
      const source=ctx.createBufferSource();
      source.buffer=buffer;
      source.connect(ctx.destination);
      current=source;
      return await new Promise((resolve,reject)=>{
        source.onended=()=>{if(current===source)current=null;resolve(true)};
        try{source.start(0);}catch(e){reject(e);}
      });
    }catch(e){
      console.warn('WebAudio playback fallback',e);
    }
  }

  const url=URL.createObjectURL(blob);
  const a=new Audio(url);
  a.preload='auto';
  current=a;
  try{
    await a.play();
    return await new Promise(resolve=>{
      a.onended=()=>{URL.revokeObjectURL(url);if(current===a)current=null;resolve(true)};
      a.onerror=()=>{URL.revokeObjectURL(url);if(current===a)current=null;resolve(false)};
    });
  }catch(e){
    URL.revokeObjectURL(url);
    if(current===a)current=null;
    throw e;
  }
}

async function speak(text,{kind='instruction',profile='sakhi'}={}){
  text=String(text||'').trim();
  if(!text)return false;
  lastRequest={text,kind,profile};
  stopSpeech();
  try{
    const blob=await fetchNeural(text,kind,profile);
    if(blob){
      lastProvider='elevenlabs';
      await playBlob(blob);
      return true;
    }
  }catch(e){
    console.error('Sakhi neural audio error',e);
  }
  return browserSpeak(text,profile);
}

async function speakPhoneme(id){
  const clean=String(id||'').toLowerCase().replace(/^phoneme_/,'').trim();
  if(!clean)return false;
  const assets=window.SAKHI_PHONEME_AUDIO||{};
  const src=assets[id]||assets[clean];
  lastRequest={phoneme:clean};
  stopSpeech();

  if(src){
    lastProvider='validated-phoneme';
    const a=new Audio(src);current=a;
    try{await a.play();return true;}catch(e){console.error('Validated phoneme playback failed',e);return false;}
  }

  // Isolated phonemes intentionally do not use ElevenLabs TTS.
  // A validated prerecorded phoneme library is the authoritative final source.
  // Browser synthesis is only a temporary fallback until that library is populated.
  return browserSpeak(phonemeFallback[clean]||clean,'sakhi');
}

function repeatSpeech(){
  if(!lastRequest)return Promise.resolve(false);
  if(lastRequest.phoneme)return speakPhoneme(lastRequest.phoneme);
  return speak(lastRequest.text,{kind:lastRequest.kind,profile:lastRequest.profile});
}
function pause(){if(current instanceof HTMLAudioElement)current.pause();else try{window.speechSynthesis?.pause();}catch(_){}}
function resume(){if(current instanceof HTMLAudioElement)return current.play();try{window.speechSynthesis?.resume();}catch(_){}return Promise.resolve();}
function getStatus(){return {provider:lastProvider,audioContext:audioContext?.state||'unavailable',neuralConfigured:!!window.RAINBOW_CONFIG?.ttsEndpoint};}

window.SpeechService={
  speakInstruction:(t,p='sakhi')=>speak(t,{kind:'instruction',profile:p}),
  speakCharacter:(t,p='sakhi')=>speak(t,{kind:'character',profile:p}),
  speakPhoneme,
  speakWord:(t,p='sakhi')=>speak(t,{kind:'word',profile:p}),
  speakStory:(t,p='book')=>speak(t,{kind:'story',profile:p}),
  speakFeedback:(t,p='sakhi')=>speak(t,{kind:'feedback',profile:p}),
  stopSpeech,repeatSpeech,pause,resume,speak,unlockAudio,getStatus
};
})();