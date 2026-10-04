window.SakhiLibraryArt=(function(){
'use strict';
/* Reuse the user's generated Picture Sound Cards as instructional art, not as a
   full-page background. Only sound groups whose printed label exactly matches
   the practiced letter are enabled here. The /k/ row is intentionally excluded
   from letter C work because that artwork says /k/, not C. */
var SPRITE='assets/theme-media/library/phonics-sound-cards.webp';
var SCALE=.34;
var CELL_W=116,CELL_H=84;
var GROUPS={
  m:[['moon',22,276],['map',375,276],['mug',724,276]],
  s:[['sun',22,531],['sock',375,531],['star',724,531]],
  p:[['pig',22,1038],['pan',375,1038],['pen',724,1038]]
};
function decorate(root,q){
  if(!root||!q||!q.sheet||q.sheet.kind!=='letter')return;
  var letter=String(q.sheet.target||'').toLowerCase(),cards=GROUPS[letter];if(!cards)return;
  var cues=root.querySelectorAll&&root.querySelectorAll('.school-picture-cue');if(!cues||cues.length<3)return;
  for(var i=0;i<3;i++){
    var cell=cues[i],art=cell.querySelector('.school-picture-art'),caption=cell.querySelector('.school-picture-word');if(!art)continue;
    var card=cards[i];
    art.textContent='';
    art.classList.add('school-picture-library-art');
    art.setAttribute('role','img');
    art.setAttribute('aria-label',card[0]);
    art.style.display='block';
    art.style.width=CELL_W+'px';
    art.style.height=CELL_H+'px';
    art.style.maxWidth='100%';
    art.style.margin='0 auto';
    art.style.borderRadius='18px';
    art.style.backgroundImage='url("'+SPRITE+'")';
    art.style.backgroundRepeat='no-repeat';
    art.style.backgroundSize=(1103*SCALE)+'px '+(1426*SCALE)+'px';
    art.style.backgroundPosition=(-card[1]*SCALE)+'px '+(-card[2]*SCALE)+'px';
    art.style.boxShadow='0 7px 18px rgba(72,49,126,.12)';
    if(caption)caption.textContent=card[0];
  }
}
function install(){
  var T=window.SakhiTemplates;if(!T||typeof T.render!=='function'||T.__libraryArtWrapped)return false;
  var original=T.render;
  T.render=function(root,q,ctx){var result=original.call(T,root,q,ctx);try{decorate(root,q);}catch(e){console.warn('[Sakhi library art]',e&&e.message||e);}return result;};
  T.__libraryArtWrapped=true;return true;
}
return{SPRITE:SPRITE,GROUPS:GROUPS,decorate:decorate,install:install};
})();
window.SakhiLibraryArt.install();
