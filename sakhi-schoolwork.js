window.SakhiSchoolwork=(function(){
'use strict';
var VERSION='school-v1';
var TRACE_SKILLS={
  'writing.uppercase':true,
  'writing.lowercase':true,
  'writing.numerals':true,
  'math.write_numerals':true
};
var LETTER_SKILLS={'reading.letter_names_upper':true,'reading.letter_names_lower':true};
var LIFE_SKILLS={'wellbeing.friendship':true,'wellbeing.routines':true,'wellbeing.safety':true};

function clone(x){return JSON.parse(JSON.stringify(x));}
function baseKey(key){return String(key||'').replace(new RegExp('\\|'+VERSION+'$'),'');}
function schoolKey(key){return baseKey(key)+'|'+VERSION;}
function mappedAvoid(avoid){var out=(avoid||[]).slice();(avoid||[]).forEach(function(k){if(String(k).slice(-(VERSION.length+1))==='|'+VERSION){var b=baseKey(k);if(out.indexOf(b)<0)out.push(b);}});return out;}
function copyMeta(base,q){
  q.question_key=schoolKey(base.question_key);
  q.content_id=(base.content_id||'school')+':'+VERSION;
  q.assessment_id=base.assessment_id;
  q.learning_objective=base.learning_objective;
  q.difficulty=base.difficulty;
  q.learning_phase=base.learning_phase;
  q.coach_tip=base.coach_tip;
  q.teaching=base.teaching?clone(base.teaching):undefined;
  q.narration_policy=base.narration_policy||'prompt_only';
  q.hints=clone(base.hints||['Look carefully.','Take your time.']);
  q.spoken_instruction=base.spoken_instruction||base.narration||base.prompt;
  q.narration=q.spoken_instruction;
  return q;
}
function traceSheet(base){
  var target=String(base.trace_target||''),parts=target.split(':'),kind=parts[0],value=parts.slice(1).join(':');
  if(!value||(kind!=='letter'&&kind!=='number'))return null;
  return copyMeta(base,{
    template:'school-trace-sheet',
    prompt:base.prompt,
    answer:'done',
    trace_target:target,
    evidence_mode:'practice',
    sheet:{kind:kind,target:value,tracePads:2,freePads:1}
  });
}
function letterGap(base,skillId){
  if(!Array.isArray(base.choices)||base.choices.length<2)return null;
  var answer=String(base.answer||''),upper=skillId==='reading.letter_names_upper',alphabet='abcdefghijklmnopqrstuvwxyz'.split('');
  if(upper)alphabet=alphabet.map(function(x){return x.toUpperCase();});
  var i=alphabet.indexOf(answer);if(i<0)return null;
  var prev=alphabet[(i+alphabet.length-1)%alphabet.length],next=alphabet[(i+1)%alphabet.length];
  return copyMeta(base,{
    template:'school-letter-gap',prompt:base.prompt,answer:answer,choices:clone(base.choices),
    evidence_mode:base.evidence_mode,
    sheet:{target:answer,before:prev,after:next,case:upper?'uppercase':'lowercase'}
  });
}
function countMatch(base){
  if(!base.media||!base.media.count||!Array.isArray(base.choices))return null;
  return copyMeta(base,{
    template:'school-count-match',prompt:base.prompt,answer:base.answer,choices:clone(base.choices),
    evidence_mode:base.evidence_mode,media:clone(base.media),sheet:{count:Number(base.media.count)||0}
  });
}
function compareCard(base){
  var nums=String(base.prompt||'').match(/\b\d+\b/g)||[];
  if(nums.length<2)return null;
  var a=Number(nums[0]),b=Number(nums[1]);
  if(a===b||String(base.answer)!==String(a)&&String(base.answer)!==String(b))return null;
  return copyMeta(base,{
    template:'school-number-compare',prompt:base.prompt,answer:base.answer,choices:[a,b],
    evidence_mode:base.evidence_mode,media:base.media?clone(base.media):null,sheet:{pair:[a,b]}
  });
}
function lifeChoice(base,skillId){
  if(base.template!=='choice'||!Array.isArray(base.choices))return null;
  return copyMeta(base,{
    template:'school-life-choice',prompt:base.prompt,answer:base.answer,choices:clone(base.choices),
    evidence_mode:base.evidence_mode,sheet:{area:skillId==='wellbeing.safety'?'safe choice':skillId==='wellbeing.routines'?'school routine':'kind choice'}
  });
}
function namePage(base){
  return copyMeta(base,{
    template:'school-name-page',prompt:base.prompt||'Write your name and draw yourself.',answer:'done',
    evidence_mode:'practice',sheet:{personal:true}
  });
}
function enhanceQuestion(skillId,base,index){
  var q=null;
  if(TRACE_SKILLS[skillId])q=traceSheet(base);
  else if(LETTER_SKILLS[skillId])q=letterGap(base,skillId);
  else if(skillId==='math.cardinality_20'&&base.template==='choice')q=countMatch(base);
  else if(skillId==='math.compare'&&base.template==='choice')q=compareCard(base);
  else if(skillId==='writing.name'&&index===1)q=namePage(base);
  else if(LIFE_SKILLS[skillId])q=lifeChoice(base,skillId);
  return q||base;
}
function enhanceActivity(activity,avoid){
  if(!activity||!Array.isArray(activity.questions))return activity;
  var blocked={};(avoid||[]).forEach(function(k){blocked[String(k)]=true;});
  activity.questions=activity.questions.map(function(base,index){
    var q=enhanceQuestion(activity.skill_id,base,index);
    if(q!==base&&blocked[q.question_key])return base;
    return q;
  });
  activity.schoolwork_version=VERSION;
  activity.evidence_mode=activity.questions.every(function(q){return q.evidence_mode==='practice';})?'practice':'objective';
  return activity;
}

function clear(root){while(root&&root.firstChild)root.removeChild(root.firstChild);}
function notify(ctx){if(ctx&&typeof ctx.onProgress==='function')ctx.onProgress();}
function activate(el,fn){
  var touch=false,timer=null;
  el.addEventListener('pointerup',function(e){if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;touch=true;clearTimeout(timer);fn(e);timer=setTimeout(function(){touch=false;},350);});
  el.addEventListener('click',function(e){if(touch){e.preventDefault();return;}fn(e);});
}
function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
function choiceButton(text,cls){var b=el('button',cls||'school-choice',text);b.type='button';b.setAttribute('aria-pressed','false');return b;}
function wireSingleChoice(root,values,answer,ctx,cls){
  var state={response:null},buttons=[];
  values.forEach(function(v){var b=choiceButton(String(v),cls);buttons.push(b);activate(b,function(){buttons.forEach(function(x){x.classList.remove('selected');x.setAttribute('aria-pressed','false');});b.classList.add('selected');b.setAttribute('aria-pressed','true');state.response=v;notify(ctx);});root.appendChild(b);});
  return{immediate:false,isReady:function(){return state.response!==null;},check:function(){return{correct:String(state.response)===String(answer),response:state.response};},reset:function(){state.response=null;buttons.forEach(function(b){b.classList.remove('selected');b.setAttribute('aria-pressed','false');});notify(ctx);}};
}
function worksheetTitle(root,label,title){var head=el('div','school-sheet-head'),badge=el('span','school-sheet-badge',label),h=el('strong','school-sheet-title',title);head.appendChild(badge);head.appendChild(h);root.appendChild(head);}

function renderLetterGap(root,q,ctx){
  clear(root);worksheetTitle(root,'LETTER WORK','Find the missing letter');
  var strip=el('div','school-letter-strip');
  [q.sheet.before,null,q.sheet.after].forEach(function(v){var box=el('div','school-letter-box'+(v===null?' is-gap':''),v===null?'?':v);strip.appendChild(box);});
  root.appendChild(strip);
  var hint=el('p','school-sheet-help','Choose the letter that belongs between the two letters.');root.appendChild(hint);
  var bank=el('div','school-letter-bank');root.appendChild(bank);
  return wireSingleChoice(bank,q.choices,q.answer,ctx,'school-letter-choice');
}
function renderCount(root,q,ctx){
  clear(root);worksheetTitle(root,'COUNT & MATCH','Count each treasure once');
  var field=el('div','school-count-field');
  var icons=['●','◆','★','♥'],symbol=icons[(Number(q.sheet.count)||1)%icons.length],tapped=0;
  for(var i=0;i<q.sheet.count;i++)(function(){var b=choiceButton(symbol,'school-count-object'),mark=el('span','school-count-mark','');b.appendChild(mark);activate(b,function(){if(b.dataset.counted==='1')return;b.dataset.counted='1';tapped++;b.classList.add('counted');mark.textContent=String(tapped);});field.appendChild(b);}());
  root.appendChild(field);root.appendChild(el('p','school-sheet-help','Tap the pictures as you count, then choose the number.'));
  var bank=el('div','school-number-bank');root.appendChild(bank);
  return wireSingleChoice(bank,q.choices,q.answer,ctx,'school-number-choice');
}
function renderCompare(root,q,ctx){
  clear(root);worksheetTitle(root,'COMPARE NUMBERS','Choose from the pair');
  var pair=el('div','school-compare-pair');root.appendChild(pair);
  var widget=wireSingleChoice(pair,q.sheet.pair,q.answer,ctx,'school-compare-number');
  var sign=el('div','school-compare-sign','?');sign.setAttribute('aria-hidden','true');root.appendChild(sign);
  return widget;
}
function drawWritingGuide(g,w,h){
  g.clearRect(0,0,w,h);g.fillStyle='#fffdf8';g.fillRect(0,0,w,h);g.strokeStyle='#c8b9d8';g.lineWidth=2;g.setLineDash([]);
  var top=Math.round(h*.22),mid=Math.round(h*.50),base=Math.round(h*.78);
  g.beginPath();g.moveTo(16,top);g.lineTo(w-16,top);g.moveTo(16,base);g.lineTo(w-16,base);g.stroke();
  g.strokeStyle='#dfd4e9';g.setLineDash([8,8]);g.beginPath();g.moveTo(16,mid);g.lineTo(w-16,mid);g.stroke();g.setLineDash([]);
}
function writingFontSize(target,kind){
  if(kind==='number')return 150;
  if(kind==='name')return Math.max(54,Math.min(118,Math.floor(380/Math.max(3,String(target||'').length))));
  return 170;
}
function makePad(holder,target,guided,kind,onMark,label){
  var wrap=el('div','school-pen-wrap'),lab=el('small','school-pen-label',label),c=el('canvas','school-pen-canvas');c.width=440;c.height=250;c.setAttribute('aria-label',label+' '+target);wrap.appendChild(lab);wrap.appendChild(c);holder.appendChild(wrap);
  var g=c.getContext('2d'),drawing=false,marks=0;
  function guide(){drawWritingGuide(g,c.width,c.height);if(guided){g.save();g.strokeStyle='#b7a6cf';g.lineWidth=5;g.setLineDash([8,9]);g.font='bold '+writingFontSize(target,kind)+'px ui-rounded, system-ui, sans-serif';g.textAlign='center';g.textBaseline='middle';g.strokeText(target,c.width/2,c.height*.51);g.restore();g.fillStyle='#ff72b6';g.beginPath();g.arc(58,56,9,0,Math.PI*2);g.fill();}}
  function pos(e){var r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};}
  function start(e){drawing=true;if(c.setPointerCapture)try{c.setPointerCapture(e.pointerId);}catch(x){}var p=pos(e);g.beginPath();g.moveTo(p.x,p.y);e.preventDefault();}
  function move(e){if(!drawing)return;var p=pos(e);g.strokeStyle='#7551d6';g.lineWidth=10;g.lineCap='round';g.lineJoin='round';g.lineTo(p.x,p.y);g.stroke();marks++;if(marks===12&&onMark)onMark();e.preventDefault();}
  function end(){drawing=false;}
  guide();c.addEventListener('pointerdown',start);c.addEventListener('pointermove',move);c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
  return{ready:function(){return marks>=12;},reset:function(){drawing=false;marks=0;guide();}};
}
function renderTraceSheet(root,q,ctx){
  clear(root);worksheetTitle(root,q.sheet.kind==='number'?'NUMBER WRITING':'LETTER WRITING','Trace it, then try it yourself');
  var hero=el('div','school-trace-hero',q.sheet.target);root.appendChild(hero);root.appendChild(el('p','school-sheet-help','Follow the dotted model first. Then write one by yourself.'));
  var pads=el('div','school-pen-grid'),all=[];root.appendChild(pads);
  function changed(){notify(ctx);}
  for(var i=0;i<(q.sheet.tracePads||2);i++)all.push(makePad(pads,q.sheet.target,true,q.sheet.kind,changed,'Trace '+(i+1)));
  for(var j=0;j<(q.sheet.freePads||1);j++)all.push(makePad(pads,q.sheet.target,false,q.sheet.kind,changed,'My turn'));
  return{immediate:false,isReady:function(){return all.every(function(p){return p.ready();});},check:function(){return{correct:true,response:'traced and wrote '+q.sheet.target};},reset:function(){all.forEach(function(p){p.reset();});notify(ctx);}};
}
function renderNamePage(root,q,ctx){
  clear(root);worksheetTitle(root,'MY NAME','My name and me');
  var name='Sakhi';try{var s=window.SakhiProgress&&SakhiProgress.snapshot?SakhiProgress.snapshot():null;if(s&&s.learner&&s.learner.name)name=String(s.learner.name).slice(0,30);}catch(e){}
  var model=el('div','school-name-model',name);root.appendChild(model);root.appendChild(el('p','school-sheet-help','Trace your name, write it again, then draw a picture of yourself.'));
  var pads=el('div','school-name-grid'),ready=[false,false,false];root.appendChild(pads);
  var p1=makePad(pads,name,true,'name',function(){ready[0]=true;notify(ctx);},'Trace my name');
  var p2=makePad(pads,name,false,'name',function(){ready[1]=true;notify(ctx);},'Write my name');
  var portrait=el('div','school-portrait-wrap'),label=el('small','school-pen-label','This is me'),c=el('canvas','school-portrait-canvas');c.width=520;c.height=360;portrait.appendChild(label);portrait.appendChild(c);pads.appendChild(portrait);
  var g=c.getContext('2d'),drawing=false,marks=0;g.fillStyle='#fffdf8';g.fillRect(0,0,c.width,c.height);g.strokeStyle='#e3d9ec';g.lineWidth=4;g.strokeRect(8,8,c.width-16,c.height-16);
  function pos(e){var r=c.getBoundingClientRect();return{x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height};}
  c.addEventListener('pointerdown',function(e){drawing=true;var p=pos(e);g.beginPath();g.moveTo(p.x,p.y);e.preventDefault();});
  c.addEventListener('pointermove',function(e){if(!drawing)return;var p=pos(e);g.strokeStyle='#7551d6';g.lineWidth=8;g.lineCap='round';g.lineTo(p.x,p.y);g.stroke();marks++;if(marks===12){ready[2]=true;notify(ctx);}e.preventDefault();});
  c.addEventListener('pointerup',function(){drawing=false;});c.addEventListener('pointercancel',function(){drawing=false;});
  return{immediate:false,isReady:function(){return p1.ready()&&p2.ready()&&ready[2];},check:function(){return{correct:true,response:'name and portrait completed'};},reset:function(){p1.reset();p2.reset();ready=[false,false,false];drawing=false;marks=0;g.clearRect(0,0,c.width,c.height);g.fillStyle='#fffdf8';g.fillRect(0,0,c.width,c.height);g.strokeStyle='#e3d9ec';g.lineWidth=4;g.strokeRect(8,8,c.width-16,c.height-16);notify(ctx);}};
}
function renderLifeChoice(root,q,ctx){
  clear(root);worksheetTitle(root,'LIFE SKILLS',String(q.sheet.area||'good choice').toUpperCase());
  root.appendChild(el('p','school-sheet-help',q.sheet.area==='safe choice'?'Choose the safest answer.':q.sheet.area==='school routine'?'Choose what belongs in the routine.':'Choose the kind and fair answer.'));
  var bank=el('div','school-life-options');root.appendChild(bank);
  return wireSingleChoice(bank,q.choices,q.answer,ctx,'school-life-option');
}
function renderSchool(root,q,ctx){
  if(!q||String(q.template||'').indexOf('school-')!==0)return null;
  if(q.template==='school-letter-gap')return renderLetterGap(root,q,ctx);
  if(q.template==='school-count-match')return renderCount(root,q,ctx);
  if(q.template==='school-number-compare')return renderCompare(root,q,ctx);
  if(q.template==='school-trace-sheet')return renderTraceSheet(root,q,ctx);
  if(q.template==='school-name-page')return renderNamePage(root,q,ctx);
  if(q.template==='school-life-choice')return renderLifeChoice(root,q,ctx);
  return null;
}
function install(){
  if(window.SakhiActivities&&!window.SakhiActivities.__schoolworkWrapped){
    var A=window.SakhiActivities,baseGenerate=A.generate,baseCan=A.canGenerate;
    var wrapped={};Object.keys(A).forEach(function(k){wrapped[k]=A[k];});
    wrapped.generate=function(skillId,band,seed,avoid,context){var originalAvoid=avoid||[],activity=baseGenerate.call(A,skillId,band,seed,mappedAvoid(originalAvoid),context);return enhanceActivity(activity,originalAvoid);};
    wrapped.canGenerate=function(skillId){try{return!!wrapped.generate(skillId,3,'schoolwork-preflight',[],{}).questions.length;}catch(e){return baseCan?baseCan.call(A,skillId):false;}};
    wrapped.__schoolworkWrapped=true;wrapped.__baseGenerate=baseGenerate;window.SakhiActivities=wrapped;
  }
  if(window.SakhiTemplates&&!window.SakhiTemplates.__schoolworkWrapped){
    var T=window.SakhiTemplates,baseRender=T.render,next={};Object.keys(T).forEach(function(k){next[k]=T[k];});
    next.render=function(root,q,ctx){var rendered=renderSchool(root,q,ctx);return rendered||baseRender.call(T,root,q,ctx);};
    next.__schoolworkWrapped=true;window.SakhiTemplates=next;
  }
}
install();
return{VERSION:VERSION,enhanceActivity:enhanceActivity,renderSchool:renderSchool,mappedAvoid:mappedAvoid,install:install};
})();
