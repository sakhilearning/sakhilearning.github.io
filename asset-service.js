(function(){
'use strict';
const META={
  frozen:{title:'Frozen Star Palace',purpose:'math, patterns, logic and spatial reasoning',icon:'❄️',a:'#bde0fe',b:'#e8f7ff'},
  ocean:{title:'Mermaid Ocean Kingdom',purpose:'counting, science, sorting and vocabulary',icon:'🧜‍♀️',a:'#48cae4',b:'#90e0ef'},
  story:{title:'Enchanted Story Castle',purpose:'reading, phonics, comprehension and vocabulary',icon:'📚',a:'#cdb4db',b:'#ffe5ec'},
  tower:{title:'Tower Garden',purpose:'patterns, creativity, sequencing and fine motor',icon:'🏰',a:'#f1c0e8',b:'#c8b6ff'},
  ballroom:{title:'Royal Ballroom',purpose:'matching, memory, social learning and time',icon:'💃',a:'#ffd6e0',b:'#c8b6ff'},
  meadow:{title:'Rainbow Unicorn Meadow',purpose:'phonics, early reading, movement and rewards',icon:'🦄',a:'#bde0fe',b:'#ffc8dd'}
};
const domainWorld={reading:'story',language:'story',math:'frozen',logic:'frozen',science:'ocean',memory:'ballroom',sel:'ballroom',executive:'ballroom',writing:'tower',fine:'tower',creativity:'tower',gross:'meadow',life:'meadow',knowledge:'ocean'};
const activityWorld={'read-first':'meadow','read-blend':'meadow','read-cvc':'story','read-seg':'meadow','math-compose':'ocean','math-qty':'frozen','math-pattern':'frozen','math-add':'ballroom','language-retell':'story','language-why':'story','science-float':'ocean','science-shadow':'frozen','memory-directions':'ballroom','executive-switch':'ballroom','sel-feelings':'ballroom','life-cleanup':'meadow','creativity-story':'tower','fine-sort':'tower','gross-sequence':'meadow','knowledge-community':'ocean'};
function escapeHtml(s){return String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
function worldFor(value){if(typeof value==='string'&&META[value])return value;if(activityWorld[value?.id])return activityWorld[value.id];return domainWorld[value?.domain]||'meadow';}
function sceneMarkup(value,className='scene-art'){
  const key=worldFor(value),m=META[key];
  return `<span class="${escapeHtml(className)} scene-${key}" role="img" aria-label="${escapeHtml(m.title)}" style="--scene-a:${m.a};--scene-b:${m.b}"><span class="scene-sky"><i></i><i></i><i></i></span><span class="scene-land"></span><span class="scene-castle">🏰</span><span class="scene-star s1">✦</span><span class="scene-star s2">✧</span><span class="scene-character">${m.icon}</span></span>`;
}
function preloadForActivity(activity){return Promise.resolve({world:worldFor(activity),ready:true});}
const service=Object.freeze({worldFor,sceneMarkup,preloadForActivity,worlds:META,policy:'local-stable-assets'});
window.AssetService=service;
})();
