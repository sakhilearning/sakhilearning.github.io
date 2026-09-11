/* Sakhi adaptive planner — READ ONLY with respect to learning state.
 *
 * It recommends placement probes, review and next skills. It never writes
 * mastery, evidence, placement credit or storage. All learning mutations are
 * committed by SakhiProgress.completeActivity().
 */
window.SakhiAdaptive = (function () {
  'use strict';

  var PROBE_LIMIT = 4;
  var COMPRESSED_REVIEW_MAX = 3;
  var PROBE_START = {
    reading: 'reading.cvc_mixed',
    math: 'math.compose_to_10',
    language: 'language.sequence',
    logic: 'logic.patterns',
    science: 'science.habitats',
    writing: 'writing.cvc_words'
  };

  function Cur(){return window.SakhiCurriculum;}
  function Prog(){return window.SakhiProgress;}
  function masteryOf(id){return Prog().masteryOf(id);}
  function state(){return Prog().load();}

  function placementActive(){var p=state().placement;return !p||!p.complete;}
  function placementDoneIds(){var p=state().placement;return p&&Array.isArray(p.probes)?p.probes.map(function(x){return x.skill_id;}):[];}
  function nextProbe(){
    if(!placementActive())return null;
    var done=placementDoneIds(),order=['reading','math','logic','language','science','writing'];
    for(var i=0;i<order.length&&done.length<PROBE_LIMIT;i++){
      var id=PROBE_START[order[i]];
      if(id&&done.indexOf(id)===-1&&Cur().skill(id))return{skill_id:id,band:3,reason:'placement probe',placement_probe:true};
    }
    return null;
  }

  /* Pure prerequisite closure. Progress decides whether/how those prerequisites
     receive placement credit when the probe completion is atomically committed. */
  function prerequisiteClosure(skillId){
    var seen={},out=[];
    (function walk(id){Cur().prerequisites(id).forEach(function(p){if(seen[p])return;seen[p]=true;out.push(p);walk(p);});})(skillId);
    return out;
  }

  function reviewItems(domainId){
    var due=Prog().reviewDue().filter(function(id){var sk=Cur().skill(id);return !domainId||(sk&&sk.domain_id===domainId);});
    if(!due.length)return[];
    var strong=due.filter(function(id){var m=masteryOf(id);return m==='MASTERED'||m==='MOSTLY_MASTERED';});
    var cap=strong.length===due.length?1:COMPRESSED_REVIEW_MAX;
    return due.slice(0,cap);
  }

  function strongSweep(last){return !!(last&&last.accuracy===1&&last.correct>0&&last.independent===last.correct);}

  function nextInDomain(domainId,opts){
    opts=opts||{};var used=opts.usedSkillIds||[],last=opts.lastResult;
    if(strongSweep(last)){
      var lsk=Cur().skill(last.skill_id);
      if(lsk&&lsk.domain_id===domainId){
        var nxt=Cur().nextAfter(last.skill_id,masteryOf);
        if(nxt&&nxt.domain_id===domainId&&used.indexOf(nxt.skill_id)===-1)
          return{skill_id:nxt.skill_id,band:Math.max(2,Prog().bandFor(nxt.skill_id)),reason:'accelerated in '+domainId+': cleared '+last.skill_id+' independently'};
      }
    }
    var rev=reviewItems(domainId).filter(function(id){return used.indexOf(id)===-1;});
    if(rev.length)return{skill_id:rev[0],band:Prog().bandFor(rev[0]),reason:'spaced review in '+domainId};
    var frontier=Cur().frontier(domainId,masteryOf).filter(function(sk){return used.indexOf(sk.skill_id)===-1;});
    if(frontier.length)return{skill_id:frontier[0].skill_id,band:Prog().bandFor(frontier[0].skill_id),reason:'next in '+domainId};
    return null;
  }

  /* Respect the six-month scope/sequence while remaining readiness-based. The
     scheduled target is used only if unlocked. Otherwise we stay in that same
     subject trail and select an available prerequisite/frontier/review. */
  function nextForTarget(targetSkillId,opts){
    opts=opts||{};var used=opts.usedSkillIds||[],target=Cur().skill(targetSkillId);
    if(!target)return nextActivity(opts);
    var m=masteryOf(targetSkillId);
    if(used.indexOf(targetSkillId)===-1&&m!=='MASTERED'&&m!=='MOSTLY_MASTERED'&&Cur().isAvailable(targetSkillId,masteryOf))
      return{skill_id:targetSkillId,band:Prog().bandFor(targetSkillId),reason:'today’s '+target.domain_id+' trail target'};
    return nextInDomain(target.domain_id,opts)||
      ((m==='MASTERED'||m==='MOSTLY_MASTERED')?{skill_id:targetSkillId,band:Prog().bandFor(targetSkillId),reason:'scheduled consolidation'}:null);
  }

  function nextActivity(opts){
    opts=opts||{};var used=opts.usedSkillIds||[];
    if(placementActive()){
      var probe=nextProbe();if(probe)return probe;
      /* Four probes already exist; completeActivity will have marked placement
         complete on the fourth commit. This guard avoids a dead end if old data
         has four probes but lacks the complete flag. */
    }
    var domains=Cur().domains().map(function(d){return d.domain_id;});
    var scored=domains.map(function(d){
      var pick=nextInDomain(d,{usedSkillIds:used,lastResult:opts.lastResult});
      var practised=used.filter(function(id){var sk=Cur().skill(id);return sk&&sk.domain_id===d;}).length;
      return{domain:d,pick:pick,practised:practised};
    }).filter(function(x){return x.pick;});
    if(!scored.length)return null;
    scored.sort(function(a,b){return a.practised-b.practised;});
    return scored[0].pick;
  }

  function shouldContinue(session,opts){
    opts=opts||{};
    var minutes=opts.sessionMinutes||(Prog().load().profile.typical_session_length)||30;
    var elapsed=(Date.now()-new Date(session.started_at).getTime())/60000;
    if(elapsed>=minutes)return{continue:false,reason:'session length reached'};
    var more=nextActivity({usedSkillIds:opts.usedSkillIds||[],lastResult:opts.lastResult});
    if(!more)return{continue:false,reason:'no further skill available'};
    return{continue:true,reason:'time remaining',minutesLeft:Math.max(0,Math.round(minutes-elapsed)),next:more};
  }

  function explain(pick){
    if(!pick)return'Nothing further is unlocked right now.';
    var sk=Cur().skill(pick.skill_id),name=sk?sk.title:pick.skill_id;
    if(/placement/.test(pick.reason))return'Quick starting-point check on “'+name+'” so Sakhi does not reteach skills already known.';
    if(/accelerated/.test(pick.reason))return name+' — the previous work was completed independently, so the trail moved forward.';
    if(/review|consolidation/.test(pick.reason))return name+' — a short memory check before more new learning.';
    if(/trail target/.test(pick.reason))return name+' — today’s planned target is unlocked and ready.';
    return name+' — the next ready skill in this subject trail.';
  }

  return{
    PROBE_LIMIT:PROBE_LIMIT,PROBE_START:PROBE_START,COMPRESSED_REVIEW_MAX:COMPRESSED_REVIEW_MAX,
    placementActive:placementActive,nextProbe:nextProbe,prerequisiteClosure:prerequisiteClosure,
    reviewItems:reviewItems,nextInDomain:nextInDomain,nextForTarget:nextForTarget,
    nextActivity:nextActivity,shouldContinue:shouldContinue,explain:explain
  };
})();
