window.SakhiPresentation=(function(){
'use strict';
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
function artTheme(domain){return{reading:'unicorn_meadow',math:'royal_castle',writing:'butterfly_cottage',language:'royal_castle',science:'mermaid_lagoon',logic:'butterfly_cottage',wellbeing:'unicorn_meadow',creative:'ice_palace'}[domain]||'unicorn_meadow';}
function scene(domain,progress){var t=SakhiTrails.get(domain),p=t.palette,ch=SakhiTrails.chapter(domain,progress),art=window.SakhiArt?SakhiArt.scene(artTheme(domain),{label:t.name}):'';var charms=(t.objects||[]).slice(0,3).map(function(o){return'<span>'+esc(o)+'</span>';}).join('');return '<div class="scene-card illustrated-scene" style="--a:'+p[0]+';--b:'+p[1]+';--c:'+p[2]+'"><div class="scene-art">'+art+'</div><div class="scene-copy"><small>'+esc(ch)+'</small><b>'+esc(t.name)+'</b><span>'+esc(t.companion)+'</span><div class="scene-charms">'+charms+'</div></div></div>';}
function objectSet(domain,count){var t=SakhiTrails.get(domain),names=t.objects||['sparkles'],glyph={reading:'✦',math:'◆',writing:'✧',language:'❦',science:'◌',logic:'✤',wellbeing:'♡',creative:'✶'}[domain]||'★';return Array.from({length:count},function(_,i){return '<button class="learn-object charm-object '+esc(domain)+'-object" type="button" aria-label="'+esc(names[i%names.length])+' '+(i+1)+'"><span>'+glyph+'</span></button>';}).join('');}
function celebration(domain){var t=SakhiTrails.get(domain);return {title:'Wonderful work!',body:t.companion+' helped you light up '+t.name+'.',icon:window.SakhiArt?SakhiArt.portrait(artTheme(domain),t.companion):t.icon};}
return{scene:scene,objectSet:objectSet,celebration:celebration};
})();
