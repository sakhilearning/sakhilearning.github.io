const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const failures=[];
const store={};
global.localStorage={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
global.sessionStorage=global.localStorage;
global.crypto=require('crypto').webcrypto;
global.navigator={onLine:false};
global.fetch=()=>Promise.reject(new Error('offline in tests'));
global.addEventListener=()=>{};
global.window={addEventListener:()=>{}};
global.document={addEventListener:()=>{},readyState:'complete'};
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json'),'utf8'));
global.window.SAKHI_CURRICULUM_DATA=curriculum;
for(const f of ['sakhi-curriculum.js','sakhi-progress.js','sakhi-content.js','sakhi-activities.js','sakhi-quality.js'])require(path.join(root,f));
window.SakhiCurriculum.load();
const A=window.SakhiActivities,Q=window.SakhiQuality;
let activities=0,questions=0,warnings=0,visualKinds=new Set();
for(const sk of curriculum.skills){
  for(const band of [1,2,3,4,5]){
    for(let seed=0;seed<4;seed++){
      let a;
      try{a=A.generate(sk.skill_id,band,'quality-'+seed,[],{});}catch(e){failures.push(`${sk.skill_id} band ${band} generation threw: ${e.message}`);continue;}
      activities++;
      const issues=Q.inspectActivity(a);
      warnings+=issues.filter(x=>x.severity==='warning').length;
      const fatal=issues.filter(x=>x.severity!=='warning');
      if(fatal.length)failures.push(`${sk.skill_id} band ${band}: ${fatal.map(x=>x.code).join(', ')}`);
      (a.questions||[]).forEach(q=>{questions++;if(q.media)visualKinds.add(sk.kind);});
    }
  }
}
for(const kind of Q.requiredVisualKinds){if(!visualKinds.has(kind))failures.push(`required visual kind ${kind} produced no media in the audit matrix`);}
if(activities<500)failures.push(`quality audit exercised too few activities: ${activities}`);
if(questions<1200)failures.push(`quality audit exercised too few questions: ${questions}`);
if(failures.length){console.error('quality-contracts FAILED:\n- '+failures.slice(0,80).join('\n- '));process.exit(1);}
console.log(`quality-contracts passed: ${activities} activities, ${questions} questions, ${visualKinds.size} skill kinds with media, ${warnings} non-blocking readability/accessibility warnings.`);
