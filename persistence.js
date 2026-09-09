(function(){
'use strict';
const CACHE_KEY='rainbowMagicLearningV2';
const cfg=()=>window.RAINBOW_CONFIG||{};
let client=null,learnerId=null,sessionId=null,ready=false,remote=false,syncTimer=null;
function uuid(){return crypto?.randomUUID?crypto.randomUUID():'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&3|8);return v.toString(16)});}
function clone(v){return JSON.parse(JSON.stringify(v||{}));}
function scoreFor(result){return result==='CORRECT'?1:result==='PARTIAL'?.65:.3}
function legacySkillName(skillId,fallback){return Object.entries(window.RainbowCurriculum?.aliases||{}).find(([,id])=>id===skillId)?.[0]||fallback||skillId;}
function normalizeStateText(v){return String(v||'NOT_INTRODUCED').split('_').map(w=>w?`${w[0]}${w.slice(1).toLowerCase()}`:'').join(' ')}
async function init(){
  const c=cfg();
  if(!c.supabaseUrl||!c.supabaseAnonKey||!window.supabase?.createClient){ready=true;return {remote:false,reason:'not_configured'};}
  client=window.supabase.createClient(c.supabaseUrl,c.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const {data:{session}}=await client.auth.getSession();remote=!!session;ready=true;if(remote)await ensureProfile();return {remote};
}
async function signIn(email){if(!client)await init();if(!client)throw new Error('Backend not configured');return client.auth.signInWithOtp({email,options:{emailRedirectTo:location.href}});}
async function signOut(){if(client)await client.auth.signOut();remote=false;learnerId=null;sessionId=null;}
async function ensureProfile(){
  const {data:{user}}=await client.auth.getUser();if(!user)return null;
  let {data,error}=await client.from('learner_profiles').select('*').eq('parent_user_id',user.id).order('created_at',{ascending:true}).limit(1).maybeSingle();
  if(error)throw error;
  if(!data){
    const ins=await client.from('learner_profiles').insert({parent_user_id:user.id,display_name:'Learner',birth_year_or_age:'5',current_grade_level:'Pre-K / Kindergarten',preferred_themes:['unicorn'],typical_session_length:20,curriculum_version:window.RainbowCurriculum?.version||'2026.09.09-v2',adaptive_state:{},domain_levels:{},learning_velocity:0}).select('*').single();
    if(ins.error)throw ins.error;data=ins.data;
  }
  learnerId=data.learner_id;return data;
}
async function getSnapshot(){if(!remote||!learnerId)return null;const r=await client.rpc('get_learner_snapshot',{p_learner_id:learnerId});if(r.error)throw r.error;return r.data;}
function hydrateFromSnapshot(localData,snap){
  if(!snap)return localData;
  const out={...localData};
  const profile=snap.profile||{};
  out.theme=profile.preferred_themes?.[0]||out.theme||'unicorn';
  out.skills={};out.evidence={};
  for(const s of snap.skill_progress||[]){const name=legacySkillName(s.skill_id,s.skill_name),key=`${s.domain}::${name}`;out.skills[key]=normalizeStateText(s.mastery_state);}
  out.activityAttempts=(snap.attempts||[]).map(a=>({...a,score:scoreFor(a.result),completion_instance:a.completion_id||a.attempt_id,save_status:'SAVED',completed_at:a.timestamp}));
  out.questHistory=(snap.attempts||[]).map(a=>{const name=legacySkillName(a.skill_id),key=`${a.domain}::${name}`;(out.evidence[key]||(out.evidence[key]=[])).push({date:a.timestamp?.slice(0,10),score:scoreFor(a.result),activityId:a.activity_id,interaction_type:a.interaction_type,hints:a.hint_level_used,attempts:a.number_of_attempts,independent_success:a.independent_success});return {date:a.timestamp?.slice(0,10),activityId:a.activity_id,score:scoreFor(a.result),interaction_type:a.interaction_type,hints:a.hint_level_used,attempts:a.number_of_attempts,completion_instance:a.completion_id||a.attempt_id};}).slice(-250);
  out.rewardTransactions=(snap.rewards||[]).map(r=>({...r,status:'SAVED'}));
  out.rewardBalances={...(snap.reward_balances||{})};out.shinyStars=Number(out.rewardBalances.MAGIC_STAR||0);
  out.sessionHistory=(snap.sessions||[]).map(s=>({...s}));
  out.settings=snap.settings?{...snap.settings}:out.settings;
  out.curriculumState=snap.curriculum_state||out.curriculumState||null;
  if(profile.adaptive_state&&Object.keys(profile.adaptive_state).length)out.adaptiveProfile=profile.adaptive_state;
  if(profile.last_session_summary)out.lastAdaptiveSummary=profile.last_session_summary;
  const active=(snap.sessions||[]).find(s=>s.status==='IN_PROGRESS'||s.status==='PLANNED');
  if(active){sessionId=active.session_id;out.activeSession={session_id:active.session_id,started_at:active.started_at,completed_at:null,completed_activities:[],skills_practiced:active.skills_practiced||[],reward_transaction_ids:[]};}
  return out;
}
async function hydrate(localData){if(!remote||!learnerId)return localData;return hydrateFromSnapshot(localData,await getSnapshot());}
async function beginSession(data={},requestedId=null){
  if(!remote||!learnerId)return requestedId||null;
  if(sessionId&&(!requestedId||requestedId===sessionId))return sessionId;
  const r=await client.rpc('start_learning_session',{p_learner_id:learnerId,p_session_id:requestedId||null,p_planned_duration:Number(window.SettingsService?.sessionMinutes?.()||data.adaptiveTargetMinutes||20),p_theme_id:window.AdventureService?.worldFor?.({})||data.theme||'meadow',p_curriculum_version:window.RainbowCurriculum?.version||'2026.09.09-v2'});
  if(r.error)throw r.error;sessionId=r.data.session_id;return sessionId;
}
async function completeActivity(result,activity){
  if(!remote||!learnerId)return {saved:false,remote:false};
  const localSession=result.session_id||null,sid=await beginSession(window.data||{},localSession);
  const skillId=result.skill_id||activity.skill_id||window.RainbowCurriculum?.aliases?.[activity.skill]||`${activity.domain}.${String(activity.skill||'skill').toLowerCase().replace(/[^a-z0-9]+/g,'_')}`;
  const completionId=result.completion_instance||result.completion_id||`${sid}:${activity.id}:${result.completed_at||Date.now()}`;
  const r=await client.rpc('complete_activity',{
    p_learner_id:learnerId,p_session_id:sid,p_completion_id:completionId,p_activity_id:activity.id,p_skill_id:skillId,p_domain:activity.domain,
    p_interaction_type:activity.interaction_type||'offline_activity',p_difficulty:Number(activity.difficulty||1),p_expected_answer:activity.correct_answer??null,
    p_response:result.learner_response??{},p_result:result.result||'PARTIAL',p_attempt_number:Number(result.attempts||1),p_hint_level:Number(result.hint_level||0),
    p_independent:!!result.independent_success,p_completion_quality:result.completion_quality??result.score??null,p_curriculum_version:window.RainbowCurriculum?.version||'2026.09.09-v2',
    p_reward_type:'MAGIC_STAR',p_reward_amount:result.completed?1:0,p_reward_reason:'meaningful_activity_completion'
  });
  if(r.error)throw r.error;return {...r.data,saved:true,remote:true,completion_id:completionId};
}
async function saveSettings(settings){if(!remote||!learnerId)return {saved:false,remote:false};const r=await client.rpc('save_learner_settings',{p_learner_id:learnerId,p_settings:{...settings,settings_version:window.SettingsService?.version||'2026.09.09-settings-v3'}});if(r.error)throw r.error;return {saved:true,remote:true,settings:r.data};}
async function completeSession(summary){if(!remote||!learnerId)return {saved:false,remote:false};const sid=summary?.session_id||sessionId;if(!sid)return {saved:false,remote:true,reason:'no_session'};const r=await client.rpc('complete_learning_session',{p_learner_id:learnerId,p_session_id:sid});if(r.error)throw r.error;if(sessionId===sid)sessionId=null;return {saved:true,remote:true,...r.data};}
async function syncSnapshot(data){
  if(!remote||!learnerId)return {saved:false,remote:false};
  const adaptive=data.adaptiveProfile||{},domainLevels={};for(const [domain,x] of Object.entries(adaptive.domains||{}))domainLevels[domain]={difficulty:x.difficulty,current_skill_id:x.current_skill_id,ready_next:x.ready_next,stretch_skill:x.stretch_skill};
  const p=await client.from('learner_profiles').update({preferred_themes:[data.theme||'unicorn'],curriculum_version:window.RainbowCurriculum?.version||'2026.09.09-v2',adaptive_state:adaptive,domain_levels:domainLevels,learning_velocity:Number(adaptive.learningVelocity||0),last_session_summary:adaptive.lastSummary||null}).eq('learner_id',learnerId);if(p.error)throw p.error;
  if(window.SettingsService)await saveSettings(window.SettingsService.all());return {saved:true,remote:true};
}
function queueSync(data){clearTimeout(syncTimer);syncTimer=setTimeout(()=>syncSnapshot(clone(data)).catch(console.warn),700);}
function backendStatus(){return {ready,remote,learnerId,sessionId,configured:!!(cfg().supabaseUrl&&cfg().supabaseAnonKey),source:remote?'SUPABASE':'LOCAL_CACHE_ONLY'};}
window.RainbowPersistence={init,hydrate,hydrateFromSnapshot,getSnapshot,signIn,signOut,ensureProfile,beginSession,completeActivity,saveSettings,completeSession,queueSync,syncSnapshot,backendStatus,uuid,CACHE_KEY};
})();
