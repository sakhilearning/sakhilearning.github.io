/* Sakhi Learning Trails V3 application shell.
 *
 * Child flow: Home -> a fixed subject trail -> interactive activity -> short
 * celebration -> next planned trail -> off-screen mission -> treasures.
 *
 * Curriculum/adaptation remain upstream. This file only wires views and hands an
 * already selected skill to the presentation layer for its fixed domain trail.
 */
(function(){
  'use strict';

  var Cur=window.SakhiCurriculum,Themes=window.SakhiThemes,Act=window.SakhiActivities,
      Plan=window.SakhiPlan,Trails=window.SakhiTrails,Present=window.SakhiPresentation,
      Prog=window.SakhiProgress,Adapt=window.SakhiAdaptive,Audio=window.SakhiAudio,
      Art=window.SakhiArt,Tpl=window.SakhiTemplates,Cloud=window.SakhiCloud;
  var $=function(s){return document.querySelector(s);};
  var el=function(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n;};
  var clear=function(n){while(n&&n.firstChild)n.removeChild(n.firstChild);};

  var view='home',session=null,sessionMode=null,planDay=null,sessionSteps=[],stepIndex=0;
  var current=null,currentTrail=null,controller=null,hintLevel=0,tries=0,qIndex=0,answers=[];
  var usedSkills=[],lastResult=null,lastByDomain={},questionStartedAt=0,faultsShown={};
  var PARENT_TTL=15*60*1000;

  function parentUnlocked(){return Number(sessionStorage.getItem('sakhi.parent.until')||0)>Date.now();}
  function unlockParent(){
    var a=17+Math.floor(Math.random()*23),b=14+Math.floor(Math.random()*26);
    var answer=window.prompt('Grown-up check: what is '+a+' + '+b+'?');
    if(answer===null)return false;
    if(Number(answer)!==a+b){toast('That grown-up check did not match.');return false;}
    sessionStorage.setItem('sakhi.parent.until',String(Date.now()+PARENT_TTL));return true;
  }
  function toast(msg){var t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('is-visible');clearTimeout(t._timer);t._timer=setTimeout(function(){t.classList.remove('is-visible');},2400);}
  function pct(n,d){return d?Math.round(n/d*100):0;}
  function sameDomainUsed(domain){return usedSkills.filter(function(id){var sk=Cur.skill(id);return sk&&sk.domain_id===domain;});}
  function applyAccessibility(){var p=Prog.load().profile;document.body.classList.toggle('reduce-motion',!!p.reduced_motion);Audio.setEnabled(p.voice_enabled!==false);}

  function show(v){
    Audio.stopAll();
    if(v==='parent'&&!parentUnlocked()&&!unlockParent())return;
    view=v;
    document.querySelectorAll('[data-nav]').forEach(function(b){b.classList.toggle('is-active',b.dataset.nav===v||(v==='activity'&&b.dataset.nav==='home'));});
    document.querySelectorAll('.view').forEach(function(n){n.classList.toggle('is-active',n.dataset.view===v);});
    render();window.scrollTo({top:0,behavior:Prog.load().profile.reduced_motion?'auto':'smooth'});
  }

  function render(){applyAccessibility();renderStats();({home:renderHome,activity:renderActivity,trails:renderTrails,rewards:renderRewards,parent:renderParent}[view]||renderHome)();}
  function renderStats(){var pr=Plan.progress(Prog.load());$('#statWeek').textContent='Week '+pr.week;$('#statDays').textContent=pr.completed+' / '+pr.total;}

  /* ------------------------------- home ---------------------------------- */
  function renderHome(){
    var s=Prog.load(),placement=Adapt.placementActive(),day=Plan.dayForState(s),pr=Plan.progress(s),heroTrail=Trails.forDomain('reading');
    Themes.apply(heroTrail.theme_id);
    $('#homeScene').innerHTML=Art.scene(heroTrail.theme_id,{eager:true,label:'Sakhi learning trails'});
    $('#homePlanMeter').style.width=pr.pct+'%';
    $('#homeProgress').textContent=pr.completed+' of '+pr.total+' practice days complete · Week '+pr.week;
    if(placement){
      $('#homeEyebrow').textContent='ONE-TIME STARTING CHECK';$('#homeTitle').textContent='Let’s find your best starting place';
      $('#homeWelcome').textContent='Four tiny quests help Sakhi skip things you already know. No grades — just a smarter beginning.';
      $('#startAdventure').textContent='✨ Find my starting place';renderPlacementStops();renderOffscreenPreview(null);return;
    }
    $('#homeEyebrow').textContent='WEEK '+day.week+' · DAY '+day.day_of_week;$('#homeTitle').textContent=day.week_title;
    $('#homeWelcome').textContent=day.weekly_goal;$('#startAdventure').textContent='▶ Start Today’s Adventure';
    renderTodayStops(day);renderOffscreenPreview(day);
  }
  function renderPlacementStops(){
    var wrap=$('#todayStops');clear(wrap);['reading','math','logic','language'].forEach(function(d){var t=Trails.forDomain(d);wrap.appendChild(stopCard(t,'Quick starting check',null));});
  }
  function stopCard(t,skillTitle,minutes){
    var c=el('article','stop-card');c.style.setProperty('--stop-image','url("'+Art.src(t.theme_id)+'")');c.appendChild(el('span','stop-icon',t.icon));c.appendChild(el('b',null,t.short));c.appendChild(el('small',null,skillTitle));if(minutes)c.appendChild(el('span','stop-time',minutes+' min'));return c;
  }
  function renderTodayStops(day){var wrap=$('#todayStops');clear(wrap);day.app_blocks.forEach(function(b){var sk=Cur.skill(b.skill_id),t=Trails.forSkill(b.skill_id);wrap.appendChild(stopCard(t,sk?sk.title:b.slot,b.minutes));});}
  function renderOffscreenPreview(day){
    var box=$('#homeOffscreen');clear(box);if(!day){box.appendChild(el('h3',null,'Today is just the starting check'));box.appendChild(el('p','muted','Your six-month trail begins right after Sakhi finds the best starting point.'));return;}
    box.appendChild(el('span','eyebrow','REAL-WORLD QUEST · 6 MIN'));box.appendChild(el('h3',null,'Finish away from the screen'));
    var row=el('div','mission-inline');row.appendChild(el('span',null,'🤸 Move'));row.appendChild(el('span',null,'✏️ Pencil'));row.appendChild(el('span',null,'💬 Family talk'));box.appendChild(row);
  }

  /* ------------------------------ session -------------------------------- */
  async function startAdventure(){
    await Audio.unlock();usedSkills=[];lastResult=null;lastByDomain={};stepIndex=0;answers=[];
    if(Adapt.placementActive()){
      sessionMode='placement';planDay=null;sessionSteps=[];session=Prog.startSession('learning_trails',{planned_blocks:['placement']});
    }else{
      sessionMode='plan';planDay=Plan.dayForState(Prog.load());sessionSteps=Plan.stepsForDay(planDay,Prog.load().profile.typical_session_length||30);session=Prog.startSession('learning_trails',{plan_day_id:planDay.day_id,week:planDay.week,planned_blocks:sessionSteps.map(function(x){return x.block;})});
    }
    await nextActivity();
  }
  function strong(res){return !!(res&&res.accuracy===1&&res.correct>0&&res.independent===res.correct);}
  function pickForPlanStep(step){
    var target=Cur.skill(step.block.skill_id),domain=target?target.domain_id:step.block.skill_id.split('.')[0],prev=lastByDomain[domain];
    if(step.repeat&&prev&&!strong(prev))return{skill_id:prev.skill_id,band:Prog.bandFor(prev.skill_id),reason:'second practice round in '+domain};
    return Adapt.nextForTarget(step.block.skill_id,{usedSkillIds:sameDomainUsed(domain),lastResult:prev})||{skill_id:step.block.skill_id,band:Prog.bandFor(step.block.skill_id),reason:'today’s '+domain+' trail practice'};
  }
  async function nextActivity(){
    var pick;
    if(sessionMode==='placement'){
      pick=Adapt.nextProbe();if(!pick)return finishSession(false,'Starting point found. Your learning trails are ready!');
    }else{
      if(stepIndex>=sessionSteps.length)return showOffscreen();pick=pickForPlanStep(sessionSteps[stepIndex]);
    }
    currentTrail=Trails.forSkill(pick.skill_id);Themes.apply(currentTrail.theme_id);Art.prefetch(currentTrail.theme_id);
    var seed=session.session_id+':'+sessionMode+':'+stepIndex+':'+usedSkills.length;
    var raw=Act.generate(pick.skill_id,pick.band,seed);current=Present.decorateActivity(raw,currentTrail);current._pick=pick;current._trail=currentTrail;
    qIndex=0;answers=[];hintLevel=0;tries=0;show('activity');
    await Audio.preloadActivity(current).catch(function(){});speakQuestion();
  }
  function question(){return current&&current.questions[qIndex];}
  function speakQuestion(){if(!question())return;Audio.speakQuestion(question()).catch(showAudioFault);}
  function renderActivity(){
    if(!current)return show('home');var t=currentTrail,q=question(),theme=Themes.get(t.theme_id);Themes.apply(t.theme_id);
    $('.view-activity').style.setProperty('--activity-scene','url("'+Art.src(t.theme_id)+'")');
    $('#activityWorld').textContent=t.name;$('#activitySkill').textContent=current.skill_title;$('#activityLandmark').textContent='At '+Trails.landmarkForSkill(current.skill_id);
    var total=sessionMode==='placement'?Adapt.PROBE_LIMIT:sessionSteps.length,pos=sessionMode==='placement'?(Prog.load().placement&&Prog.load().placement.probes?Prog.load().placement.probes.length+1:1):stepIndex+1;
    $('#activityProgress').textContent=(sessionMode==='placement'?'Check ':'Quest ')+Math.min(pos,total)+' of '+total;$('#questMeter').style.width=Math.min(100,Math.round((pos-1)/total*100))+'%';
    $('#activityStory').textContent=Present.storyPrompt(t,current.skill_title,stepIndex);$('#activityGuide').innerHTML=Art.portrait(t.theme_id,t.companion);$('#companionName').textContent=t.companion;$('#companionLine').textContent=theme.narration.encourage;
    hintLevel=current.support.hintUpFront?1:0;tries=0;questionStartedAt=Date.now();renderHint();
    controller=Tpl.render($('#interaction'),q,{onHear:function(){Audio.speakQuestion(q).catch(showAudioFault);},onImmediate:function(res){grade(res.correct,res.response);},onProgress:function(){$('#checkBtn').disabled=!controller.isReady();}});
    $('#checkBtn').hidden=!!controller.immediate;$('#checkBtn').disabled=!controller.isReady();$('#resetBtn').hidden=!!controller.immediate;
  }
  function renderHint(){var box=$('#hintBox');clear(box);var hints=question().hints||[];for(var i=0;i<hintLevel&&i<hints.length;i++)box.appendChild(el('div','hint','💡 '+hints[i]));$('#hintBtn').disabled=hintLevel>=hints.length;}
  function useHint(){var hints=question().hints||[];if(hintLevel>=hints.length)return;hintLevel++;renderHint();Audio.speakStructured(hints[hintLevel-1]).catch(showAudioFault);}
  function grade(correct,response){
    tries++;
    if(!correct&&tries<2){if(hintLevel<(question().hints||[]).length){hintLevel++;renderHint();}Audio.speak(Themes.get(currentTrail.theme_id).narration.encourage).catch(function(){});setTimeout(function(){controller.reset();$('#checkBtn').disabled=true;},700);return;}
    answers.push({questionIndex:qIndex,correct:correct,hintsUsed:hintLevel,responseMs:Date.now()-questionStartedAt,response:response,tries:tries});
    Audio.speak(correct?Themes.get(currentTrail.theme_id).narration.celebrate:'Good try. We will remember this one for later.').catch(function(){});
    setTimeout(function(){if(qIndex<current.questions.length-1){qIndex++;renderActivity();speakQuestion();}else finishActivity();},850);
  }
  function finishActivity(){
    var status=Prog.completeActivity({activity:current,sessionId:session.session_id,themeId:currentTrail.theme_id,answers:answers,placementProbe:!!current._pick.placement_probe});
    lastResult=status;lastByDomain[current.domain_id]=status;usedSkills.push(current.skill_id);renderStats();
    var theme=Themes.get(currentTrail.theme_id),stage=Trails.stageForSkill(current.skill_id),milestone=theme.milestones[Math.min(theme.milestones.length-1,stage%theme.milestones.length)];
    $('#doneIcon').textContent=currentTrail.props.success||'✨';$('#doneTrail').textContent=currentTrail.name;$('#doneTitle').textContent=current.skill_title+' complete!';$('#doneBody').textContent=milestone+'. '+(strong(status)?'You solved that independently!':'Your trail remembers what to practice next.');
    clear($('#doneRewards'));status.rewards_issued.forEach(function(r){$('#doneRewards').appendChild(el('span','reward-chip','+'+r.amount+' '+r.label));});
    var isLast=sessionMode==='placement'?!!status.placement&&status.placement.complete:stepIndex>=sessionSteps.length-1;
    if(sessionMode==='placement'){$('#doneNext').textContent=isLast?'Sakhi found your starting point.':'Another tiny starting check is waiting.';$('#doneContinue').textContent=isLast?'See my trails ✨':'Next check →';}
    else{$('#doneNext').textContent=isLast?'One real-world mission finishes today’s adventure.':'Next stop: '+nextStepLabel();$('#doneContinue').textContent=isLast?'Real-world quest →':'Next trail →';}
    $('#doneContinue').onclick=function(){$('#doneOverlay').classList.remove('is-visible');if(sessionMode==='placement'&&isLast){finishSession(false,'Starting point found.');return;}stepIndex++;nextActivity();};
    $('#doneOverlay').classList.add('is-visible');
  }
  function nextStepLabel(){var n=sessionSteps[stepIndex+1];if(!n)return'Real-world quest';var t=Trails.forSkill(n.block.skill_id);return t.icon+' '+t.short;}
  function showOffscreen(){
    if(!planDay)return finishSession(false);var box=$('#offscreenMissions');clear(box),off=planDay.offscreen_block,profile=Prog.load().profile;
    if(profile.movement_breaks!==false)box.appendChild(mission('🤸','Move',off.movement));box.appendChild(mission('✏️','Pencil',off.handwriting));box.appendChild(mission('💬','Family talk',off.family_talk));
    $('#offscreenDone').onclick=function(){$('#offscreenOverlay').classList.remove('is-visible');finishSession(true,'Completed all app quests and the real-world mission.');};
    $('#offscreenLater').onclick=function(){$('#offscreenOverlay').classList.remove('is-visible');finishSession(false,'App quests complete; real-world mission left for later.');};
    $('#offscreenOverlay').classList.add('is-visible');
  }
  function mission(icon,title,text){var c=el('div','mission-card'),i=el('div','mission-icon',icon),b=el('div');b.appendChild(el('b',null,title));b.appendChild(el('span',null,text));c.appendChild(i);c.appendChild(b);return c;}
  function finishSession(completeDay,note){if(session)Prog.endSession(session.session_id,note||null,{completePlanDay:!!completeDay,abandoned:false});session=null;current=null;sessionMode=null;planDay=null;sessionSteps=[];stepIndex=0;show('rewards');}
  function quitActivity(){if(!session){show('home');return;}if(window.confirm('Finish for now? Today’s plan will stay here so you can continue next time.')){Prog.endSession(session.session_id,'Left before the daily plan was complete.',{abandoned:true});session=null;current=null;show('home');}}

  /* ------------------------------ trails --------------------------------- */
  function renderTrails(){
    var grid=$('#trailGrid');clear(grid);Trails.all().forEach(function(t){
      var p=Trails.progress(t.domain,Prog.masteryOf),front=Cur.frontier(t.domain,Prog.masteryOf)[0],stage=front?Trails.stageForSkill(front.skill_id):4;
      var card=el('article','trail-card');card.dataset.domain=t.domain;var visual=el('div','trail-visual');visual.innerHTML=Art.scene(t.theme_id,{label:t.name});var content=el('div','trail-content');content.appendChild(el('span','eyebrow',t.icon+' '+t.short));content.appendChild(el('h2',null,t.name));content.appendChild(el('p',null,t.promise));
      var meter=el('div','trail-progress'),fill=el('span');fill.style.width=p.pct+'%';meter.appendChild(fill);content.appendChild(meter);content.appendChild(el('div','trail-next',p.done+' of '+p.total+' skills strong'+(front?' · Next: '+front.title:' · Current path complete')));
      var lm=el('div','landmark-row');t.landmarks.forEach(function(name,i){lm.appendChild(el('span','landmark-dot '+(i<stage?'is-done':i===stage?'is-current':'')));});lm.appendChild(el('span','trail-landmark-name',t.landmarks[stage]));content.appendChild(lm);card.appendChild(visual);card.appendChild(content);card.onclick=function(){openTrail(t);};grid.appendChild(card);
    });
  }
  function openTrail(t){var body=$('#modalBody');clear(body);body.appendChild(el('span','eyebrow',t.icon+' '+t.name));body.appendChild(el('h2',null,'Your '+t.short+' path'));body.appendChild(el('p','muted',t.promise));Cur.skillsIn(t.domain).forEach(function(sk){var e=Prog.load().skills[sk.skill_id],m=e?e.mastery_state:'NOT_INTRODUCED',row=el('div','modal-row');row.appendChild(el('span','modal-k',m==='MASTERED'||m==='MOSTLY_MASTERED'?'✓ Strong':m==='NOT_INTRODUCED'?'○ Ahead':'◐ Growing'));row.appendChild(el('span','modal-v',sk.title));body.appendChild(row);});$('#modal').classList.add('is-visible');}

  /* ----------------------------- treasures ------------------------------- */
  function renderRewards(){
    var s=Prog.load(),b=Prog.balances();$('#rewardArt').innerHTML=Art.rewardScene();var grid=$('#rewardGrid');clear(grid);var keys=Object.keys(b);
    if(!keys.length){grid.appendChild(el('div','reward-card','Start an adventure to find your first treasure.'));}
    keys.forEach(function(k){var row=s.rewards.slice().reverse().find(function(r){return r.reward_key===k;})||{},card=el('div','reward-card');card.appendChild(el('div','reward-icon',rewardIcon(k)));card.appendChild(el('b',null,String(b[k])));card.appendChild(el('small',null,row.reward_label||humanize(k)));grid.appendChild(card);});
    var completed=s.sessions.filter(function(x){return x.status==='COMPLETED';}).length;$('#rewardStory').textContent=completed?completed+' adventures finished. Every treasure is tied to real practice.':'Your treasures will appear after your first adventure.';
    var list=$('#recentVictories');clear(list);s.rewards.slice(-10).reverse().forEach(function(r){var sk=Cur.skill(r.skill_id),row=el('div','victory-row');row.appendChild(el('span',null,rewardIcon(r.reward_key)+' '+(sk?sk.title:r.reason)));row.appendChild(el('span',null,'+'+r.amount+' '+r.reward_label));list.appendChild(row);});if(!s.rewards.length)list.appendChild(el('p','muted','No victories yet — your first trail is waiting.'));
  }
  function rewardIcon(k){if(/snow/.test(k))return'❄️';if(/pearl|shell/.test(k))return'🐚';if(/butterfly|candle/.test(k))return'🦋';if(/heart|story/.test(k))return'📚';if(/royal/.test(k))return'👑';if(/gem/.test(k))return'💎';return'⭐';}
  function humanize(k){return String(k).replace(/_/g,' ').replace(/\b\w/g,function(x){return x.toUpperCase();});}

  /* ------------------------------- parent -------------------------------- */
  function renderParent(){renderParentKpis();renderParentDomains();renderParentPlan();renderParentCloud();renderParentSettings();renderParentAudio();renderParentHistory();}
  function renderParentKpis(){var w=Prog.weeklySummary(7),wrap=$('#parentKpis');clear(wrap);var rows=[['Practice days',w.practice_days,'unique days with completed practice'],['Learning time',w.minutes+' min','recorded app sessions'],['Correct',pct(w.correct,w.attempts)+'%','of objective attempts'],['Independent',pct(w.independent,w.attempts)+'%','correct without hints']];rows.forEach(function(r){var c=el('div','kpi');c.appendChild(el('small',null,r[0]));c.appendChild(el('b',null,String(r[1])));c.appendChild(el('small',null,r[2]));wrap.appendChild(c);});$('#pWeekSummary').textContent=w.hinted+' correct answers used support. Independence and correctness are shown separately.';}
  function renderParentDomains(){var w=Prog.weeklySummary(7),wrap=$('#pDomains');clear(wrap);var h=el('div','domain-row header');['Trail','Attempts','Correct','Independent','Next ready skill'].forEach(function(x){h.appendChild(el('span',null,x));});wrap.appendChild(h);Trails.all().forEach(function(t){var d=w.domains[t.domain]||{attempts:0,correct:0,independent:0},front=Cur.frontier(t.domain,Prog.masteryOf)[0],row=el('div','domain-row');row.appendChild(el('span','domain-name',t.icon+' '+t.short));row.appendChild(el('span','metric-muted',String(d.attempts)));row.appendChild(el('span','metric-good',d.attempts?pct(d.correct,d.attempts)+'%':'—'));row.appendChild(el('span','metric-good',d.attempts?pct(d.independent,d.attempts)+'%':'—'));row.appendChild(el('span','domain-next',front?front.title:'Current trail complete'));wrap.appendChild(row);});}
  function renderParentPlan(){var pr=Plan.progress(Prog.load()),day=Plan.dayForState(Prog.load()),box=$('#pPlan');clear(box);var big=el('div','plan-big'),ring=el('div','plan-ring');ring.style.setProperty('--pct',pr.pct);ring.appendChild(el('b',null,pr.pct+'%'));var copy=el('div','plan-copy');copy.appendChild(el('b',null,pr.completed+' / '+pr.total+' planned days'));copy.appendChild(el('small',null,'Currently Week '+pr.week+(day?' · next '+day.day_id:'')));big.appendChild(ring);big.appendChild(copy);box.appendChild(big);if(day){box.appendChild(el('p','muted',day.weekly_goal));}}
  function renderParentCloud(){
    var box=$('#pCloud');clear(box);if(!Cloud){box.appendChild(el('p','muted','Cloud transport is not available.'));return;}var cs=Cloud.state(),status=el('div','cloud-status'+(cs.status==='CONNECTED'?' is-good':''));status.appendChild(el('b',null,cs.status==='CONNECTED'?'Connected to family progress':'Not connected'));status.appendChild(el('span',null,cloudCopy(cs)));box.appendChild(status);
    if(!cs.signedIn){var form=el('div','cloud-form'),email=field('Email','email','email'),pw=field('Password','password','password');form.appendChild(email.wrap);form.appendChild(pw.wrap);var br=el('div','button-row'),signin=el('button','btn-magic','Sign in'),signup=el('button','btn-soft','Create account');signin.onclick=function(){cloudAuth('signin',email.input.value,pw.input.value);};signup.onclick=function(){cloudAuth('signup',email.input.value,pw.input.value);};br.appendChild(signin);br.appendChild(signup);form.appendChild(br);box.appendChild(form);return;}
    var info=el('p','muted','Signed in as '+(cs.email||'parent')+'. '+cs.pending+' queued change(s); '+cs.failed+' need attention.');box.appendChild(info);var row=el('div','button-row'),sync=el('button','btn-magic','Sync now'),out=el('button','btn-soft','Sign out');sync.onclick=async function(){sync.disabled=true;try{await Prog.syncCloud();toast('Family progress sync finished.');}catch(e){toast('Sync needs attention: '+e.message);}sync.disabled=false;renderParentCloud();};out.onclick=async function(){await Cloud.signOut();renderParentCloud();};row.appendChild(sync);row.appendChild(out);box.appendChild(row);
    var profile=Prog.load().profile,report=el('div','cloud-form');report.appendChild(el('h3',null,'Sunday progress email'));var re=field('Send to','email','email');re.input.value=profile.weekly_report_email||cs.email||'';report.appendChild(re.wrap);var sw=switchControl('Send my weekly Sakhi summary','Uses only this learner’s parent dashboard evidence.',!!profile.weekly_report_enabled);report.appendChild(sw.wrap);var save=el('button','btn-soft','Save email preference');save.onclick=function(){Prog.updateProfile({weekly_report_email:re.input.value.trim()||null,weekly_report_enabled:sw.input.checked});toast('Weekly report preference saved.');};report.appendChild(save);box.appendChild(report);
    if(cs.failed){var dead=el('div','cloud-status');dead.appendChild(el('b',null,cs.failed+' cloud write(s) need attention'));dead.appendChild(el('span',null,'Nothing was silently discarded. Retry after the V3 Supabase migration is applied.'));box.appendChild(dead);}
  }
  function cloudCopy(cs){if(cs.status==='CONNECTED')return'Authenticated learner data request succeeded.';if(cs.status==='OFFLINE')return'Offline. Work remains queued on this device.';if(cs.status==='NOT_CONFIGURED')return'No Supabase client configuration is present.';return cs.signedIn?'Signed in, but learner-data connectivity has not been confirmed.':'Sign in to sync across devices and enable weekly reports.';}
  async function cloudAuth(kind,email,password){if(!email||!password){toast('Enter the parent email and password.');return;}try{var res=kind==='signup'?await Cloud.signUp(email,password):await Cloud.signIn(email,password);if(res&&res.needsConfirmation){toast('Check your email to confirm the account.');return;}await Prog.syncCloud();toast('Family progress is connected.');renderParent();}catch(e){toast('Could not connect: '+e.message);}}
  function field(label,type,autocomplete){var wrap=el('label','field');wrap.appendChild(el('span',null,label));var input=document.createElement('input');input.type=type;input.autocomplete=autocomplete;wrap.appendChild(input);return{wrap:wrap,input:input};}
  function switchControl(title,note,checked){var wrap=el('label','switch-row'),copy=el('span','setting-copy'),input=document.createElement('input');input.type='checkbox';input.checked=checked;copy.appendChild(el('b',null,title));copy.appendChild(el('small',null,note));wrap.appendChild(copy);wrap.appendChild(input);return{wrap:wrap,input:input};}
  function renderParentSettings(){var box=$('#pSettings');clear(box),p=Prog.load().profile;var voice=switchControl('Sakhi voice','ElevenLabs narration when available; browser voice is narration fallback only.',p.voice_enabled!==false);voice.input.onchange=function(){Prog.updateProfile({voice_enabled:voice.input.checked});Audio.setEnabled(voice.input.checked);};box.appendChild(voice.wrap);var move=switchControl('Movement mission','Include the short off-screen movement activity.',p.movement_breaks!==false);move.input.onchange=function(){Prog.updateProfile({movement_breaks:move.input.checked});};box.appendChild(move.wrap);var reduced=switchControl('Reduced motion','Keep the magic, reduce decorative movement.',!!p.reduced_motion);reduced.input.onchange=function(){Prog.updateProfile({reduced_motion:reduced.input.checked});applyAccessibility();};box.appendChild(reduced.wrap);var f=el('label','field');f.appendChild(el('span',null,'Target session length'));var sel=document.createElement('select');[25,30,35].forEach(function(n){var o=document.createElement('option');o.value=n;o.textContent=n+' minutes';o.selected=Number(p.typical_session_length||30)===n;sel.appendChild(o);});sel.onchange=function(){Prog.updateProfile({typical_session_length:Number(sel.value)});toast('Session target updated.');};f.appendChild(sel);box.appendChild(f);var exp=el('button','btn-soft','Export progress backup');exp.onclick=exportProgress;box.appendChild(exp);}
  function renderParentAudio(){var box=$('#pAudio');clear(box),r=Audio.phonemeReport(),s=Audio.status();var rows=[['Narration',s.configured?'ElevenLabs gateway configured':'Gateway not configured'],['Local isolated sounds',r.localVerified+' of '+r.required],['Remote phoneme gateway',r.remoteGateway?'Available':'Not configured'],['Cached narration',s.cachedLines+' lines this visit']];rows.forEach(function(x){var c=el('div','audio-chip');c.appendChild(el('b',null,x[0]+': '));c.appendChild(document.createTextNode(x[1]));box.appendChild(c);});box.appendChild(el('p','muted',r.note));if(r.missing.length)box.appendChild(el('small','muted','Local recordings still needed/validated: '+r.missing.join(', ')));}
  function renderParentHistory(){var hist=$('#pHistory');clear(hist);var recent=Prog.load().attempts.slice(-20).reverse();if(!recent.length){hist.appendChild(el('li',null,'No practice recorded yet.'));return;}recent.forEach(function(a){var li=el('li'),sk=Cur.skill(a.skill_id);li.appendChild(el('b',null,sk?sk.title:a.skill_id));li.appendChild(el('small',null,new Date(a.timestamp).toLocaleString()+' · '+(a.result==='CORRECT'?'correct':'retry needed')+' · '+(a.independent_success?'independent':a.hint_level_used?'support used':'not independent')));hist.appendChild(li);});}
  function exportProgress(){var blob=new Blob([JSON.stringify(Prog.snapshot(),null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='sakhi-progress-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(u);}

  /* ------------------------- faults / lifecycle --------------------------- */
  function showAudioFault(fault){var d=Audio.describe(fault);if(!d)return;if(faultsShown[fault.kind]&&fault.kind!=='MISSING_ASSET')return;faultsShown[fault.kind]=true;var box=$('#audioFault');clear(box);box.appendChild(el('b',null,d.title));box.appendChild(el('span',null,d.body));box.classList.add('is-visible');clearTimeout(box._timer);box._timer=setTimeout(function(){box.classList.remove('is-visible');},6500);}
  function registerServiceWorker(){if(!('serviceWorker'in navigator))return;navigator.serviceWorker.register('./sw.js').then(function(reg){function offer(){var b=$('#updateBanner');b.classList.add('is-visible');$('#updateNow').onclick=function(){if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});location.reload();};$('#updateLater').onclick=function(){b.classList.remove('is-visible');};}if(reg.waiting)offer();reg.addEventListener('updatefound',function(){var w=reg.installing;if(!w)return;w.addEventListener('statechange',function(){if(w.state==='installed'&&navigator.serviceWorker.controller)offer();});});setInterval(function(){reg.update().catch(function(){});},30*60*1000);}).catch(function(e){console.warn('[Sakhi] service worker:',e.message);});}

  async function boot(){
    try{await Cur.load();await Plan.load();Prog.load();applyAccessibility();}
    catch(e){document.body.innerHTML='<main class="app"><section class="parent-block"><h1>Sakhi could not start</h1><p>'+String(e.message)+'</p></section></main>';return;}
    document.querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(){show(b.dataset.nav);};});
    $('#startAdventure').onclick=startAdventure;$('#activityQuit').onclick=quitActivity;$('#checkBtn').onclick=function(){var r=controller.check();if(r)grade(r.correct,r.response);};$('#resetBtn').onclick=function(){controller.reset();$('#checkBtn').disabled=true;};$('#hintBtn').onclick=useHint;$('#hearAgain').onclick=function(){Audio.repeat().catch(showAudioFault);};$('#modalClose').onclick=function(){$('#modal').classList.remove('is-visible');};$('#modal').onclick=function(e){if(e.target===$('#modal'))$('#modal').classList.remove('is-visible');};
    Audio.onFault(showAudioFault);document.addEventListener('visibilitychange',function(){if(document.hidden)Audio.stopAll();});registerServiceWorker();
    if(Cloud){Cloud.onChange(function(){if(view==='parent')renderParentCloud();});await Cloud.probe().catch(function(){});if(Cloud.state().signedIn)Prog.syncCloud().then(function(){render();}).catch(function(e){console.warn('[Sakhi] cloud restore deferred:',e.message);});}
    show('home');
  }

  window.SakhiApp={boot:boot,show:show,state:function(){return Prog.snapshot();}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
