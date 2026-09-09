const fs=require('fs');
const vm=require('vm');
const activityStore=[];
const context={
  console,
  activities:activityStore,
  themes:{unicorn:{art:'🦄',title:'Rainbow Unicorn Kingdom'},dragon:{art:'🐉',title:'Dragon Rescue'}},
  data:{theme:'unicorn',interactionEvidence:[],quest:[],questResults:{},questHistory:[],skills:{},rewards:{},activeSession:null},
  persist:()=>{},getStatus:()=> 'Not Introduced',recordEvidence:()=>{},todayKey:()=> '2026-01-01',esc:s=>String(s),
  document:{getElementById:()=>null,querySelectorAll:()=>[],createElement:()=>({}),body:{appendChild:()=>{}}},
  localStorage:{},CSS:{escape:s=>s},setTimeout:()=>{},clearTimeout:()=>{},requestAnimationFrame:()=>{},
  CustomEvent:function(type,init){this.type=type;this.detail=init?.detail},dispatchEvent:()=>{},
  RainbowCurriculum:{aliases:{'Beginning sounds':'reading.beginning_sounds','Oral blending':'reading.oral_blending','CVC decoding':'reading.cvc_decoding','Phoneme segmentation':'reading.segmenting','Letter formation':'writing.letter_formation'},normalizeState:s=>s,version:'test'},
  Date,Math,JSON,Object,Array,Set,Map,String,Number,Boolean,Promise
};
context.window=context;
vm.createContext(context);
vm.runInContext(fs.readFileSync('activity-contract.js','utf8'),context,{filename:'activity-contract.js'});
vm.runInContext(fs.readFileSync('interaction-engine.js','utf8'),context,{filename:'interaction-engine.js'});

if(activityStore.length<12)throw new Error(`Expected a substantial activity library; found ${activityStore.length}`);
const required=context.ActivityContract.required;
for(const a of activityStore){
  const check=context.ActivityContract.validate(a);
  if(!check.ok)throw new Error(`${a.id}: ${check.errors.join(', ')}`);
  for(const k of required){if(check.activity[k]===undefined||check.activity[k]===null)throw new Error(`${a.id}: missing canonical ${k}`)}
  if(check.activity.interaction_type==='trace'){
    if(!check.activity.trace_character)throw new Error(`${a.id}: trace character missing`);
    if(check.activity.trace_points.length<5)throw new Error(`${a.id}: trace path too short`);
    if(check.activity.completion_threshold<.5)throw new Error(`${a.id}: trace completion threshold too weak`);
  }
}
const formats=new Set(activityStore.map(a=>a.interaction_type));
if(formats.size<10)throw new Error(`Interaction variety too low: ${[...formats].join(', ')}`);
if(typeof context.ActivityRenderer!=='object')throw new Error('ActivityRenderer missing');
for(const type of formats){if(!context.ActivityRenderer.registry[type])throw new Error(`No renderer registered for ${type}`)}
if(/function\s+makeQuest\s*\(/.test(fs.readFileSync('interaction-engine.js','utf8')))throw new Error('interaction-engine.js still owns duplicate lesson planning');
console.log(`Validated ${activityStore.length} canonical activities across ${formats.size} interaction formats with one renderer registry.`);
