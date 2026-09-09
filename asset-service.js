(function(){
'use strict';

const WORLD_META={
  frozen:{title:'Frozen Star Palace',purpose:'math, patterns, logic and spatial reasoning',icon:'❄️',a:'#bde0fe',b:'#e8f7ff'},
  ocean:{title:'Mermaid Ocean Kingdom',purpose:'counting, science, sorting and vocabulary',icon:'🧜‍♀️',a:'#48cae4',b:'#90e0ef'},
  story:{title:'Enchanted Story Castle',purpose:'reading, phonics, comprehension and vocabulary',icon:'📚',a:'#cdb4db',b:'#ffe5ec'},
  tower:{title:'Tower Garden',purpose:'patterns, creativity, sequencing and fine motor',icon:'🏰',a:'#f1c0e8',b:'#c8b6ff'},
  ballroom:{title:'Royal Ballroom',purpose:'matching, memory, social learning and time',icon:'💃',a:'#ffd6e0',b:'#c8b6ff'},
  meadow:{title:'Rainbow Unicorn Meadow',purpose:'phonics, early reading, movement and rewards',icon:'🦄',a:'#bde0fe',b:'#ffc8dd'}
};

const CHARACTER_ROLES=Object.freeze({
  elsa:['number puzzles','patterns','spatial reasoning','winter science','logic'],
  anna:['number puzzles','patterns','spatial reasoning','winter science','logic'],
  ariel:['ocean science','counting shells','sorting','marine animals','vocabulary'],
  belle:['stories','vocabulary','reading comprehension','books','sequencing'],
  cinderella:['matching','sorting','routines','time concepts','social situations'],
  rapunzel:['creative activities','patterns','sequencing','art','story creation'],
  snow_white:['stories','animals','sorting','memory'],
  aurora:['stories','patterns','music','memory'],
  jasmine:['stories','spatial reasoning','patterns','world knowledge'],
  tiana:['counting','sequencing','practical life','science'],
  moana:['ocean science','navigation','patterns','storytelling'],
  mulan:['logic','sequencing','memory','movement'],
  merida:['movement','patterns','storytelling','spatial reasoning'],
  pocahontas:['nature','animals','science','stories'],
  mickey:['general review','counting','memory','matching','movement'],
  minnie:['general review','counting','memory','matching','movement'],
  pooh:['stories','emotions','friendship','simple reasoning','nature'],
  tigger:['movement','memory','patterns','general review'],
  piglet:['emotions','friendship','stories','simple reasoning'],
  eeyore:['emotions','friendship','stories'],
  luna:['phonics','reading','rewards','rainbow adventures']
});

const CATEGORY_PATHS=Object.freeze({
  disney_princesses:'characters/disney-princesses/',
  mickey_friends:'characters/mickey-friends/',
  pooh:'characters/pooh/',
  unicorns:'characters/unicorns/',
  fairies:'characters/fairies/',
  animals:'characters/animals/',
  backgrounds:'backgrounds/',
  educational:'educational/',
  rewards:'rewards/'
});

const REGISTRY=new Map();
const FALLBACKS={character:'unicorn_luna_01',background:'world_meadow_01',educational:'world_story_01',reward:'world_meadow_01'};

function register(meta){
  if(!meta||!meta.asset_id)throw new Error('Asset metadata requires asset_id');
  const normalized={
    asset_id:String(meta.asset_id),character:meta.character||null,category:meta.category||'educational',
    source_url:meta.source_url||null,source_page:meta.source_page||null,local_path:meta.local_path||null,
    image_width:Number(meta.image_width)||null,image_height:Number(meta.image_height)||null,
    aspect_ratio:meta.aspect_ratio||null,use_case:Array.isArray(meta.use_case)?meta.use_case:(meta.use_case?[meta.use_case]:[]),
    quality_score:Number(meta.quality_score)||0,active:meta.active!==false,fallback_asset_id:meta.fallback_asset_id||null,
    provenance:meta.provenance||'project',rights_note:meta.rights_note||null,inventory_status:meta.inventory_status||'KEEP'
  };
  REGISTRY.set(normalized.asset_id,normalized);return normalized;
}
function getById(id){return REGISTRY.get(id)||null;}
function listActive(){return [...REGISTRY.values()].filter(a=>a.active);}
function findCharacter(name){const key=String(name||'').toLowerCase().replace(/\s+/g,'_');return listActive().filter(a=>String(a.character||'').toLowerCase().replace(/\s+/g,'_')===key).sort((a,b)=>b.quality_score-a.quality_score);}
function resolve(id,fallbackType='character'){
  const seen=new Set();let cur=getById(id);
  while(cur&&!cur.active&&!seen.has(cur.asset_id)){seen.add(cur.asset_id);cur=getById(cur.fallback_asset_id);}
  if(cur&&cur.active)return cur;
  const fb=getById(FALLBACKS[fallbackType]);return fb&&fb.active?fb:null;
}
function assetUrl(id,fallbackType='character'){const a=resolve(id,fallbackType);return a?.local_path||null;}

const domainWorld={reading:'story',language:'story',math:'frozen',logic:'frozen',science:'ocean',memory:'ballroom',sel:'ballroom',executive:'ballroom',writing:'tower',fine:'tower',creativity:'tower',gross:'meadow',life:'meadow',knowledge:'ocean'};
const activityWorld={'read-first':'meadow','read-blend':'meadow','read-cvc':'story','read-seg':'meadow','math-compose':'ocean','math-qty':'frozen','math-pattern':'frozen','math-add':'ballroom','language-retell':'story','language-why':'story','science-float':'ocean','science-shadow':'frozen','memory-directions':'ballroom','executive-switch':'ballroom','sel-feelings':'ballroom','life-cleanup':'meadow','creativity-story':'tower','fine-sort':'tower','gross-sequence':'meadow','knowledge-community':'ocean'};
function escapeHtml(s){return String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
function worldFor(value){if(typeof value==='string'&&WORLD_META[value])return value;if(activityWorld[value?.id])return activityWorld[value.id];return domainWorld[value?.domain]||'meadow';}
function sceneMarkup(value,className='scene-art'){
  const key=worldFor(value),m=WORLD_META[key];
  return `<span class="${escapeHtml(className)} scene-${key}" role="img" aria-label="${escapeHtml(m.title)}" style="--scene-a:${m.a};--scene-b:${m.b}"><span class="scene-sky"><i></i><i></i><i></i></span><span class="scene-land"></span><span class="scene-castle">🏰</span><span class="scene-star s1">✦</span><span class="scene-star s2">✧</span><span class="scene-character">${m.icon}</span></span>`;
}
async function preloadAsset(id){const a=resolve(id);if(!a?.local_path)return false;return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(true);img.onerror=()=>resolve(false);img.src=a.local_path;});}
async function preloadForActivity(activity){
  const ids=[activity?.character_asset_id,activity?.background_asset_id,...(activity?.interactive_asset_ids||[])].filter(Boolean);
  const results=await Promise.all(ids.map(preloadAsset));
  return {world:worldFor(activity),ready:results.every(Boolean),assets:ids};
}
function characterRoles(name){const key=String(name||'').toLowerCase().replace(/\s+/g,'_');return CHARACTER_ROLES[key]||[];}
function inventory(){return listActive().map(a=>({...a,status:a.inventory_status||'KEEP'}));}

// Stable generic fallbacks are registered immediately. User-provided and permitted local imagery can be added later without changing lesson code.
register({asset_id:'unicorn_luna_01',character:'Luna',category:'unicorns',use_case:['phonics','reading','rewards'],quality_score:100,active:true,provenance:'generated-ui',inventory_status:'KEEP'});
register({asset_id:'world_meadow_01',category:'backgrounds',use_case:['phonics','movement','rewards'],quality_score:100,active:true,provenance:'generated-ui',inventory_status:'KEEP'});
register({asset_id:'world_story_01',category:'backgrounds',use_case:['reading','stories','vocabulary'],quality_score:100,active:true,provenance:'generated-ui',inventory_status:'KEEP'});

const service=Object.freeze({
  register,getById,listActive,findCharacter,resolve,assetUrl,worldFor,sceneMarkup,preloadAsset,preloadForActivity,
  characterRoles,inventory,worlds:WORLD_META,categories:CATEGORY_PATHS,roles:CHARACTER_ROLES,
  policy:'local-stable-assets-user-first',
  acquisitionFlow:['SEARCH_DISCOVER','REVIEW_QUALITY','SELECT','STORE_CACHE','REGISTER','USE_THROUGH_ASSET_SERVICE'],
  qualityRules:{prefer:['high resolution','clear character visibility','good crop','minimal text','minimal watermarking','clear background separation','child-friendly expression'],reject:['pixelated','tiny thumbnail','obvious watermark','UI screenshot','cropped head','poor compression','adult/inappropriate','distorted character']},
  priority:['USER_PROVIDED','EXISTING_HIGH_QUALITY_PROJECT','PUBLICLY_ACCESSIBLE_WHERE_PERMITTED','GENERATED_ORIGINAL_SUPPORTING_ART']
});
window.AssetService=service;
})();