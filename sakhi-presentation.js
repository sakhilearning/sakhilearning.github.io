window.SakhiPresentation=(function(){
'use strict';
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
var WORLD={
  reading:{landmark:'📚',spark:'✦ ✧ ✦',object:'⭐'},
  math:{landmark:'🏰',spark:'◆ ✦ ◆',object:'💎'},
  writing:{landmark:'🏮',spark:'✧ ✦ ✧',object:'🏮'},
  language:{landmark:'📖',spark:'❀ ✦ ❀',object:'🌹'},
  science:{landmark:'🐚',spark:'○ ✦ ○',object:'🐚'},
  logic:{landmark:'🦋',spark:'✦ ❀ ✦',object:'🦋'},
  wellbeing:{landmark:'🌷',spark:'♡ ✦ ♡',object:'🌷'},
  creative:{landmark:'✨',spark:'✦ ★ ✦',object:'✨'}
};
function scene(domain,progress){
  var t=SakhiTrails.get(domain),p=t.palette,ch=SakhiTrails.chapter(domain,progress),w=WORLD[domain]||WORLD.reading,icon=window.SAKHI_ICON_DATA||'./icon-192.png';
  return '<div class="scene-card scene-'+esc(domain)+'" style="--a:'+p[0]+';--b:'+p[1]+';--c:'+p[2]+'">'+
    '<div class="scene-cloud cloud-a"></div><div class="scene-cloud cloud-b"></div>'+
    '<div class="sky-sparkles">'+esc(w.spark)+'</div>'+
    '<div class="scene-landmark" aria-hidden="true">'+w.landmark+'</div>'+
    '<div class="scene-path" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'+
    '<div class="scene-companion"><span class="companion-glow"></span><img src="'+icon+'" alt="'+esc(t.companion)+'"></div>'+
    '<div class="scene-copy"><small>NOW EXPLORING</small><b>'+esc(t.name)+'</b><span>'+esc(ch)+' · '+Math.max(0,Math.min(100,progress||0))+'% explored</span></div>'+
  '</div>';
}
function objectSet(domain,count){
  var w=WORLD[domain]||WORLD.reading,glyph=w.object;
  return Array.from({length:count},function(_,i){return '<button class="learn-object" type="button" aria-label="learning object '+(i+1)+'"><span>'+glyph+'</span></button>';}).join('');
}
function celebration(domain){var t=SakhiTrails.get(domain);return{title:'Wonderful work!',body:t.companion+' helped you move farther through '+t.name+'.',icon:t.icon};}
return{scene:scene,objectSet:objectSet,celebration:celebration};
})();
