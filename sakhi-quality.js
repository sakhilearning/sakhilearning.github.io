window.SakhiQuality=(function(){
'use strict';
var BANNED=[/show a grown-up one specific thing you learned/i,/draw one by yourself/i,/write it once by yourself/i,/choice\s*\d+\s+is/i];
function text(v){return String(v===undefined||v===null?'':v).trim();}
function unique(a){var seen={};return(a||[]).filter(function(x){var k=String(x);if(seen[k])return false;seen[k]=true;return true;});}
function hasMedia(q,path){var cur=q;for(var i=0;i<path.length;i++){if(!cur||cur[path[i]]===undefined||cur[path[i]]===null)return false;cur=cur[path[i]];}return true;}
function taskKey(q){return text(q&&q.prompt)+'|'+JSON.stringify(q&&q.answer);}
function visualIssue(q,skill){
  var k=skill&&skill.kind||'',id=skill&&skill.skill_id||'',tpl=q.template||'';
  if(k==='count'||k==='subitize')return hasMedia(q,['media','count'])||hasMedia(q,['sheet','count'])?null:'count question has no represented count';
  if(k==='compose')return hasMedia(q,['media','tenFrame'])||hasMedia(q,['sheet','tenFrame'])?null:'compose question has no ten-frame model';
  if(k==='teen')return hasMedia(q,['media','tenFrame'])?null:'place-value question has no tens/ones model';
  if(k==='pattern')return hasMedia(q,['media','patternStrip'])?null:'pattern question has no pattern strip';
  if(k==='add')return hasMedia(q,['media','groups'])?null:'addition question has no group model';
  if(k==='sub')return hasMedia(q,['media','subtract'])?null:'subtraction question has no take-away model';
  if(id==='writing.labels'||tpl==='school-write-room')return hasMedia(q,['media','visual'])||hasMedia(q,['sheet','picture'])?null:'write-the-room question has no picture';
  if(tpl==='school-number-compare')return hasMedia(q,['sheet','pair'])?null:'number comparison has no visible pair';
  if(tpl==='school-letter-gap')return hasMedia(q,['sheet','alphabet'])||hasMedia(q,['sheet','target'])?null:'missing-letter page has no alphabet model';
  if(tpl==='school-trace-sheet')return hasMedia(q,['sheet','target'])&&text(q.trace_target)?null:'trace page has no visible target';
  return null;
}
function auditQuestion(q,activity,index){
  var errors=[],warnings=[],skill=window.SakhiCurriculum&&activity&&activity.skill_id?SakhiCurriculum.skill(activity.skill_id):null,prompt=text(q&&q.prompt),spoken=text(q&&(q.spoken_instruction||q.narration));
  if(!q||typeof q!=='object')return{errors:['question '+(index+1)+' is not an object'],warnings:[]};
  if(!prompt)errors.push('question '+(index+1)+' has no visible prompt');
  if(!text(q.template))errors.push('question '+(index+1)+' has no template');
  if(!text(q.question_key))errors.push('question '+(index+1)+' has no stable question_key');
  if(!text(q.learning_phase))warnings.push('question '+(index+1)+' has no learning phase');
  if(!text(q.coach_tip))warnings.push('question '+(index+1)+' has no strategy coaching');
  BANNED.forEach(function(re){if(re.test(prompt)||re.test(spoken))errors.push('question '+(index+1)+' contains banned/vague wording: '+re);});
  if(q.template==='choice'){
    if(!Array.isArray(q.choices)||q.choices.length<2)errors.push('question '+(index+1)+' has fewer than two choices');
    else{
      var values=q.choices.map(String);if(unique(values).length!==values.length)errors.push('question '+(index+1)+' repeats a choice');
      if(values.indexOf(String(q.answer))<0)errors.push('question '+(index+1)+' answer is not in choices');
    }
  }
  var vi=visualIssue(q,skill);if(vi)errors.push('question '+(index+1)+' '+vi);
  if(prompt.length>220&&!/(story|nonfiction|passage|listen|details|main_idea|infer|compare_ideas)/.test(skill&&skill.kind||''))warnings.push('question '+(index+1)+' prompt may overload a young reader');
  return{errors:errors,warnings:warnings};
}
function auditActivity(activity){
  var errors=[],warnings=[],qs=activity&&Array.isArray(activity.questions)?activity.questions:[];
  if(!activity||typeof activity!=='object')return{ok:false,errors:['activity is missing'],warnings:[]};
  if(!qs.length)errors.push('activity has no questions');
  var keys={},tasks={};
  qs.forEach(function(q,i){
    var r=auditQuestion(q,activity,i);errors=errors.concat(r.errors);warnings=warnings.concat(r.warnings);
    var key=text(q.question_key);if(key){if(keys[key])errors.push('question_key repeats inside activity: '+key);keys[key]=true;}
    var task=taskKey(q);if(tasks[task])errors.push('same task repeats inside activity');tasks[task]=true;
  });
  if(qs.length>=4){var phases=qs.map(function(q){return q.learning_phase;});if(phases.indexOf('transfer')<0)errors.push('deep lesson has no transfer question');if(phases.indexOf('practice')<0&&phases.indexOf('apply')<0)errors.push('deep lesson has no practice/application step');}
  return{ok:errors.length===0,errors:unique(errors),warnings:unique(warnings)};
}
function repairRepeatedTasks(activity,args,generate){
  if(!activity||!Array.isArray(activity.questions)||activity.questions.length<2)return activity;
  var seen={},usedKeys=activity.questions.map(function(q){return q.question_key;}).filter(Boolean),seed=text(args[2]||activity.activity_id||activity.skill_id||'quality'),baseAvoid=Array.isArray(args[3])?args[3].slice():[],options=args[4]&&typeof args[4]==='object'?Object.assign({},args[4]):{};
  activity.questions=activity.questions.map(function(q,index){
    var key=taskKey(q);if(!seen[key]){seen[key]=true;return q;}
    var phase=q.learning_phase,evidence=q.evidence_mode,candidate=null;
    for(var attempt=0;attempt<6&&!candidate;attempt++){
      var alternate=generate.call(window.SakhiActivities,args[0],args[1],seed+'|quality-repair|'+index+'|'+attempt,baseAvoid.concat(usedKeys),Object.assign({},options,{teachFirst:false}));
      if(!alternate||!Array.isArray(alternate.questions))continue;
      candidate=alternate.questions.find(function(x){return x&&x.question_key&&usedKeys.indexOf(x.question_key)<0&&!seen[taskKey(x)];})||null;
    }
    if(!candidate)return q;
    candidate=JSON.parse(JSON.stringify(candidate));
    if(phase)candidate.learning_phase=phase;
    if(evidence!==undefined)candidate.evidence_mode=evidence;
    seen[taskKey(candidate)]=true;usedKeys.push(candidate.question_key);
    console.info('[Sakhi quality repaired duplicate task]',activity.skill_id,'question',index+1);
    return candidate;
  });
  return activity;
}
function installGeneratorGuard(){
  var A=window.SakhiActivities;if(!A||typeof A.generate!=='function'||A.__qualityWrapped)return;
  var generate=A.generate;A.generate=function(){var args=Array.prototype.slice.call(arguments),activity=generate.apply(A,args);activity=repairRepeatedTasks(activity,args,generate);var report=auditActivity(activity);activity.quality_report=report;if(!report.ok){console.error('[Sakhi quality contract]',activity.skill_id,report.errors);if(window.SAKHI_STRICT_QUALITY)throw new Error('Sakhi quality contract failed: '+report.errors.join('; '));}else if(report.warnings.length)console.warn('[Sakhi quality warning]',activity.skill_id,report.warnings);return activity;};A.__qualityWrapped=true;
}
function installLibraryGallery(){
  var P=window.SakhiPresentation;if(!P||typeof P.gallery!=='function'||P.__libraryGalleryWrapped)return;
  var gallery=P.gallery;P.gallery=function(){return '<section class="library-reward-showcase" aria-label="Sakhi’s generated learning artwork"><figure><img src="./assets/library-media/luna-unicorn.webp" alt="Luna the Rainbow Unicorn from Sakhi’s original ChatGPT artwork" loading="lazy" decoding="async"><figcaption>Luna returns as Sakhi’s familiar learning companion from the original artwork set.</figcaption></figure><figure><img src="./assets/theme-media/generated-v4/princess-story-forest.webp" alt="Princess story forest for language adventures" loading="lazy" decoding="async"><figcaption>Story artwork supports listening and imagination while the question stays in its own clear space.</figcaption></figure></section>'+gallery.apply(P,arguments);};P.__libraryGalleryWrapped=true;
}
installGeneratorGuard();installLibraryGallery();
return{auditActivity:auditActivity,auditQuestion:auditQuestion,visualIssue:visualIssue,repairRepeatedTasks:repairRepeatedTasks,installGeneratorGuard:installGeneratorGuard};
})();
