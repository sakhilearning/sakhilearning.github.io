window.SakhiQuality=(function(){
'use strict';
var REQUIRED_VISUAL_KINDS={count:true,subitize:true,compose:true,add:true,sub:true,teen:true,pattern:true};
var BANNED_PLACEHOLDERS=[/\bchoice\s*[1234]\b/i,/\boption\s*[1234]\b/i,/lorem ipsum/i,/todo\b/i,/tbd\b/i];
function words(s){return String(s||'').trim().split(/\s+/).filter(Boolean);}
function issue(code,message,severity){return{code:code,message:message,severity:severity||'error'};}
function numeric(v){return typeof v==='number'&&isFinite(v);}
function mediaMatches(skill,q){var out=[],m=q&&q.media||null,k=skill&&skill.kind||'';
 if(REQUIRED_VISUAL_KINDS[k]&&!m)out.push(issue('VISUAL_REQUIRED','This skill depends on a concrete visual, but the generated question has no media.'));
 if(!m)return out;
 if(m.count!==undefined&&(!Number.isInteger(m.count)||m.count<1))out.push(issue('COUNT_MEDIA_INVALID','Count media must contain a positive integer.'));
 if(m.groups){if(!Array.isArray(m.groups)||m.groups.length<2||m.groups.some(function(x){return!numeric(x)||x<0;}))out.push(issue('GROUP_MEDIA_INVALID','Group media must contain valid non-negative quantities.'));else if(k==='add'&&numeric(q.answer)&&m.groups.reduce(function(a,b){return a+b;},0)!==Number(q.answer))out.push(issue('GROUP_MEDIA_MISMATCH','Addition picture does not equal the authored answer.'));}
 if(m.subtract){if(!Array.isArray(m.subtract)||m.subtract.length!==2||m.subtract.some(function(x){return!numeric(x);}))out.push(issue('SUBTRACT_MEDIA_INVALID','Subtraction media must contain start and removed quantities.'));else if(numeric(q.answer)&&Number(m.subtract[0])-Number(m.subtract[1])!==Number(q.answer))out.push(issue('SUBTRACT_MEDIA_MISMATCH','Subtraction picture does not equal the authored answer.'));}
 if(m.tenFrame){var tf=m.tenFrame;if(tf.tens!==undefined){var total=Number(tf.tens)*10+Number(tf.ones||0);if(numeric(q.answer)&&total!==Number(q.answer))out.push(issue('PLACE_VALUE_MEDIA_MISMATCH','Tens-and-ones picture does not equal the authored answer.'));}else if(tf.filled!==undefined&&tf.total!==undefined&&k==='compose'&&numeric(q.answer)&&Number(tf.filled)+Number(q.answer)!==Number(tf.total))out.push(issue('TEN_FRAME_MEDIA_MISMATCH','Ten-frame missing part does not equal the authored answer.'));}
 if(m.patternStrip&&(!Array.isArray(m.patternStrip)||m.patternStrip.length<4))out.push(issue('PATTERN_MEDIA_INVALID','Pattern strip must contain enough visible terms to establish the pattern.'));
 if(m.shape&&(!m.shape.src||!m.shape.name))out.push(issue('SHAPE_MEDIA_INVALID','Shape media needs both a source and an accessible name.'));
 if(m.visual&&!m.alt)out.push(issue('VISUAL_ALT_GENERIC','Authored assessment visuals should provide a question-specific alt description.','warning'));
 return out;
}
function inspectQuestion(skill,q){var out=[];if(!q||typeof q!=='object')return[issue('QUESTION_MISSING','Generated question is missing.')];
 var prompt=String(q.prompt||'').trim();if(!prompt)out.push(issue('PROMPT_EMPTY','Question prompt is empty.'));
 if(/\s{2,}/.test(prompt))out.push(issue('PROMPT_SPACING','Question prompt contains repeated spaces.'));
 BANNED_PLACEHOLDERS.forEach(function(re){if(re.test(prompt))out.push(issue('PLACEHOLDER_LANGUAGE','Question contains placeholder-style wording.'));});
 if(words(prompt).length>34&&!(q.media&&q.media.passage))out.push(issue('PROMPT_TOO_DENSE','Child-facing prompt exceeds 34 words without a separate passage.','warning'));
 if(q.template==='choice'){
  if(!Array.isArray(q.choices)||q.choices.length<2)out.push(issue('CHOICES_MISSING','Multiple-choice question needs at least two choices.'));
  else{var normalized=q.choices.map(function(x){return String(x);});if(new Set(normalized).size!==normalized.length)out.push(issue('CHOICES_DUPLICATE','Multiple-choice question contains duplicate choices.'));if(normalized.indexOf(String(q.answer))<0)out.push(issue('ANSWER_NOT_IN_CHOICES','Correct answer is not present among the choices.'));}
 }
 var spoken=String(q.spoken_instruction||q.narration||'').trim();if(!spoken)out.push(issue('NARRATION_MISSING','Question has no spoken instruction.'));
 out=out.concat(mediaMatches(skill,q));return out;
}
function inspectActivity(activity){var skill=window.SakhiCurriculum&&activity?window.SakhiCurriculum.skill(activity.skill_id):null,out=[];(activity&&activity.questions||[]).forEach(function(q,i){inspectQuestion(skill,q).forEach(function(x){x.question_index=i;x.skill_id=activity.skill_id;out.push(x);});});return out;}
function errors(activity){return inspectActivity(activity).filter(function(x){return x.severity!=='warning';});}
function warnings(activity){return inspectActivity(activity).filter(function(x){return x.severity==='warning';});}
return{inspectQuestion:inspectQuestion,inspectActivity:inspectActivity,errors:errors,warnings:warnings,requiredVisualKinds:Object.keys(REQUIRED_VISUAL_KINDS)};
})();
