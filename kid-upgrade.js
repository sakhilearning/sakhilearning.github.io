(function(){
'use strict';

const KID_AUDIO={m:{word:'moon'},s:{word:'sun'},t:{word:'top'},p:{word:'pig'},a:{word:'apple'},n:{word:'nest'},f:{word:'fish'},l:{word:'leaf'},h:{word:'hat'},r:{word:'rainbow'}};
function speech(){if(!window.SpeechService)throw new Error('SpeechService must load before kid-upgrade.js');return window.SpeechService;}
function esc(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));}
function sceneKey(a){return window.SakhiVisuals?.sceneKey?.(a)||'fairy';}
function sceneMarkup(a,cls='kid-scene-art'){return window.SakhiVisuals?.sceneMarkup?.(sceneKey(a),cls)||`<div class="${cls} scene-fallback" role="img" aria-label="Magical learning scene">✨🏰🦄</div>`;}

function normalizeLearningCopy(){
 const first=(window.activities||[]).find(a=>a.id==='read-first');
 if(first){
   first.spoken_instruction='Listen to the first sound in each picture name. Put the m-sound pictures in Luna’s pink cloud and the s-sound pictures in the blue cloud.';
   first.hint_2='Moon begins with the /m/ sound.';
   first.hint_3='Moon and map begin with /m/. Sun and sock begin with /s/.';
   first.success_feedback='Yes! You sorted the pictures by their first sounds.';
 }
}

async function playLetterSound(k){
 if(!KID_AUDIO[k])return false;
 document.querySelectorAll('.sound-orb').forEach(b=>b.classList.toggle('playing',b.dataset.sound===k));
 try{return await speech().speakPhoneme(k);}finally{document.querySelectorAll('.sound-orb').forEach(b=>b.classList.remove('playing'));}
}
window.playLetterSound=playLetterSound;

function addKidStart(){
 const home=document.getElementById('home');if(!home||document.getElementById('kidStartZone'))return;
 const zone=document.createElement('section');zone.id='kidStartZone';zone.className='kid-start-zone';
 zone.innerHTML=`<div class="kid-welcome"><div><span class="kid-label">FOR KIDS</span><h2>Pick a way to play ✨</h2><p>Touch, move, listen, build, and discover.</p></div><div class="kid-stars">⭐ ✦ ⭐</div></div>
 <div class="kid-mode-grid"><button class="kid-mode quest-mode" onclick="go('quest')"><span>✨</span><b>Today's Adventure</b><small>5 different missions</small></button><button class="kid-mode sound-mode"><span>🔊</span><b>Sound Garden</b><small>Tap letters and listen</small></button><button class="kid-mode build-mode" onclick="openDomain('reading')"><span>🔤</span><b>Build Words</b><small>Move letters into place</small></button><button class="kid-mode number-mode" onclick="openDomain('math')"><span>💎</span><b>Play With Numbers</b><small>Count, move, make</small></button></div>
 <div id="soundPlay" class="sound-play-card"><div class="sound-head"><div><span class="kid-label">SOUND GARDEN</span><h3>Tap a letter to hear its sound</h3></div><button class="sound-all" type="button">🔊 Play 5</button></div><div class="sound-orbs">${Object.keys(KID_AUDIO).map(k=>`<button type="button" class="sound-orb" data-sound="${k}" aria-label="Hear ${k} sound"><b>${k}</b><small>${KID_AUDIO[k].word}</small><span>🔊</span></button>`).join('')}</div></div>`;
 home.prepend(zone);
 zone.querySelector('.sound-mode').onclick=()=>document.getElementById('soundPlay').scrollIntoView({behavior:'smooth'});
 zone.querySelectorAll('.sound-orb').forEach(b=>b.addEventListener('click',()=>playLetterSound(b.dataset.sound)));
 zone.querySelector('.sound-all').addEventListener('click',async()=>{for(const k of ['m','s','t','p','a']){await playLetterSound(k);await new Promise(r=>setTimeout(r,180));}});
}

function patchHero(){
 const hero=document.querySelector('.hero-visual');if(!hero)return;
 const theme=(typeof data!=='undefined'&&data.theme)||'unicorn';
 const pseudo={id:'hero-'+theme,domain:theme==='mermaid'?'science':theme==='ice'?'memory':'creativity'};
 hero.innerHTML=sceneMarkup(pseudo,'hero-scene')+'<div class="hq-stars">✦ ⭐ ✦</div>';
}

