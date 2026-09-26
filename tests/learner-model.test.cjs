const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),store={};
function src(f){return fs.readFileSync(path.join(root,f),'utf8');}
const curriculum=JSON.parse(src('data/curriculum-v3.json'));
const ctx={window:{},console,Date,crypto:{randomUUID:()=>String(Math.random())},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]}};ctx.window=ctx;ctx.SAKHI_CURRICULUM_DATA=curriculum;ctx.SakhiCloud={enqueue(){},scheduleSnapshot(){}};vm.createContext(ctx);
(async()=>{
 vm.runInContext(src('sakhi-curriculum.js'),ctx);await ctx.SakhiCurriculum.load();vm.runInContext(src('sakhi-progress.js'),ctx);vm.runInContext(src('sakhi-adaptive.js'),ctx);
 const activity={activity_id:'fast-1',skill_id:'math.count_sequence',domain_id:'math',band:2,evidence_mode:'objective',questions:[{question_key:'a'},{question_key:'b'},{question_key:'c'}]};
 ctx.SakhiProgress.completeActivity({activity,sessionId:'session-1',answers:[1,2,3].map(()=>({correct:true,hintsUsed:0,tries:1,response_ms:1800}))});
 const profile=ctx.SakhiProgress.skillProfile('math.count_sequence');
 if(profile.signal!=='LIKELY_KNOWS'||profile.confidence!=='EARLY'||profile.accuracy!==100||profile.independence!==100)throw new Error('Fast independent success was not represented honestly: '+JSON.stringify(profile));
 const placement={activity_id:'placement-2',skill_id:'math.compare',domain_id:'math',band:3,evidence_mode:'objective',questions:[{question_key:'p1'},{question_key:'p2'},{question_key:'p3'}]};
 ctx.SakhiProgress.completeActivity({activity:placement,sessionId:'session-1',answers:[1,2,3].map(()=>({correct:true,hintsUsed:0,tries:1,response_ms:2000}))});
 const next=ctx.SakhiAdaptive.pick('math',[]);
 if(next.skill_id==='math.count_sequence')throw new Error('Adaptive engine repeated a quickly demonstrated basic skill');
 const locked=ctx.SakhiCurriculum.skill(next.skill_id);if(!ctx.SakhiCurriculum.isAvailable(locked.skill_id,ctx.SakhiProgress.masteryOf))throw new Error('Adaptive engine selected a locked prerequisite');
 const weak={activity_id:'weak-1',skill_id:'reading.print_concepts',domain_id:'reading',band:2,evidence_mode:'objective',questions:[{question_key:'d'},{question_key:'e'},{question_key:'f'}]};
 ctx.SakhiProgress.completeActivity({activity:weak,sessionId:'session-1',answers:[{correct:false,hintsUsed:2,tries:2,response_ms:9000},{correct:false,hintsUsed:2,tries:2,response_ms:9000},{correct:true,hintsUsed:1,tries:2,response_ms:7000}]});
 const need=ctx.SakhiProgress.skillProfile('reading.print_concepts');if(need.signal!=='NEEDS_SUPPORT')throw new Error('Struggle evidence was not surfaced to parents: '+JSON.stringify(need));
 const insights=ctx.SakhiProgress.insights();if(!insights.needsSupport||!insights.likelyKnows||!insights.domains.every(d=>d.recommendation&&d.total>0))throw new Error('Parent evidence summary is incomplete');
 console.log('Learner model passed: fast independent mastery advances, locked lessons stay locked, struggles trigger support, and parent recommendations use evidence.');
})().catch(e=>{console.error(e);process.exit(1);});
