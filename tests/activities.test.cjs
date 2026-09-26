const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json'),'utf8'));
const ctx={window:{},console};ctx.window.window=ctx.window;vm.createContext(ctx);ctx.window.SakhiCurriculum={skill:id=>curriculum.skills.find(s=>s.skill_id===id)||null};
for(const f of ['sakhi-content.js','sakhi-activities.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function bag(arr){const m=new Map();for(const v of arr){const k=String(v);m.set(k,(m.get(k)||0)+1);}return m;}
function containsBag(container,needed){const c=bag(container),n=bag(needed);for(const [k,v] of n)if((c.get(k)||0)<v)return false;return true;}
const printSkill=curriculum.skills.find(s=>s.kind==='print');
if(!printSkill)throw new Error('Print-concepts skill missing');
const printActivity=ctx.window.SakhiActivities.generate(printSkill.skill_id,1,'navigation-regression');
if(new Set(printActivity.questions.map(q=>q.prompt)).size!==3)throw new Error('Print-concepts activity repeats the same question and appears stuck');
let activities=0,questions=0;
for(const s of curriculum.skills)for(let b=1;b<=5;b++)for(let seed=0;seed<50;seed++){
  const a=ctx.window.SakhiActivities.generate(s.skill_id,b,String(seed));
  if(!a.questions||a.questions.length!==3)throw new Error('Bad activity '+s.skill_id+' band '+b+' seed '+seed);
  if(s.kind==='practice'&&a.questions.some(q=>q.template!=='guided'||!Array.isArray(q.steps)||q.steps.length<3||!q.success_criteria))throw new Error('Practice skill is vague or not measurable: '+s.skill_id);
  for(const q of a.questions){
    questions++;
    if(!q.template||q.answer===undefined)throw new Error('Bad question '+s.skill_id);
    if(!q.narration_policy)throw new Error('Narration policy missing '+s.skill_id);
    if(q.template==='choice'&&['count_sequence','numeral','count','subitize','compare','compose','add','sub','bond','teen','pattern','measure','shape','data','letter_name','cvc_read','cvc_spell'].includes(s.kind)&&q.narration_policy!=='prompt_only')throw new Error('Self-explanatory assessment will read every option: '+s.skill_id);
    if(/look at|this picture|this sentence|pictures|which ribbon|how many treasures do you see/i.test(q.prompt)){const m=q.media||{};if(!(m.visual||m.count||m.shape||m.groups||m.subtract||m.passage))throw new Error('Question depends on missing visual media: '+s.skill_id+' · '+q.prompt);}
    if(q.media&&q.media.visual&&!['leaves','ribbons','print-line','cat','dog','sun','memory'].includes(q.media.visual))throw new Error('Unknown assessment visual '+q.media.visual);
    if(q.template==='choice'){
      if(!Array.isArray(q.choices)||q.choices.length<2)throw new Error('Choice options missing '+s.skill_id);
      const serialized=q.choices.map(x=>JSON.stringify(x));
      if(new Set(serialized).size!==serialized.length)throw new Error('Duplicate choice option '+s.skill_id);
      if(q.choices.filter(x=>same(x,q.answer)).length!==1)throw new Error('Choice must contain exactly one correct answer '+s.skill_id);
    }
    if(q.template==='sequence'){
      if(!Array.isArray(q.tokens)||!Array.isArray(q.answer)||!q.tokens.length||!q.answer.length)throw new Error('Sequence data missing '+s.skill_id);
      if(!containsBag(q.tokens,q.answer)||!containsBag(q.answer,q.tokens))throw new Error('Sequence tokens do not match answer '+s.skill_id);
    }
    if(q.template==='build'){
      if(!Array.isArray(q.tokens)||!Array.isArray(q.answer)||!q.tokens.length||!q.answer.length)throw new Error('Build data missing '+s.skill_id);
      if(!containsBag(q.tokens,q.answer))throw new Error('Build answer contains unavailable token '+s.skill_id);
    }
    if(q.template==='guided'&&(!Array.isArray(q.steps)||q.steps.length<3||!q.success_criteria))throw new Error('Guided task lacks steps or success criteria: '+s.skill_id);
  }
  if(new Set(a.questions.map(q=>q.question_key)).size!==a.questions.length)throw new Error('Activity repeats a question: '+s.skill_id+' band '+b+' seed '+seed);
  activities++;
}
console.log(`Activity generation passed: ${activities} activities / ${questions} questions across ${curriculum.skills.length} skills × 5 bands × 50 seeds`);