window.renderWordBuilder=function(a,m){
 const st=runtimeState();st.order=[];st.tileIds=[];
 m.innerHTML=`<div class="kid-task-scene">${sceneMarkup(a,'kid-task-scene-art')}<span>${esc(a.character_prompt||'Build the word!')}</span></div><div class="word-build-stage"><div class="word-slots kid-word-slots">${a.targets.map((_,i)=>`<button type="button" class="word-slot kid-slot" data-slot="${i}" aria-label="Letter slot ${i+1}">_</button>`).join('')}</div><div class="letter-bank kid-letter-bank">${shuffle(a.items).map(i=>`<div class="letter-piece-wrap"><button type="button" draggable="true" class="letter-tile movable-letter" data-id="${esc(i.id)}" data-value="${esc(i.value)}"><b>${esc(i.value)}</b></button><button type="button" class="tile-sound" data-value="${esc(i.value)}">🔊</button></div>`).join('')}</div><p class="tap-fallback">Drag a letter into a box — or tap letters in order.</p><button class="big-action" type="button" onclick="checkWord()">⭐ Check My Word</button></div>`;
 function sync(){m.querySelectorAll('.kid-slot').forEach((s,i)=>s.textContent=st.order[i]||'_');m.querySelectorAll('.movable-letter').forEach(t=>t.classList.toggle('used',st.tileIds.includes(t.dataset.id)));}
 function place(id,value,slotIndex=null){if(st.tileIds.includes(id))return;if(slotIndex==null)slotIndex=st.order.length;if(slotIndex>=a.targets.length)return;while(st.order.length<slotIndex)st.order.push(null);if(st.order[slotIndex]){st.order.splice(slotIndex,1);st.tileIds.splice(slotIndex,1);}st.order[slotIndex]=value;st.tileIds[slotIndex]=id;sync();speech().speakPhoneme(value);}
 m.querySelectorAll('.movable-letter').forEach(t=>{t.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',JSON.stringify({id:t.dataset.id,value:t.dataset.value})));t.addEventListener('click',()=>place(t.dataset.id,t.dataset.value));});
 m.querySelectorAll('.kid-slot').forEach(s=>{s.addEventListener('dragover',e=>e.preventDefault());s.addEventListener('drop',e=>{e.preventDefault();try{const x=JSON.parse(e.dataTransfer.getData('text/plain'));place(x.id,x.value,+s.dataset.slot);}catch(_){}});s.addEventListener('click',()=>{const idx=+s.dataset.slot;if(st.order[idx]){st.order.splice(idx,1);st.tileIds.splice(idx,1);sync();}});});
 m.querySelectorAll('.tile-sound').forEach(b=>b.addEventListener('click',()=>speech().speakPhoneme(b.dataset.value)));sync();
};

const oldOpenStructured=window.openStructuredActivity;
window.openStructuredActivity=function(a,containerId,source){
 oldOpenStructured(a,containerId,source);
 setTimeout(()=>{
  const host=document.getElementById(containerId),mission=host?.querySelector('.child-mission');if(!mission)return;
  if(!mission.querySelector('.kid-scene-strip')){const guide=mission.querySelector('.character-guide'),strip=document.createElement('div');strip.className='kid-scene-strip';strip.innerHTML=sceneMarkup(a,'kid-scene-strip-art')+`<span>${esc(a.character||'Magic Guide')}</span>`;guide?.after(strip);}
  const tools=mission.querySelector('.child-tools');if(tools&&!tools.querySelector('.start-over')){const b=document.createElement('button');b.className='child-tool start-over';b.textContent='↻ Start Over';b.onclick=()=>restartCurrentMission(false);tools.appendChild(b);}
  speech().speakInstruction(a.spoken_instruction);
 },30);
};

window.restartCurrentMission=function(record=true){if(!interactionRuntime)return;const r=interactionRuntime,a=r.activity;if(record&&typeof data!=='undefined'){data.retryHistory=data.retryHistory||[];data.retryHistory.push({date:todayKey(),activityId:a.id,skill:a.skill,domain:a.domain,previousAttempts:r.attempts,hints:r.hintLevel});data.retryHistory=data.retryHistory.slice(-120);persist(false);}openStructuredActivity(a,r.containerId,r.source);};
window.handleRetry=function(allowHint=true){const r=interactionRuntime,a=r.activity;document.getElementById('structuredFeedback').textContent='🌈 '+a.retry_feedback;recordInteractionEvent('retry');if(r.attempts>=2&&allowHint&&r.hintLevel<2)showHint();if(r.attempts>=3){r.hintLevel=3;document.getElementById('structuredHint').textContent='💡 '+a.hint_3;applyStrongScaffold();}};

function nextQuestMission(){if(!interactionRuntime)return closeStructuredActivity();const current=interactionRuntime.activity.id,ids=data.quest||[],i=ids.indexOf(current),next=ids.slice(i+1).find(id=>data.questResults[id]==null);if(next){closeStructuredActivity();setTimeout(()=>runActivity(next),100);}else{closeStructuredActivity();go('quest');}}
window.nextQuestMission=nextQuestMission;
const oldFinishSuccess=window.finishSuccess;
window.finishSuccess=function(forcedScore=null){const snapshot=interactionRuntime?{containerId:interactionRuntime.containerId,source:interactionRuntime.source}:null;oldFinishSuccess(forcedScore);if(!snapshot)return;setTimeout(()=>{const f=document.getElementById('structuredFeedback');if(!f||f.querySelector('.after-mission-actions'))return;const actions=document.createElement('div');actions.className='after-mission-actions';actions.innerHTML=`<button type="button" class="retry-mission">↻ Play Again</button>${snapshot.source==='quest'?'<button type="button" class="next-mission">Next Adventure →</button>':''}`;f.appendChild(actions);actions.querySelector('.retry-mission').onclick=()=>restartCurrentMission(true);const next=actions.querySelector('.next-mission');if(next)next.onclick=nextQuestMission;},40);};

function renderCoachInsights(){const parent=document.getElementById('parent');if(!parent)return;let box=document.getElementById('smartCoach');if(!box){box=document.createElement('div');box.id='smartCoach';box.className='card smart-coach';parent.querySelector('.grid')?.after(box);}box.innerHTML='<div class="smart-coach-head"><div><span class="badge adult">🧠 Learning Coach</span><h3>What the app suggests next</h3></div><small>Based on attempts, hints and success — not just stars.</small></div><p class="muted">Complete interactive missions and Sakhi will adapt the next practice.</p>';}
const oldGo=window.go;window.go=function(id){oldGo(id);if(id==='parent')setTimeout(renderCoachInsights,40);};

function childPolish(){normalizeLearningCopy();document.body.classList.add('kid-v4');addKidStart();patchHero();const q=document.querySelector('#questSummary');if(q)q.textContent='Tap a mission. Listen. Touch. Move. Try again. Earn a shiny star!';renderCoachInsights();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',childPolish);else childPolish();
})();