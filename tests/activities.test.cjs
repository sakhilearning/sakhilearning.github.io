const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json'),'utf8'));
const ctx={window:{},console};ctx.window.window=ctx.window;vm.createContext(ctx);ctx.window.SakhiCurriculum={skill:id=>curriculum.skills.find(s=>s.skill_id===id)||null};
for(const f of ['sakhi-content.js','sakhi-activities.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
function same(a,b){return JSON.stringify(a)===JSON.stringify(b);}
function bag(arr){const m=new Map();for(const v of arr){const k=String(v);m.set(k,(m.get(k)||0)+1);}return m;}
function containsBag(container,needed){const c=bag(container),n=bag(needed);for(const [k,v] of n)if((c.get(k)||0)<v)return false;return true;}
let activities=0,questions=0;
for(const s of curriculum.skills)for(let b=1;b<=5;b++)for(let seed=0;seed<50;seed++){
  const a=ctx.window.SakhiActivities.generate(s.skill_id,b,String(seed));
  if(!a.questions||a.questions.length!==3)throw new Error('Bad activity '+s.skill_id+' band '+b+' seed '+seed);
  for(const q of a.questions){
    questions++;
    if(!q.template||q.answer===undefined)throw new Error('Bad question '+s.skill_id);
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
  }
  activities++;
}
console.log(`Activity generation passed: ${activities} activities / ${questions} questions across 85 skills × 5 bands × 50 seeds`);
