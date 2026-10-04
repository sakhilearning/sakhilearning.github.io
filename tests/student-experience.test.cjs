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
const OPEN_TEMPLATES=new Set(['guided','trace','school-trace-sheet','school-name-page','school-portrait']);
const CONCEPT_FLOORS={'reading.print_concepts':9};
const task=q=>[String(q.prompt||''),JSON.stringify(q.answer===undefined?null:q.answer),String(q.media&&q.media.passage||'')].join('|');
const adultDependency=/\b(?:ask|show|teach|tell|explain|read)\b.{0,28}\b(?:a |your )?(?:grown[- ]?up|parent|mom|dad|mother|father)\b/i;
let academic=0,questions=0;
for(const sk of curriculum.skills){
  const seen=new Set();let firstTemplate=null;
  for(let seed=0;seed<30;seed++){
    let a;try{a=A.generate(sk.skill_id,3,'experience-'+seed,[],{});}catch(e){failures.push(`${sk.skill_id}: generation failed: ${e.message}`);break;}
    for(const q of a.questions||[]){
      firstTemplate=firstTemplate||q.template;seen.add(task(q));questions++;
      const prompt=String(q.prompt||'').trim();
      if(CORE.has(sk.domain_id)&&adultDependency.test(prompt))failures.push(`${sk.skill_id}: academic task depends on an adult instead of the learner: ${prompt}`);
      if(/\b(?:show|teach|explain) (?:a|your) grown[- ]?up\b/i.test(prompt))failures.push(`${sk.skill_id}: presentation-to-grown-up prompt returned: ${prompt}`);
      if(/^(question|choice|option)\s*\d+/i.test(prompt))failures.push(`${sk.skill_id}: quiz-placeholder wording returned: ${prompt}`);
    }
  }
  if(CORE.has(sk.domain_id)&&!OPEN_TEMPLATES.has(firstTemplate)){
    academic++;
    const floor=CONCEPT_FLOORS[sk.skill_id]||10;
    if(seen.size<floor)failures.push(`${sk.skill_id}: only ${seen.size} distinct band-3 learning tasks across 30 sittings; required floor is ${floor}`);
  }
}
if(academic<80)failures.push(`academic audit covered only ${academic} question-asking skills`);
if(questions<8000)failures.push(`student experience audit generated too few questions: ${questions}`);
if(failures.length){console.error('student-experience FAILED:\n- '+failures.slice(0,120).join('\n- '));if(failures.length>120)console.error(`... and ${failures.length-120} more`);process.exit(1);}
console.log(`student-experience passed: ${academic} core academic skills meet meaningful task-depth floors; ${questions} generated questions avoid placeholder and unnecessary adult-dependency prompts.`);
