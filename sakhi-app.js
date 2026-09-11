(function(){
'use strict';
var Cur=SakhiCurriculum,Prog=SakhiProgress,Plan=SakhiPlan,Trails=SakhiTrails,Pres=SakhiPresentation,Act=SakhiActivities,Audio=SakhiAudio,Tpl=SakhiTemplates,Cloud=SakhiCloud;
var $=function(s){return document.querySelector(s);};
var view='home',plan=null,session=null,missionIndex=0,current=null,qIndex=0,answers=[],controller=null,hintLevel=0,parentOpen=false,questionTries=0;
function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(function(){t.classList.remove('show');},2600);}
function setWorld(domain){if(domain)document.body.dataset.domain=domain;else delete document.body.dataset.domain;}
function show(v){Audio.stopAll();view=v;document.body.dataset.view=v;if(v!=='activity')setWorld(null);document.querySelectorAll('.view').forEach(function(n){n.classList.toggle('active',n.dataset.view===v);});document.querySelectorAll('[data-nav]').forEach(function(b){b.classList.toggle('active',b.dataset.nav===v);});render();window.scrollTo(0,0);}
function render(){renderStats();if(view==='home')renderHome();else if(view==='map')renderMap();else if(view==='rewards')renderRewards();else if(view==='parent')renderParent();else if(view==='activity')renderActivity();}
function renderStats(){var n=$('#starStat');if(n)n.textContent='⭐ '+Prog.stars();}
function trailCard(d){var p=Prog.domainProgress(d.domain_id),t=Trails.get(d.domain_id);return '<article class="trail-card"><div class="mini-scene">'+Pres.scene(d.domain_id,p)+'</div><div class="trail-card-copy"><h3>'+t.icon+' '+t.name+'</h3><p class="muted">'+d.title+' · '+Trails.chapter(d.domain_id,p)+'</p><div class="meter" aria-label="'+p+' percent explored"><i style="width:'+p+'%"></i></div><small>'+p+'% explored</small></div></article>';}
function renderHome(){
  setWorld(null);plan=Plan.build();
  $('#homeHero').innerHTML=Pres.scene('reading',Prog.domainProgress('reading'));
  $('#todayTitle').textContent='Day '+plan.program_day+' · '+plan.missions.length+' magical missions';
  var names=plan.missions.map(function(m){var s=Cur.skill(m.pick.skill_id);return s?s.title:m.pick.skill_id;});
  $('#todaySummary').textContent=names.join(' • ')+' • one hands-on mission';
  var grid=$('#trailPreview');grid.innerHTML=Cur.domains().slice(0,4).map(trailCard).join('');
}
function renderMap(){var g=$('#mapGrid');g.innerHTML=Cur.domains().map(function(d){return trailCard(d);}).join('');}
function renderRewards(){var s=Prog.load();$('#rewardTotal').textContent=Prog.stars();var box=$('#rewardRecent'),recent=s.rewards.slice(-10).reverse();box.innerHTML=recent.length?recent.map(function(r){var sk=Cur.skill(r.skill_id);return '<div class="reward-row"><span>⭐ +'+r.amount+' '+r.label+'</span><span class="muted">'+(sk?sk.title:'practice')+'</span></div>';}).join(''):'<p class="center muted">Complete an adventure to collect your first Trail Stars.</p>';}
function parentMetric(label,value,sub){return '<article class="parent-card"><small>'+label+'</small><h2>'+value+'</h2><p class="muted">'+sub+'</p></article>';}
async function renderParent(){
  if(!parentOpen){$('#parentGate').hidden=false;$('#parentBody').hidden=true;return;}
  $('#parentGate').hidden=true;var s=Prog.load(),body=$('#parentBody');body.hidden=false;
  var completed=s.sessions.filter(function(x){return x.status==='COMPLETED';}).length,objective=s.attempts.filter(function(a){return a.objective;}),ind=objective.reduce(function(n,a){return n+a.independent_questions;},0),tot=objective.reduce(function(n,a){return n+a.total_questions;},0),hints=objective.reduce(function(n,a){return n+a.hints;},0),cloud=Cloud.state(),audio=await Audio.phonemeReport();
  body.innerHTML='<div class="parent-grid">'+parentMetric('Program day',Math.min(130,completed+1)+' / 130','Six-month learning path')+parentMetric('Independent answers',tot?Math.round(ind/tot*100)+'%':'—','Objective questions only')+parentMetric('Hints used',hints,'Support is information, not failure')+parentMetric('Cloud',cloud.status,cloud.pending+' queued · '+cloud.dead+' needs review')+'</div>'+
  '<section class="parent-card parent-section"><h2>Family progress sync</h2>'+(cloud.configured?(cloud.status==='CONNECTED'?'<p>Connected to Supabase. Completed objective attempts can sync across devices.</p><button class="soft" id="cloudSignOut">Disconnect</button>':'<p class="muted">Sign in with the parent account used for Sakhi sync.</p><div class="parent-form"><input class="parent-input" id="cloudEmail" type="email" placeholder="Parent email"><input class="parent-input" id="cloudPassword" type="password" placeholder="Password"><button class="soft" id="cloudSignIn">Connect</button></div>'):'<p class="muted">Supabase public URL/key are not configured in this build. Progress stays on this device.</p>')+'</section>'+
  '<section class="parent-card parent-section"><h2>Subject progress</h2>'+Cur.domains().map(function(d){var p=Prog.domainProgress(d.domain_id);return '<div class="parent-progress"><p><b>'+d.title+'</b> — '+Trails.chapter(d.domain_id,p)+' <span class="muted">('+p+'%)</span></p><div class="meter"><i style="width:'+p+'%"></i></div></div>';}).join('')+'</section>'+
  '<section class="parent-card parent-section"><h2>Audio readiness</h2><p class="audio-badge '+(audio.complete?'good':'warn')+'">Verified isolated phonemes: '+audio.present+' / '+audio.required+'</p><p class="muted">Narration uses the Supabase ElevenLabs route when configured, with the device voice as a normal-instruction fallback. Isolated phonemes never fall back to TTS.</p><div class="audio-tools"><button class="soft" id="testVoiceBtn">🔊 Test Sakhi voice</button><span class="muted" id="audioStatusText"></span></div></section>'+ 
  '<section class="parent-card parent-section"><h2>Settings</h2><label class="parent-setting"><input type="checkbox" id="voiceToggle" '+(Audio.isEnabled()?'checked':'')+'> Spoken instructions</label><label class="parent-setting">Session length <select id="sessionMinutes"><option value="20">20 min</option><option value="25">25 min</option><option value="30">30 min</option></select></label><button class="soft" id="exportBtn">Export progress backup</button></section>';
  var sm=$('#sessionMinutes');sm.value=String(s.settings.session_minutes||30);sm.onchange=function(){Prog.setSetting('session_minutes',Number(sm.value));toast('Session length saved');};
  $('#voiceToggle').onchange=function(e){Audio.setEnabled(e.target.checked);Prog.setSetting('voice',e.target.checked);};
  if($('#testVoiceBtn'))$('#testVoiceBtn').onclick=async function(){var out=$('#audioStatusText');try{await Audio.unlock();await Audio.speak('Hello! Sakhi voice is ready for our learning adventure.');var st=Audio.status();out.textContent='Playing with '+(st.provider==='elevenlabs'?'ElevenLabs':'this device')+' voice.';}catch(e){out.textContent='Voice could not play: '+(e.message||e);}};
  if($('#cloudSignIn'))$('#cloudSignIn').onclick=async function(){try{await Cloud.signIn($('#cloudEmail').value,$('#cloudPassword').value);toast('Family progress connected');renderParent();}catch(e){console.error(e);toast('Could not sign in. Check the parent account.');}};
  if($('#cloudSignOut'))$('#cloudSignOut').onclick=async function(){await Cloud.signOut();toast('Family progress disconnected');renderParent();};
  $('#exportBtn').onclick=function(){var blob=new Blob([JSON.stringify(Prog.snapshot(),null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='sakhi-progress-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);};
}
async function start(){
  $('#startBtn').disabled=true;
  try{await Audio.unlock();plan=Plan.build();session=Prog.startSession(plan);missionIndex=0;await loadMission();}
  catch(e){console.error('[Sakhi start]',e);toast('Sakhi could not start that mission. Please refresh once.');}
  finally{$('#startBtn').disabled=false;}
}
async function loadMission(){
  if(missionIndex>=plan.missions.length)return offscreenMission();
  var m=plan.missions[missionIndex];current=Act.generate(m.pick.skill_id,m.pick.band,session.session_id+':'+missionIndex);current._mission=m;qIndex=0;answers=[];hintLevel=0;questionTries=0;show('activity');speak();
}
function offscreenMission(){
  current={skill_id:'creative.imaginative_play',skill_title:'Hands-on mission',domain_id:plan.offscreen.domain,band:1,band_name:'PRACTICE',evidence_mode:'practice',questions:[{template:'practice',prompt:plan.offscreen.prompt,narration:plan.offscreen.prompt,answer:'done',evidence_mode:'practice',hints:['A grown-up can join you.']}]};
  current._mission={domain:plan.offscreen.domain,minutes:plan.offscreen.minutes,pick:{skill_id:current.skill_id,reason:'off-screen practice'}};qIndex=0;answers=[];hintLevel=0;questionTries=0;show('activity');speak();
}
function q(){return current.questions[qIndex];}
function speak(){var pill=$('#voicePill');if(pill)pill.textContent='🔊 Starting voice…';Audio.narrate(q()).then(function(){if(pill){var st=Audio.status();pill.textContent=st.provider==='elevenlabs'?'✨ Sakhi voice':'🔊 Device voice';}}).catch(function(e){if(e.kind!=='DISABLED'){console.warn('[Sakhi voice]',e);if(pill)pill.textContent='🔇 Tap Hear again';toast('Tap Hear again if you want Sakhi to read it aloud.');}});}
function renderActivity(){
  if(!current)return;var d=current.domain_id,p=Prog.domainProgress(d),t=Trails.get(d),cue=Pres.storyCue(d,current.skill_title,qIndex);setWorld(d);
  $('#activityTrail').textContent=t.icon+' '+t.name+' · '+Trails.chapter(d,p);$('#activitySkill').textContent=current.skill_title;$('#activityProgress').textContent=(missionIndex+1)+' / '+(plan.missions.length+1)+' missions';$('#activityScene').innerHTML=Pres.scene(d,p);$('#missionEyebrow').textContent=cue.eyebrow;$('#missionStory').textContent=cue.text;$('#missionStep').textContent=cue.step;$('#questLabel').textContent=current.evidence_mode==='practice'?'Hands-on practice':'Learning quest';$('#questionPrompt').textContent=q().prompt;$('#hintArea').textContent=hintLevel?(q().hints||[]).slice(0,hintLevel).map(function(h){return'💡 '+h;}).join('  '):'';
  controller=Tpl.render($('#interaction'),q(),{domain:d,onProgress:function(){if(controller)$('#checkBtn').disabled=!controller.isReady();}});$('#checkBtn').disabled=!controller.isReady();$('#hintBtn').disabled=!(q().hints||[]).length;
}
function hint(){var h=q().hints||[];if(hintLevel<h.length){hintLevel++;$('#hintArea').textContent=h.slice(0,hintLevel).map(function(x){return'💡 '+x;}).join('  ');Audio.speak(h[hintLevel-1]).catch(function(){});}if(hintLevel>=h.length)$('#hintBtn').disabled=true;}
function check(){
  if(!controller)return;var r=controller.check();if(!r)return;questionTries++;
  if(!r.correct&&current.evidence_mode!=='practice'&&questionTries<2){toast('Good try — here is a clue.');if(hintLevel<(q().hints||[]).length)hint();setTimeout(function(){controller.reset();$('#checkBtn').disabled=true;},500);return;}
  answers.push({correct:r.correct,hintsUsed:hintLevel,response:r.response,tries:questionTries});
  if(r.correct)toast(questionTries===1&&hintLevel===0?'You got it! ✨':'Nice thinking — you found it! ✨');else toast('We will practice that one again later. 💜');
  setTimeout(nextQuestion,500);
}
function nextQuestion(){if(qIndex<current.questions.length-1){qIndex++;hintLevel=0;questionTries=0;renderActivity();speak();}else finishActivity();}
function finishActivity(){
  var result=Prog.completeActivity({activity:current,sessionId:session.session_id,answers:answers});renderStats();var c=Pres.celebration(current.domain_id);$('#celebrateIcon').textContent=c.icon;$('#celebrateTitle').textContent=current.skill_title+' complete!';$('#celebrateBody').textContent=c.body+' You earned '+result.rewards_issued[0].amount+' Trail Stars.';var finalMission=missionIndex>=plan.missions.length;$('#continueBtn').textContent=finalMission?'See my treasures ⭐':'Continue the trail →';$('#celebrate').classList.add('show');
}
function continueAfter(){$('#celebrate').classList.remove('show');missionIndex++;if(missionIndex>plan.missions.length){Prog.endSession(session.session_id);session=null;show('rewards');}else loadMission();}
function bind(){
  document.querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(){show(b.dataset.nav);};});$('#startBtn').onclick=start;$('#quitBtn').onclick=function(){if(session)Prog.endSession(session.session_id,'LEFT_EARLY');session=null;show('home');};$('#hearBtn').onclick=async function(){try{await Audio.unlock();await Audio.narrate(q());var st=Audio.status();var pill=$('#voicePill');if(pill)pill.textContent=st.provider==='elevenlabs'?'✨ Sakhi voice':'🔊 Device voice';}catch(e){console.warn('[Sakhi repeat]',e);toast('Voice could not play. A grown-up can check Audio in Parents.');}};$('#hintBtn').onclick=hint;$('#checkBtn').onclick=check;$('#continueBtn').onclick=continueAfter;$('#gateBtn').onclick=function(){if($('#gateAnswer').value.trim()==='11'){parentOpen=true;renderParent();}else toast('Try the grown-up question again.');};Audio.onFault(function(e){console.warn('[Sakhi audio]',e.kind,e.message);});
}
function bootFailure(e){
  console.error('[Sakhi boot failed]',e);window.__SAKHI_BOOT_ERROR=String(e&&e.message||e);var box=$('#bootFallback');if(box){box.hidden=false;var detail=box.querySelector('[data-boot-detail]');if(detail)detail.textContent='Build '+(window.SAKHI_BUILD_ID||'unknown')+' · '+window.__SAKHI_BOOT_ERROR;}
}
async function boot(){
  try{await Cur.load();Prog.load();Audio.setEnabled(Prog.load().settings.voice!==false);bind();renderHome();renderStats();window.__SAKHI_BOOTED=true;document.documentElement.classList.add('sakhi-ready');if(Cloud&&Cloud.probe)Cloud.probe().catch(function(e){console.warn('Cloud probe',e.message);});if('serviceWorker'in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('./sw.js?v=3.0.0-rc3',{updateViaCache:'none'}).then(function(r){r.update().catch(function(){});}).catch(function(e){console.warn('SW',e.message);});}}
  catch(e){bootFailure(e);}
}
window.SakhiApp={boot:boot,show:show};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
