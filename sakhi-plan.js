window.SakhiPlan=(function(){
'use strict';
function completedSessions(){return SakhiProgress.load().sessions.filter(function(s){return s.status==='COMPLETED';}).length;}
function scheduledDay(){
 // Preserve the curated SAKHI_SIX_MONTH_PLAN as a Kindergarten seed. Adaptive
 // selection continues through a 365-day year and subsequent years, without a cap.
 var plan=window.SAKHI_SIX_MONTH_PLAN;if(!plan||!Array.isArray(plan.weeks)||!plan.weeks.length)return null;
 var days=plan.weeks.reduce(function(a,w){return a.concat(w.days||[]);},[]);return days.length?days[completedSessions()%days.length]:null;
}
function chooseMission(m,used){
 var urgent=SakhiAdaptive.pick(m.domain,used);if(urgent&&/spaced review|targeted teaching/.test(urgent.reason))return urgent;
 var planned=SakhiCurriculum.skill(m.skill_id),grade=SakhiCurriculum.grade?SakhiCurriculum.grade():0;
 if(planned&&Number(planned.grade_min||0)>=grade&&(!SakhiCurriculum.eligible||SakhiCurriculum.eligible(planned))&&SakhiCurriculum.isAvailable(planned.skill_id,SakhiProgress.masteryOf)){
 var state=SakhiProgress.masteryOf(planned.skill_id);if(state!=='MASTERED'&&state!=='MOSTLY_MASTERED'&&used.indexOf(planned.skill_id)<0)return{skill_id:planned.skill_id,band:SakhiProgress.bandFor(planned.skill_id),reason:'today’s learning sequence'};
 }
 return SakhiAdaptive.pick(m.domain,used);
}
function build(){
 var source=scheduledDay()||{missions:[]},mins=Math.max(20,Math.min(30,Number(SakhiProgress.load().settings.session_minutes)||30)),used=[],day=completedSessions(),rotation=['logic','wellbeing','world','creative'][day%4],priorities=[{domain:'math',weight:6,label:'Math reasoning'},{domain:'science',weight:5,label:'Science inquiry'},{domain:'language',weight:4,label:'Listen and understand'},{domain:'reading',weight:5,label:'Read and understand'},{domain:'writing',weight:3,label:'Write and communicate'},{domain:rotation,weight:2,label:'Life, world, and thinking'}],screenBudget=mins-5;
 var missions=priorities.map(function(focus){var scheduled=(source.missions||[]).find(function(m){return m.domain===focus.domain;}),p=scheduled&&scheduled.skill_id?chooseMission(scheduled,used):SakhiAdaptive.pick(focus.domain,used);if(p)used.push(p.skill_id);return{domain:focus.domain,minutes:0,focus:focus.label,pick:p,weight:focus.weight};}).filter(function(m){return m.pick;});
 var total=missions.reduce(function(n,m){return n+m.weight;},0),assigned=0;missions.forEach(function(m){m.minutes=Math.floor(m.weight*screenBudget/total);assigned+=m.minutes;});for(var i=0;assigned<screenBudget&&missions.length;i++,assigned++)missions[i%missions.length].minutes++;
 var handsOn=day%2===0?'science':'math',date=new Date();return{date:date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0'),program_day:day+1,year_day:day%365+1,learning_year:Math.floor(day/365)+1,grade:SakhiCurriculum.grade?SakhiCurriculum.grade():0,minutes:mins,missions:missions,offscreen:{minutes:4,domain:handsOn,prompt:offscreen(handsOn)},celebration_minutes:1};
}
function offscreen(d){return{reading:'Find three things at home that begin with a sound from today’s reading.',math:'Use toys or crayons to model today’s number idea. Explain how you know, then change one number and solve again.',writing:'Use pencil and paper for careful letter, number, or word practice.',language:'Tell a grown-up the beginning, middle, and end of a favorite story.',science:'Ask one testable question, predict, observe safely with a grown-up, then explain the evidence.',logic:'Build a repeating pattern, then ask someone to continue it.',wellbeing:'Practice one helpful routine independently and tell a grown-up how it felt.',creative:'Draw, dance, build, or act out something from today’s learning.'}[d]||'Do a hands-on learning mission with a grown-up nearby.';}
return{build:build,scheduledDay:scheduledDay};
})();
