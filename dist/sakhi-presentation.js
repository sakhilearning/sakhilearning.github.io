window.SakhiPresentation=(function(){
'use strict';
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];});}
function media(domain){return{
 reading:{src:'./assets/theme-media/public/meadow-bart-cc0.jpg',tone:'meadow',alt:'Soft watercolor meadow background'},
 writing:{src:'./assets/theme-media/public/meadow-bart-cc0.jpg',tone:'meadow',alt:'Soft watercolor meadow background'},
 logic:{src:'./assets/theme-media/public/meadow-bart-cc0.jpg',tone:'garden',alt:'Soft watercolor meadow background'},
 wellbeing:{src:'./assets/theme-media/public/meadow-bart-cc0.jpg',tone:'garden',alt:'Soft watercolor meadow background'},
 creative:{src:'./assets/theme-media/public/meadow-bart-cc0.jpg',tone:'starlight',alt:'Soft watercolor meadow background'},
 science:{src:'./assets/theme-media/public/underwater-scribe-cc0.png',tone:'lagoon',alt:'Underwater lagoon background'},
 math:{src:'./assets/theme-media/public/neuschwanstein-wikimedia.jpg',tone:'palace',alt:'Fairytale castle background'},
 language:{src:'./assets/theme-media/public/neuschwanstein-wikimedia.jpg',tone:'palace',alt:'Fairytale castle background'}
}[domain]||{src:'./assets/theme-media/public/meadow-bart-cc0.jpg',tone:'meadow',alt:'Soft watercolor meadow background'};}
function scene(domain,progress){var t=SakhiTrails.get(domain),p=t.palette,ch=SakhiTrails.chapter(domain,progress),m=media(domain);var charms=(t.objects||[]).slice(0,3).map(function(o){return'<span>'+esc(o)+'</span>';}).join('');return '<div class="scene-card media-scene tone-'+esc(m.tone)+'" style="--a:'+p[0]+';--b:'+p[1]+';--c:'+p[2]+'"><img class="scene-image" src="'+esc(m.src)+'" alt="'+esc(m.alt)+'" loading="lazy"><div class="scene-glow"></div><div class="scene-copy"><small>'+esc(ch)+'</small><b>'+esc(t.name)+'</b><span>'+esc(t.companion)+'</span><div class="scene-charms">'+charms+'</div></div></div>';}
function objectSet(domain,count){var t=SakhiTrails.get(domain),names=t.objects||['sparkles'],glyph={reading:'✦',math:'◆',writing:'✧',language:'❦',science:'◌',logic:'✤',wellbeing:'♡',creative:'✶'}[domain]||'★';return Array.from({length:count},function(_,i){return '<button class="learn-object charm-object '+esc(domain)+'-object" type="button" aria-label="'+esc(names[i%names.length])+' '+(i+1)+'"><span>'+glyph+'</span></button>';}).join('');}
function celebration(domain){var t=SakhiTrails.get(domain),m=media(domain);return {title:'Wonderful work!',body:t.companion+' helped you light up '+t.name+'.',icon:'<img class="reward-portrait" src="'+esc(m.src)+'" alt="'+esc(m.alt)+'">'};}
return{scene:scene,objectSet:objectSet,celebration:celebration};
})();
