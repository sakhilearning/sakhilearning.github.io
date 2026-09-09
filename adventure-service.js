(function(){
'use strict';
const S=window.SettingsService;
if(!S)throw new Error('settings-service.js must load before adventure-service.js');

const WORLDS=Object.freeze({
  meadow:{id:'meadow',display_name:'Rainbow Unicorn Meadow',legacy_theme:'unicorn',character_set:['Luna'],background_asset:'generated:world_meadow',color_theme:'rainbow',story_prompt_style:'magical meadow quest',icon:'🦄',description:'Rainbows, unicorns and bright meadow magic.',narrative:'Help Luna solve the challenge and light up the rainbow trail.'},
  frozen:{id:'frozen',display_name:'Frozen Star Palace',legacy_theme:'ice',character_set:['Sakhi'],background_asset:'generated:world_frozen',color_theme:'ice',story_prompt_style:'winter palace quest',icon:'❄️',description:'Snowy stars, crystal paths and cool blue puzzles.',narrative:'Solve the challenge to brighten the crystal star palace.'},
  ocean:{id:'ocean',display_name:'Mermaid Ocean Kingdom',legacy_theme:'mermaid',character_set:['Sakhi'],background_asset:'generated:world_ocean',color_theme:'ocean',story_prompt_style:'undersea pearl quest',icon:'🧜‍♀️',description:'Pearl shells, ocean colors and undersea discovery.',narrative:'Solve the challenge to unlock another glowing pearl shell.'},
  story:{id:'story',display_name:'Enchanted Story Castle',legacy_theme:'library',character_set:['Sakhi'],background_asset:'generated:world_story',color_theme:'storybook',story_prompt_style:'enchanted library quest',icon:'📚',description:'Story doors, books and enchanted castle rooms.',narrative:'Solve the challenge to open the next enchanted story door.'},
  tower:{id:'tower',display_name:'Tower Lantern Garden',legacy_theme:'tower',character_set:['Sakhi'],background_asset:'generated:world_tower',color_theme:'lantern',story_prompt_style:'lantern garden quest',icon:'🏰',description:'Lanterns, gardens, patterns and creative building.',narrative:'Solve the challenge to light another lantern in the tower garden.'},
  ballroom:{id:'ballroom',display_name:'Royal Ballroom',legacy_theme:'fairy',character_set:['Sakhi'],background_asset:'generated:world_ballroom',color_theme:'royal',story_prompt_style:'royal ballroom quest',icon:'💃',description:'Royal patterns, memory games and sparkling celebrations.',narrative:'Solve the challenge to add another sparkle to the royal ballroom.'}
});
const DOMAIN_PREFERENCE=Object.freeze({
  reading:'story',language:'story',math:'frozen',logic:'frozen',science:'ocean',knowledge:'ocean',
  writing:'tower',creativity:'tower',fine:'tower',memory:'ballroom',sel:'ballroom',executive:'ballroom',
  gross:'meadow',life:'meadow'
});
let baseAssetService=null;
let wrappedAssetService=null;

function validIds(){
  if(!baseAssetService?.worlds)return Object.keys(WORLDS);
  return Object.keys(WORLDS).filter(id=>!!baseAssetService.worlds[id]);
}
function options(){
  const ids=validIds();
  return [{id:'AUTO',display_name:'Sakhi Picks',icon:'✨',description:'Sakhi rotates valid worlds to fit the activity and avoid too much repetition.',complete:true},...ids.map(id=>({...WORLDS[id],complete:true}))];
}
function history(){
  const d=window.data||{};d.adventureHistory=d.adventureHistory||[];return d.adventureHistory;
}
function autoWorld(value){
  const ids=validIds();if(!ids.length)return'meadow';
  const preferred=DOMAIN_PREFERENCE[value?.domain]||'meadow';
  const recent=history().slice(-8),last=recent.at(-1)?.world||null;
  const counts=Object.fromEntries(ids.map(id=>[id,recent.filter(x=>x.world===id).length]));
  return [...ids].sort((a,b)=>{
    const score=id=>(id===preferred?-5:0)+(counts[id]||0)*1.8+(id===last?3:0);
    return score(a)-score(b);
  })[0]||preferred;
}
function worldFor(value){
  if(typeof value==='string'&&WORLDS[value])return value;
  const settings=S.all();
  if(settings.adventure_mode==='MANUAL'&&settings.preferred_adventure!=='AUTO'&&validIds().includes(settings.preferred_adventure))return settings.preferred_adventure;
  return autoWorld(value||{});
}
function previewWorld(){
  const settings=S.all();
  if(settings.adventure_mode==='MANUAL'&&settings.preferred_adventure!=='AUTO'&&validIds().includes(settings.preferred_adventure))return settings.preferred_adventure;
  return autoWorld({domain:'creativity'});
}
function meta(id){return WORLDS[id]||WORLDS.meadow}
function sceneMarkup(value,className='scene-art'){
  const id=worldFor(value),base=baseAssetService;
  if(base?.sceneMarkup)return base.sceneMarkup(id,className);
  const m=meta(id);return `<span class="${className}" role="img" aria-label="${m.display_name}"><span class="scene-character">${m.icon}</span></span>`;
}
function applyBody(id){
  const world=validIds().includes(id)?id:'meadow',m=meta(world),d=window.data||{};
  if(document.body){document.body.dataset.adventure=world;document.body.dataset.theme=m.legacy_theme}
  d.theme=m.legacy_theme;
  const select=document.getElementById('themeSelect');if(select&&[...select.options].some(o=>o.value===m.legacy_theme))select.value=m.legacy_theme;
  const art=document.getElementById('heroArt');if(art)art.textContent=m.icon;
  const title=document.getElementById('questTitle');if(title)title.textContent=`${m.icon} ${m.display_name}`;
  const summary=document.getElementById('questSummary');if(summary)summary.textContent=`${m.narrative} Sakhi still chooses the learning skills from progress.`;
  window.dispatchEvent(new CustomEvent('sakhi-adventure-applied',{detail:{world,meta:m}}));
  return world;
}
function applyCurrent(value){return applyBody(worldFor(value||{}))}
function recordActivity(activity){
  const world=worldFor(activity),h=history();h.push({world,activity_id:activity?.id||null,at:new Date().toISOString()});window.data.adventureHistory=h.slice(-40);
  try{window.persist?.(false)}catch(_){}
  applyBody(world);return world;
}
function refreshVisuals(){
  document.querySelectorAll('.quest-visual,.domain-visual,.activity-visual,.learning-scene').forEach(el=>el.remove());
  try{window.VisualUI?.hero?.();window.VisualUI?.decorateQuest?.();window.VisualUI?.decorateDomains?.();window.VisualUI?.decorateActivities?.()}catch(e){console.warn('Adventure visual refresh',e)}
}
function previewMarkup(){const id=previewWorld(),m=meta(id);return `<div class="settings-adventure-preview">${sceneMarkup(id,'settings-preview-scene')}<div><b>${m.icon} ${m.display_name}</b><small>${m.description}</small></div></div>`}
function setPreference(value){
  const id=String(value||'AUTO');
  if(id==='AUTO'){S.set('adventure_mode','AUTO',{notify:false});S.set('preferred_adventure','AUTO');}
  else if(validIds().includes(id)){S.set('preferred_adventure',id);}
  else{S.set('preferred_adventure','AUTO');}
  applyCurrent();refreshVisuals();
  return S.get('preferred_adventure');
}
function installAssetAdapter(){
  const existing=Object.getOwnPropertyDescriptor(window,'AssetService');
  if(existing)return;
  Object.defineProperty(window,'AssetService',{configurable:true,enumerable:true,get(){return wrappedAssetService},set(base){
    baseAssetService=base;
    wrappedAssetService=Object.freeze({...base,worldFor,sceneMarkup});
  }});
}
function onReady(){
  if(S.get('preferred_adventure')!=='AUTO'&&!validIds().includes(S.get('preferred_adventure')))S.set('preferred_adventure','AUTO',{notify:false});
  applyCurrent();
  window.UIHooks?.on?.('activityOpened',e=>{const [activity]=e.args||[];if(activity)recordActivity(activity)});
  window.addEventListener('sakhi-setting-changed',e=>{
    if(['preferred_adventure','adventure_mode'].includes(e.detail?.key)){applyCurrent();refreshVisuals()}
  });
}
installAssetAdapter();
window.AdventureService=Object.freeze({worlds:WORLDS,options,validIds,worldFor,previewWorld,meta,sceneMarkup,previewMarkup,applyCurrent,recordActivity,setPreference,refreshVisuals,policy:'presentation-only-curriculum-independent'});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onReady,{once:true});else onReady();
})();