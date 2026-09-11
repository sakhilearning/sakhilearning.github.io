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
  var rot=['language','science','logic','wellbeing','creative'][completedSessions()%5];
  return{missions:[{domain:'reading',minutes:6},{domain:'math',minutes:6},{domain:'writing',minutes:5},{domain:rot,minutes:6}],offscreen:{minutes:5,type:'movement_pencil_hands_on'},celebration_minutes:2,total_minutes:30};
}
function build(){
  var source=scheduledDay()||fallbackDay(),mins=Number(SakhiProgress.load().settings.session_minutes)||30,scale=mins/30,used=[];
  var missions=(source.missions||[]).map(function(m){
    var p=m.skill_id?chooseMission(m,used):SakhiAdaptive.pick(m.domain,used);
    if(p)used.push(p.skill_id);
    return{domain:m.domain,minutes:Math.max(4,Math.round((m.minutes||5)*scale)),pick:p};
  }).filter(function(x){return x.pick;});
  var rotation=(source.missions&&source.missions[3]&&source.missions[3].domain)||'creative';
  return{
    date:new Date().toISOString().slice(0,10),
    program_day:Math.min(130,completedSessions()+1),
    minutes:mins,
    missions:missions,
    offscreen:{minutes:Math.max(4,Math.round(((source.offscreen&&source.offscreen.minutes)||5)*scale)),domain:rotation,prompt:offscreen(rotation)},
    celebration_minutes:Math.max(1,Math.round((source.celebration_minutes||2)*scale))
  };
}
function offscreen(d){return{
  reading:'Find three things at home that begin with a sound from today\'s Rainbow Library mission.',
  math:'Use real objects such as blocks, spoons, socks, or fruit to act out today\'s number idea.',
  writing:'Use pencil and paper for one short line of careful letter, number, or word practice.',
  language:'Tell a grown-up the beginning, middle, and end of a favorite story.',
  science:'Make one prediction, test it safely with a grown-up nearby, then say what you observed.',
  logic:'Build a repeating pattern with toys or household objects, then ask someone to continue it.',
  wellbeing:'Practice one helpful routine independently and tell a grown-up how it felt.',
  creative:'Draw, dance, build, or act out something from today\'s learning.'
}[d]||'Do a short hands-on learning mission with a grown-up nearby.';}
return{build:build,scheduledDay:scheduledDay};
})();
