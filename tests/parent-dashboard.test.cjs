// DOM-level integration of the parent screen with a test-only gate service.
// No real PIN, browser account, or user progress is created by this test.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),nodes={};
class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.options=[];this.value='';this.hidden=false;this.dataset={};this.classList={add(){},remove(){},toggle(){},contains(){return false;}};}
 appendChild(e){this.children.push(e);return e;}insertBefore(e){nodes[e.id]=e;return this.appendChild(e);}setAttribute(){}removeAttribute(){}querySelectorAll(){return[];}
 set textContent(s){this.text=String(s);this.children=[];}get textContent(){return this.text||'';}
 set innerHTML(html){this.html=html;for(const match of html.matchAll(/<(\w+)[^>]*\bid="([^"]+)"[^>]*>/g)){const n=nodes[match[2]]=new Element(match[1]);if(match[1]==='select'){const end=html.indexOf('</select>',match.index),source=html.slice(match.index,end);n.options=[...source.matchAll(/<option\b([^>]*)>([^<]*)<\/option>/g)].map(m=>({value:(m[1].match(/value="([^"]*)"/)||[])[1],dataset:{domain:(m[1].match(/data-domain="([^"]*)"/)||[])[1]},hidden:false}));n.value=n.options[0]?.value||'';}}}get innerHTML(){return this.html||'';}
}
(async()=>{
 const settings={grade:0,session_minutes:30,daily_limit_minutes:30},state={settings,learner:{name:'Test learner'},question_history:[]};let opened=false,resource=null;
 const ctx={console,Date,URL,localStorage:{getItem:()=>null,setItem(){}},setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,addEventListener(){},scrollTo(){},document:{readyState:'loading',body:{dataset:{}},addEventListener(){},querySelector:s=>nodes[s.slice(1)]||(nodes[s.slice(1)]=new Element()),querySelectorAll:()=>[],createElement:t=>new Element(t)},SAKHI_CURRICULUM_DATA:JSON.parse(read('data/curriculum-v3.json'))};ctx.window=ctx;vm.createContext(ctx);
 vm.runInContext(read('sakhi-curriculum.js'),ctx);await ctx.SakhiCurriculum.load();
 ctx.SakhiProgress={load:()=>state,stars:()=>0,insights:()=>({week:{sessions:0,minutes:0,activities:0,accuracy:null,independence:null},mastered:0,likelyKnows:0,developing:0,needsSupport:0,unassessed:0,reviewDue:0,strengths:[],needs:[],recent:[],sessions:[],domains:[]}),getActiveRun:()=>null,evidence:()=>({mastery_state:'NOT_INTRODUCED'}),setSetting:(k,v)=>settings[k]=v,clearActiveRun(){},snapshot:()=>state};
 ctx.SakhiPlan={build:()=>({missions:[],program_day:1})};ctx.SakhiAdaptive={explain:()=>''};ctx.SakhiTrails={get:()=>({chapters:['Foundation','Build','Apply','Extend','Transfer']})};ctx.SakhiPresentation={esc:s=>String(s)};ctx.SakhiActivities={};ctx.SakhiTemplates={};ctx.SakhiCloud={state:()=>({configured:false})};ctx.SakhiAudio={phonemeReport:async()=>({}),isEnabled:()=>true,stopAll(){}};
 ctx.SakhiFamily={configured:()=>true,isOpen:()=>opened,lock:()=>opened=false,verify:async()=>opened=true,remaining:()=>30*60000,extend(){}};ctx.SakhiResources={open:(panel,skill,mode)=>resource={skill,mode}};
 vm.runInContext(read('sakhi-app.js'),ctx,{filename:'sakhi-app.js'});
 ctx.SakhiApp.show('parent');assert.equal(nodes.parentBody.hidden,true);nodes.gateAnswer.value='test-only';await nodes.gateBtn.onclick();
 assert.equal(nodes.parentBody.hidden,false);assert.equal(nodes.curriculumSkill.options.length,410);assert.ok(nodes.curriculumEvidence.children.length>=2);assert.ok(nodes.parentBody.html.includes('learnerGrade'));
 nodes.characterVoice.value='pixie';nodes.characterVoice.onchange();assert.equal(settings.character_voice,'pixie');nodes.sceneMusic.checked=false;nodes.sceneMusic.onchange();assert.equal(settings.scene_music,false);nodes.sceneVolume.value='25';nodes.sceneVolume.oninput();assert.equal(settings.scene_volume,.25);
 nodes.worksheetBtn.onclick();assert.equal(resource.mode,'worksheet');nodes.miniLessonBtn.onclick();assert.equal(resource.mode,'lesson');
 nodes.learnerGrade.value='3';nodes.learnerGrade.onchange();await new Promise(r=>setImmediate(r));assert.equal(settings.grade,3);assert.equal(nodes.parentBody.hidden,false);
 nodes.lockParents.onclick();assert.equal(nodes.parentBody.hidden,true);assert.equal(opened,false);
 console.log('Parent dashboard passed: gate, 410-skill dropdown and evidence table, grade settings, resource routing, and relocking.');
})().catch(e=>{console.error(e);process.exitCode=1;});
