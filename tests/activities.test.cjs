const fs=require('fs'),vm=require('vm'),path=require('path');const root=path.join(__dirname,'..');const curriculum=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json'),'utf8'));
const ctx={window:{},console};ctx.window.window=ctx.window;vm.createContext(ctx);ctx.window.SakhiCurriculum={skill:id=>curriculum.skills.find(s=>s.skill_id===id)||null};
for(const f of ['sakhi-content.js','sakhi-activities.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
let n=0;for(const s of curriculum.skills)for(let b=1;b<=5;b++)for(let seed=0;seed<5;seed++){const a=ctx.window.SakhiActivities.generate(s.skill_id,b,String(seed));if(!a.questions||a.questions.length!==3)throw new Error('Bad activity '+s.skill_id);for(const q of a.questions){if(!q.template||q.answer===undefined)throw new Error('Bad question '+s.skill_id);}n++;}
console.log(`Activity generation passed: ${n} skill/band/seed combinations`);
