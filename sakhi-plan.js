window.SakhiPlan=(function(){
'use strict';
function completedSessions(){return SakhiProgress.load().sessions.filter(function(s){return s.status==='COMPLETED';}).length;}
function scheduledDay(){
  var plan=window.SAKHI_SIX_MONTH_PLAN;
  if(!plan||!Array.isArray(plan.weeks)||!plan.weeks.length)return null;
  var index=Math.min(129,completedSessions());
  var week=Math.floor(index/5),day=index%5;
  return plan.weeks[week]&&plan.weeks[week].days&&plan.weeks[week].days[day]||null;
}
function chooseMission(m,used){
  var planned=SakhiCurriculum.skill(m.skill_id);
  if(planned&&SakhiCurriculum.isAvailable(planned.skill_id,SakhiProgress.masteryOf)){
    var state=SakhiProgress.masteryOf(planned.skill_id);
    if(state!=='MASTERED'&&state!=='MOSTLY_MASTERED'&&used.indexOf(planned.skill_id)<0){
      return{skill_id:planned.skill_id,band:SakhiProgress.bandFor(planned.skill_id),reason:'today\'s six-month learning path'};
    }
  }
  return SakhiAdaptive.pick(m.domain,used);
}
function fallbackDay(){
  return{missions:[],offscreen:{minutes:4,type:'math_science_hands_on'},celebration_minutes:1,total_minutes:30};
}
function build(){
  var source=scheduledDay()||fallbackDay(),mins=Number(SakhiProgress.load().settings.session_minutes)||30,used=[],day=completedSessions(),rotation=['logic','wellbeing','world','writing','creative'][day%5],priorities=[{domain:'math',weight:6,label:'Math reasoning'},{domain:'science',weight:6,label:'Science inquiry'},{domain:'language',weight:5,label:'Listen and understand'},{domain:'reading',weight:5,label:'Read and understand'},{domain:rotation,weight:4,label:'Life, world, and thinking'}],screenBudget=Math.max(15,mins-5),weightTotal=26;
  var missions=priorities.map(function(focus){
    var scheduled=(source.missions||[]).find(function(m){return m.domain===focus.domain;}),m=scheduled||{domain:focus.domain},p=m.skill_id?chooseMission(m,used):SakhiAdaptive.pick(m.domain,used);
    if(p)used.push(p.skill_id);
    return{domain:m.domain,minutes:Math.max(3,Math.round(focus.weight*screenBudget/weightTotal)),focus:focus.label,pick:p};
  }).filter(function(x){return x.pick;});
  var handsOn=day%2===0?'science':'math';
  return{
    date:new Date().toISOString().slice(0,10),
    program_day:Math.min(130,completedSessions()+1),
    minutes:mins,
    missions:missions,
    offscreen:{minutes:4,domain:handsOn,prompt:offscreen(handsOn)},
    celebration_minutes:1
  };
}
function offscreen(d){return{
  reading:'Find three things at home that begin with a sound from today\'s Rainbow Library mission.',
  math:'Use toys or crayons to model today\'s number idea, explain how you know, then change one number and solve again.',
  writing:'Use pencil and paper for one short line of careful letter, number, or word practice.',
  language:'Tell a grown-up the beginning, middle, and end of a favorite story.',
  science:'Ask one testable question, make a prediction, observe safely with a grown-up, then explain what the evidence showed.',
  logic:'Build a repeating pattern with blocks, stickers, or beads, then ask someone to continue it.',
  wellbeing:'Practice one helpful routine independently and tell a grown-up how it felt.',
  creative:'Draw, dance, build, or act out something from today\'s learning.'
}[d]||'Do a short hands-on learning mission with a grown-up nearby.';}
return{build:build,scheduledDay:scheduledDay};
})();
