(function(){
'use strict';
var scheduled=false;
var PHASES=[['learn','Discover'],['connect','Remember'],['practice','Try'],['apply','Explore'],['transfer','Challenge']];
var DOMAIN_ICONS={reading:'📖',math:'🔢',writing:'✏️',language:'🎧',science:'🔭',logic:'🧩',wellbeing:'💗',creative:'🎨',world:'🌍'};
function qs(s){return document.querySelector(s);}
function all(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
function text(n){return n?String(n.textContent||'').trim():'';}
function phaseFromLabel(label){label=String(label||'').toLowerCase();if(label.indexOf('learn')>=0)return'learn';if(label.indexOf('warm')>=0||label.indexOf('connect')>=0)return'connect';if(label.indexOf('try')>=0||label.indexOf('practice')>=0)return'practice';if(label.indexOf('use')>=0||label.indexOf('apply')>=0)return'apply';if(label.indexOf('deeper')>=0||label.indexOf('transfer')>=0||label.indexOf('challenge')>=0)return'transfer';return'practice';}
function phaseIndex(phase){for(var i=0;i<PHASES.length;i++)if(PHASES[i][0]===phase)return i;return 2;}
function domain(){return document.body.dataset.domain||'reading';}
function enhanceHome(){
 var stage=qs('.home-stage'),path=qs('.today-path');if(!stage||!path)return;
 var strip=qs('.daily-focus-strip');if(!strip){strip=document.createElement('div');strip.className='daily-focus-strip';strip.setAttribute('aria-label','Today’s learning powers');path.parentNode.insertBefore(strip,path);}
 var cards=all('#trailPreview .today-world-card').slice(0,5),items=cards.map(function(card,i){var title=text(card.querySelector('h3'))||text(card.querySelector('b'))||'Discovery';return'<span class="daily-focus-chip"><i>'+(i+1)+'</i>'+title.replace(/^\S+\s+/,'')+'</span>';});
 var html='<strong>Today’s magic</strong>'+items.join('');if(strip.innerHTML!==html)strip.innerHTML=html;
}
function ensureJourney(){
 var card=qs('.quest-card');if(!card)return;
 var rail=qs('.learning-journey');if(!rail){rail=document.createElement('div');rail.className='learning-journey';rail.setAttribute('aria-label','Learning journey');card.parentNode.insertBefore(rail,card);}
 var currentPhase=phaseFromLabel(text(qs('#missionStep'))),active=phaseIndex(currentPhase);
 document.body.dataset.phase=currentPhase;
 var html=PHASES.map(function(p,i){var cls=i<active?' done':i===active?' active':'';return'<span class="learning-journey-step'+cls+'"><b>'+p[1]+'</b><small>'+(i+1)+'</small></span>';}).join('');
 if(rail.innerHTML!==html)rail.innerHTML=html;
}
function enhanceActivity(){
 if(document.body.dataset.view!=='activity')return;
 ensureJourney();
 var card=qs('.quest-card'),story=qs('.mission-story');if(card&&story){var power=card.querySelector('.mission-power'),skill=text(qs('#activitySkill')),trail=text(qs('#activityTrail'));if(!power){power=document.createElement('div');power.className='mission-power';story.insertAdjacentElement('afterend',power);}var content='<span>'+(DOMAIN_ICONS[domain()]||'✨')+' <b>'+skill+'</b></span><span>Inside '+trail+'</span>';if(power.innerHTML!==content)power.innerHTML=content;}
 var hear=qs('#hearBtn');if(hear){hear.classList.add('voice-listen');if(!hear.getAttribute('aria-busy'))hear.textContent='Listen to Sakhi';}
 var pill=qs('#voicePill');if(pill&&!pill.dataset.experienceLabel){pill.textContent='♪ Gentle Sakhi voice';pill.dataset.experienceLabel='1';}
}
function enhanceCelebrate(){
 var overlay=qs('#celebrate'),card=overlay&&overlay.querySelector('.celebrate-card');if(!card)return;
 var burst=card.querySelector('.treasure-burst');if(!burst){burst=document.createElement('div');burst.className='treasure-burst';burst.setAttribute('aria-hidden','true');burst.innerHTML='<span>✦</span><span>★</span><span>✦</span>';var icon=qs('#celebrateIcon');if(icon)icon.insertAdjacentElement('beforebegin',burst);}
 var title=qs('#celebrateTitle'),reward=qs('#celebrateReward');if(overlay.classList.contains('show')&&title&&reward){card.dataset.rewardReady='1';if(text(title).indexOf('Trail complete')>=0)reward.setAttribute('aria-label','Trail treasure earned');}
}
function enhanceRewards(){var box=qs('#rewardRecent');if(box)box.dataset.experience='treasure-room';}
function enhance(){scheduled=false;enhanceHome();enhanceActivity();enhanceCelebrate();enhanceRewards();}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(enhance);}
function start(){schedule();var root=qs('#app')||document.body,new MutationObserver(schedule).observe(root,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','data-view','aria-busy']});var celebration=qs('#celebrate');if(celebration)new MutationObserver(schedule).observe(celebration,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});document.addEventListener('click',function(){setTimeout(schedule,0);});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
