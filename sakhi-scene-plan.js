/* Teaching contract: one scene, one quantity, one number rail. No DOM/audio. */
window.SakhiScenePlan=(function(){
'use strict';
function make(q){
 var m=q&&q.media&&q.media.mathModel,n=Number(q&&q.answer);if(!m||q.template!=='choice'&&q.template!=='school-count-match'&&q.template!=='school-number-compare'||!Number.isFinite(n))return null;
 // Comparison needs the two original quantities, so it keeps its own renderer.
 if(m.type==='compare'||m.type==='array')return null;
 var types={path:'count',jumps:'hop',quantity:'count',bond:'complete',groups:'add',subtract:'takeaway'},type=types[m.type];if(!type)return null;
 var actor=['unicorn','dinosaur','cat','princess','mouse','horse'][Math.abs(String(q.prompt||'').split('').reduce(function(s,c){return s+c.charCodeAt(0);},0))%6],art=m.type==='path'||m.type==='jumps'?'ball':m.art==='domino'?'ball':m.art;
 if(['dinosaur','horse','unicorn','princess','mouse','cat'].indexOf(art)>=0)art='ball';
 var initial=type==='add'?m.values[0]:type==='takeaway'?m.whole:type==='complete'?m.known:0,total=type==='add'?m.values.reduce(function(a,b){return a+b;},0):type==='takeaway'?m.whole:type==='complete'?m.whole:n;
 var start=n<=10?1:Math.floor((n-1)/10)*10+1,numbers=Array.from({length:10},function(_,i){return start+i;});if(n===0)numbers=[0,1,2,3,4,5,6,7,8,9];
 return Object.freeze({type:type,target:n,total:total,initial:initial,taken:m.taken||0,art:art,actor:actor,trail:m.type==='path'?m.values.slice():null,jumps:m.steps||0,direction:m.direction||1,start:m.start||0,numbers:numbers,compact:total>20,label:type==='takeaway'?'Watch what is taken away.':type==='add'?'Watch the group grow.':type==='complete'?'Help make the whole group.':type==='hop'?'Watch the number hops.':(art==='ball'?'Count the balls, then tap a number.':'Count the objects, then tap a number.'),action:type==='takeaway'?'Take away '+m.taken:type==='complete'?'Add the missing ones':art==='ball'?'Kick the balls':'Bring the objects'});
}
function narration(q){return make(q)?Object.assign({},q,{teaching:null}):q;}
return{make:make,narration:narration};
})();
