const assert=require('assert');
const path=require('path');
const root=path.join(__dirname,'..');
const store={};
global.localStorage={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}};
global.sessionStorage=global.localStorage;
global.crypto=require('crypto').webcrypto;
global.navigator={onLine:false};
global.fetch=()=>Promise.reject(new Error('offline'));
global.addEventListener=()=>{};
global.window={addEventListener:()=>{}};
global.document={addEventListener:()=>{},readyState:'complete'};
const skill={skill_id:'math.enterprise_mastery_probe',domain_id:'math',title:'Mastery probe',mastery_criteria:{min_attempts:3,target_accuracy:.8,independent_evidence:2},review_policy:{}};
global.SakhiCurriculum=global.window.SakhiCurriculum={skill:id=>id===skill.skill_id?skill:null,domains:()=>[],skillsIn:()=>[],nextAfter:()=>null,isAvailable:()=>true};
require(path.join(root,'sakhi-progress.js'));
const P=global.window.SakhiProgress;
function activity(n){return{activity_id:'act-'+n,skill_id:skill.skill_id,domain_id:'math',band:3,evidence_mode:'objective'};}
function answers(n){return Array.from({length:n},(_,i)=>({correct:true,hintsUsed:0,tries:1,response_ms:2500,question_key:'q-'+i,evidence_mode:'objective'}));}
function complete(sessionId,n){return P.completeActivity({activity:activity(sessionId),sessionId:'session-'+sessionId,answers:answers(n)});}
let r=complete(1,4);
assert.notStrictEqual(r.mastery_state,'MOSTLY_MASTERED','one perfect short sitting must not award mostly-mastered');
assert.notStrictEqual(r.mastery_state,'MASTERED','one perfect short sitting must not award mastery');
assert.strictEqual(P.evidence(skill.skill_id).objective_sessions,1);
r=complete(2,4);
assert.strictEqual(P.evidence(skill.skill_id).objective_sessions,2,'evidence should span two distinct sessions');
assert.strictEqual(r.mastery_state,'MOSTLY_MASTERED','two strong independent sittings may establish likely knowledge');
r=complete(3,4);
assert.strictEqual(P.evidence(skill.skill_id).objective_sessions,3);
assert.strictEqual(r.mastery_state,'MASTERED','mastery requires repeated independent evidence across three sessions');
/* More activities in the same session deepen evidence but must not fake a new sitting. */
const before=P.evidence(skill.skill_id).objective_sessions;
P.completeActivity({activity:{activity_id:'extra-same-session',skill_id:skill.skill_id,domain_id:'math',band:4,evidence_mode:'objective'},sessionId:'session-3',answers:answers(4)});
assert.strictEqual(P.evidence(skill.skill_id).objective_sessions,before);
console.log('mastery-depth: repeated independent sessions are required before mastery, while same-session practice does not inflate confidence.');
