const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const curriculum=JSON.parse(read('data/curriculum-v3.json'));
const required=new Set(JSON.parse(read('assets/audio/narration/texts-v5.json')));
const manifest=JSON.parse(read('assets/audio/narration/manifest.json'));
const replacements={'🌸':'flower','🦋':'butterfly','⭐':'star','🌈':'rainbow','🌙':'moon','🔴':'red circle','🔵':'blue circle','🟡':'yellow circle','🦄':'unicorn','🐚':'shell','🐠':'fish','⬜':'empty square','➡️':'right arrow','⬅️':'left arrow','⬆️':'up arrow'};
function normalize(value){let text=String(value||'');for(const [symbol,word] of Object.entries(replacements))text=text.split(symbol).join(word);return text.replace(/\/([a-z]+)\//gi,'$1 sound').replace(/\s*=\s*\?/g,' equals what number?').replace(/−/g,' minus ').replace(/\+/g,' plus ').replace(/\s+/g,' ').trim();}
const ctx={window:{},console};ctx.window=ctx;ctx.SakhiCurriculum={skill:id=>curriculum.skills.find(skill=>skill.skill_id===id)||null};vm.createContext(ctx);
for(const file of ['sakhi-content.js','sakhi-activities.js','sakhi-wrapups.js'])vm.runInContext(read(file),ctx,{filename:file});
const missingPrompts=new Set();
for(const skill of curriculum.skills)for(let band=1;band<=5;band++)for(let seed=0;seed<100;seed++){
  const activity=ctx.SakhiActivities.generate(skill.skill_id,band,'coverage:'+seed);
  for(const question of activity.questions){const text=normalize(question.spoken_instruction||question.narration||question.prompt);if(!required.has(text))missingPrompts.add(skill.skill_id+' · '+text);}
}
for(const wrap of [...Object.values(ctx.SakhiWrapUps.all),ctx.SakhiWrapUps.fallback])if(!required.has(normalize(wrap.prompt)))missingPrompts.add('wrap-up · '+wrap.prompt);
if(!required.has('Complete one step at a time. Ask for help only if you need it.'))missingPrompts.add('wrap-up hint');
if(missingPrompts.size)throw new Error('Narration collector misses runtime prompts:\n'+[...missingPrompts].slice(0,20).join('\n'));
const missingFiles=[...required].filter(text=>!manifest.files[text]||!fs.existsSync(path.join(root,'assets/audio/narration',manifest.files[text])));
if(missingFiles.length)throw new Error(`${missingFiles.length} required narration clips are not bundled`);
console.log(`Narration coverage passed: ${required.size} local Kokoro prompts cover 141 skills across 5 difficulty bands.`);
