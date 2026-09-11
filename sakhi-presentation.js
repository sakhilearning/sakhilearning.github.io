window.SakhiPresentation=(function(){
'use strict';
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
function scene(domain,progress){var t=SakhiTrails.get(domain),p=t.palette,ch=SakhiTrails.chapter(domain,progress);return '<div class="scene-card" style="--a:'+p[0]+';--b:'+p[1]+';--c:'+p[2]+'"><div class="sky-sparkles">✦ ✧ ✦ ✧ ✦</div><div class="scene-castle">'+t.icon+'</div><div class="scene-companion">🦄</div><div class="scene-copy"><small>'+esc(ch)+'</small><b>'+esc(t.name)+'</b><span>'+esc(t.companion)+'</span></div></div>';}
function objectSet(domain,count){var t=SakhiTrails.get(domain),glyph={reading:'📚',math:'💎',writing:'🏮',language:'🌹',science:'🐚',logic:'🦋',wellbeing:'🌷',creative:'✨'}[domain]||'⭐';return Array.from({length:count},function(_,i){return '<button class="learn-object" type="button" aria-label="object '+(i+1)+'">'+glyph+'</button>';}).join('');}
function celebration(domain){var t=SakhiTrails.get(domain);return {title:'Wonderful work!',body:t.companion+' helped you light up '+t.name+'.',icon:t.icon};}
return{scene:scene,objectSet:objectSet,celebration:celebration};
})();
