// Compatibility shim only. Scheduling/mastery logic now lives in MasteryEngine and LessonPlanner.
(function(){
'use strict';
if(!window.MasteryEngine||!window.LessonPlanner)throw new Error('core-learning-services.js must load before scheduler.js');
window.Scheduler=Object.freeze({
  reviewIntervalDays:state=>window.MasteryEngine.reviewInterval(state),
  isActivityDue:activity=>window.MasteryEngine.isDue(activity,window.data||{}),
  planToday:()=>window.LessonPlanner.planToday(window.data||{})
});
})();
