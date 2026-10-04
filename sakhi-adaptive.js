window.SakhiAdaptive=(function(){
'use strict';
var BASELINE={reading:'reading.short_vowels',math:'math.compare',writing:'writing.cvc_words',language:'language.listening',logic:'logic.patterns',science:'science.observe',wellbeing:'wellbeing.emotions',creative:'creative.imaginative_play',world:'world.past_present'};
function attempts(domain){return(SakhiProgress.load().attempts||[]).filter(function(a){return a.domain_id===domain&&a.objective;});}
function reviewDue(e){return!!(e.next_review&&Date.parse(e.next_review)<=Date.now());}
function recentlyStrong(sk){var e=SakhiProgress.evidence(sk.skill_id),p=SakhiProgress.skillProfile?SakhiProgress.skillProfile(sk.skill_id):null,last=Date.parse(e.last_practiced||0);return!!(p&&(p.signal==='LIKELY_KNOWS'||p.signal==='SECURE')&&last&&Date.now()-last<12*60*60*1000&&!reviewDue(e));}
/* Selection responds to evidence more quickly than mastery. A perfect first
   sitting may justify moving on immediately, but it does not mark the skill
   mastered. That lets Sakhi stay challenging without confusing hypothesis with
   durable learning. Spaced review can bring the skill back later. */
function score(sk,used){
  var e=SakhiProgress.evidence(sk.skill_id),profile=SakhiProgress.skillProfile?SakhiProgress.skillProfile(sk.skill_id):null,s=0;
  if(used.indexOf(sk.skill_id)>=0)s-=100;
  if(reviewDue(e))s+=55;
  if(e.mastery_state==='LEARNING')s+=40;
  if(e.mastery_state==='DEVELOPING')s+=32;
  if(e.mastery_state==='NOT_INTRODUCED')s+=24;
  if(e.last_accuracy!==null&&e.last_accuracy<.6)s+=28;
  if(e.last_accuracy>=.9&&e.independent_correct_count>=3)s-=18;
  if(profile&&profile.signal==='LIKELY_KNOWS'&&recentlyStrong(sk))s-=62;
  if(profile&&profile.signal==='SECURE'&&recentlyStrong(sk))s-=72;
  if(e.mastery_state==='MOSTLY_MASTERED')s-=24;
  if(e.mastery_state==='MASTERED')s-=36;
  /* Among equally appropriate unlocked choices, prefer the richer application
     over falling back to the earliest foundation drill. This never bypasses a
     prerequisite because the pool has already been filtered by isAvailable. */
  s+=Math.max(0,Math.min(5,Number(sk.difficulty_level)||1))*4;
  s-=Math.min(15,e.attempt_count||0);
  return s;
}
function pick(domain,used){used=used||[];var seen=attempts(domain),baseline=SakhiCurriculum.skill(BASELINE[domain]);if(!seen.length&&baseline&&used.indexOf(baseline.skill_id)<0&&SakhiCurriculum.isAvailable(baseline.skill_id,SakhiProgress.masteryOf))return{skill_id:baseline.skill_id,band:Math.max(2,SakhiProgress.bandFor(baseline.skill_id)),reason:'age-appropriate starting lesson',placement:true};
 var available=SakhiCurriculum.skillsIn(domain).filter(function(sk){return SakhiCurriculum.isAvailable(sk.skill_id,SakhiProgress.masteryOf);}),unused=available.filter(function(sk){return used.indexOf(sk.skill_id)<0;}),pool=unused.length?unused:available;
 var freshPool=pool.filter(function(sk){return!recentlyStrong(sk);});if(freshPool.length)pool=freshPool;
 var candidates=SakhiCurriculum.frontier(domain,SakhiProgress.masteryOf).concat(pool).filter(function(x,i,a){return pool.indexOf(x)>=0&&a.findIndex(function(y){return y.skill_id===x.skill_id;})===i;}).sort(function(a,b){var delta=score(b,used)-score(a,used);if(delta)return delta;return(Number(b.difficulty_level)||1)-(Number(a.difficulty_level)||1);}),best=candidates[0];if(!best)return null;var e=SakhiProgress.evidence(best.skill_id),profile=SakhiProgress.skillProfile?SakhiProgress.skillProfile(best.skill_id):null,reason=reviewDue(e)?'spaced review':e.last_accuracy!==null&&e.last_accuracy<.6?'targeted teaching and practice':e.mastery_state==='NOT_INTRODUCED'?'next lesson in the learning sequence':profile&&profile.signal==='LIKELY_KNOWS'?'new application while evidence is still early':e.last_accuracy>=.9?'ready for a harder application':'best next teaching step';return{skill_id:best.skill_id,band:SakhiProgress.bandFor(best.skill_id),reason:reason};}
function explain(p){if(!p)return'Practice complete for now.';var s=SakhiCurriculum.skill(p.skill_id);return s.title+' — '+p.reason+'.';}
return{pick:pick,explain:explain};
})();
