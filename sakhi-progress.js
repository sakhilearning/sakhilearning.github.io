/* Sakhi progress, mastery, plan state and reward ledger.
 *
 * LEARNING INVARIANT: completeActivity() is the only function that persists
 * learning evidence, placement credit, mastery, review scheduling and rewards.
 * Profile/settings/session lifecycle may persist separately, but may not change
 * skill evidence or mastery.
 */
window.SakhiProgress = (function(){
  'use strict';

  var LOCAL_KEY='sakhi.learner.state';
  var Cloud=window.SakhiCloud;
  var STATES=['NOT_INTRODUCED','INTRODUCED','LEARNING','DEVELOPING','MOSTLY_MASTERED','MASTERED','REVIEW_NEEDED'];
  var DEFAULT_CRITERIA={min_attempts:4,target_accuracy:.8,independent_evidence:3,multi_session:true};
  var DEFAULT_REVIEW={learning_days:1,developing_days:3,mostly_mastered_days:7,mastered_days:18};
  var state=null;

  function nowIso(){return new Date().toISOString();}
  function today(){return nowIso().slice(0,10);}
  function uuid(){return Cloud?Cloud.uuid():String(Date.now())+Math.random();}
  function activeVersion(){return window.SakhiCurriculum?window.SakhiCurriculum.ACTIVE_VERSION:null;}

  function blank(){return{
    learner_id:uuid(),curriculum_version:activeVersion(),
    profile:{display_name:'Sakhi',active_theme:'unicorn_meadow',typical_session_length:30,voice_enabled:true,movement_breaks:true,reduced_motion:false},
    skills:{},sessions:[],attempts:[],rewards:[],review:{},placement:null,
    plan:{completed_day_ids:[],last_completed_day_id:null},updated_at:nowIso()
  };}

  function load(){
    if(state)return state;
    var raw=null;try{raw=JSON.parse(localStorage.getItem(LOCAL_KEY)||'null');}catch(e){}
    state=Object.assign(blank(),raw||{});
    ['sessions','attempts','rewards'].forEach(function(k){if(!Array.isArray(state[k]))state[k]=[];});
    ['skills','review','profile','plan'].forEach(function(k){if(!state[k]||typeof state[k]!=='object')state[k]=blank()[k];});
    if(!Array.isArray(state.plan.completed_day_ids))state.plan.completed_day_ids=[];
    state.profile=Object.assign(blank().profile,state.profile||{});
    /* Evidence survives curriculum upgrades by stable skill_id. New V3 skills
       begin untouched; old skill evidence is not erased. */
    state.curriculum_version=activeVersion()||state.curriculum_version;
    return state;
  }

  function persistLocal(){state.updated_at=nowIso();try{localStorage.setItem(LOCAL_KEY,JSON.stringify(state));}catch(e){console.warn('[SakhiProgress] local persist failed',e);}}

  function freshEvidence(skillId){return{skill_id:skillId,mastery_state:'NOT_INTRODUCED',mastery_score:0,attempt_count:0,independent_correct_count:0,hinted_correct_count:0,incorrect_count:0,independent_accuracy:0,sessions_seen:[],last_practiced_at:null,last_mastered_at:null,consecutive_successful_sessions:0,consecutive_struggle_sessions:0,difficulty_level:1,placement_credited:false};}
  function evidence(skillId){var s=load();return s.skills[skillId]?JSON.parse(JSON.stringify(s.skills[skillId])):freshEvidence(skillId);}
  function masteryOf(skillId){var s=load();return s.skills[skillId]?s.skills[skillId].mastery_state:'NOT_INTRODUCED';}
  function bandFor(skillId){var e=load().skills[skillId]||freshEvidence(skillId);return Math.max(1,Math.min(5,e.difficulty_level||1));}
  function criteriaFor(skillId){var sk=window.SakhiCurriculum&&window.SakhiCurriculum.skill(skillId);return Object.assign({},DEFAULT_CRITERIA,(sk&&sk.mastery_criteria)||{});}
  function reviewPolicyFor(skillId){var sk=window.SakhiCurriculum&&window.SakhiCurriculum.skill(skillId);return Object.assign({},DEFAULT_REVIEW,(sk&&sk.review_policy)||{});}

  function recomputeRecord(e,skillId){
    var c=criteriaFor(skillId),total=e.attempt_count||0;
    if(!total){e.mastery_state='NOT_INTRODUCED';e.mastery_score=0;return e;}
    var weighted=e.independent_correct_count+(e.hinted_correct_count*.5),acc=weighted/total;
    e.independent_accuracy=total?e.independent_correct_count/total:0;e.mastery_score=Math.round(Math.min(1,acc)*10000)/10000;
    var enoughAttempts=total>=c.min_attempts,enoughIndependent=e.independent_correct_count>=c.independent_evidence,multiOk=!c.multi_session||(e.sessions_seen||[]).length>=2,hits=acc>=c.target_accuracy;
    if(enoughAttempts&&enoughIndependent&&hits&&multiOk)e.mastery_state='MASTERED';
    else if(enoughIndependent&&hits)e.mastery_state='MOSTLY_MASTERED';
    else if(acc>=.6&&total>=2)e.mastery_state='DEVELOPING';
    else e.mastery_state='LEARNING';
    if(e.consecutive_struggle_sessions>=2&&(e.mastery_state==='MASTERED'||e.mastery_state==='MOSTLY_MASTERED'))e.mastery_state='REVIEW_NEEDED';
    if(e.mastery_state==='MASTERED'&&!e.last_mastered_at)e.last_mastered_at=nowIso();
    return e;
  }
  /* Public for inspection/tests; durable writes still happen only in completeActivity. */
  function recompute(skillId){return recomputeRecord(evidence(skillId),skillId);}

  function dueForRecord(e,skillId,baseMs){
    var p=reviewPolicyFor(skillId),days;
    switch(e.mastery_state){case'MASTERED':days=p.mastered_days;break;case'MOSTLY_MASTERED':days=p.mostly_mastered_days;break;case'DEVELOPING':days=p.developing_days;break;case'REVIEW_NEEDED':days=0;break;default:days=p.learning_days;}
    return new Date((baseMs||Date.now())+days*86400000).toISOString();
  }
  function scheduleReview(skillId){return dueForRecord(evidence(skillId),skillId);}
  function reviewDue(){var s=load(),now=Date.now(),out=[];Object.keys(s.review).forEach(function(k){if(new Date(s.review[k]).getTime()<=now&&masteryOf(k)!=='NOT_INTRODUCED')out.push(k);});return out;}

  function balances(){return load().rewards.reduce(function(m,t){m[t.reward_key]=(m[t.reward_key]||0)+(t.amount||0);return m;},{});}
  function issueRewardInto(s,txn){var dupe=s.rewards.some(function(r){return r.transaction_id===txn.transaction_id||(txn.attempt_id&&r.attempt_id===txn.attempt_id&&r.reward_key===txn.reward_key);});if(dupe)return null;s.rewards.push(txn);return txn;}


  function sessionCloudRow(x){return{
    session_id:x.session_id,learner_id:x.learner_id,started_at:x.started_at,completed_at:x.completed_at||null,duration:x.duration||null,
    theme:x.theme||null,curriculum_version:x.curriculum_version,skills_practiced:x.skills_practiced||[],skills_introduced:x.skills_introduced||[],
    activities_completed:x.activities_completed||0,reward_earned:x.reward_earned||null,overall_engagement:x.overall_engagement||null,session_summary:x.session_summary||null,
    plan_day_id:x.plan_day_id||null,week:x.week||null,planned_blocks:x.planned_blocks||[],status:x.status||null,last_activity_at:x.last_activity_at||null
  };}
  function profileCloudRow(s,parentId){return{
    learner_id:s.learner_id,parent_user_id:parentId,display_name:s.profile.display_name||'Learner',typical_session_length:s.profile.typical_session_length||30,
    curriculum_version:s.curriculum_version,active_theme:s.profile.active_theme||'unicorn_meadow',adaptive_state:s.placement||{},plan_state:s.plan||{},
    settings:{voice_enabled:s.profile.voice_enabled!==false,movement_breaks:s.profile.movement_breaks!==false,reduced_motion:!!s.profile.reduced_motion},
    weekly_report_enabled:!!s.profile.weekly_report_enabled,weekly_report_email:s.profile.weekly_report_email||null,last_activity_at:s.updated_at||nowIso()
  };}
  function skillCloudRow(learnerId,skillId,e){var sk=window.SakhiCurriculum&&window.SakhiCurriculum.skill(skillId);return{
    learner_id:learnerId,skill_id:skillId,domain:sk?sk.domain_id:String(skillId).split('.')[0],subdomain:sk?sk.strand_id:null,skill_name:sk?sk.title:skillId,
    skill_level:sk?sk.difficulty_level:1,mastery_state:e.mastery_state,mastery_score:e.mastery_score||0,independent_accuracy:e.independent_accuracy||0,
    attempt_count:e.attempt_count||0,independent_correct_count:e.independent_correct_count||0,hinted_correct_count:e.hinted_correct_count||0,incorrect_count:e.incorrect_count||0,
    last_practiced_at:e.last_practiced_at||null,last_mastered_at:e.last_mastered_at||null,next_review_at:load().review[skillId]||null,difficulty_level:e.difficulty_level||1,
    consecutive_successful_sessions:e.consecutive_successful_sessions||0,consecutive_struggle_sessions:e.consecutive_struggle_sessions||0
  };}
  function remoteEvidence(row){var e=freshEvidence(row.skill_id);Object.keys(e).forEach(function(k){if(row[k]!==undefined&&row[k]!==null)e[k]=row[k];});
    e.mastery_state=row.mastery_state||e.mastery_state;e.mastery_score=Number(row.mastery_score)||0;e.independent_accuracy=Number(row.independent_accuracy)||0;
    e.attempt_count=row.attempt_count||0;e.independent_correct_count=row.independent_correct_count||0;e.hinted_correct_count=row.hinted_correct_count||0;e.incorrect_count=row.incorrect_count||0;
    e.last_practiced_at=row.last_practiced_at||null;e.last_mastered_at=row.last_mastered_at||null;e.difficulty_level=row.difficulty_level||1;
    e.consecutive_successful_sessions=row.consecutive_successful_sessions||0;e.consecutive_struggle_sessions=row.consecutive_struggle_sessions||0;return e;}
  function chooseEvidence(a,b){if(!a)return b;if(!b)return a;if((b.attempt_count||0)>(a.attempt_count||0))return b;if((b.attempt_count||0)<(a.attempt_count||0))return a;
    return new Date(b.last_practiced_at||0).getTime()>new Date(a.last_practiced_at||0).getTime()?b:a;}

  function prerequisiteClosure(skillId){
    var C=window.SakhiCurriculum,seen={},out=[];
    (function walk(id){(C?C.prerequisites(id):[]).forEach(function(p){if(seen[p])return;seen[p]=true;out.push(p);walk(p);});})(skillId);return out;
  }
  function rank(m){var order=['NOT_INTRODUCED','INTRODUCED','LEARNING','DEVELOPING','MOSTLY_MASTERED','MASTERED'];return order.indexOf(m);}

  function completeActivity(result){
    var s=load(),act=result.activity,skillId=act.skill_id,theme=window.SakhiThemes?window.SakhiThemes.get(result.themeId):null,stamp=nowIso();
    var attempts=result.answers.map(function(a){var q=act.questions[a.questionIndex]||{};return{
      attempt_id:a.attempt_id||uuid(),learner_id:s.learner_id,session_id:result.sessionId||null,activity_id:act.activity_id,domain:act.domain_id,skill_id:skillId,
      interaction_type:q.template||'choice',difficulty:act.band,curriculum_level:act.band,question_or_task_id:act.activity_id+':q'+a.questionIndex,
      expected_answer:q.answer,learner_response:a.response,result:a.correct?'CORRECT':'INCORRECT',independent_success:!!a.correct&&!a.hintsUsed,hint_level_used:a.hintsUsed||0,
      number_of_attempts:a.tries||1,response_time_ms:a.responseMs||null,completed:true,challenge_mode:act.band>=5,timestamp:stamp,curriculum_version:s.curriculum_version
    };});
    if(!attempts.length)throw new Error('Cannot complete an activity with no answers.');
    var correct=attempts.filter(function(a){return a.result==='CORRECT';}).length,independent=attempts.filter(function(a){return a.independent_success;}).length,hinted=correct-independent,wrong=attempts.length-correct,accuracy=correct/attempts.length;

    /* Stage into a deep copy. A thrown error before assignment leaves state intact. */
    var staged=JSON.parse(JSON.stringify(s));
    var e=staged.skills[skillId]||freshEvidence(skillId);staged.skills[skillId]=e;
    e.attempt_count+=attempts.length;e.independent_correct_count+=independent;e.hinted_correct_count+=hinted;e.incorrect_count+=wrong;e.last_practiced_at=stamp;e.sessions_seen=e.sessions_seen||[];
    if(result.sessionId&&e.sessions_seen.indexOf(result.sessionId)===-1)e.sessions_seen.push(result.sessionId);
    if(accuracy>=.8){e.consecutive_successful_sessions++;e.consecutive_struggle_sessions=0;}else if(accuracy<.5){e.consecutive_struggle_sessions++;e.consecutive_successful_sessions=0;}
    if(accuracy===1&&independent===attempts.length&&e.difficulty_level<5)e.difficulty_level++;else if(accuracy<.5&&e.difficulty_level>1)e.difficulty_level--;
    recomputeRecord(e,skillId);
    var due=dueForRecord(e,skillId);staged.review[skillId]=due;

    /* Placement credits are learning evidence, so they are committed here, not
       by the adaptive planner. Credits are explicitly marked as inferred from a
       successful independent probe rather than as directly taught attempts. */
    var placementResult=null;
    if(result.placementProbe){
      var p=staged.placement||{complete:false,probes:[],started_at:stamp};
      var passed=accuracy>=.8,independentPass=passed&&independent===attempts.length,credited=[];
      if(passed){
        prerequisiteClosure(skillId).forEach(function(id){
          var pe=staged.skills[id]||freshEvidence(id);staged.skills[id]=pe;
          var target=independentPass?'MOSTLY_MASTERED':'DEVELOPING';
          if(rank(pe.mastery_state)<rank(target)){pe.mastery_state=target;pe.mastery_score=independentPass?.85:.7;pe.difficulty_level=Math.max(pe.difficulty_level,3);pe.placement_credited=true;credited.push(id);}
        });
        e.difficulty_level=Math.max(e.difficulty_level,independentPass?4:3);
      }
      if(!p.probes.some(function(x){return x.activity_id===act.activity_id;}))p.probes.push({activity_id:act.activity_id,skill_id:skillId,accuracy:accuracy,passed:passed,independent:independentPass,credited:credited,at:stamp});
      var limit=window.SakhiAdaptive?window.SakhiAdaptive.PROBE_LIMIT:4;
      if(p.probes.length>=limit){p.complete=true;p.completed_at=stamp;}
      staged.placement=p;placementResult={passed:passed,credited:credited,complete:!!p.complete};
    }

    staged.attempts=staged.attempts.concat(attempts).slice(-800);
    var issued=[],primary=theme?theme.rewards.primary:{key:'magic_stars',label:'Magic Stars'},badge=theme?theme.rewards.badge:{key:'trail_badges',label:'Trail Badges'};
    attempts.forEach(function(a){if(a.result!=='CORRECT')return;var t=issueRewardInto(staged,{transaction_id:a.attempt_id+':'+primary.key,learner_id:staged.learner_id,session_id:a.session_id,attempt_id:a.attempt_id,reward_key:primary.key,reward_label:primary.label,amount:1,reason:'Correct answer in '+act.skill_title,theme_id:result.themeId,skill_id:skillId,created_at:stamp});if(t)issued.push(t);});
    var completionId=act.activity_id+':'+(result.sessionId||'nosession');
    var bt=issueRewardInto(staged,{transaction_id:completionId+':'+badge.key,learner_id:staged.learner_id,session_id:result.sessionId||null,attempt_id:null,reward_key:badge.key,reward_label:badge.label,amount:1,reason:'Finished '+act.skill_title,theme_id:result.themeId,skill_id:skillId,created_at:stamp});if(bt)issued.push(bt);

    var ses=staged.sessions.filter(function(x){return x.session_id===result.sessionId;})[0];
    if(ses){ses.activities_completed=(ses.activities_completed||0)+1;ses.skills_practiced=ses.skills_practiced||[];if(ses.skills_practiced.indexOf(skillId)===-1)ses.skills_practiced.push(skillId);ses.last_activity_at=stamp;}

    staged.updated_at=stamp;state=staged;persistLocal();

    if(Cloud){
      var ops=[
        {table:'learning_attempts',rows:attempts},
        {table:'learner_skill_progress',rows:[skillCloudRow(staged.learner_id,skillId,e)]},
        {table:'review_schedule',rows:[{learner_id:staged.learner_id,skill_id:skillId,due_at:due,reason:e.mastery_state}]}
      ];
      if(issued.length)ops.push({table:'reward_transactions',rows:issued});
      if(result.placementProbe&&Cloud.state().signedIn)ops.push({table:'learner_profiles',rows:[profileCloudRow(staged,Cloud.state().userId)]});
      if(Cloud.batch)Cloud.batch(ops,{kind:'activity_completion',activity_id:act.activity_id,session_id:result.sessionId||null});
      else ops.forEach(function(op){Cloud.upsert(op.table,op.rows);});
    }

    return{skill_id:skillId,skill_title:act.skill_title,band:act.band,next_band:e.difficulty_level,correct:correct,independent:independent,hinted:hinted,incorrect:wrong,accuracy:accuracy,mastery_state:e.mastery_state,mastery_score:e.mastery_score,next_review_at:due,rewards_issued:issued.map(function(t){return{key:t.reward_key,label:t.reward_label,amount:t.amount};}),balances:balances(),placement:placementResult,cloud:Cloud?Cloud.state():{status:'NOT_CONFIGURED'}};
  }

  function startSession(themeId,meta){
    var s=load();meta=meta||{};var ses={session_id:uuid(),learner_id:s.learner_id,date:today(),started_at:nowIso(),theme:themeId||null,curriculum_version:s.curriculum_version,plan_day_id:meta.plan_day_id||null,week:meta.week||null,planned_blocks:meta.planned_blocks||[],skills_practiced:[],activities_completed:0,status:'IN_PROGRESS'};
    s.sessions.push(ses);s.sessions=s.sessions.slice(-180);persistLocal();if(Cloud)Cloud.upsert('learning_sessions',[sessionCloudRow(ses)]);return ses;
  }
  function endSession(sessionId,summary,opts){
    var s=load(),ses=s.sessions.filter(function(x){return x.session_id===sessionId;})[0];if(!ses)return null;opts=opts||{};
    ses.completed_at=nowIso();ses.duration=Math.max(0,Math.round((new Date(ses.completed_at)-new Date(ses.started_at))/1000));ses.status=opts.abandoned?'LEFT_EARLY':'COMPLETED';ses.session_summary=summary||null;
    if(opts.completePlanDay&&ses.plan_day_id&&window.SakhiPlan)window.SakhiPlan.markCompleteLocal(s,ses.plan_day_id);
    persistLocal();if(Cloud){Cloud.upsert('learning_sessions',[sessionCloudRow(ses)]);var cs=Cloud.state();if(cs.signedIn)Cloud.upsert('learner_profiles',[profileCloudRow(s,cs.userId)]);}return ses;
  }
  function updateProfile(patch){var s=load();Object.keys(patch||{}).forEach(function(k){s.profile[k]=patch[k];});persistLocal();if(Cloud){var cs=Cloud.state();if(cs.signedIn)Cloud.upsert('learner_profiles',[profileCloudRow(s,cs.userId)]);}return s.profile;}
  function setTheme(id){/* compatibility only: V3 learning trails ignore this field */updateProfile({active_theme:id});return id;}
  function persist(){/* profile/session compatibility only; never called by adaptive in V3 */persistLocal();return load();}

  async function syncCloud(){
    if(!Cloud)return{status:'NOT_CONFIGURED'};var cs=Cloud.state();if(!cs.signedIn)return cs;
    var local=load(),profiles=await Cloud.request('/rest/v1/learner_profiles?select=*&order=created_at.asc&limit=1'),remoteProfile=profiles&&profiles[0];
    if(!remoteProfile){
      var created=await Cloud.request('/rest/v1/learner_profiles',{method:'POST',headers:{Prefer:'return=representation'},body:profileCloudRow(local,cs.userId)});
      remoteProfile=created&&created[0]||profileCloudRow(local,cs.userId);
    }
    var oldId=local.learner_id,newId=remoteProfile.learner_id||oldId;
    if(oldId!==newId){local.learner_id=newId;local.attempts.forEach(function(x){x.learner_id=newId;});local.sessions.forEach(function(x){x.learner_id=newId;});local.rewards.forEach(function(x){x.learner_id=newId;});if(Cloud.rewriteLearnerId)Cloud.rewriteLearnerId(oldId,newId);}
    var q=encodeURIComponent(newId),parts=await Promise.all([
      Cloud.request('/rest/v1/learner_skill_progress?select=*&learner_id=eq.'+q),
      Cloud.request('/rest/v1/learning_sessions?select=*&learner_id=eq.'+q+'&order=started_at.desc&limit=180'),
      Cloud.request('/rest/v1/learning_attempts?select=*&learner_id=eq.'+q+'&order=timestamp.desc&limit=800'),
      Cloud.request('/rest/v1/review_schedule?select=*&learner_id=eq.'+q+'&order=due_at.desc'),
      Cloud.request('/rest/v1/reward_transactions?select=*&learner_id=eq.'+q+'&order=created_at.desc&limit=1000').catch(function(){return[];})
    ]);
    (parts[0]||[]).forEach(function(row){local.skills[row.skill_id]=chooseEvidence(local.skills[row.skill_id],remoteEvidence(row));});
    var sessMap={};local.sessions.concat(parts[1]||[]).forEach(function(x){sessMap[x.session_id]=Object.assign(sessMap[x.session_id]||{},x);});local.sessions=Object.keys(sessMap).map(function(k){return sessMap[k];}).sort(function(a,b){return new Date(a.started_at)-new Date(b.started_at);}).slice(-180);
    var attMap={};local.attempts.concat(parts[2]||[]).forEach(function(x){attMap[x.attempt_id]=Object.assign(attMap[x.attempt_id]||{},x);});local.attempts=Object.keys(attMap).map(function(k){return attMap[k];}).sort(function(a,b){return new Date(a.timestamp)-new Date(b.timestamp);}).slice(-800);
    (parts[3]||[]).forEach(function(r){if(!local.review[r.skill_id]||new Date(r.due_at)>new Date(local.review[r.skill_id]))local.review[r.skill_id]=r.due_at;});
    var rew={};local.rewards.concat(parts[4]||[]).forEach(function(x){rew[x.transaction_id]=Object.assign(rew[x.transaction_id]||{},x);});local.rewards=Object.keys(rew).map(function(k){return rew[k];}).sort(function(a,b){return new Date(a.created_at)-new Date(b.created_at);});
    var settings=remoteProfile.settings||{};local.profile.display_name=remoteProfile.display_name||local.profile.display_name;local.profile.typical_session_length=remoteProfile.typical_session_length||local.profile.typical_session_length;
    ['voice_enabled','movement_breaks','reduced_motion'].forEach(function(k){if(settings[k]!==undefined)local.profile[k]=settings[k];});
    if(remoteProfile.weekly_report_enabled!==undefined)local.profile.weekly_report_enabled=remoteProfile.weekly_report_enabled;if(remoteProfile.weekly_report_email!==undefined)local.profile.weekly_report_email=remoteProfile.weekly_report_email;
    if(remoteProfile.plan_state&&Array.isArray(remoteProfile.plan_state.completed_day_ids)){var ids=(local.plan.completed_day_ids||[]).concat(remoteProfile.plan_state.completed_day_ids);local.plan.completed_day_ids=ids.filter(function(x,i){return ids.indexOf(x)===i;});local.plan.last_completed_day_id=remoteProfile.plan_state.last_completed_day_id||local.plan.last_completed_day_id;}
    state=local;persistLocal();
    var ops=[{table:'learner_profiles',rows:[profileCloudRow(local,cs.userId)]}];
    var skRows=Object.keys(local.skills).filter(function(id){return(local.skills[id].attempt_count||0)>0||local.skills[id].placement_credited;}).map(function(id){return skillCloudRow(local.learner_id,id,local.skills[id]);});if(skRows.length)ops.push({table:'learner_skill_progress',rows:skRows});
    if(local.sessions.length)ops.push({table:'learning_sessions',rows:local.sessions.map(sessionCloudRow)});if(local.attempts.length)ops.push({table:'learning_attempts',rows:local.attempts});if(local.rewards.length)ops.push({table:'reward_transactions',rows:local.rewards});
    if(Cloud.batch)Cloud.batch(ops,{kind:'full_sync'});Cloud.flush();return Cloud.state();
  }
  function snapshot(){return JSON.parse(JSON.stringify(load()));}
  function reset(){state=blank();persistLocal();return state;}

  function weeklySummary(days){
    days=days||7;var s=load(),cut=Date.now()-days*86400000,attempts=s.attempts.filter(function(a){return new Date(a.timestamp).getTime()>=cut;}),sessions=s.sessions.filter(function(x){return new Date(x.started_at).getTime()>=cut&&(x.status==='COMPLETED'||(!x.status&&x.completed_at));});
    var correct=attempts.filter(function(a){return a.result==='CORRECT';}).length,ind=attempts.filter(function(a){return a.independent_success;}).length,hinted=attempts.filter(function(a){return a.result==='CORRECT'&&!a.independent_success;}).length;
    var domains={};attempts.forEach(function(a){var d=domains[a.domain]||(domains[a.domain]={attempts:0,correct:0,independent:0});d.attempts++;if(a.result==='CORRECT')d.correct++;if(a.independent_success)d.independent++;});
    var practiceDays={};sessions.forEach(function(x){practiceDays[x.date||String(x.started_at||'').slice(0,10)]=true;});
    return{days:days,practice_days:Object.keys(practiceDays).length,sessions:sessions.length,minutes:Math.round(sessions.reduce(function(n,x){return n+(x.duration||0);},0)/60),attempts:attempts.length,correct:correct,independent:ind,hinted:hinted,domains:domains};
  }

  return{STATES:STATES,load:load,snapshot:snapshot,reset:reset,persist:persist,evidence:evidence,masteryOf:masteryOf,bandFor:bandFor,recompute:recompute,scheduleReview:scheduleReview,reviewDue:reviewDue,balances:balances,completeActivity:completeActivity,startSession:startSession,endSession:endSession,setTheme:setTheme,updateProfile:updateProfile,syncCloud:syncCloud,weeklySummary:weeklySummary,criteriaFor:criteriaFor,reviewPolicyFor:reviewPolicyFor};
})();
