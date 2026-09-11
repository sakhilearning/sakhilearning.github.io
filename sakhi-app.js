(function(){
'use strict';
var Cur=SakhiCurriculum,Prog=SakhiProgress,Plan=SakhiPlan,Trails=SakhiTrails,Pres=SakhiPresentation,Act=SakhiActivities,Audio=SakhiAudio,Tpl=SakhiTemplates,Cloud=SakhiCloud;
var $=function(s){return document.querySelector(s);};
var view='home',plan=null,session=null,missionIndex=0,current=null,qIndex=0,answers=[],controller=null,hintLevel=0,parentOpen=false,parentChallenge=null,questionTries=0,awaitingNext=false,sessionMode='scheduled',trailLaunching=false,adventureMode=localStorage.getItem('sakhi_adventure_mode')==='princess'?'princess':'unicorn';
function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(function(){t.classList.remove('show');},2600);}
function setWorld(domain){if(domain)document.body.dataset.domain=domain;else delete document.body.dataset.domain;}
function show(v){Audio.stopAll();view=v;document.body.dataset.view=v;if(v!=='activity')setWorld(null);document.querySelectorAll('.view').forEach(function(n){n.classList.toggle('active',n.dataset.view===v);});document.querySelectorAll('[data-nav]').forEach(function(b){b.classList.toggle('active',b.dataset.nav===v);});if(v==='parent'&&!parentOpen)refreshParentChallenge();render();window.scrollTo(0,0);}
function render(){renderStats();if(view==='home')renderHome();else if(view==='map')renderMap();else if(view==='rewards')renderRewards();else if(view==='parent')renderParent();else if(view==='activity')renderActivity();}
function renderStats(){var n=$('#starStat');if(n)n.textContent='✦ '+Prog.stars();}
function trailCard(d){var p=Prog.domainProgress(d.domain_id),t=Trails.get(d.domain_id);return '<article class="trail-card domain-'+d.domain_id+'" data-trail-domain="'+d.domain_id+'" role="button" tabindex="0" aria-label="Open '+d.title+' trail"><div class="mini-scene">'+Pres.scene(d.domain_id,p)+'</div><div class="trail-card-copy"><h3>'+t.icon+' '+t.name+'</h3><p>'+d.title+' · '+Trails.chapter(d.domain_id,p)+'</p><div class="meter" aria-label="'+p+' percent explored"><i style="width:'+p+'%"></i></div><small>'+p+'% explored · Tap to explore</small></div></article>';}
function renderHome(){
  setWorld(null);plan=Plan.build();
  document.body.dataset.adventureMode=adventureMode;$('#homeHero').innerHTML=Pres.scene('reading',Prog.domainProgress('reading'),adventureMode==='princess'?'princess':'home');
  $('#modeUnicorn').classList.toggle('active',adventureMode==='unicorn');$('#modePrincess').classList.toggle('active',adventureMode==='princess');$('#heroTitle').innerHTML=adventureMode==='unicorn'?'<span class="desktop-title">Your next<br>adventure<br>starts with a little<br>magic.</span><span class="mobile-title">Ready for a<br>little magic?</span>':'<span class="desktop-title">A little courage.<br>A kingdom of<br>possibilities.</span><span class="mobile-title">A kingdom of<br>possibilities.</span>';$('#heroInvite').textContent=adventureMode==='unicorn'?'Luna saved a place for you. Shall we explore?':'Your crown is curiosity. Come and discover something wonderful.';
  $('#todayTitle').textContent='Day '+plan.program_day+' · '+plan.missions.length+' magical missions';
  var names=plan.missions.map(function(m){var s=Cur.skill(m.pick.skill_id);return s?s.title:m.pick.skill_id;});
  $('#todaySummary').textContent=names.join(' • ')+' • one hands-on mission';
  $('#questCount').textContent=plan.missions.length+' little quests + a hands-on discovery';$('#todayPath').innerHTML=names.map(function(name,i){return '<span><i>'+(i+1)+'</i><b>'+name+'</b></span>';}).join('')+'<span><i>✦</i><b>Play away from the screen</b></span>';
  var order=['reading','logic','science','language','wellbeing','creative'],domains=Cur.domains();
  var grid=$('#trailPreview');grid.innerHTML=order.map(function(id){return domains.find(function(d){return d.domain_id===id;});}).filter(Boolean).map(trailCard).join('');
}
function renderMap(){var g=$('#mapGrid');g.innerHTML=Cur.domains().map(function(d){return trailCard(d);}).join('');}
function renderRewards(){var s=Prog.load();$('#rewardTotal').textContent=Prog.stars();var box=$('#rewardRecent'),recent=s.rewards.slice(-10).reverse();box.innerHTML=recent.length?recent.map(function(r){var sk=Cur.skill(r.skill_id);return '<div class="reward-row"><span>⭐ +'+r.amount+' '+r.label+'</span><span class="muted">'+(sk?sk.title:'practice')+'</span></div>';}).join(''):'<p class="center muted">Complete an adventure to collect your first Trail Stars.</p>';}
function parentMetric(label,value,sub){return '<article class="parent-card"><small>'+label+'</small><h2>'+value+'</h2><p class="muted">'+sub+'</p></article>';}
function refreshParentChallenge(){
  if(parentOpen)return;var add=Math.random()>.28,a=6+Math.floor(Math.random()*9),b=2+Math.floor(Math.random()*7),label=$('#parentGate')&&$('#parentGate').querySelector('label');
  if(add){parentChallenge={answer:a+b,text:'What is '+a+' + '+b+'?'};}else{if(b>a){var x=a;a=b;b=x;}parentChallenge={answer:a-b,text:'What is '+a+' − '+b+'?'};}
  if(label)label.textContent=parentChallenge.text;var input=$('#gateAnswer');if(input){input.value='';setTimeout(function(){try{input.focus();}catch(e){}},60);}
}
async function renderParent(){
  if(!parentOpen){$('#parentGate').hidden=false;$('#parentBody').hidden=true;if(!parentChallenge)refreshParentChallenge();return;}
  $('#parentGate').hidden=true;var s=Prog.load(),body=$('#parentBody');body.hidden=false;
  var completed=s.sessions.filter(function(x){return x.status==='COMPLETED';}).length,objective=s.attempts.filter(function(a){return a.objective;}),ind=objective.reduce(function(n,a){return n+a.independent_questions;},0),tot=objective.reduce(function(n,a){return n+a.total_questions;},0),hints=objective.reduce(function(n,a){return n+a.hints;},0),cloud=Cloud.state(),audio=await Audio.phonemeReport(),voice=Audio.status();
  body.innerHTML='<div class="parent-grid">'+parentMetric('Program day',Math.min(130,completed+1)+' / 130','Six-month learning path')+parentMetric('Independent answers',tot?Math.round(ind/tot*100)+'%':'—','Objective questions only')+parentMetric('Hints used',hints,'Support is information, not failure')+parentMetric('Cloud',cloud.status,cloud.pending+' queued · '+cloud.dead+' needs review')+'</div>'+
  '<section class="parent-card parent-section"><h2>Family progress sync</h2>'+(cloud.configured?(cloud.status==='CONNECTED'?'<p>Connected to Supabase. Completed objective attempts can sync across devices.</p><button class="soft" id="cloudSignOut">Disconnect</button>':'<p class="muted">Sign in with the parent account used for Sakhi sync.</p><div class="parent-form"><input class="parent-input" id="cloudEmail" type="email" placeholder="Parent email"><input class="parent-input" id="cloudPassword" type="password" placeholder="Password"><button class="soft" id="cloudSignIn">Connect</button></div>'):'<p class="muted">Supabase public URL/key are not configured in this build. Progress stays on this device.</p>')+'</section>'+
  '<section class="parent-card parent-section"><h2>Subject progress</h2>'+Cur.domains().map(function(d){var p=Prog.domainProgress(d.domain_id);return '<div class="parent-progress"><p><b>'+d.title+'</b> — '+Trails.chapter(d.domain_id,p)+' <span class="muted">('+p+'%)</span></p><div class="meter"><i style="width:'+p+'%"></i></div></div>';}).join('')+'</section>'+
  '<section class="parent-card parent-section"><h2>Audio readiness</h2><p class="audio-badge '+(audio.complete?'good':'warn')+'">Verified isolated phonemes: '+audio.present+' / '+audio.required+'</p><p class="muted">Narration now prefers Sakhi’s local natural voice (Kokoro, gentle female voice) with no usage credits. ElevenLabs is secondary when configured. The generic device voice is not used as the normal production fallback.</p><div class="audio-tools"><button class="soft" id="testVoiceBtn">🔊 Test Sakhi voice</button><span class="muted" id="audioStatusText">'+(voice.naturalState==='loading'?'Preparing natural voice…':'')+'</span></div></section>'+
  '<section class="parent-card parent-section"><h2>Settings</h2><label class="parent-setting"><input type="checkbox" id="voiceToggle" '+(Audio.isEnabled()?'checked':'')+'> Spoken instructions</label><label class="parent-setting">Session length <select id="sessionMinutes"><option value="20">20 min</option><option value="25">25 min</option><option value="30">30 min</option></select></label><button class="soft" id="exportBtn">Export progress backup</button></section>';
  var sm=$('#sessionMinutes');sm.value=String(s.settings.session_minutes||30);sm.onchange=function(){Prog.setSetting('session_minutes',Number(sm.value));toast('Session length saved');};
  $('#voiceToggle').onchange=function(e){Audio.setEnabled(e.target.checked);Prog.setSetting('voice',e.target.checked);};
  if($('#testVoiceBtn'))$('#testVoiceBtn').onclick=async function(){var out=$('#audioStatusText');try{out.textContent='Preparing Sakhi natural voice…';await Audio.unlock();await Audio.speak('Hello! I am ready for our gentle learning adventure.');var st=Audio.status();out.textContent=st.provider==='kokoro'?'Playing Sakhi natural voice.':st.provider==='elevenlabs'?'Playing ElevenLabs voice.':'Voice played.';}catch(e){out.textContent='Voice could not play: '+(e.message||e);}};
  if($('#cloudSignIn'))$('#cloudSignIn').onclick=async function(){try{await Cloud.signIn($('#cloudEmail').value,$('#cloudPassword').value);toast('Family progress connected');renderParent();}catch(e){console.error(e);toast('Could not sign in. Check the parent account.');}};
  if($('#cloudSignOut'))$('#cloudSignOut').onclick=async function(){await Cloud.signOut();toast('Family progress disconnected');renderParent();};
  $('#exportBtn').onclick=function(){var blob=new Blob([JSON.stringify(Prog.snapshot(),null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='sakhi-progress-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);};
}
async function start(){
  $('#startBtn').disabled=true;sessionMode='scheduled';
  try{await Audio.unlock();plan=Plan.build();session=Prog.startSession(plan);missionIndex=0;await loadMission();}
  catch(e){console.error('[Sakhi start]',e);toast('Sakhi could not start that mission. Please refresh once.');}
  finally{$('#startBtn').disabled=false;}
}
async function startTrail(domain){
  if(trailLaunching||session)return;trailLaunching=true;
  try{
    await Audio.unlock();var pick=window.SakhiAdaptive&&SakhiAdaptive.pick(domain,[]);if(!pick){toast('That trail is resting for now. Try another magical world.');return;}
    var base=Plan.build();plan={date:base.date,program_day:base.program_day,minutes:Math.min(10,base.minutes||30),missions:[{domain:domain,minutes:8,pick:pick}],offscreen:null,celebration_minutes:1,optional_trail:true};
    sessionMode='trail';session=Prog.startSession(plan);missionIndex=0;await loadMission();
  }catch(e){console.error('[Sakhi trail]',e);toast('That trail could not open. Please try once more.');}
  finally{trailLaunching=false;}
}
async function loadMission(){
  if(missionIndex>=plan.missions.length){if(sessionMode==='trail'){if(session)Prog.endSession(session.session_id,'TRAIL_COMPLETE');session=null;current=null;show('map');toast('Trail practice saved ✨');return;}return offscreenMission();}
  var m=plan.missions[missionIndex];current=Act.generate(m.pick.skill_id,m.pick.band,session.session_id+':'+missionIndex);current._mission=m;qIndex=0;answers=[];hintLevel=0;questionTries=0;show('activity');speak();
}
function offscreenMission(){
  current={skill_id:'creative.imaginative_play',skill_title:'Hands-on mission',domain_id:plan.offscreen.domain,band:1,band_name:'PRACTICE',evidence_mode:'practice',questions:[{template:'practice',prompt:plan.offscreen.prompt,narration:plan.offscreen.prompt,answer:'done',evidence_mode:'practice',hints:['A grown-up can join you.']}]};
  current._mission={domain:plan.offscreen.domain,minutes:plan.offscreen.minutes,pick:{skill_id:current.skill_id,reason:'off-screen practice'}};qIndex=0;answers=[];hintLevel=0;questionTries=0;show('activity');speak();
}
function q(){return current.questions[qIndex];}
function voiceLabel(){var st=Audio.status();return st.provider==='kokoro'?'✨ Sakhi natural voice':st.provider==='elevenlabs'?'✨ Sakhi cloud voice':st.naturalState==='loading'?'✨ Preparing Sakhi voice…':'🔊 Sakhi voice';}
function speak(){var pill=$('#voicePill');if(pill)pill.textContent=Audio.status().naturalState==='loading'?'✨ Preparing Sakhi voice…':'🔊 Starting Sakhi voice…';Audio.narrate(q()).then(function(){if(pill)pill.textContent=voiceLabel();}).catch(function(e){if(e.kind!=='DISABLED'){console.warn('[Sakhi voice]',e);if(pill)pill.textContent='🔇 Tap Hear again';toast(e.kind==='NATURAL_VOICE'?'Sakhi’s gentle voice needs the connection once. Tap Hear again.':'Tap Hear again if you want Sakhi to read it aloud.');}});}
function renderActivity(){
  if(!current)return;var d=current.domain_id,p=Prog.domainProgress(d),t=Trails.get(d),cue=Pres.storyCue(d,current.skill_title,qIndex);setWorld(d);
  $('#activityTrail').textContent=t.name;$('#activitySkill').textContent=current.skill_title;$('#activityProgress').textContent=sessionMode==='trail'?'Trail practice':'Quest '+(missionIndex+1)+' of '+(plan.missions.length+1);$('#activityScene').innerHTML=Pres.scene(d,p);$('#missionEyebrow').textContent=t.companion;$('#missionStory').textContent='Take your time. I’m right here.';$('#missionStep').textContent=cue.step;$('#questLabel').textContent=current.evidence_mode==='practice'?'A little practice':'A little discovery';$('#questionPrompt').textContent=q().prompt;$('#hintArea').textContent=hintLevel?(q().hints||[]).slice(0,hintLevel).map(function(h){return'💡 '+h;}).join('  '):'';$('#checkBtn').textContent='Check ✓';awaitingNext=false;
  controller=Tpl.render($('#interaction'),q(),{domain:d,onProgress:function(){if(controller)$('#checkBtn').disabled=!controller.isReady();}});$('#checkBtn').disabled=!controller.isReady();$('#hintBtn').disabled=!(q().hints||[]).length;
}
function hint(){var h=q().hints||[];if(hintLevel<h.length){hintLevel++;$('#hintArea').textContent=h.slice(0,hintLevel).map(function(x){return'💡 '+x;}).join('  ');Audio.speak(h[hintLevel-1]).catch(function(){});}if(hintLevel>=h.length)$('#hintBtn').disabled=true;}
function check(){
  if(awaitingNext){awaitingNext=false;nextQuestion();return;}
  if(!controller)return;var r=controller.check();if(!r)return;questionTries++;
  if(!r.correct&&current.evidence_mode!=='practice'&&questionTries<2){toast('Good try — here is a clue.');if(hintLevel<(q().hints||[]).length)hint();setTimeout(function(){controller.reset();$('#checkBtn').disabled=true;},500);return;}
  answers.push({correct:r.correct,hintsUsed:hintLevel,response:r.response,tries:questionTries});
  $('#hintArea').textContent=r.correct?'You found it! Ready for the next little adventure?':'We’ll practice that one again later.';$('#hintBtn').disabled=true;$('#checkBtn').disabled=false;$('#checkBtn').textContent='Next discovery →';awaitingNext=true;
}
function nextQuestion(){if(qIndex<current.questions.length-1){qIndex++;hintLevel=0;questionTries=0;awaitingNext=false;renderActivity();speak();}else finishActivity();}
function finishActivity(){
  var result=Prog.completeActivity({activity:current,sessionId:session.session_id,answers:answers});renderStats();var t=Trails.get(current.domain_id),amount=result.rewards_issued[0].amount;$('#celebrateIcon').innerHTML='<img src="'+(window.SAKHI_ICON_DATA||'./icon-192.png')+'" alt="">';$('#celebrateTitle').textContent=current.skill_title+' complete!';$('#celebrateBody').textContent=t.companion+' is cheering for you.';$('#celebrateReward').textContent='✦ '+amount+' trail stars earned';var finalMission=sessionMode==='trail'||missionIndex>=plan.missions.length;$('#continueBtn').textContent=sessionMode==='trail'?'Back to trails →':finalMission?'See my treasures →':'Next little adventure →';$('#celebrate').classList.add('show');
}
function continueAfter(){
  $('#celebrate').classList.remove('show');missionIndex++;
  if(sessionMode==='trail'&&missionIndex>=plan.missions.length){if(session)Prog.endSession(session.session_id,'TRAIL_COMPLETE');session=null;current=null;show('map');toast('Trail practice saved ✨');return;}
  if(missionIndex>plan.missions.length){Prog.endSession(session.session_id);session=null;show('rewards');}else loadMission();
}
function bind(){
  document.querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(){show(b.dataset.nav);};});
  document.addEventListener('click',function(e){var c=e.target&&e.target.closest&&e.target.closest('[data-trail-domain]');if(c){e.preventDefault();startTrail(c.dataset.trailDomain);}});
  document.addEventListener('keydown',function(e){var c=e.target&&e.target.closest&&e.target.closest('[data-trail-domain]');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();startTrail(c.dataset.trailDomain);}});
  $('#startBtn').onclick=start;$('#modeUnicorn').onclick=function(){adventureMode='unicorn';localStorage.setItem('sakhi_adventure_mode',adventureMode);renderHome();};$('#modePrincess').onclick=function(){adventureMode='princess';localStorage.setItem('sakhi_adventure_mode',adventureMode);renderHome();};
  $('#quitBtn').onclick=function(){if(session)Prog.endSession(session.session_id,sessionMode==='trail'?'TRAIL_LEFT_EARLY':'LEFT_EARLY');session=null;current=null;show(sessionMode==='trail'?'map':'home');};
  $('#hearBtn').onclick=async function(){try{var pill=$('#voicePill');if(pill)pill.textContent='✨ Preparing Sakhi voice…';await Audio.unlock();await Audio.narrate(q());if(pill)pill.textContent=voiceLabel();}catch(e){console.warn('[Sakhi repeat]',e);toast('Sakhi voice could not play. A grown-up can check Audio in Parents.');}};
  $('#hintBtn').onclick=hint;$('#checkBtn').onclick=check;$('#continueBtn').onclick=continueAfter;
  $('#gateBtn').onclick=function(){var v=Number($('#gateAnswer').value);if(parentChallenge&&Number.isFinite(v)&&v===parentChallenge.answer){parentOpen=true;parentChallenge=null;renderParent();}else{toast('Try the grown-up question again.');refreshParentChallenge();}};
  $('#gateAnswer').addEventListener('keydown',function(e){if(e.key==='Enter')$('#gateBtn').click();});
  Audio.onFault(function(e){console.warn('[Sakhi audio]',e.kind,e.message);});
}
function bootFailure(e){console.error('[Sakhi boot failed]',e);window.__SAKHI_BOOT_ERROR=String(e&&e.message||e);var box=$('#bootFallback');if(box){box.hidden=false;var detail=box.querySelector('[data-boot-detail]');if(detail)detail.textContent='Build '+(window.SAKHI_BUILD_ID||'unknown')+' · '+window.__SAKHI_BOOT_ERROR;}}
async function boot(){
  try{await Cur.load();Prog.load();Audio.setEnabled(Prog.load().settings.voice!==false);bind();renderHome();renderStats();window.__SAKHI_BOOTED=true;document.documentElement.classList.add('sakhi-ready');if(Audio.warm)Audio.warm();if(Cloud&&Cloud.probe)Cloud.probe().catch(function(e){console.warn('Cloud probe',e.message);});if('serviceWorker'in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('./sw.js?v=3.0.0-rc6',{updateViaCache:'none'}).then(function(r){r.update().catch(function(){});}).catch(function(e){console.warn('SW',e.message);});}}
  catch(e){bootFailure(e);}
}
window.SakhiApp={boot:boot,show:show};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
