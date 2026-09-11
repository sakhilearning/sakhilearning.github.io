window.SakhiCurriculum=(function(){
'use strict';
var data=null, byId={};
function hydrate(raw){
  if(!raw||!Array.isArray(raw.skills)||!Array.isArray(raw.domains)) throw new Error('Curriculum data is invalid.');
  data=raw; byId={};
  data.skills.forEach(function(s){byId[s.skill_id]=s;});
  return data;
}
async function load(){
  if(data) return data;
  if(window.SAKHI_CURRICULUM_DATA) return hydrate(window.SAKHI_CURRICULUM_DATA);
  var url=new URL('data/curriculum-v3.json',document.baseURI).href;
  var r=await fetch(url,{cache:'no-store'});
  if(!r.ok) throw new Error('Curriculum failed to load ('+r.status+').');
  return hydrate(await r.json());
}
function requireData(){if(!data)throw new Error('Curriculum not loaded');}
function skill(id){requireData();return byId[id]||null;}
function domains(){requireData();return data.domains.slice();}
function skillsIn(d){requireData();return data.skills.filter(function(s){return s.domain_id===d&&s.active;});}
function prerequisites(id){var s=skill(id);return s&&Array.isArray(s.prerequisites)?s.prerequisites.slice():[];}
function isAvailable(id,masteryOf){return prerequisites(id).every(function(p){var m=masteryOf(p);return m==='MOSTLY_MASTERED'||m==='MASTERED';});}
function frontier(d,masteryOf){return skillsIn(d).filter(function(s){var m=masteryOf(s.skill_id);return m!=='MASTERED'&&m!=='MOSTLY_MASTERED'&&isAvailable(s.skill_id,masteryOf);});}
function nextAfter(id,masteryOf){var s=skill(id);if(!s)return null;var arr=skillsIn(s.domain_id),i=arr.findIndex(function(x){return x.skill_id===id;});for(var j=i+1;j<arr.length;j++){if(isAvailable(arr[j].skill_id,masteryOf))return arr[j];}return null;}
return{load:load,skill:skill,domains:domains,skillsIn:skillsIn,prerequisites:prerequisites,isAvailable:isAvailable,frontier:frontier,nextAfter:nextAfter,version:function(){return data&&data.curriculum_version;}};
})();
