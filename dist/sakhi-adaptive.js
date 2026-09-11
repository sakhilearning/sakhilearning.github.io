window.SakhiAdaptive=(function(){
'use strict';
function due(domain){var now=Date.now();return SakhiCurriculum.skillsIn(domain).filter(function(s){var e=SakhiProgress.evidence(s.skill_id);return e.next_review&&new Date(e.next_review).getTime()<=now;});}
function pick(domain,used){used=used||[];var d=due(domain).filter(function(s){return used.indexOf(s.skill_id)<0;});if(d.length)return{skill_id:d[0].skill_id,band:SakhiProgress.bandFor(d[0].skill_id),reason:'spaced review'};var f=SakhiCurriculum.frontier(domain,SakhiProgress.masteryOf).filter(function(s){return used.indexOf(s.skill_id)<0;});if(f.length)return{skill_id:f[0].skill_id,band:SakhiProgress.bandFor(f[0].skill_id),reason:'next step on this learning trail'};var all=SakhiCurriculum.skillsIn(domain).filter(function(s){return used.indexOf(s.skill_id)<0;});return all.length?{skill_id:all[0].skill_id,band:SakhiProgress.bandFor(all[0].skill_id),reason:'confidence review'}:null;}
function explain(p){if(!p)return'Practice complete for now.';var s=SakhiCurriculum.skill(p.skill_id);return s.title+' — '+p.reason+'.';}
return{pick:pick,explain:explain};
})();
