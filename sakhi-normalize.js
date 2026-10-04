window.SakhiNormalize=(function(){
'use strict';
var ORAL_KINDS={fluency:true,retell:true,conversation:true,oral_reasoning:true,blend:true,rhyme:true,phoneme_change:true,listen:true,segment:true};
function text(value){
  if(typeof value!=='string')return value;
  var out=value
    .replace(/[\t\r\n]+/g,' ')
    .replace(/ {2,}/g,' ')
    .replace(/\s+([,.;:!?])/g,'$1')
    .trim();
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
  var skill=window.SakhiCurriculum&&a.skill_id?window.SakhiCurriculum.skill(a.skill_id):null;
  var oral=!!(skill&&ORAL_KINDS[skill.kind]);
  if(Array.isArray(a.questions))a.questions.forEach(function(q){normalizeQuestion(q);if(oral&&q.template!=='trace'&&q.template!=='school-trace-sheet')q.voice_practice=true;});
  return a;
}
function install(){
  var Act=window.SakhiActivities;if(!Act||typeof Act.generate!=='function'||Act.__normalized)return false;
  var original=Act.generate;
  Act.generate=function(){return activity(original.apply(Act,arguments));};
  Act.__normalized=true;return true;
}
return{text:text,question:normalizeQuestion,activity:activity,install:install,oralKinds:Object.keys(ORAL_KINDS)};
})();
window.SakhiNormalize.install();
