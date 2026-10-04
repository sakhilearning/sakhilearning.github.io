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
window.SAKHI_CURRICULUM_DATA=curriculum;
for(const f of ['sakhi-curriculum.js','sakhi-progress.js','sakhi-content.js','sakhi-activities.js','sakhi-normalize.js'])require(path.join(root,f));
window.SakhiCurriculum.load();
const A=window.SakhiActivities;
const CORE=new Set(['reading','math','science','logic','world','language']);
const SOCIAL_KINDS=new Set(['conversation','social','emotions','problem_solving','self_management']);
const OPEN_TEMPLATES=new Set(['guided','trace','school-trace-sheet','school-name-page','school-portrait']);
const task=q=>String(q.prompt||'')+'|'+JSON.stringify(q.answer===undefined?null:q.answer);
let academic=0,questions=0;
for(const sk of curriculum.skills){
  const seen=new Set(),prompts=[];let firstTemplate=null;
  for(let seed=0;seed<30;seed++){
    let a;try{a=A.generate(sk.skill_id,3,'experience-'+seed,[],{});}catch(e){failures.push(`${sk.skill_id}: generation failed: ${e.message}`);break;}
    for(const q of a.questions||[]){
      firstTemplate=firstTemplate||q.template;seen.add(task(q));prompts.push(String(q.prompt||''));questions++;
      const grown=/\b(grown[- ]?up|parent|mom|dad|mother|father)\b/i.test(String(q.prompt||''));
      if(CORE.has(sk.domain_id)&&grown&&!SOCIAL_KINDS.has(sk.kind))failures.push(`${sk.skill_id}: academic child-facing prompt unnecessarily depends on a grown-up: ${q.prompt}`);
      if(/\b(show|teach|explain) (a|your) grown[- ]?up\b/i.test(String(q.prompt||'')))failures.push(`${sk.skill_id}: presentation-to-grown-up prompt returned: ${q.prompt}`);
      if(/^(question|choice|option)\s*\d+/i.test(String(q.prompt||'').trim()))failures.push(`${sk.skill_id}: quiz-placeholder wording returned: ${q.prompt}`);
    }
  }
  if(CORE.has(sk.domain_id)&&!OPEN_TEMPLATES.has(firstTemplate)){
    academic++;
    if(seen.size<10)failures.push(`${sk.skill_id}: only ${seen.size} distinct band-3 tasks across 30 sittings; core academic floor is 10`);
  }
  const uniquePrompts=new Set(prompts).size;
  if(prompts.length>=20&&!OPEN_TEMPLATES.has(firstTemplate)&&uniquePrompts<Math.min(8,seen.size))failures.push(`${sk.skill_id}: prompt surface is repetitive (${uniquePrompts} unique prompts)`);
}
if(academic<80)failures.push(`academic audit covered only ${academic} question-asking skills`);
if(questions<8000)failures.push(`student experience audit generated too few questions: ${questions}`);
if(failures.length){console.error('student-experience FAILED:\n- '+failures.slice(0,120).join('\n- '));if(failures.length>120)console.error(`... and ${failures.length-120} more`);process.exit(1);}
console.log(`student-experience passed: ${academic} core academic skills exceed the deeper freshness floor; ${questions} generated questions avoid placeholder and unnecessary grown-up dependency.`);
