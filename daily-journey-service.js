(function(){
'use strict';
const R=()=>window.SakhiDomainThemeRegistry;
let autoLaunchGuard=false;
let finalRewardScheduled=false;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function activities(){return Array.isArray(window.activities)?window.activities:[];}
function questIds(){return Array.isArray(window.data?.quest)?window.data.quest:[];}
function byId(id){return activities().find(a=>a.id===id)||null;}
function currentRuntime(){return window.ActivityRenderer?.current?.()||null;}
function firstOpenId(){return questIds().find(id=>window.data?.questResults?.[id]==null)||questIds()[0]||null;}
function themeFor(activity){return R()?.forDomain(activity?.domain)||{theme_id:'unicorn-rainbow-meadow',display_name:'Unicorn Reading Meadow',accent:'#d948a6',secondary_accent:'#71c9ff',guide_character:'Luna the Unicorn',button_style:'rainbow',background:'linear-gradient(135deg,#fff7fb,#ddf5ff)'};}
function heroMarkup(theme,large=false){const c1=esc(theme.accent||'#d948a6'),c2=esc(theme.secondary_accent||'#71c9ff'),id=esc(theme.theme_id||'theme');return `<div class="journey-hero-svg ${large?'large':''}" data-theme-asset="${id}" aria-label="${esc(theme.display_name)} art"><svg viewBox="0 0 240 160" role="img" focusable="false"><defs><linearGradient id="g-${id}" x1="0" x2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect x="8" y="16" width="224" height="132" rx="28" fill="url(#g-${id})" opacity=".24"/><circle cx="58" cy="58" r="28" fill="${c2}" opacity=".45"/><circle cx="176" cy="54" r="24" fill="${c1}" opacity=".38"/><path d="M44 125 C70 75,92 86,112 120 C130 80,166 78,195 126 Z" fill="${c1}" opacity=".34"/><path d="M74 124 L92 72 L110 124 Z M115 124 L135 58 L156 124 Z" fill="${c2}" opacity=".58"/><path d="M112 37 l8 18 19 2-14 13 4 19-17-10-17 10 4-19-14-13 19-2z" fill="#fff" opacity=".92"/><path d="M34 96 C72 50,124 50,204 96" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".74"/><text x="120" y="140" text-anchor="middle" font-size="16" font-family="system-ui" fill="#3a235a" font-weight="700">${esc(theme.guide_character||'Sakhi')}</text></svg></div>`;}
function decoratedTitle(activity){return R()?.titleFor(activity)||String(activity?.title||'Learning activity');}
function learningType(activity){return R()?.learningType(activity)||String(activity?.skill||'Learning');}
function decorateActivities(){for(const a of activities()){const t=themeFor(a);a.domain_theme=t.theme_id;a.theme_id=t.theme_id;a.display_title=decoratedTitle(a);a.guide_character=a.guide_character||t.guide_character;}}
function updateHome(){
  const hero=document.querySelector('#home');if(!hero)return;
  const title=document.querySelector('.hero h1');if(title)title.innerHTML='<span class="rainbow">Sakhi</span><br/>Magic Learning';
  const intro=document.querySelector('.hero p');if(intro)intro.innerHTML='<b>Hi, Princess!</b><br>Ready for today’s magic?';
  document.querySelectorAll('button').forEach(b=>{if(/Start My Adventure|Open Today/.test(b.textContent||'')){b.textContent='🌈 Start Today’s Adventure';b.setAttribute('aria-label','Start Today’s Adventure');}});
  const heroArt=document.getElementById('heroArt');if(heroArt){heroArt.innerHTML=heroMarkup(themeFor({domain:'reading'}),true);heroArt.classList.add('journey-home-art');}
  if(!document.getElementById('dailyJourneyHome')){
    const card=document.createElement('section');card.id='dailyJourneyHome';card.className='daily-home-panel';card.innerHTML=`<div class="daily-home-copy"><span class="kid-label">TODAY’S MAGIC</span><h2>Home → Adventure → Rewards → Story</h2><p>About 20 minutes. Sakhi will guide one activity at a time.</p></div><button class="btn primary" type="button" data-start-journey>Start Today’s Adventure</button><div class="kingdom-strip">${R().orderedTrail().map(t=>`<span style="--accent:${esc(t.accent)}">${esc(t.display_name)}</span>`).join('')}</div>`;
    const first=document.querySelector('#home .section-title');first?.before(card);
    card.querySelector('[data-start-journey]').onclick=()=>startAdventure();
  }
}
function updateNavigation(){
  const labels={quest:['✨ Adventure','Adventure'],learn:['🏰 Kingdoms','Kingdoms'],rewards:['🌟 Rewards','Rewards']};
  document.querySelectorAll('[data-go]').forEach(btn=>{const key=btn.dataset.go;if(labels[key])btn.innerHTML=btn.closest('.bottom')?`<span>${labels[key][0].split(' ')[0]}</span>${labels[key][1]}`:labels[key][0];});
  document.querySelectorAll('[data-go="baseline"]').forEach(el=>el.classList.add('control-hidden'));
}
function renderTrail(){
  const quest=document.getElementById('quest');if(!quest)return;
  let trail=document.getElementById('dailyAdventureTrail');
  if(!trail){trail=document.createElement('div');trail.id='dailyAdventureTrail';trail.className='daily-adventure-trail';document.getElementById('questCards')?.before(trail);}
  const ids=questIds(),current=currentRuntime()?.activity?.id,open=firstOpenId();
  const fallback=[{domain:'reading',skill:'Reading Meadow'},{domain:'math',skill:'Royal Math Quest'},{domain:'logic',skill:'Ice Palace Puzzle'},{domain:'science',skill:'Mermaid Discovery'},{domain:'rewards',skill:'Reward Castle'}];
  const items=(ids.length?ids.map(byId).filter(Boolean):fallback).slice(0,5);
  trail.innerHTML=`<div class="trail-header"><div><span class="kid-label">TODAY’S ADVENTURE</span><h2>Follow the magic trail</h2></div><button class="btn primary" type="button" data-launch-current>${current?'Continue Activity':'Start First Activity'}</button></div><div class="trail-steps">${items.map((a,i)=>{const done=!!window.data?.questResults?.[a.id],active=current===a.id||(!current&&open===a.id)||(!a.id&&i===0),t=themeFor(a);return `<button class="trail-step ${done?'done':''} ${active?'active':''}" type="button" data-activity-id="${esc(a.id||'')}"><span class="trail-num">${done?'✓':i+1}</span><span class="trail-art">${heroMarkup(t)}</span><b>${esc(t.display_name)}</b><small>${esc(learningType(a))}</small></button>`;}).join('')}<button class="trail-step reward ${!open&&!current?'active':''}" type="button" data-open-rewards><span class="trail-num">⭐</span><b>Reward Castle</b><small>Adventure celebration</small></button></div>`;
  trail.querySelector('[data-launch-current]').onclick=()=>launchCurrent();
  trail.querySelectorAll('[data-activity-id]').forEach(btn=>{if(btn.dataset.activityId)btn.onclick=()=>window.runActivity?.(btn.dataset.activityId);});
  trail.querySelector('[data-open-rewards]').onclick=()=>showAdventureComplete();
  const cards=document.getElementById('questCards');if(cards){cards.setAttribute('aria-hidden','true');cards.classList.add('journey-card-list-hidden');}
}
function startAdventure(){window.SpeechService?.unlockAudio?.();window.go?.('quest');setTimeout(()=>{renderTrail();launchCurrent();},120);}
function launchCurrent(){if(autoLaunchGuard)return;const id=firstOpenId();if(!id)return showAdventureComplete();autoLaunchGuard=true;window.runActivity?.(id);setTimeout(()=>{autoLaunchGuard=false;},600);}
function maybeAutoLaunch(payload){if(payload?.args?.[0]!=='quest')return;setTimeout(()=>{renderTrail();if(!currentRuntime()&&firstOpenId())launchCurrent();},160);}
function decorateActivity(payload){
  const [activity,containerId,source]=payload?.args||[];if(!activity||!containerId)return;
  const host=document.getElementById(containerId),mission=host?.querySelector('.child-mission');if(!host||!mission)return;
  const t=themeFor(activity);host.classList.add('journey-activity-page');host.style.setProperty('--journey-accent',t.accent);host.style.setProperty('--journey-secondary',t.secondary_accent);host.style.setProperty('--journey-bg',t.background);
  mission.dataset.theme=t.theme_id;
  if(!mission.querySelector('.journey-activity-header')){
    mission.insertAdjacentHTML('afterbegin',`<div class="journey-activity-header"><div class="journey-theme-copy"><span>${esc(t.display_name)}</span><h2>${esc(learningType(activity))}</h2></div>${heroMarkup(t,true)}</div>`);
  }
  const inst=mission.querySelector('.activity-instruction');if(inst)inst.textContent=activity.instruction_text||activity.learning_objective||'Try this activity.';
  const hear=mission.querySelector('.activity-hear');if(hear)hear.textContent='🔊 Hear Sakhi';
  renderTrail();
}
function observeFinalCelebration(){
  const runner=document.getElementById('activityRunner');if(!runner||runner.dataset.journeyObserver)return;runner.dataset.journeyObserver='1';
  new MutationObserver(()=>{const text=runner.textContent||'';if(/Adventure complete/i.test(text)&&!finalRewardScheduled){finalRewardScheduled=true;setTimeout(()=>{showAdventureComplete();finalRewardScheduled=false;},1500);}}).observe(runner,{childList:true,subtree:true,characterData:true});
}
function rewardSummary(){const done=questIds().filter(id=>window.data?.questResults?.[id]!=null).map(byId).filter(Boolean);const stars=(window.data?.rewardTransactions||[]).filter(x=>x.status!=='FAILED').length||done.length;return {done,stars:Math.max(stars,done.length),gems:done.length>=4?1:0,heart:done.some(a=>['sel','writing','science'].includes(a.domain))?1:0};}
function storyText(done){const skills=done.map(a=>a.skill||a.learning_objective).filter(Boolean).slice(0,3).join(', ')||'reading, numbers, and thinking';return `Tonight, Sakhi and Luna followed a soft rainbow path through the learning kingdoms. They practiced ${skills}. First they listened carefully, then they solved each little mystery one step at a time. The stars grew calm, the unicorn curled up beside the princess, and Sakhi whispered, “Your brain learned something new today. Now it is time to rest.”`;}
function showStory(){const s=rewardSummary();let modal=document.getElementById('bedtimeStoryPanel');if(!modal){modal=document.createElement('div');modal.id='bedtimeStoryPanel';modal.className='bedtime-story-panel';document.body.appendChild(modal);}modal.innerHTML=`<div class="bedtime-card"><button type="button" class="story-close" data-close-story>×</button><span class="kid-label">BEDTIME STORY</span><h2>Sakhi’s Calm Rainbow Story</h2><p>${esc(storyText(s.done))}</p><button class="btn soft" type="button" data-read-story>🔊 Read aloud</button></div>`;modal.hidden=false;modal.querySelector('[data-close-story]').onclick=()=>{modal.hidden=true};modal.querySelector('[data-read-story]').onclick=()=>window.SpeechService?.speakStory?.(storyText(s.done));}
function showAdventureComplete(){
  const s=rewardSummary();window.go?.('rewards');
  const rewards=document.getElementById('rewards');if(!rewards)return;
  let panel=document.getElementById('journeyCelebration');
  if(!panel){panel=document.createElement('section');panel.id='journeyCelebration';panel.className='journey-celebration-full';rewards.prepend(panel);}
  panel.innerHTML=`<div class="celebration-visual">${heroMarkup(themeFor({domain:'reading'}),true)}<div class="confetti" aria-hidden="true">✨ 🌈 ⭐ 💎 ✨</div></div><div class="celebration-copy"><span class="kid-label">ADVENTURE COMPLETE!</span><h2>You Finished Today’s Adventure!</h2><p>You built words, solved number puzzles, and explored new ideas today.</p><div class="celebration-stats"><b>⭐ ${s.stars} Magic Stars</b><b>💎 ${s.gems} Unicorn Gem</b><b>💛 ${s.heart} Courage Heart</b></div><h3>Today you practiced</h3><ul>${(s.done.length?s.done:[{domain:'reading',skill:'Reading'},{domain:'math',skill:'Math'}]).map(a=>`<li>${esc((a.domain||'Learning').replace(/^./,m=>m.toUpperCase()))} — ${esc(a.skill||a.title||'Practice')}</li>`).join('')}</ul><div class="celebration-actions"><button class="btn primary" type="button" data-bedtime-story>Bedtime Story</button><button class="btn soft" type="button" onclick="document.getElementById('rewardGrid')?.scrollIntoView({behavior:'smooth'})">See My Rewards</button><button class="btn soft" type="button" onclick="go('home')">Home</button></div></div>`;
  panel.querySelector('[data-bedtime-story]').onclick=showStory;
}
function refresh(){decorateActivities();updateHome();updateNavigation();renderTrail();observeFinalCelebration();}
function init(){if(!R())throw new Error('SakhiDomainThemeRegistry must load before DailyJourneyService');refresh();window.UIHooks?.on?.('navigate',maybeAutoLaunch);window.UIHooks?.on?.('questRendered',()=>setTimeout(renderTrail,0));window.UIHooks?.on?.('activityOpened',decorateActivity);window.addEventListener('sakhi-activity-saved',()=>setTimeout(renderTrail,0));}
window.startSakhiDailyAdventure=startAdventure;
window.DailyJourneyService=Object.freeze({refresh,startAdventure,launchCurrent,showAdventureComplete,showStory,themeFor,rewardSummary,getTrail:()=>questIds().map(byId).filter(Boolean)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
