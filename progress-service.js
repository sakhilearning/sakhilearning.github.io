(function(){
'use strict';
const backend=window.RainbowPersistence;
if(!backend)throw new Error('persistence.js must load before progress-service.js');
let installed=false;
function installLegacyBridge(){
  if(installed)return;installed=true;
  const basePersist=window.persist;
  if(typeof basePersist==='function')window.persist=function(show=true){const result=basePersist(show);backend.queueSync(window.data||{});return result;};
  const baseRecord=window.recordInteractionEvent;
  if(typeof baseRecord==='function')window.recordInteractionEvent=function(type,extra={}){
    const r=window.interactionRuntime;
    const result=baseRecord(type,extra);
    if(r&&['success','not_yet'].includes(type)){
      const evt={event_id:backend.uuid(),type,attempts:r.attempts,hintLevel:r.hintLevel,elapsed:Math.round((Date.now()-r.startedAt)/1000),timestamp:new Date().toISOString(),...extra};
      backend.appendAttempt(evt,r.activity).catch(e=>console.warn('Progress sync attempt',e));
    }
    return result;
  };
}
async function boot(localState=window.data||{}){
  const status=await backend.init();
  if(status.remote){
    const hydrated=await backend.hydrate(localState);
    for(const key of Object.keys(localState))delete localState[key];Object.assign(localState,hydrated);
    localStorage.setItem(window.STORAGE_KEY||backend.CACHE_KEY,JSON.stringify(localState));
    await backend.syncSnapshot(localState);
  }
  return status;
}
const service=Object.freeze({
  boot,installLegacyBridge,
  signIn:email=>backend.signIn(email),signOut:()=>backend.signOut(),
  sync:state=>backend.syncSnapshot(state||window.data||{}),
  status:()=>backend.backendStatus(),
  uuid:()=>backend.uuid(),
  authoritativeSource:()=>backend.backendStatus().remote?'supabase':'local-cache-until-family-sign-in'
});
window.ProgressService=service;
})();
