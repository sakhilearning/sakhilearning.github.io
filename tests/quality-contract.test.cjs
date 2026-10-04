const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const failures=[];
const check=(label,cond,extra)=>{if(!cond)failures.push(label+(extra!==undefined?'  <'+JSON.stringify(extra)+'>':''));};
const store={};
global.localStorage={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
global.sessionStorage=global.localStorage;global.crypto=require('crypto').webcrypto;global.navigator={onLine:false};global.fetch=()=>Promise.reject(new Error('offline'));global.addEventListener=()=>{};global.window={addEventListener:()=>{}};global.document={addEventListener:()=>{},readyState:'complete'};
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'data/curriculum-v3.json'),'utf8'));global.window.SAKHI_CURRICULUM_DATA=curriculum;
for(const f of ['sakhi-curriculum.js','sakhi-progress.js','sakhi-content.js','sakhi-activities.js','sakhi-normalize.js','sakhi-quality.js'])require(path.join(root,f));
global.SakhiCurriculum=global.window.SakhiCurriculum;global.SakhiProgress=global.window.SakhiProgress;global.window.SakhiCurriculum.load();
const Act=global.window.SakhiActivities,Q=global.window.SakhiQuality;let inspected=0,warningCount=0;const errors=[],duplicateKeys=[],emptyActivities=[];
for(const sk of curriculum.skills){for(const band of [1,2,3,4,5]){let a;try{a=Act.generate(sk.skill_id,band,'quality-'+sk.skill_id+'-'+band,[],{});}catch(e){errors.push(sk.skill_id+'@'+band+': generate threw '+e.message);continue;}if(!a||!Array.isArray(a.questions)||!a.questions.length){emptyActivities.push(sk.skill_id+'@'+band);continue;}inspected++;Q.inspectActivity(a).forEach(i=>{const label=sk.skill_id+'@'+band+' q'+(i.question_index===undefined?'?':i.question_index)+' '+i.code+': '+i.message;if(i.severity==='warning')warningCount++;else errors.push(label);});const keys=a.questions.map(q=>q.question_key).filter(Boolean);if(new Set(keys).size!==keys.length)duplicateKeys.push(sk.skill_id+'@'+band);}}
check('every skill/band produced an activity',emptyActivities.length===0,emptyActivities.slice(0,12));
check('generated activities have no semantic/visual contract errors',errors.length===0,errors.slice(0,20));
check('question keys do not collide within an activity',duplicateKeys.length===0,duplicateKeys.slice(0,12));
check('quality gate exercised the full curriculum',inspected>=curriculum.skills.length*5,inspected);
check('quality warnings stay below 5% of generated activities',warningCount<=Math.ceil(inspected*.05),{warnings:warningCount,activities:inspected});
if(failures.length){console.error('quality-contract FAILED:\n- '+failures.join('\n- '));process.exit(1);}console.log(`quality-contract passed: ${inspected} generated activities across ${curriculum.skills.length} skills; semantic/visual errors 0; warnings ${warningCount}.`);
