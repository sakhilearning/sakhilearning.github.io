window.SakhiProgress=(function(){
'use strict';
var KEY='sakhi.v3.progress';
var STATES=['NOT_INTRODUCED','LEARNING','DEVELOPING','MOSTLY_MASTERED','MASTERED'];
var data=null;
function fresh(){return{version:3,learner:{name:'Sakhi'},settings:{session_minutes:30,voice:true,reduced_motion:false},skills:{},sessions:[],attempts:[],rewards:[],last_day:null};}
function load(){if(data)return data;try{data=JSON.parse(localStorage.getItem(KEY)||'null')||fresh();}catch(e){data=fresh();}return data;}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}return data;}
function blankEvidence(id){return{skill_id:id,mastery_state:'NOT_INTRODUCED',attempt_count:0,objective_attempts:0,correct_count:0,independent_correct_count:0,hints_used:0,difficulty_level:1,last_practiced:null,next_review:null};}
function evidence(id){var s=load();return s.skills[id]||blankEvidence(id);}
function mutableEvidence(id){var s=load();if(!s.skills[id])s.skills[id]=blankEvidence(id);return s.skills[id];}
function masteryOf(id){return evidence(id).mastery_state;}
function bandFor(id){var e=evidence(id);return Math.max(1,Math.min(5,e.difficulty_level||1));}
function recompute(e,criteria){if(e.objective_attempts<=0){if(e.attempt_count>0)e.mastery_state='LEARNING';return;}var acc=e.correct_count/e.objective_attempts,ind=e.independent_correct_count;if(e.objective_attempts>=criteria.min_attempts&&acc>=.9&&ind>=criteria.independent_evidence)e.mastery_state='MASTERED';else if(e.objective_attempts>=criteria.min_attempts&&acc>=criteria.target_accuracy)e.mastery_state='MOSTLY_MASTERED';else if(acc>=.6)e.mastery_state='DEVELOPING';else e.mastery_state='LEARNING';if(acc>=.9&&ind>=2)e.difficulty_level=Math.min(5,(e.difficulty_level||1)+1);else if(acc<.5)e.difficulty_level=Math.max(1,(e.difficulty_level||1)-1);}
function reviewDays(e,policy){return e.mastery_state==='MASTERED'?policy.mastered_days:e.mastery_state==='MOSTLY_MASTERED'?policy.mostly_mastered_days:e.mastery_state==='DEVELOPING'?policy.developing_days:policy.learning_days;}
function completeActivity(payload){
  var s=load(),a=payload.activity,sk=SakhiCurriculum.skill(a.skill_id);if(!sk)throw new Error('Unknown skill');var e=mutableEvidence(a.skill_id),answers=payload.answers||[],objective=a.evidence_mode!=='practice';var correct=answers.filter(function(x){return x.correct;}).length,ind=answers.filter(function(x){return x.correct&&!x.hintsUsed&&x.tries===1;}).length;
  e.attempt_count+=1;e.last_practiced=new Date().toISOString();
  if(objective){e.objective_attempts+=1;if(answers.length&&correct===answers.length)e.correct_count+=1;if(answers.length&&ind===answers.length)e.independent_correct_count+=1;e.hints_used+=answers.reduce(function(n,x){return n+(x.hintsUsed||0);},0);recompute(e,sk.mastery_criteria);var d=new Date();d.setDate(d.getDate()+reviewDays(e,sk.review_policy));e.next_review=d.toISOString();}else if(e.mastery_state==='NOT_INTRODUCED')e.mastery_state='LEARNING';
  var reward={id:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random()),at:new Date().toISOString(),skill_id:a.skill_id,amount:objective?3:1,label:'Trail Stars'};s.rewards.push(reward);
  var attempt={id:reward.id,at:reward.at,skill_id:a.skill_id,domain_id:a.domain_id,objective:objective,correct_questions:correct,total_questions:answers.length,independent_questions:ind,hints:answers.reduce(function(n,x){return n+(x.hintsUsed||0);},0),band:a.band};s.attempts.push(attempt);persist();if(window.SakhiCloud)SakhiCloud.enqueue([attempt]);return{skill_id:a.skill_id,accuracy:answers.length?correct/answers.length:1,correct:correct,independent:ind,mastery_state:e.mastery_state,rewards_issued:[reward]};
}
function startSession(plan){var s=load(),x={session_id:(crypto.randomUUID?crypto.randomUUID():String(Date.now())),started_at:new Date().toISOString(),ended_at:null,plan:plan,status:'ACTIVE'};s.sessions.push(x);persist();return x;}
function endSession(id,status){var s=load(),x=s.sessions.find(function(v){return v.session_id===id;});if(x){x.ended_at=new Date().toISOString();x.status=status||'COMPLETED';persist();}}
function domainProgress(domain){var list=SakhiCurriculum.skillsIn(domain),score=0;list.forEach(function(sk){var m=masteryOf(sk.skill_id);score+=m==='MASTERED'?1:m==='MOSTLY_MASTERED'?.8:m==='DEVELOPING'?.5:m==='LEARNING'?.2:0;});return list.length?Math.round(score/list.length*100):0;}
function stars(){return load().rewards.reduce(function(n,r){return n+(r.amount||0);},0);}
function snapshot(){return JSON.parse(JSON.stringify(load()));}
function setSetting(k,v){load().settings[k]=v;persist();}
return{STATES:STATES,load:load,persist:persist,evidence:evidence,masteryOf:masteryOf,bandFor:bandFor,completeActivity:completeActivity,startSession:startSession,endSession:endSession,domainProgress:domainProgress,stars:stars,snapshot:snapshot,setSetting:setSetting};
})();
