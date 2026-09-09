(function(){
'use strict';
const curriculum=window.RainbowCurriculum;
if(!curriculum)throw new Error('curriculum.js must load before adaptive-acceleration-service.js');
const VERSION='2026.09.09-adaptive-v1';
const TARGET_MINUTES=20;
const MAX_SESSION_ACTIVITIES=9;
const DOMAINS=['reading','math','language','writing','logic','science','memory','executive','knowledge','creativity','fine','gross','life','sel'];
function data(){return window.data||{};}
function now(){return new Date().toISOString();}
function ensure(){
  const d=data();d.adaptiveProfile=d.adaptiveProfile||{};const p=d.adaptiveProfile;
  p.version=VERSION;p.skills=p.skills||{};p.domains=p.domains||{};p.decisions=p.decisions||[];p.recentContent=p.recentContent||[];p.compressedSkills=p.compressedSkills||{};p.learningVelocity=Number(p.learningVelocity||0);p.lastSummary=p.lastSummary||'';
  for(const domain of DOMAINS)p.domains[domain]=p.domains[domain]||{difficulty:1,current_skill_id:null,ready_next:null,stretch_skill:null,challenge_misses:0};
  return p;
}
function activityById(id){return (window.activities||[]).find(a=>a.id===id)||null;}
function savedAttempts(){return (data().activityAttempts||[]).filter(x=>x.save_status==='SAVED');}
function attemptsForSkill(skillId){return savedAttempts().filter(x=>x.skill_id===skillId).slice(-24);}
function attemptsForDomain(domain){return savedAttempts().filter(x=>x.domain===domain).slice(-40);}
function recentGuessEvents(skillId){const ids=new Set((window.activities||[]).filter(a=>a.skill_id===skillId).map(a=>a.id));return (data().interactionEvidence||[]).slice(-80).filter(e=>ids.has(e.activityId)&&/RANDOM_TAPPING|possible_random_tapping/i.test(e.type||''));}
function isIndependent(a){return !!a.independent_success&&Number(a.hint_level||0)===0&&Number(a.attempts||1)<=1;}
function metrics(skillId){
  const list=attemptsForSkill(skillId),recent=list.slice(-8),n=recent.length;
  const avg=n?recent.reduce((s,a)=>s+Number(a.score||0),0)/n:0;
  const independent=n?recent.filter(isIndependent).length/n:0;
  const hinted=n?recent.filter(a=>Number(a.hint_level||0)>0).length/n:0;
  const incorrect=n?recent.filter(a=>Number(a.score||0)<.55).length/n:0;
  const fastBad=recent.filter(a=>Number(a.elapsed_seconds||999)<=3&&Number(a.score||0)<.7).length;
  const types=new Set(recent.map(a=>a.interaction_type).filter(Boolean)).size;
  const days=new Set(recent.map(a=>(a.completed_at||'').slice(0,10)).filter(Boolean)).size;
  const challenge=recent.filter(a=>activityById(a.activity_id)?.challenge);
  const challengeMisses=challenge.slice(-2).filter(a=>Number(a.score||0)<.65||Number(a.hint_level||0)>=2).length;
  const independentStreak=(()=>{let c=0;for(let i=recent.length-1;i>=0;i--){if(isIndependent(recent[i])&&Number(recent[i].score||0)>=.88)c++;else break;}return c;})();
  const guessing=fastBad>=2||recentGuessEvents(skillId).length>=1;
  const fluent=n>=5&&avg>=.88&&independent>=.8&&hinted<=.2&&types>=2&&!guessing&&(days>=2||n>=6);
  const strongNow=independentStreak>=3&&!guessing&&avg>=.86;
  const struggling=n>=2&&(recent.slice(-2).every(a=>Number(a.score||0)<.65)||recent.slice(-2).every(a=>Number(a.hint_level||0)>=2));
  return {n,avg,independent,hinted,incorrect,types,days,fastBad,guessing,fluent,strongNow,struggling,challengeMisses,independentStreak};
}
function baseDifficulty(skillId){return Number(curriculum.byId?.[skillId]?.difficulty_level||1);}
function skillProfile(skillId){const p=ensure(),m=metrics(skillId),s=p.skills[skillId]||{difficulty:baseDifficulty(skillId),mode:'practice'};let difficulty=Number(s.difficulty||baseDifficulty(skillId));if(m.fluent||m.strongNow)difficulty=Math.min(5,difficulty+1);if(m.struggling||m.challengeMisses>=2)difficulty=Math.max(1,difficulty-1);const mode=m.guessing?'verify':m.challengeMisses>=2||m.struggling?'support':m.fluent?'compressed_review':m.strongNow?'challenge':'practice';return {...s,skill_id:skillId,difficulty,mode,metrics:m};}
function masteredEnough(skillId){const m=metrics(skillId),state=curriculum.normalizeState?.(window.CurriculumEngine?.state?.(skillId,data())||'NOT_INTRODUCED');return m.fluent||['MASTERED','MOSTLY_MASTERED'].includes(state);}
function prerequisiteReady(skillId){const s=curriculum.byId?.[skillId];if(!s)return true;return (s.prerequisites||[]).every(masteredEnough);}
function nextReadySkills(domain,currentSkillId=null){
  const skills=(curriculum.skills||[]).filter(s=>s.domain===domain&&prerequisiteReady(s.skill_id)&&!masteredEnough(s.skill_id));
  if(currentSkillId){const next=new Set(curriculum.byId?.[currentSkillId]?.recommended_next||[]);const preferred=skills.filter(s=>next.has(s.skill_id));if(preferred.length)return preferred.sort((a,b)=>a.difficulty_level-b.difficulty_level);}
  return skills.sort((a,b)=>a.difficulty_level-b.difficulty_level);
}
function recentIds(){return new Set(savedAttempts().slice(-16).map(a=>a.activity_id));}
function recentTokens(){return new Set(ensure().recentContent.slice(-50));}
function candidateScore(a,{skillId=null,domain=null,mode='practice',difficulty=null,exclude=new Set(),usedTypes=new Set()}={}){
  if(!a||exclude.has(a.id)||!a.interaction_type)return 1e9;if(skillId&&a.skill_id!==skillId)return 1e9;if(domain&&a.domain!==domain)return 1e9;
  let score=0;const target=Number(difficulty||baseDifficulty(a.skill_id));score+=Math.abs(Number(a.difficulty||1)-target)*4;
  const phase=a.phase||'practice';if(mode==='challenge')score+=a.challenge||phase==='challenge'||phase==='transfer'? -8:6;if(mode==='compressed_review')score+=phase==='mixed'||phase==='transfer'? -7:4;if(mode==='support')score+=Number(a.difficulty||1)<=target? -5:5;if(mode==='verify')score+=['sort','drag_drop','word_builder','sequence'].includes(a.interaction_type)?-6:2;
  if(a.transfer)score-=mode==='challenge'||mode==='compressed_review'?3:0;if(recentIds().has(a.id))score+=10;if(usedTypes.has(a.interaction_type))score+=2;
  const rt=recentTokens(),tokens=a.content_tokens||[];score+=tokens.filter(t=>rt.has(t)).length*2;
  return score;
}
function chooseActivity(opts={}){const pool=(window.activities||[]).filter(a=>a.interaction_type);let best=null,bestScore=1e9;for(const a of pool){const s=candidateScore(a,opts);if(s<bestScore){best=a;bestScore=s;}}return bestScore>=1e9?null:best;}
function currentSkillForDomain(domain){const attempts=attemptsForDomain(domain);return attempts.at(-1)?.skill_id||ensure().domains[domain]?.current_skill_id||null;}
function recommend(domain,{currentSkillId=null,exclude=new Set(),usedTypes=new Set()}={}){
  const current=currentSkillId||currentSkillForDomain(domain),sp=current?skillProfile(current):null;
  if(current&&sp?.mode==='support')return chooseActivity({skillId:current,mode:'support',difficulty:sp.difficulty,exclude,usedTypes});
  if(current&&sp?.mode==='verify')return chooseActivity({skillId:current,mode:'verify',difficulty:Math.max(1,sp.difficulty),exclude,usedTypes});
  if(current&&(sp?.metrics.fluent||sp?.metrics.strongNow)){
    const next=nextReadySkills(domain,current)[0];if(next){const challenge=sp.metrics.strongNow&&!sp.metrics.fluent;return chooseActivity({skillId:next.skill_id,mode:challenge?'challenge':'practice',difficulty:Math.max(baseDifficulty(next.skill_id),sp.difficulty),exclude,usedTypes})||chooseActivity({skillId:next.skill_id,exclude,usedTypes});}
    return chooseActivity({skillId:current,mode:'challenge',difficulty:Math.min(5,sp.difficulty+1),exclude,usedTypes});
  }
  if(current)return chooseActivity({skillId:current,mode:sp?.mode||'practice',difficulty:sp?.difficulty,exclude,usedTypes})||chooseActivity({domain,exclude,usedTypes});
  const next=nextReadySkills(domain)[0];return next?chooseActivity({skillId:next.skill_id,difficulty:baseDifficulty(next.skill_id),exclude,usedTypes}):chooseActivity({domain,exclude,usedTypes});
}
function domainDifficulty(domain){const at=attemptsForDomain(domain).slice(-12);if(!at.length)return Number(ensure().domains[domain]?.difficulty||1);const values=at.map(a=>Number(activityById(a.activity_id)?.difficulty||a.difficulty||1));return Math.max(1,Math.min(5,Math.round(values.reduce((s,x)=>s+x,0)/values.length)));}
function calculateVelocity(){const at=savedAttempts().slice(-60),days=new Set(at.map(a=>(a.completed_at||'').slice(0,10)).filter(Boolean)).size||1,skills=new Set(at.filter(a=>Number(a.score||0)>=.85&&isIndependent(a)).map(a=>a.skill_id)).size,retained=[...new Set(at.map(a=>a.skill_id))].filter(id=>metrics(id).fluent).length,challenge=at.filter(a=>activityById(a.activity_id)?.challenge&&Number(a.score||0)>=.75).length;return Number(((skills+retained*.75+challenge*.35)/days).toFixed(2));}
function recordDecision(type,detail={}){const p=ensure();p.decisions.push({type,timestamp:now(),...detail});p.decisions=p.decisions.slice(-80);window.SakhiRuntimeLog?.log('ADAPTIVE_'+type.toUpperCase(),detail);}
function rememberContent(a){const p=ensure();for(const t of a?.content_tokens||[])p.recentContent.push(t);p.recentContent=p.recentContent.slice(-80);}
function updateModel(attempt){
  const p=ensure(),a=activityById(attempt.activity_id),skillId=attempt.skill_id||a?.skill_id,domain=attempt.domain||a?.domain;if(!skillId||!domain)return;
  rememberContent(a);const sp=skillProfile(skillId);p.skills[skillId]={difficulty:sp.difficulty,mode:sp.mode,lastUpdated:now(),lastMetrics:{avg:sp.metrics.avg,independent:sp.metrics.independent,guessing:sp.metrics.guessing,fluent:sp.metrics.fluent}};
  const dp=p.domains[domain]||{};dp.difficulty=domainDifficulty(domain);dp.current_skill_id=skillId;dp.challenge_misses=sp.metrics.challengeMisses;const ready=nextReadySkills(domain,skillId)[0];dp.ready_next=ready?.skill_id||null;dp.stretch_skill=ready?.skill_id||skillId;p.domains[domain]=dp;
  if(sp.metrics.fluent){p.compressedSkills[skillId]={since:now(),reason:'Consistent independent accuracy across varied tasks; foundational practice compressed to brief retrieval.'};recordDecision('compression',{skill_id:skillId,domain,reason:'demonstrated mastery'});}else if(sp.metrics.strongNow){recordDecision('escalate',{skill_id:skillId,domain,to_difficulty:sp.difficulty,reason:'independent accurate streak'});}else if(sp.metrics.challengeMisses>=2){recordDecision('scaffold',{skill_id:skillId,domain,to_difficulty:sp.difficulty,reason:'two difficult challenge attempts'});}else if(sp.metrics.guessing){recordDecision('verify',{skill_id:skillId,domain,reason:'fast inaccurate or random-tap evidence'});}
  p.learningVelocity=calculateVelocity();
}
function usedInteractionTypes(){return new Set((data().quest||[]).filter(id=>data().questResults?.[id]!=null).map(id=>activityById(id)?.interaction_type).filter(Boolean));}
function sessionElapsed(){const start=data().activeSession?.started_at;if(!start)return 0;return Math.max(0,(Date.now()-new Date(start).getTime())/1000);}
function pickBalancedExtension(exclude,usedTypes){const priority=['reading','math','language','logic','science','creativity','memory'],counts={};for(const id of data().quest||[]){const d=activityById(id)?.domain;if(d)counts[d]=(counts[d]||0)+1;}priority.sort((a,b)=>(counts[a]||0)-(counts[b]||0));for(const domain of priority){const a=recommend(domain,{exclude,usedTypes});if(a)return a;}return null;}
function replanAfterSave(activityId){
  const attempt=savedAttempts().filter(x=>x.activity_id===activityId).at(-1);if(!attempt)return;updateModel(attempt);
  const d=data(),quest=d.quest||[],idx=quest.indexOf(activityId),current=activityById(activityId);if(idx<0||!current)return;
  const exclude=new Set(quest.filter(id=>d.questResults?.[id]!=null)),usedTypes=usedInteractionTypes();let candidate=recommend(current.domain,{currentSkillId:attempt.skill_id,exclude,usedTypes});
  const nextIndex=idx+1;
  if(candidate&&nextIndex<quest.length&&d.questResults?.[quest[nextIndex]]==null&&candidate.id!==quest[nextIndex]){const old=quest[nextIndex];quest[nextIndex]=candidate.id;recordDecision('replan',{after:activityId,replaced:old,next:candidate.id,domain:current.domain});}
  if(nextIndex>=quest.length&&sessionElapsed()<TARGET_MINUTES*60*.8&&quest.length<MAX_SESSION_ACTIVITIES){candidate=candidate||pickBalancedExtension(exclude,usedTypes);if(candidate&&!quest.includes(candidate.id)){quest.push(candidate.id);recordDecision('extend_session',{after:activityId,next:candidate.id,elapsed_seconds:Math.round(sessionElapsed())});}}
  d.quest=quest;d.adaptiveProfile.lastSummary=buildDailySummary();window.persist?.(false);
}
function planSession(){
  const exclude=new Set(),usedTypes=new Set(),picked=[],add=a=>{if(a&&!exclude.has(a.id)){picked.push(a);exclude.add(a.id);usedTypes.add(a.interaction_type);}};
  add(recommend('reading',{exclude,usedTypes}));add(recommend('reading',{exclude,usedTypes}));add(recommend('math',{exclude,usedTypes}));
  const secondary=['language','logic','science'][Math.floor(Date.now()/86400000)%3];add(recommend(secondary,{exclude,usedTypes}));
  const active=['writing','creativity','memory','gross'][Math.floor(Date.now()/86400000)%4];add(recommend(active,{exclude,usedTypes}));
  while(picked.reduce((s,a)=>s+Number(a.estimated_minutes||3),0)<17&&picked.length<7){const a=pickBalancedExtension(exclude,usedTypes);if(!a)break;add(a);}
  return {activities:picked,targetMinutes:TARGET_MINUTES,adaptive:true};
}
function levelLabel(domain){const d=ensure().domains[domain]||{},skill=curriculum.byId?.[d.current_skill_id];return skill?.title||'Gathering evidence';}
function stretchFor(domain){const d=ensure().domains[domain]||{},id=d.stretch_skill;return curriculum.byId?.[id]?.title||null;}
function readyNextFor(domain){const d=ensure().domains[domain]||{},id=d.ready_next;return curriculum.byId?.[id]?.title||null;}
function compressedNotes(){const p=ensure();return Object.entries(p.compressedSkills).map(([id,x])=>({skill_id:id,title:curriculum.byId?.[id]?.title||id,reason:x.reason})).slice(-8);}
function parentSnapshot(){const p=ensure(),domains={};for(const domain of ['reading','math','language','writing','logic','science','memory'])domains[domain]={current:levelLabel(domain),difficulty:p.domains[domain]?.difficulty||1,readyNext:readyNextFor(domain),stretch:stretchFor(domain)};return {domains,learningVelocity:p.learningVelocity,compressed:compressedNotes(),lastSummary:p.lastSummary||buildDailySummary()};}
function buildDailySummary(){const today=new Date().toISOString().slice(0,10),at=savedAttempts().filter(a=>(a.completed_at||'').slice(0,10)===today);if(!at.length)return'No completed learning activities yet today.';const decisions=ensure().decisions.filter(x=>(x.timestamp||'').slice(0,10)===today),compressed=decisions.find(x=>x.type==='compression'),escalated=decisions.find(x=>x.type==='escalate'),scaffold=decisions.find(x=>x.type==='scaffold'),parts=[];if(compressed)parts.push(`Sakhi shortened basic ${curriculum.byId?.[compressed.skill_id]?.title||'skill'} practice because performance showed consistent mastery.`);if(escalated)parts.push(`Difficulty increased after independent accurate work in ${curriculum.byId?.[escalated.skill_id]?.title||escalated.domain}.`);if(scaffold)parts.push('A challenge became difficult, so Sakhi added support and will retry it later.');if(!parts.length)parts.push(`${at.length} activities were completed with difficulty adjusted from actual performance.`);return parts.join(' ');}
function shouldCompress(skillId){return !!ensure().compressedSkills[skillId]||metrics(skillId).fluent;}
function resetAdaptive(){data().adaptiveProfile={};ensure();window.persist?.(false);}
window.addEventListener('sakhi-runtime-event',e=>{if(e.detail?.type==='ACTIVITY_SAVED')setTimeout(()=>replanAfterSave(e.detail.activity_id),0);});
window.AdaptiveAccelerationService=Object.freeze({VERSION,TARGET_MINUTES,metrics,skillProfile,masteredEnough,prerequisiteReady,nextReadySkills,chooseActivity,recommend,replanAfterSave,planSession,parentSnapshot,buildDailySummary,shouldCompress,calculateVelocity,resetAdaptive});
setTimeout(()=>{ensure();if(!(data().quest||[]).some(id=>data().questResults?.[id]!=null)){const plan=planSession();if(plan.activities.length){data().quest=plan.activities.map(a=>a.id);data().questResults=data().questResults||{};window.persist?.(false);window.renderQuest?.();window.updateStats?.();}}},0);
})();