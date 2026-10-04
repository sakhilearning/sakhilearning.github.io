window.SakhiLibraryArt=(function(){
'use strict';
/* Reuse the user's generated Picture Sound Cards as instructional art, not as a
   full-page background. Only sound groups whose printed label exactly matches
   the practiced letter are enabled here. The /k/ row is intentionally excluded
   from letter C work because that artwork says /k/, not C. */
var CELL_W=116,CELL_H=81;
var GROUPS={
  m:{src:'assets/theme-media/library/phonics-m-strip.webp',words:['moon','map','mug']},
  s:{src:'assets/theme-media/library/phonics-s-strip.webp',words:['sun','sock','star']},
  p:{src:'assets/theme-media/library/phonics-p-strip.webp',words:['pig','pan','pen']}
};
function decorate(root,q){
  if(!root||!q||!q.sheet||q.sheet.kind!=='letter')return;
  var letter=String(q.sheet.target||'').toLowerCase(),group=GROUPS[letter];if(!group)return;
  var cues=root.querySelectorAll&&root.querySelectorAll('.school-picture-cue');if(!cues||cues.length<3)return;
  for(var i=0;i<3;i++){
    var cell=cues[i],art=cell.querySelector('.school-picture-art'),caption=cell.querySelector('.school-picture-word');if(!art)continue;
    var word=group.words[i];
    art.textContent='';
    art.classList.add('school-picture-library-art');
    art.setAttribute('role','img');
    art.setAttribute('aria-label',word);
    art.style.display='block';
    art.style.width=CELL_W+'px';
    art.style.height=CELL_H+'px';
    art.style.maxWidth='100%';
    art.style.margin='0 auto';
    art.style.borderRadius='16px';
    art.style.backgroundImage='url("'+group.src+'")';
    art.style.backgroundRepeat='no-repeat';
    art.style.backgroundSize=(CELL_W*3)+'px '+CELL_H+'px';
    art.style.backgroundPosition=(-CELL_W*i)+'px 0';
    art.style.boxShadow='0 7px 18px rgba(72,49,126,.12)';
    if(caption)caption.textContent=word;
  }
}
function install(){
  var T=window.SakhiTemplates;if(!T||typeof T.render!=='function'||T.__libraryArtWrapped)return false;
  var original=T.render;
  T.render=function(root,q,ctx){var result=original.call(T,root,q,ctx);try{decorate(root,q);}catch(e){console.warn('[Sakhi library art]',e&&e.message||e);}return result;};
  T.__libraryArtWrapped=true;return true;
}
return{GROUPS:GROUPS,decorate:decorate,install:install};
})();
window.SakhiLibraryArt.install();
