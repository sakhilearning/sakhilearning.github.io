window.SakhiActivities=(function(){
'use strict';
var C=window.SakhiContent;
var BANDS={1:{name:'INTRO',choices:2,model:true},2:{name:'SUPPORTED',choices:3,model:false},3:{name:'INDEPENDENT',choices:3,model:false},4:{name:'MIXED',choices:4,model:false},5:{name:'CHALLENGE',choices:4,model:false}};
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){var a=hash(seed);return function(){a+=0x6D2B79F5;var t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function pick(r,a){return a[Math.floor(r()*a.length)];}
function shuffle(r,a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function opts(r,a,pool,n){var out=[a];shuffle(r,pool.filter(function(x){return String(x)!==String(a);})).forEach(function(x){if(out.length<n&&out.indexOf(x)<0)out.push(x);});return shuffle(r,out);}
function choice(prompt,a,options,narration,media){return{template:'choice',prompt:prompt,answer:a,choices:options,narration:narration||prompt,media:media||null,hints:['Look carefully.','Try saying or counting it slowly.','You can do this one step at a time.']};}
function practice(prompt,narration,kind){return{template:kind||'practice',prompt:prompt,answer:'done',narration:narration||prompt,evidence_mode:'practice',hints:['Take your time.','Try your best, then tap Done.']};}
function qFor(skill,band,r){var k=skill.kind,d=skill.domain_id,B=BANDS[band]||BANDS[3],n=B.choices;
 if(k==='print')return choice('Where do we start reading this sentence?','left',['left','right'],'Point to the side where reading begins.');
 if(k==='letter_name'){var l=pick(r,C.LETTERS);return choice('Tap the letter '+l.toUpperCase()+'.',l.toUpperCase(),opts(r,l.toUpperCase(),C.UPPER,n),'Find uppercase '+l.toUpperCase()+'.');}
 if(k==='rhyme'){var sets=[['cat','hat','sun'],['pig','wig','map'],['log','frog','bed'],['cake','lake','fish']];var s=pick(r,sets);return choice('Which word rhymes with “'+s[0]+'”?',s[1],opts(r,s[1],[s[1],s[2],'top','run'],n));}
 if(k==='syllable'){var data=[['sun',1],['rainbow',2],['butterfly',3],['unicorn',3],['banana',3]];var x=pick(r,data);return choice('How many beats are in “'+x[0]+'”?',x[1],opts(r,x[1],[1,2,3,4],n),'Clap the word '+x[0]+'. How many parts?');}
 if(k==='initial_sound'||k==='letter_sound'){var data=[['moon','m'],['sun','s'],['fish','f'],['dog','d'],['cat','c'],['rabbit','r']];var x=pick(r,data);return choice('Which letter starts “'+x[0]+'”?',x[1],opts(r,x[1],C.LETTERS,n),'Listen for the first sound in '+x[0]+'.');}
 if(k==='final_sound'){var data=[['sun','n'],['map','p'],['cat','t'],['dog','g'],['fish','sh']];var x=pick(r,data);return choice('What sound do you hear at the end of “'+x[0]+'”?',x[1],opts(r,x[1],['n','p','t','g','sh','m'],n));}
 if(k==='oral_blend'){var w=pick(r,C.CVC);return choice('Blend the sounds: '+w.split('').map(function(c){return '/'+c+'/';}).join(' '),w,opts(r,w,C.CVC,n),'Blend the sounds and choose the word.');}
 if(k==='oral_segment'){var w=pick(r,C.CVC);return choice('How many sounds are in “'+w+'”?',3,opts(r,3,[2,3,4,5],n),'Say '+w+' slowly and count the sounds.');}
 if(k==='short_vowel'){var data=[['cat','a'],['bed','e'],['pig','i'],['dog','o'],['sun','u']];var x=pick(r,data);return choice('Which vowel do you hear in “'+x[0]+'”?',x[1],opts(r,x[1],['a','e','i','o','u'],n));}
 if(k==='cvc_read'||k==='cvc_spell'||k==='dictation'){var w=pick(r,C.CVC); if(k==='cvc_spell'||k==='dictation')return{template:'build',prompt:'Build the word you hear.',narration:'Build the word '+w+'.',tokens:shuffle(r,w.split('').concat(['m','s'])),answer:w.split(''),hints:['Listen for the first sound.','Then the middle vowel.','Finish with the last sound.']}; return choice('Which word says “'+w+'”?',w,opts(r,w,C.CVC,n));}
 if(k==='digraph'){var dg=pick(r,Object.keys(C.DIGRAPHS)),w=pick(r,C.DIGRAPHS[dg]);return choice('Which two letters make the special sound in “'+w+'”?',dg,opts(r,dg,Object.keys(C.DIGRAPHS),n));}
 if(k==='blend'){var bl=pick(r,Object.keys(C.BLENDS)),w=pick(r,C.BLENDS[bl]);return choice('Which blend starts “'+w+'”?',bl,opts(r,bl,Object.keys(C.BLENDS),n));}
 if(k==='sight_word'){var w=pick(r,C.SIGHT);return choice('Find the word “'+w+'”.',w,opts(r,w,C.SIGHT,n));}
 if(k==='sentence_read'||k==='fluency'){var s=pick(r,C.SENTENCES),words=s.replace('.','').split(' '),a=pick(r,words);return choice(s+'  Tap “'+a+'”.',a,opts(r,a,words,n),s+' Find the word '+a+'.');}
 if(k==='story'||k==='listen'||k==='wh_question'||k==='story_order'||k==='retell'||k==='predict'||k==='cause'||k==='infer'||k==='main_idea'){var st=pick(r,C.STORIES);return choice(st.q,st.a,opts(r,st.a,st.options,n),st.text+' '+st.q,{passage:st.text});}
 if(k==='advanced_phonics'){var p=pick(r,[['cap','cape'],['kit','kite'],['hop','hope'],['cub','cube']]);return choice('Add silent e to “'+p[0]+'”. What word do you get?',p[1],opts(r,p[1],[p[1],p[0],'cake','home'],n));}
 if(k==='count_sequence'){var start=1+Math.floor(r()*20),a=start+1;return choice('What number comes after '+start+'?',a,opts(r,a,[a-1,a,a+1,a+2],n));}
 if(k==='numeral'){var a=Math.floor(r()*21);return choice('Tap the number '+a+'.',a,opts(r,a,[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],n));}
 if(k==='trace_number')return practice('Trace the glowing number with your finger.','Trace slowly from the start dot.','trace');
 if(k==='count'||k==='subitize'){var max=k==='subitize'?5:Math.min(20,6+band*3),a=1+Math.floor(r()*max);return choice('How many treasures do you see?',a,opts(r,a,[Math.max(1,a-1),a,a+1,a+2],n),'Count the treasures.',{count:a,semantic:'countable.primary'});}
 if(k==='compare'){var a=1+Math.floor(r()*10),b=1+Math.floor(r()*10);if(a===b)b++;var ans=a>b?a:b;return choice('Which number is greater: '+a+' or '+b+'?',ans,opts(r,ans,[a,b,Math.min(a,b),ans+1],n));}
 if(k==='compose'){var total=band>2?10:5,a=1+Math.floor(r()*(total-1)),ans=total-a;return choice(a+' and ? make '+total,ans,opts(r,ans,[ans-1,ans,ans+1,total],n));}
 if(k==='add'){var cap=band>2?10:5,a=1+Math.floor(r()*cap),b=1+Math.floor(r()*(cap-a+1)),ans=a+b;return choice(a+' + '+b+' = ?',ans,opts(r,ans,[ans-1,ans,ans+1,a],n),'Put the groups together and count.',{groups:[a,b]});}
 if(k==='sub'){var a=2+Math.floor(r()*9),b=1+Math.floor(r()*(a-1)),ans=a-b;return choice(a+' − '+b+' = ?',ans,opts(r,ans,[Math.max(0,ans-1),ans,ans+1,a],n),'Take away '+b+' and count what remains.',{subtract:[a,b]});}
 if(k==='bond'){var a=1+Math.floor(r()*9),ans=10-a;return choice(a+' and ? make 10',ans,opts(r,ans,[ans-1,ans,ans+1,10],n));}
 if(k==='teen'){var ones=1+Math.floor(r()*9),ans=10+ones;return choice('1 ten and '+ones+' ones makes…',ans,opts(r,ans,[ones,ans,ans-1,20],n));}
 if(k==='pattern')return choice('What comes next? 🌸 🦋 🌸 🦋', '🌸',opts(r,'🌸',['🌸','🦋','⭐','🌈'],n));
 if(k==='measure')return choice('Which is longer?','ribbon',opts(r,'ribbon',['ribbon','button','coin','bead'],n),'Compare the objects from end to end.');
 if(k==='shape'){var sh=pick(r,C.SHAPES);return choice('Which one is a '+sh.name+'?',sh.name,opts(r,sh.name,C.SHAPES.map(function(x){return x.name;}),n),'Find the '+sh.name+'.',{shape:sh});}
 if(k==='data')return choice('Three butterflies are pink and two are blue. Which color has more?','pink',opts(r,'pink',['pink','blue','same'],n));
 if(k==='trace_stroke'||k==='trace_letter')return practice('Trace the glowing path, then try it once by yourself.','Start at the dot and follow the path.','trace');
 if(k==='label')return{template:'build',prompt:'Build the label “cat”.',narration:'Build the word cat.',tokens:shuffle(r,['c','a','t','m','s']),answer:['c','a','t'],hints:['First sound /c/.','Middle vowel /a/.','Last sound /t/.']};
 if(k==='punctuation')return choice('Which sentence is ready for school?','I see a cat.',opts(r,'I see a cat.',['I see a cat.','i see a cat','I see a cat'],n));
 if(k==='sentence_build')return{template:'sequence',prompt:'Put the words in order.',narration:'Build the sentence: I see a star.',tokens:shuffle(r,['I','see','a','star.']),answer:['I','see','a','star.'],hints:['Sentences start with a capital.','What comes after I?']};
 if(k==='vocab'){var v=pick(r,C.VOCAB);return choice('What does “'+v.w+'” mean?',v.m,opts(r,v.m,v.o,n));}
 if(skill.domain_id==='science'){var s=pick(r,C.SCI);return choice(s.q,s.a,opts(r,s.a,s.options,n));}
 if(skill.domain_id==='logic'){var l=pick(r,C.LOGIC);return choice(l.q,l.a,opts(r,l.a,l.options,n));}
 if(skill.domain_id==='wellbeing'){var w=pick(r,C.WELL);return choice(w.q,w.a,opts(r,w.a,w.options,n));}
 if(k==='memory')return practice('Look at the three pictures for five seconds. Cover them, then name them.','Remember: moon, shell, star.','practice');
 if(k==='movement')return practice('Movement mission: make a star shape, hop 5 times, then freeze.','Stand up and move safely with a grown-up nearby.','practice');
 return practice('Try this hands-on mission: '+skill.title+'.','Take your time and tap Done when you finish.','practice');
}
function generate(skillId,band,seed){var sk=window.SakhiCurriculum.skill(skillId);if(!sk)throw new Error('Unknown skill '+skillId);band=Math.max(1,Math.min(5,Number(band)||1));var r=rng(skillId+':'+band+':'+seed),qs=[];for(var i=0;i<3;i++)qs.push(qFor(sk,band,r));return{activity_id:skillId+':'+band+':'+seed,skill_id:skillId,skill_title:sk.title,domain_id:sk.domain_id,band:band,band_name:BANDS[band].name,evidence_mode:qs.every(function(q){return q.evidence_mode==='practice';})?'practice':'objective',questions:qs};}
return{BANDS:BANDS,generate:generate};
})();
