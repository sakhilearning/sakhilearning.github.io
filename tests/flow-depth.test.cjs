const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const curriculum=JSON.parse(read('data/curriculum-v3.json'));
const activities=read('sakhi-activities.js'),app=read('sakhi-app.js'),audio=read('sakhi-audio.js'),progress=read('sakhi-progress.js'),adaptive=read('sakhi-adaptive.js'),templates=read('sakhi-templates.js'),wrapups=read('sakhi-wrapups.js');

for(const vague of [/show a grown-up one specific thing you learned/i,/draw one by yourself/i,/write it once by yourself/i]){
  if(vague.test(app)||vague.test(activities)||vague.test(wrapups))throw new Error('A vague or unsupported child instruction remains: '+vague);
}
for(const token of ['function wrapUpFor(domain)','missions.length<4','dynamic:true','current.is_wrap_up','completeWrapUp','answers.length>=2','New challenge →',"'Quest '+(missionIndex+1)"]){
  if(!app.includes(token))throw new Error('Deep trail flow is missing '+token);
}
for(const domain of ['reading','math','writing','language','science','logic','wellbeing','creative','world'])if(!new RegExp(domain+":\\{prompt:").test(wrapups))throw new Error('Clear wrap-up missing for '+domain);
if(!app.includes('Audio.prefetch(replacement)')||!app.includes('Audio.prefetchActivity(a)'))throw new Error('Adaptive or trail audio is not warmed before navigation');
if(/APPLE_MOBILE&&item\.url/.test(audio))throw new Error('iPad playback still reopens a prefetched clip URL');
if(!progress.includes('fastPass=total>=2')||!progress.includes('question_keys:answers.map'))throw new Error('Fast mastery or answered-only repeat history is missing');
if(!adaptive.includes('unused=available.filter'))throw new Error('Trail selection may repeat a used skill while a new one is available');
if(!templates.includes('gold star')||!templates.includes("g.fillText('★'"))throw new Error('Tracing lacks a clear start-to-finish path');

const ctx={window:{},console};ctx.window.window=ctx.window;ctx.window.SakhiCurriculum={skill:id=>curriculum.skills.find(s=>s.skill_id===id)||null};vm.createContext(ctx);for(const f of ['sakhi-content.js','sakhi-activities.js'])vm.runInContext(read(f),ctx,{filename:f});
for(const skill of curriculum.skills.filter(s=>['trace_number','trace_stroke','trace_letter'].includes(s.kind))){
  for(let band=1;band<=5;band++)for(let seed=0;seed<10;seed++)for(const q of ctx.window.SakhiActivities.generate(skill.skill_id,band,'flow-'+seed).questions){
    if(q.template!=='trace'||!q.trace_target)throw new Error('Trace activity lacks an on-screen target: '+skill.skill_id);
    if(/by yourself/i.test(q.prompt)||!/trace/i.test(q.prompt))throw new Error('Trace instruction is unclear: '+q.prompt);
  }
}
console.log('Flow depth passed: four adaptive trail quests, fast mastery advance, clear wrap-ups, unambiguous tracing, and prefetched iPad audio.');
