const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'sakhi-progress.js'),'utf8');
const store={
  'sakhi.v3.progress':JSON.stringify({
    version:5,
    updated_at:'2026-09-20T00:00:00Z',
    learner:{name:'Sakhi'},
    settings:{session_minutes:30,voice:true,reduced_motion:false,challenge:'AUTO'},
    skills:{},
    sessions:[],
    attempts:[{id:'local-lesson',at:'2026-09-20T00:00:00Z',skill_id:'math.compare',domain_id:'math'}],
    question_history:[],
    rewards:[{id:'local-lesson',at:'2026-09-20T00:00:00Z',amount:3}],
    active_run:null
  })
};
let saved=null;
const remote={
  version:5,
  updated_at:'2026-09-21T00:00:00Z',
  learner:{name:'Sakhi'},
  settings:{session_minutes:30,voice:true,reduced_motion:false,challenge:'AUTO'},
  skills:{},
  sessions:[],
  attempts:[{id:'remote-lesson',at:'2026-09-21T00:00:00Z',skill_id:'reading.short_vowels',domain_id:'reading'}],
  question_history:[],
  rewards:[{id:'remote-lesson',at:'2026-09-21T00:00:00Z',amount:3}],
  active_run:{savedAt:2,missionIndex:1,qIndex:2,current:{skill_id:'reading.short_vowels'}}
};
const cloud={
  state:()=>({status:'CONNECTED',userId:'parent-1'}),
  loadSnapshot:async()=>({synced:true,snapshot:remote}),
  saveSnapshot:async snap=>{saved=JSON.parse(JSON.stringify(snap));return{synced:true,snapshot:Object.assign({},snap,{updated_at:'2026-09-22T00:00:00Z'})};},
  enqueue:()=>{}
};
const ctx={window:null,console,Date,setTimeout,clearTimeout,crypto:{randomUUID:()=> 'id'},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}}};ctx.window=ctx;ctx.SakhiCloud=cloud;ctx.SakhiCurriculum={skill:()=>null,skillsIn:()=>[]};vm.createContext(ctx);vm.runInContext(source,ctx,{filename:'sakhi-progress.js'});
(async()=>{
  const guest=ctx.SakhiProgress.load();if(!guest.attempts.some(a=>a.id==='local-lesson'))throw new Error('Legacy device history was not preserved for migration');
  ctx.SakhiProgress.attachAccount('parent-1');
  if(ctx.SakhiProgress.activeScope()!=='user-parent-1')throw new Error('History did not switch to the signed-in account scope');
  await ctx.SakhiProgress.syncCloud();
  const ids=saved.attempts.map(a=>a.id).sort().join('|');
  if(ids!=='local-lesson|remote-lesson')throw new Error('Account merge did not preserve both previously completed lessons: '+ids);
  if(!saved.active_run||saved.active_run.current.skill_id!=='reading.short_vowels')throw new Error('Exact remote resume point was not preserved');
  ctx.SakhiProgress.detachAccount();
  cloud.state=()=>({status:'CONNECTED',userId:'parent-2'});
  ctx.SakhiProgress.attachAccount('parent-2');
  if(ctx.SakhiProgress.snapshot().attempts.length!==0)throw new Error('Guest history leaked automatically into a second parent account');
  console.log('Account history passed: legacy progress is claimed once, remote account history merges safely, exact resume is preserved, and accounts stay isolated');
})().catch(e=>{console.error(e);process.exit(1);});
