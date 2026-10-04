window.SakhiNormalize=(function(){
'use strict';
function text(value){
  if(typeof value!=='string')return value;
  var out=value
    .replace(/[\t\r\n]+/g,' ')
    .replace(/ {2,}/g,' ')
    .replace(/\s+([,.;:!?])/g,'$1')
    .trim();
  /* The generator historically used this as a generic transfer task. It is
     cognitively vague for a five-year-old and makes completion depend on an
     adult. Map both the visible line and its spoken-prefixed form to variants
     that are already present in the bundled Kokoro narration pack. */
  out=out.replace(/^Teach a grown-up one thing about (.+)\.$/i,'Try $1 in a new way.');
  out=out.replace(/^Take your time\. Teach a grown-up one thing about (.+)\.$/i,'Take your time. Try $1 in a new way.');
  return out;
}
function normalizeQuestion(q){
  if(!q||typeof q!=='object')return q;
  ['prompt','narration','spoken_instruction','coach_tip','success_criteria'].forEach(function(k){if(typeof q[k]==='string')q[k]=text(q[k]);});
  if(Array.isArray(q.hints))q.hints=q.hints.map(text);
  if(Array.isArray(q.steps))q.steps=q.steps.map(text);
  if(q.teaching&&typeof q.teaching==='object'){
    ['concept','explanation'].forEach(function(k){if(typeof q.teaching[k]==='string')q.teaching[k]=text(q.teaching[k]);});
    if(q.teaching.worked&&typeof q.teaching.worked==='object'){
      ['prompt','display_prompt','answer','display_answer','why'].forEach(function(k){if(typeof q.teaching.worked[k]==='string')q.teaching.worked[k]=text(q.teaching.worked[k]);});
    }
  }
  return q;
}
function activity(a){
  if(!a||typeof a!=='object')return a;
  if(typeof a.skill_title==='string')a.skill_title=text(a.skill_title);
  if(Array.isArray(a.questions))a.questions.forEach(normalizeQuestion);
  return a;
}
function install(){
  var Act=window.SakhiActivities;if(!Act||typeof Act.generate!=='function'||Act.__normalized)return false;
  var original=Act.generate;
  Act.generate=function(){return activity(original.apply(Act,arguments));};
  Act.__normalized=true;return true;
}
return{text:text,question:normalizeQuestion,activity:activity,install:install};
})();
window.SakhiNormalize.install();
