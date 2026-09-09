(function(){
'use strict';

const curriculum=window.RainbowCurriculum;
if(!curriculum)throw new Error('curriculum.js must load before core-learning-services.js');

const STATUS_ORDER={REVIEW_NEEDED:0,LEARNING:1,DEVELOPING:2,INTRODUCED:3,NOT_INTRODUCED:4,MOSTLY_MASTERED:5,MASTERED:6};
const REVIEW_DAYS={INTRODUCED:1,LEARNING:1,DEVELOPING:3,MOSTLY_MASTERED:7,MASTERED:18,REVIEW_NEEDED:0};

function normalizeState(value){return curriculum.normalizeState(value||'NOT_INTRODUCED');}
function legacyStateMap(stateData=window.data||{}){
  return {...curriculum.fromLegacy(stateData),...(stateData.curriculumStates||{})};
}
function curriculumState(skillId,stateData=window.data||{}){
  return normalizeState(legacyStateMap(stateData)[skillId]||'NOT_INTRODUCED');
}
function deriveState(previous,evidence=[]){
  if(!evidence.length)return 'Not Introduced';
  const recent=evidence.slice(-7);
  const avg=recent.reduce((n,x)=>n+(Number(x.score)||0),0)/recent.length;
  const dates=new Set(recent.map(x=>x.date).filter(Boolean)).size;
  const formats=new Set(recent.map(x=>x.interaction_type||x.activityId).filter(Boolean)).size;
  const hints=recent.reduce((n,x)=>n+(Number(x.hints)||0),0)/recent.length;
  if(normalizeState(previous)==='MASTERED'&&recent.slice(-2).some(x=>(Number(x.score)||0)<.5))return 'Review Needed';
  if(recent.length>=5&&dates>=2&&avg>=.85&&hints<1&&(formats>=2||recent.length>=6))return 'Mastered';
  if(recent.length>=4&&avg>=.8)return 'Mostly Mastered';
  if(recent.length>=3&&avg>=.7)return 'Developing';
  if(recent.length>=2&&avg>=.55)return 'Learning';
  return 'Introduced';
}
function daysSince(date){if(!date)return Infinity;return Math.floor((Date.now()-new Date(date+'T12:00:00').getTime())/86400000);}
function reviewInterval(state){return REVIEW_DAYS[normalizeState(state)]??null;}
function evidenceForActivity(activity,stateData=window.data||{}){
  if(!activity)return [];
  return stateData.evidence?.[`${activity.domain}::${activity.skill}`]||[];
}
function isDue(activity,stateData=window.data||{}){
  const ev=evidenceForActivity(activity,stateData);if(!ev.length)return false;
  const interval=reviewInterval(window.getStatus?.(activity.domain,activity.skill)||'Not Introduced');
  return interval!=null&&daysSince(ev.at(-1)?.date)>=interval;
}
function dueSkills(stateData=window.data||{}){
  const out=[];
  for(const [key,ev] of Object.entries(stateData.evidence||{})){
    if(!ev?.length)continue;
    const [,name]=key.split('::');const skillId=curriculum.aliases[name];if(!skillId)continue;
    const state=curriculumState(skillId,stateData);const interval=reviewInterval(state);
    if(interval!=null&&daysSince(ev.at(-1)?.date)>=interval)out.push({skill_id:skillId,state,days:daysSince(ev.at(-1)?.date)});
  }
  return out.sort((a,b)=>(a.state==='REVIEW_NEEDED'?-100:0)+a.days-(b.state==='REVIEW_NEEDED'?-100:0)-b.days).reverse();
}

const CurriculumEngine=Object.freeze({
  version:curriculum.version,
  skills:curriculum.skills,
  byId:curriculum.byId,
  aliases:curriculum.aliases,
  normalizeState,
  state:curriculumState,
  ready:(skillId,stateData=window.data||{})=>curriculum.ready(skillId,legacyStateMap(stateData)),
  nextCandidates:(stateData=window.data||{})=>curriculum.nextCandidates(legacyStateMap(stateData))
});

const MasteryEngine=Object.freeze({deriveState,reviewInterval,isDue,dueSkills,evidenceForActivity,rank:s=>STATUS_ORDER[normalizeState(s)]??4});

function recentActivityIds(stateData=window.data||{},days=2){
  const cut=Date.now()-days*86400000;
  return new Set((stateData.questHistory||[]).filter(x=>new Date((x.date||'1970-01-01')+'T12:00:00').getTime()>=cut).map(x=>x.activityId));
}
function skillIdFor(activity){return curriculum.aliases[activity?.skill]||null;}
function activitiesForSkill(skillId){return (window.activities||[]).filter(a=>skillIdFor(a)===skillId&&a.interaction_type);}
function choose(domain,{mode='priority',exclude=new Set(),types=new Set(),stateData=window.data||{}}={}){
  let pool=(window.activities||[]).filter(a=>a.domain===domain&&a.interaction_type&&!exclude.has(a.id));
  if(!pool.length)return null;
  const due=new Set(dueSkills(stateData).map(x=>x.skill_id));const recent=recentActivityIds(stateData);
  pool.sort((a,b)=>{
    const ai=skillIdFor(a),bi=skillIdFor(b);
    let av=MasteryEngine.rank(ai?curriculumState(ai,stateData):window.getStatus?.(a.domain,a.skill));
    let bv=MasteryEngine.rank(bi?curriculumState(bi,stateData):window.getStatus?.(b.domain,b.skill));
    if(mode==='review'){av+=due.has(ai)?-5:2;bv+=due.has(bi)?-5:2;}
    if(mode==='challenge'){av+=ai&&CurriculumEngine.ready(ai,stateData)?-2:2;bv+=bi&&CurriculumEngine.ready(bi,stateData)?-2:2;}
    av+=recent.has(a.id)?2:0;bv+=recent.has(b.id)?2:0;
    av+=types.has(a.interaction_type)?1:0;bv+=types.has(b.interaction_type)?1:0;
    return av-bv||(a.difficulty||1)-(b.difficulty||1);
  });
  return pool[0];
}
function readinessTarget(stateData=window.data||{}){
  const candidates=CurriculumEngine.nextCandidates(stateData).filter(s=>activitiesForSkill(s.skill_id).length);
  return candidates.filter(s=>s.domain==='reading').sort((a,b)=>a.difficulty_level-b.difficulty_level)[0]||candidates.sort((a,b)=>a.difficulty_level-b.difficulty_level)[0]||null;
}
function planToday(stateData=window.data||{}){
  const picked=[],exclude=new Set(),types=new Set();
  const add=a=>{if(a&&!exclude.has(a.id)){picked.push(a);exclude.add(a.id);types.add(a.interaction_type)}};
  const target=readinessTarget(stateData);
  if(target)add(activitiesForSkill(target.skill_id).find(a=>!exclude.has(a.id)));else add(choose('reading',{exclude,types,stateData}));
  add(choose(target?.domain==='math'?'reading':'math',{exclude,types,stateData}));
  const due=dueSkills(stateData).find(x=>activitiesForSkill(x.skill_id).some(a=>!exclude.has(a.id)));
  if(due)add(activitiesForSkill(due.skill_id).find(a=>!exclude.has(a.id)));else add(choose('reading',{mode:'review',exclude,types,stateData}));
  const day=Math.floor(Date.now()/86400000);
  const secondary=['language','logic','science','memory','sel','executive','knowledge'];
  add(choose(secondary[day%secondary.length],{exclude,types,stateData}));
  const enrich=['writing','creativity','fine','gross','life'];
  add(choose(enrich[day%enrich.length],{mode:'challenge',exclude,types,stateData}));
  return {activities:picked.slice(0,5),target,interactionTypes:[...types]};
}
const LessonPlanner=Object.freeze({planToday,choose,readinessTarget,activitiesForSkill});

const LearnerProfileService=Object.freeze({
  snapshot:()=>({age:5,grade:'Kindergarten',known:{uppercase:true,lowercase:true,numbers:true,rhyming:true},phonics:'relatively-strong',themes:[window.data?.theme||'unicorn']}),
  shouldSkipAlphabetRestart:()=>true
});
// RewardService is authoritative in reward-service.js.
const AIContentService=Object.freeze({
  mode:'vetted-bank-first',
  createWrapper:({world='Rainbow Unicorn Meadow',goal=''})=>({intro:`A magical challenge is ready in ${world}.`,goal}),
  validate:payload=>!!payload&&typeof payload==='object'
});

window.CurriculumEngine=CurriculumEngine;
window.MasteryEngine=MasteryEngine;
window.LessonPlanner=LessonPlanner;
window.LearnerProfileService=LearnerProfileService;

window.AIContentService=AIContentService;

// Temporary compatibility names for legacy renderers. Planning/mastery logic lives only above.
window.deriveStatus=(current,evidence)=>MasteryEngine.deriveState(current,evidence);
window.chooseActivity=(domain,offset=0)=>LessonPlanner.choose(domain,{stateData:window.data||{},exclude:new Set(),types:new Set()});
window.makeQuest=function(){
  const result=LessonPlanner.planToday(window.data||{});
  window.data.quest=result.activities.map(a=>a.id);
  window.data.questDate=window.todayKey?.()||new Date().toISOString().slice(0,10);
  window.data.questResults={};window.data.curriculumVersion=CurriculumEngine.version;
  window.persist?.(false);window.renderQuest?.();
  return result;
};
})();
