(function(){
'use strict';
const backend=window.RainbowPersistence;if(!backend)throw new Error('persistence.js must load before progress-service.js');
const pending=new Map();
function now(){return new Date().toISOString();}
function localPersist(){try{window.persist?.(false)}catch(e){console.warn('local cache persist',e)}}
function ensureState(){const d=window.data||{};d.activityAttempts=d.activityAttempts||[];d.rewardTransactions=d.rewardTransactions||[];d.sessionHistory=d.sessionHistory||[];d.activeSession=d.activeSession||null;return d;}
function emitReady(detail){window.dispatchEvent(new CustomEvent('sakhi-progress-ready',{detail}));}
async function boot(localState=window.data||{}){
  const status=await backend.init();
  if(status.remote){const hydrated=await backend.hydrate(localState);for(const key of Object.keys(localState))delete localState[key];Object.assign(localState,hydrated);localStorage.setItem(window.STORAGE_KEY||backend.CACHE_KEY,JSON.stringify(localState));window.RewardService?.recalculate?.();}
  emitReady(status);return status;
}
function beginLocalSession(){const d=ensureState();if(d.activeSession&&!d.activeSession.completed_at)return d.activeSession;d.activeSession={session_id:backend.uuid(),started_at:now(),completed_at:null,completed_activities:[],skills_practiced:[],reward_transaction_ids:[],save_status:backend.backendStatus().remote?'PENDING_REMOTE':'LOCAL_CACHE_ONLY'};localPersist();return d.activeSession;}
function resultKey(result){return result.completion_instance||`${result.session_id||beginLocalSession().session_id}:${result.activity_id}`;}
function applyRemoteCompletion(d,result,activity,key,authoritative){
  const rec=d.activityAttempts.find(x=>x.completion_instance===key);if(rec){rec.save_status='SAVED';rec.saved_at=now();rec.remote=true;rec.authoritative=authoritative;}
  if(result.source==='quest'){d.questResults=d.questResults||{};d.questResults[activity.id]=result.score;const exists=(d.questHistory||[]).some(x=>x.completion_instance===key);if(!exists){d.questHistory=d.questHistory||[];d.questHistory.push({date:(result.completed_at||now()).slice(0,10),activityId:activity.id,score:result.score,interaction_type:activity.interaction_type,hints:result.hint_level,attempts:result.attempts,completion_instance:key});d.questHistory=d.questHistory.slice(-250);}}
  const session=beginLocalSession();if(!session.completed_activities.includes(activity.id))session.completed_activities.push(activity.id);if(!session.skills_practiced.includes(result.skill_id))session.skills_practiced.push(result.skill_id);
  if(authoritative?.new_mastery_state&&activity.skill){d.skills=d.skills||{};d.skills[`${activity.domain}::${activity.skill}`]=String(authoritative.new_mastery_state).split('_').map(w=>w?`${w[0]}${w.slice(1).toLowerCase()}`:'').join(' ');}
  if(authoritative?.reward_balance!=null){d.rewardBalances=d.rewardBalances||{};d.rewardBalances.MAGIC_STAR=Number(authoritative.reward_balance||0);d.shinyStars=d.rewardBalances.MAGIC_STAR;}
}
async function refreshAuthoritative(){const d=ensureState(),status=backend.backendStatus();if(!status.remote)return {saved:false,remote:false};const hydrated=await backend.hydrate(d);for(const key of Object.keys(d))delete d[key];Object.assign(d,hydrated);localPersist();window.RewardService?.recalculate?.();window.dispatchEvent(new CustomEvent('sakhi-progress-hydrated'));return {saved:true,remote:true};}
async function saveAttempt(result,activity){
  const key=resultKey(result);if(pending.has(key))return pending.get(key);
  const task=(async()=>{const d=ensureState();const existing=d.activityAttempts.find(x=>x.completion_instance===key&&x.save_status==='SAVED');if(existing)return {saved:true,duplicate:true,key,reward:null,authoritative:existing.authoritative||null};
    const rec={...result,attempt_id:result.attempt_id||backend.uuid(),completion_instance:key,save_status:'SAVING',updated_at:now()};d.activityAttempts.push(rec);d.activityAttempts=d.activityAttempts.slice(-300);localPersist();window.SakhiRuntimeLog?.log('ATTEMPT_SAVE_STARTED',{activity_id:activity.id,attempt_id:rec.attempt_id});
    try{
      if(!backend.backendStatus().remote){rec.save_status='RETRY_NEEDED';rec.error='Cloud Progress is not connected';localPersist();window.SakhiRuntimeLog?.log('ATTEMPT_SAVE_FAILED',{activity_id:activity.id,error:rec.error});return {saved:false,key,offline:true,error:new Error(rec.error)};}
      const session=beginLocalSession();result.session_id=session.session_id;const authoritative=await backend.completeActivity(result,activity);applyRemoteCompletion(d,result,activity,key,authoritative);localPersist();
      await refreshAuthoritative();window.SakhiRuntimeLog?.log('ATTEMPT_SAVE_SUCCESS',{activity_id:activity.id,attempt_id:rec.attempt_id,remote:true});window.SakhiRuntimeLog?.log('MASTERY_UPDATED',{activity_id:activity.id,skill_id:result.skill_id,state:authoritative.new_mastery_state});
      const reward=authoritative.reward_awarded?{reward_type:'MAGIC_STAR',amount:1,balance:authoritative.reward_balance}:null;return {saved:true,remote:true,key,reward,authoritative};
    }catch(error){rec.save_status='RETRY_NEEDED';rec.error=String(error?.message||error);localPersist();window.SakhiRuntimeLog?.log('ATTEMPT_SAVE_FAILED',{activity_id:activity.id,error:rec.error});return {saved:false,key,error};}
    finally{pending.delete(key);}
  })();pending.set(key,task);return task;
}
async function completeSession(){const d=ensureState(),s=d.activeSession;if(!s)return {saved:false,reason:'no_session'};if(s.completed_at)return {saved:true,duplicate:true};if(!backend.backendStatus().remote)return {saved:false,offline:true,reason:'cloud_not_connected'};try{const remoteResult=await backend.completeSession(s);s.completed_at=remoteResult.completed_at||now();s.duration=Number(remoteResult.actual_duration||0)*60;s.save_status='SAVED';d.sessionHistory.push({...s});d.sessionHistory=d.sessionHistory.slice(-60);d.activeSession=null;localPersist();await refreshAuthoritative();return {saved:true,remote:true,...remoteResult};}catch(error){s.save_status='RETRY_NEEDED';localPersist();return {saved:false,error};}}
async function retryPending(){const d=ensureState();if(!backend.backendStatus().remote)return 0;const items=d.activityAttempts.filter(x=>x.save_status==='RETRY_NEEDED');for(const x of [...items]){const a=(window.activities||[]).find(v=>v.id===x.activity_id);if(a)await saveAttempt({...x,completion_instance:x.completion_instance},a);}return items.length;}
async function saveSettings(settings){const result=await backend.saveSettings(settings);if(result.saved)window.dispatchEvent(new CustomEvent('sakhi-settings-remote-saved',{detail:result.settings}));return result;}
const service=Object.freeze({boot,beginLocalSession,saveAttempt,completeSession,retryPending,refreshAuthoritative,saveSettings,signIn:email=>backend.signIn(email),signOut:()=>backend.signOut(),sync:state=>backend.syncSnapshot(state||window.data||{}),status:()=>backend.backendStatus(),uuid:()=>backend.uuid(),authoritativeSource:()=>backend.backendStatus().remote?'SUPABASE':'LOCAL_CACHE_ONLY'});
window.ProgressService=service;
})();
