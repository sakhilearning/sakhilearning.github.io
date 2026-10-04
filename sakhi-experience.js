(function(){
'use strict';
var scheduled=false;
var PHASES=[['learn','Discover'],['connect','Remember'],['practice','Try'],['apply','Explore'],['transfer','Challenge']];
var DOMAIN_ICONS={reading:'📖',math:'🔢',writing:'✏️',language:'🎧',science:'🔭',logic:'🧩',wellbeing:'💗',creative:'🎨',world:'🌍'};
var DOMAIN_LABELS={reading:'Rainbow Library',math:'Crystal Palace',writing:'Lantern Studio',language:'Story Castle',science:'Discovery Lagoon',logic:'Puzzle Garden',wellbeing:'Friendship Garden',creative:'Starlight Stage',world:'Discovery Atlas'};
var WRAP_LABELS={reading:'Reading treasure',math:'Math treasure',writing:'Proud writing treasure',language:'Storyteller treasure',science:'Mini scientist mission',logic:'Puzzle-maker mission',wellbeing:'Kindness mission',creative:'Creator upgrade',world:'Explorer mission'};
var WORLD_ART={
 reading:['./assets/theme-media/generated/reading-enchanted-library.webp','./assets/theme-media/generated-v4/unicorn-phonics-meadow.webp'],
 math:['./assets/theme-media/generated/math-ice-gems.webp','./assets/theme-media/generated/logic-crystal-number-palace.webp'],
 writing:['./assets/theme-media/generated/writing-rainbow-storybook.webp','./assets/theme-media/generated/creative-tower-art-studio.webp'],
 language:['./assets/theme-media/generated/language-golden-ballroom.webp','./assets/theme-media/generated-v4/princess-story-forest.webp'],
 science:['./assets/theme-media/generated/science-mermaid-lagoon.webp','./assets/theme-media/generated-v4/safari-discovery-valley.webp'],
 logic:['./assets/theme-media/generated/logic-crystal-number-palace.webp','./assets/theme-media/generated/math-ice-gems.webp'],
 wellbeing:['./assets/theme-media/generated/wellbeing-enchanted-forest.webp','./assets/theme-media/generated/home-unicorn-storytime.webp'],
 creative:['./assets/theme-media/generated/creative-tower-art-studio.webp','./assets/theme-media/generated/writing-rainbow-storybook.webp'],
 world:['./assets/theme-media/generated-v4/princess-story-forest.webp','./assets/theme-media/generated-v4/safari-discovery-valley.webp']
};
function qs(s){return document.querySelector(s);}
function all(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
function text(n){return n?String(n.textContent||'').trim():'';}
function phaseFromLabel(label){label=String(label||'').toLowerCase();if(label.indexOf('learn')>=0)return'learn';if(label.indexOf('warm')>=0||label.indexOf('connect')>=0)return'connect';if(label.indexOf('try')>=0||label.indexOf('practice')>=0)return'practice';if(label.indexOf('use')>=0||label.indexOf('apply')>=0)return'apply';if(label.indexOf('deeper')>=0||label.indexOf('transfer')>=0||label.indexOf('challenge')>=0)return'transfer';return'practice';}
function phaseIndex(phase){for(var i=0;i<PHASES.length;i++)if(PHASES[i][0]===phase)return i;return 2;}
function domain(){return document.body.dataset.domain||'reading';}
function cardDomain(card){var scene=card&&card.querySelector('.scene-card');if(!scene)return'';for(var i=0;i<scene.classList.length;i++){var c=scene.classList[i];if(c.indexOf('scene-')===0)return c.slice(6);}return'';}
function setWorldArtwork(card,d,index){var pool=WORLD_ART[d],img=card&&card.querySelector('.mini-scene img.world-art');if(!pool||!pool.length||!img)return;var next=pool[index%pool.length];if(img.getAttribute('src')!==next)img.setAttribute('src',next);img.setAttribute('alt',(DOMAIN_LABELS[d]||'Learning world')+' learning scene');}
function decorateCard(card,index){var d=cardDomain(card);if(!d)return;card.classList.add('domain-'+d);card.dataset.world=d;setWorldArtwork(card,d,index);var badge=card.querySelector('.world-badge');if(!badge){badge=document.createElement('span');badge.className='world-badge';var scene=card.querySelector('.mini-scene');if(scene)scene.appendChild(badge);}if(badge)badge.textContent=(DOMAIN_ICONS[d]||'✨')+' '+(DOMAIN_LABELS[d]||'Learning world');}
function enhanceHome(){
 var stage=qs('.home-stage');if(!stage)return;
 var duplicate=qs('.daily-focus-strip');if(duplicate)duplicate.remove();
 var summary=qs('#todaySummary');if(summary)summary.setAttribute('aria-hidden','true');
 all('#trailPreview .today-world-card').forEach(function(card,i){decorateCard(card,i);});
 all('.trail-card').forEach(function(card,i){decorateCard(card,i+1);});
 var preview=qs('#trailPreview');if(preview)preview.classList.add('world-bento');
}
function ensureJourney(){
 var card=qs('.quest-card');if(!card)return;
 var rail=qs('.learning-journey');if(!rail){rail=document.createElement('div');rail.className='learning-journey';rail.setAttribute('aria-label','Learning journey');card.parentNode.insertBefore(rail,card);}
 var currentPhase=phaseFromLabel(text(qs('#missionStep'))),active=phaseIndex(currentPhase);
 document.body.dataset.phase=currentPhase;
 var html=PHASES.map(function(p,i){var cls=i<active?' done':i===active?' active':'';return'<span class="learning-journey-step'+cls+'"><b>'+p[1]+'</b><small>'+(i+1)+'</small></span>';}).join('');
 if(rail.innerHTML!==html)rail.innerHTML=html;
}
function enhanceWrapUp(){
 if(text(qs('#activitySkill'))!=='Trail finish')return;
 var prompt=qs('#questionPrompt'),label=WRAP_LABELS[domain()]||'Finish-line treasure';if(!prompt)return;
 var current=text(prompt);if(current&&current.indexOf(label)!==0)prompt.textContent=label+' · '+current;
 var story=qs('#missionStory');if(story)story.textContent='One last hands-on discovery. Take it away from the screen and make it yours.';
}
function enhanceActivity(){
 if(document.body.dataset.view!=='activity')return;
 ensureJourney();enhanceWrapUp();
 var card=qs('.quest-card'),story=qs('.mission-story');if(card&&story){var power=card.querySelector('.mission-power'),skill=text(qs('#activitySkill')),trail=text(qs('#activityTrail'));if(!power){power=document.createElement('div');power.className='mission-power';story.insertAdjacentElement('afterend',power);}var content='<span>'+(DOMAIN_ICONS[domain()]||'✨')+' <b>'+skill+'</b></span><span>Inside '+trail+'</span>';if(power.innerHTML!==content)power.innerHTML=content;}
 var hear=qs('#hearBtn');if(hear){hear.classList.add('voice-listen');if(!hear.getAttribute('aria-busy'))hear.textContent='Listen to Sakhi';}
 var pill=qs('#voicePill');if(pill&&text(pill)!=='♪ Gentle Sakhi voice')pill.textContent='♪ Gentle Sakhi voice';
}
function enhanceCelebrate(){
 var overlay=qs('#celebrate'),card=overlay&&overlay.querySelector('.celebrate-card');if(!card)return;
 var burst=card.querySelector('.treasure-burst');if(!burst){burst=document.createElement('div');burst.className='treasure-burst';burst.setAttribute('aria-hidden','true');burst.innerHTML='<span>✦</span><span>★</span><span>✦</span>';var icon=qs('#celebrateIcon');if(icon)icon.insertAdjacentElement('beforebegin',burst);}
 var title=qs('#celebrateTitle'),reward=qs('#celebrateReward');if(overlay.classList.contains('show')&&title&&reward){card.dataset.rewardReady='1';if(text(title).indexOf('Trail complete')>=0)reward.setAttribute('aria-label','Trail treasure earned');}
}
function enhanceRewards(){var box=qs('#rewardRecent');if(box)box.dataset.experience='treasure-room';}
function enhance(){scheduled=false;enhanceHome();enhanceActivity();enhanceCelebrate();enhanceRewards();}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance);}
function start(){
 schedule();
 var root=qs('#app')||document.body;
 var appObserver=new MutationObserver(schedule);appObserver.observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','data-view','aria-busy']});
 var celebration=qs('#celebrate');if(celebration){var celebrationObserver=new MutationObserver(schedule);celebrationObserver.observe(celebration,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});}
 document.addEventListener('click',function(){setTimeout(schedule,0);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
