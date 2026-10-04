const path=require('path');
const root=path.join(__dirname,'..');
global.window={};
const evidenceById={};
global.SakhiProgress={
  load:()=>({attempts:[]}),
  evidence:id=>evidenceById[id]||{objective_attempts:0,last_accuracy:null,independent_correct_count:0,mastery_state:'NOT_INTRODUCED',attempt_count:0},
  bandFor:id=>(evidenceById[id]&&evidenceById[id].difficulty_level)||5,
  masteryOf:id=>(evidenceById[id]&&evidenceById[id].mastery_state)||'NOT_INTRODUCED'
};
global.SakhiCurriculum={skill:()=>({title:'Skill'}),skillsIn:()=>[],frontier:()=>[],isAvailable:()=>true};
window.SakhiProgress=global.SakhiProgress;window.SakhiCurriculum=global.SakhiCurriculum;
require(path.join(root,'sakhi-adaptive.js'));
const A=window.SakhiAdaptive;
function assert(ok,msg){if(!ok){console.error('adaptive-pacing FAILED: '+msg);process.exit(1);}}
evidenceById.new={objective_attempts:0,last_accuracy:1,independent_correct_count:3,mastery_state:'MOSTLY_MASTERED',difficulty_level:5};
assert(A.needsConsolidation(evidenceById.new)===true,'one strong activity must still require consolidation');
assert(A.bandForPick('new')<=3,'brand-new skill may not jump straight to band 5');
evidenceById.one={objective_attempts:1,last_accuracy:1,independent_correct_count:6,mastery_state:'MASTERED',difficulty_level:5};
assert(A.needsConsolidation(evidenceById.one)===true,'one objective activity cannot be treated as durable mastery');
assert(A.bandForPick('one')<=4,'one objective activity may challenge, but not jump to max band');
evidenceById.two={objective_attempts:2,last_accuracy:1,independent_correct_count:8,mastery_state:'MASTERED',difficulty_level:5};
assert(A.needsConsolidation(evidenceById.two)===false,'two strong objective activities satisfy minimum consolidation');
assert(A.bandForPick('two')===5,'well-supported mastery may reach challenge band');
console.log('adaptive-pacing passed: advancement requires repeated independent evidence before max-band challenge.');
