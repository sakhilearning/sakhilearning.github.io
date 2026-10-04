window.SakhiMasteryPolicy=(function(){
'use strict';
var MIN_LIKELY_QUESTIONS=6;
var MIN_LIKELY_ACTIVITIES=2;
var MIN_MASTERED_QUESTIONS=9;
var MIN_MASTERED_ACTIVITIES=3;
var MIN_LIKELY_ACCURACY=.80;
var MIN_LIKELY_INDEPENDENCE=.67;
var MIN_MASTERED_ACCURACY=.90;
var MIN_MASTERED_INDEPENDENCE=.80;
function ratio(n,d){return d?Number(n||0)/d:0;}
function objectiveAttempts(skillId){var s=window.SakhiProgress&&SakhiProgress.load?SakhiProgress.load():null;return(s&&s.attempts||[]).filter(function(a){return a&&a.objective&&a.skill_id===skillId;});}
function distinctSessions(rows){var ids=[];(rows||[]).forEach(function(a){if(a.session_id&&ids.indexOf(a.session_id)<0)ids.push(a.session_id);});return ids.length;}
function gate(skillId){var P=window.SakhiProgress;if(!P||!P.load)return null;var s=P.load(),e=s.skills&&s.skills[skillId];if(!e)return null;var questions=Number(e.question_attempts)||0,activities=Number(e.objective_attempts)||0,accuracy=ratio(e.correct_count,questions),independence=ratio(e.independent_correct_count,questions),rows=objectiveAttempts(skillId),knownSessions=rows.some(function(a){return!!a.session_id;}),sessions=distinctSessions(rows),likely=questions>=MIN_LIKELY_QUESTIONS&&activities>=MIN_LIKELY_ACTIVITIES&&accuracy>=MIN_LIKELY_ACCURACY&&independence>=MIN_LIKELY_INDEPENDENCE,secure=questions>=MIN_MASTERED_QUESTIONS&&activities>=MIN_MASTERED_ACTIVITIES&&accuracy>=MIN_MASTERED_ACCURACY&&independence>=MIN_MASTERED_INDEPENDENCE&&(!knownSessions||sessions>=2);return{questions:questions,activities:activities,accuracy:accuracy,independence:independence,sessions:sessions,knownSessions:knownSessions,likely:likely,secure:secure};}
function enforce(skillId){var P=window.SakhiProgress,g=gate(skillId);if(!P||!g)return g;var s=P.load(),e=s.skills&&s.skills[skillId];if(!e)return g;var changed=false;if(e.mastery_state==='MASTERED'&&!g.secure){e.mastery_state=g.likely?'MOSTLY_MASTERED':(g.accuracy>=.60?'DEVELOPING':'LEARNING');changed=true;}if(e.mastery_state==='MOSTLY_MASTERED'&&!g.likely){e.mastery_state=g.accuracy>=.60?'DEVELOPING':'LEARNING';changed=true;}if(changed){var d=new Date();d.setDate(d.getDate()+1);e.next_review=d.toISOString();P.persist();}return g;}
function profile(p,skillId){if(!p)return p;var g=gate(skillId||p.skill_id);if(!g)return p;var out=Object.assign({},p,{evidence_gate:{questions:g.questions,activities:g.activities,sessions:g.sessions,accuracy:Math.round(g.accuracy*100),independence:Math.round(g.independence*100)}});if(out.signal==='SECURE'&&!g.secure)out.signal=g.likely?'LIKELY_KNOWS':'DEVELOPING';if(out.signal==='LIKELY_KNOWS'&&!g.likely)out.signal='DEVELOPING';return out;}
function install(){var P=window.SakhiProgress;if(!P||P.__masteryPolicy)return false;var complete=P.completeActivity,skillProfile=P.skillProfile;if(typeof complete==='function')P.completeActivity=function(payload){var result=complete.apply(P,arguments),id=payload&&payload.activity&&payload.activity.skill_id;if(id){enforce(id);result=Object.assign({},result,{mastery_state:P.evidence(id).mastery_state});}return result;};if(typeof skillProfile==='function')P.skillProfile=function(id){return profile(skillProfile.apply(P,arguments),id);};P.__masteryPolicy=true;return true;}
return{install:install,gate:gate,enforce:enforce,profile:profile,thresholds:{likelyQuestions:MIN_LIKELY_QUESTIONS,likelyActivities:MIN_LIKELY_ACTIVITIES,masteredQuestions:MIN_MASTERED_QUESTIONS,masteredActivities:MIN_MASTERED_ACTIVITIES}};
})();
window.SakhiMasteryPolicy.install();
