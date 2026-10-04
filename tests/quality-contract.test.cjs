const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json'),'utf8'));
const ctx={console};ctx.window=ctx;ctx.SakhiCurriculum={skill:id=>curriculum.skills.find(s=>s.skill_id===id)||null};ctx.SakhiProgress={snapshot:()=>({learner:{name:'Sakhi'}})};vm.createContext(ctx);
for(const f of ['sakhi-content.js','sakhi-activities.js','sakhi-schoolwork.js','sakhi-quality.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
const failures=[];
for(const sk of curriculum.skills){
  for(const band of [1,3,5]){
    for(let seed=0;seed<3;seed++){
      let activity;try{activity=ctx.SakhiActivities.generate(sk.skill_id,band,'quality:'+seed,[],{teachFirst:seed===0});}catch(e){failures.push(sk.skill_id+' b'+band+' generation: '+e.message);continue;}
      const report=ctx.SakhiQuality.auditActivity(activity);if(!report.ok)failures.push(sk.skill_id+' b'+band+': '+report.errors.join(' | '));
    }
  }
}
const targeted=['math.cardinality_20','math.compare','writing.labels','writing.uppercase','reading.letter_names_lower'];
for(const id of targeted){const a=ctx.SakhiActivities.generate(id,3,'targeted',[],{}),r=ctx.SakhiQuality.auditActivity(a);if(!r.ok)failures.push(id+' targeted: '+r.errors.join(' | '));}
if(failures.length){console.error('quality-contract FAILED\n- '+failures.slice(0,40).join('\n- '));console.error('total failures: '+failures.length);process.exit(1);}
console.log('quality-contract: '+curriculum.skills.length+' skills passed structure, wording, uniqueness, phase, answer, and semantic-visual contracts across three bands.');
