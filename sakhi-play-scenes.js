/* Owns the interactive scene state, animation and response controls. Curriculum
 * and progress remain data services; the legacy worksheet cannot decorate this. */
window.SakhiScenePlayer=(function(){
'use strict';
var active=null;
function el(tag,cls,text){var n=document.createElement(tag);n.className=cls||'';if(text!==undefined)n.textContent=text;return n;}
function art(kind){return SakhiPresentation.mathObject(kind,0);}
function stop(){if(active){active.cancel();active=null;}if(window.SakhiAudio&&SakhiAudio.stopSceneSound)SakhiAudio.stopSceneSound();}
function render(root,q,ctx){var plan=SakhiScenePlan.make(q);if(!plan)return null;stop();while(root.firstChild)root.removeChild(root.firstChild);
 var selected=null,phase='READY',timers=[],disposed=false,visible=0,removed=0,buttons=[],scene=el('section','play-scene'),pitch=el('div','play-pitch'),actor=el('div','play-actor'),field=el('div','play-object-field'),caption=el('p','play-instruction',plan.label),action=el('button','play-action',plan.action),rail=el('div','play-number-rail'),result=el('div','play-result');
 scene.dataset.state=phase;scene.setAttribute('aria-label','Interactive counting scene');actor.innerHTML='<span class="play-character-body">'+art(plan.actor)+'</span><span class="play-foot" aria-hidden="true"><svg viewBox="0 0 70 45"><path d="M8 5h22v20l27 4q11 2 8 12H17Q4 35 8 5" fill="#9470bd" stroke="#5f467a" stroke-width="3"/><path d="M16 41h47" stroke="#ffe29a" stroke-width="5"/></svg></span>';actor.setAttribute('aria-label','Your '+plan.actor+' friend');actor.setAttribute('role','img');action.type='button';result.setAttribute('aria-live','polite');field.setAttribute('role','group');field.setAttribute('aria-label','One group to count');
 if(plan.trail){var trail=el('div','play-number-clue');trail.setAttribute('aria-label','Number pattern');plan.trail.forEach(function(n){trail.appendChild(el('span',n===null?'is-gap':'',n===null?'?':n));});scene.appendChild(trail);}
 scene.appendChild(caption);pitch.appendChild(actor);pitch.appendChild(field);scene.appendChild(pitch);scene.appendChild(action);scene.appendChild(result);var helper=el('p','play-rail-help','Tap your answer');scene.appendChild(helper);rail.setAttribute('role','group');rail.setAttribute('aria-label','Choose a number');scene.appendChild(rail);root.appendChild(scene);
 function later(fn,ms){var id=setTimeout(function(){if(!disposed)fn();},ms);timers.push(id);}
 function sound(kind){if(window.SakhiAudio&&SakhiAudio.sceneEffect)SakhiAudio.sceneEffect(kind);}
 function character(){var settings=window.SakhiProgress?SakhiProgress.load().settings:{};if(window.SakhiAudio&&SakhiAudio.configureSceneSound)SakhiAudio.configureSceneSound({character:settings.character_voice||'AUTO',actor:plan.actor,music:settings.scene_music!==false,volume:Number(settings.scene_volume === undefined ? 0.2 : settings.scene_volume)});}
 function setPhase(p){phase=p;scene.dataset.state=p;}
 function addObject(index){var token=el('button','play-object');token.type='button';token.innerHTML=art(plan.art);token.dataset.objectIndex=String(index);token.setAttribute('aria-label',plan.art+' '+(index+1));token.setAttribute('aria-pressed','false');token.onclick=function(){if(phase==='ANIMATING')return;if(token.dataset.counted)return;token.dataset.counted='true';token.classList.add('touched');token.setAttribute('aria-pressed','true');sound('tap');};field.appendChild(token);visible++;}
 function drawInitial(){field.textContent='';visible=0;removed=0;if(plan.compact){field.appendChild(el('div','play-place-model',Math.floor(plan.total/10)+' tens + '+plan.total%10+' ones'));return;}for(var i=0;i<plan.initial;i++)addObject(i);}
 function ready(){setPhase('AWAITING_ANSWER');actor.classList.remove('is-kicking');action.disabled=false;action.textContent='Watch again';caption.textContent=plan.type==='takeaway'?'How many are left?':plan.type==='complete'?'How many did we add?':'How many can you count?';}
 function step(index,count,fn){if(index>=count){ready();return;}actor.classList.remove('is-kicking');later(function(){actor.classList.add('is-kicking');sound('kick');fn(index);later(function(){step(index+1,count,fn);},450);},70);}
 function play(){if(phase==='ANIMATING')return;character();if(window.SakhiAudio&&SakhiAudio.startSceneMusic)SakhiAudio.startSceneMusic();setPhase('ANIMATING');selected=null;buttons.forEach(function(b){b.classList.remove('selected');b.setAttribute('aria-pressed','false');});result.textContent='';action.disabled=true;drawInitial();
 if(plan.compact){caption.textContent='Use the tens and ones.';ready();return;}
 if(plan.type==='takeaway'){caption.textContent='Watch '+plan.taken+' go away.';step(0,plan.taken,function(i){var token=field.children[plan.total-1-i];if(token){token.classList.add('taken-away');token.disabled=true;removed++;}});}
 else if(plan.type==='hop'){field.textContent='';var stone=el('div','play-hop-number',plan.start);field.appendChild(stone);step(0,plan.jumps,function(i){stone.textContent=String(plan.start+(i+1)*plan.direction);});}
 else{var count=plan.type==='add'||plan.type==='complete'?plan.total-plan.initial:plan.total;caption.textContent='Count along with your friend.';step(0,count,function(i){addObject(plan.initial+i);});}
 if(ctx&&ctx.onProgress)ctx.onProgress();}
 action.onclick=play;
 plan.numbers.forEach(function(n){var b=el('button','play-number',n);b.type='button';b.setAttribute('aria-label','Answer '+n);b.setAttribute('aria-pressed','false');b.onclick=function(){if(phase==='ANIMATING')return;selected=n;buttons.forEach(function(x){x.classList.remove('selected');x.setAttribute('aria-pressed','false');});b.classList.add('selected');b.setAttribute('aria-pressed','true');sound('tap');if(ctx&&ctx.onProgress)ctx.onProgress();};buttons.push(b);rail.appendChild(b);});
 character();drawInitial();
 // One final group is available immediately; animation is optional replay, so
 // children who prefer no motion can still use the same assessment controls.
 if(!plan.compact&&plan.type!=='hop'){for(var i=plan.initial;i<plan.total;i++)addObject(i);if(plan.type==='takeaway')for(var i=0;i<plan.taken;i++)field.children[plan.total-1-i].classList.add('taken-away');}
 setPhase('AWAITING_ANSWER');
 active={cancel:function(){disposed=true;timers.forEach(clearTimeout);}};
 return{immediate:false,isReady:function(){return selected!==null&&phase!=='ANIMATING';},check:function(){var correct=Number(selected)===plan.target;result.textContent=correct?String(plan.target)+' — you did it!':'Try counting once more.';sound(correct?'success':'try');return{correct:correct,response:selected};},reset:function(){selected=null;result.textContent='';buttons.forEach(function(b){b.classList.remove('selected');b.setAttribute('aria-pressed','false');});if(ctx&&ctx.onProgress)ctx.onProgress();},dispose:stop};
}
function poster(root,q){var plan=SakhiScenePlan.make(q);if(!plan)return false;var row=el('div','play-print-model');if(plan.compact){row.textContent=Math.floor(plan.total/10)+' tens + '+plan.total%10+' ones';root.appendChild(row);return true;}var count=Math.min(20,plan.total);for(var i=0;i<count;i++){var token=el('span','play-object');token.innerHTML=art(plan.art);row.appendChild(token);}root.appendChild(row);return true;}
return{render:render,poster:poster,stop:stop};
})();
