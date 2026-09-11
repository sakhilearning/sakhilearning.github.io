/* Sakhi six-month daily plan.
 *
 * Owns cadence only: which subject block is scheduled on each practice day and
 * the associated off-screen mission. It never marks a skill mastered and it
 * never changes prerequisite rules. Adaptive selection may substitute an
 * unlocked prerequisite or review WITHIN the same domain.
 */
window.SakhiPlan = (function(){
  'use strict';
  var plan=null;
  async function load(){
    if(plan)return plan;
    var r=await fetch('./data/six-month-plan.json');
    if(!r.ok)throw new Error('Could not load six-month plan ('+r.status+').');
    plan=await r.json();return plan;
  }
  function get(){return plan;}
  function completedIds(state){return(state&&state.plan&&Array.isArray(state.plan.completed_day_ids))?state.plan.completed_day_ids:[];}
  function dayForState(state){
    if(!plan||!plan.days||!plan.days.length)return null;
    var done=completedIds(state),d=plan.days.find(function(x){return done.indexOf(x.day_id)===-1;});
    return d||plan.days[plan.days.length-1];
  }
  function progress(state){
    if(!plan)return{completed:0,total:0,pct:0,week:1};
    var n=Math.min(completedIds(state).length,plan.days.length);
    return{completed:n,total:plan.days.length,pct:plan.days.length?Math.round(n/plan.days.length*100):0,week:Math.min(26,Math.floor(n/5)+1)};
  }
  function week(n){return plan&&plan.weeks?plan.weeks[Math.max(0,Math.min(plan.weeks.length-1,(n||1)-1))]:null;}

  /* Turn one 30-minute plan day into the number of app blocks requested by the
   * parent session-length preference. The off-screen block remains about 6
   * minutes. This function owns cadence so the app shell does not invent a
   * second duration policy.
   *
   * 25 min -> 3 x 6-minute app blocks + 6-minute real-world mission ~= 24
   * 30 min -> 4 x 6-minute app blocks + 6-minute real-world mission = 30
   * 35 min -> the 30-minute day + one adaptive confirmation block ~= 36
   */
  function stepsForDay(day,targetMinutes){
    if(!day||!Array.isArray(day.app_blocks))return[];
    var mins=Number(targetMinutes||30);
    var base=day.app_blocks.map(function(b,i){return{block:b,blockIndex:i,repeat:false};});
    if(mins<=25)return base.slice(0,3);
    if(mins>=35&&base[0])return base.concat([{block:base[0].block,blockIndex:0,repeat:true}]);
    return base;
  }

  function markCompleteLocal(state,dayId){
    state.plan=state.plan||{completed_day_ids:[]};
    state.plan.completed_day_ids=state.plan.completed_day_ids||[];
    if(dayId&&state.plan.completed_day_ids.indexOf(dayId)===-1)state.plan.completed_day_ids.push(dayId);
    state.plan.last_completed_day_id=dayId||state.plan.last_completed_day_id||null;
    return state.plan;
  }
  return{load:load,get:get,dayForState:dayForState,progress:progress,week:week,stepsForDay:stepsForDay,markCompleteLocal:markCompleteLocal};
})();
