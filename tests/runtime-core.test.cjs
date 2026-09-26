const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
(async function(){
  const curriculum=JSON.parse(src('data/curriculum-v3.json'));
  const six=JSON.parse(src('data/six-month-plan.json'));
  const sessions=[];
  const progress={
    load:()=>({sessions,settings:{session_minutes:30}}),
    evidence:()=>({next_review:null}),
    masteryOf:()=> 'NOT_INTRODUCED',
    bandFor:()=>1
  };
  const ctx={window:{},console,Date,URL};ctx.window=ctx;ctx.SAKHI_CURRICULUM_DATA=curriculum;ctx.SAKHI_SIX_MONTH_PLAN=six;ctx.SakhiProgress=progress;vm.createContext(ctx);
  vm.runInContext(src('sakhi-curriculum.js'),ctx,{filename:'sakhi-curriculum.js'});
  await ctx.SakhiCurriculum.load();
  if(ctx.SakhiCurriculum.version()!==curriculum.curriculum_version)throw new Error('Inline curriculum did not hydrate');
  vm.runInContext(src('sakhi-adaptive.js'),ctx,{filename:'sakhi-adaptive.js'});
  vm.runInContext(src('sakhi-plan.js'),ctx,{filename:'sakhi-plan.js'});
  for(const domain of curriculum.domains){const pick=ctx.SakhiAdaptive.pick(domain.domain_id,[]);if(!pick)throw new Error('Trail has no launchable skill: '+domain.domain_id);const skill=ctx.SakhiCurriculum.skill(pick.skill_id);if(!skill||skill.domain_id!==domain.domain_id)throw new Error('Trail launch selected the wrong domain: '+domain.domain_id);}
  let built=ctx.SakhiPlan.build();
  if(built.program_day!==1)throw new Error('Fresh learner must start on program day 1');
  const domains=built.missions.map(m=>m.domain).join('|');
  if(domains!=='math|science|language|reading|logic')throw new Error('Daily priorities are not math, science, listening, reading, and rotating enrichment: '+domains);
  if(built.missions.length!==5||built.missions.some(m=>!m.pick||!m.focus))throw new Error('Daily plan is missing a clear adaptive mission');
  if(!built.offscreen||built.offscreen.domain!=='science')throw new Error('Day 1 should include a hands-on science mission');
  sessions.push({status:'LEFT_EARLY'});
  built=ctx.SakhiPlan.build();
  if(built.program_day!==1)throw new Error('Left-early session advanced the program day');
  sessions.push({status:'COMPLETED'});
  built=ctx.SakhiPlan.build();
  if(built.program_day!==2)throw new Error('Completed session did not advance program day');

  const store={};
  const pctx={window:{},console,Date,crypto:{randomUUID:()=> 'id'},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v},removeItem:k=>{delete store[k]}}};pctx.window=pctx;pctx.SakhiCurriculum={skill:()=>null,skillsIn:()=>[]};pctx.SakhiCloud={enqueue:()=>{}};vm.createContext(pctx);vm.runInContext(src('sakhi-progress.js'),pctx,{filename:'sakhi-progress.js'});
  pctx.SakhiProgress.load();pctx.SakhiProgress.evidence('reading.test');
  if(Object.keys(pctx.SakhiProgress.load().skills).length!==0)throw new Error('Reading evidence mutated learner skill state outside completeActivity');
  console.log('Runtime core passed: inline boot data, five daily priorities, six-month pacing, early-exit pacing, read-only evidence access');
})().catch(e=>{console.error(e);process.exit(1);});
