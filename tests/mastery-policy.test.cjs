const path=require('path');
const root=path.join(__dirname,'..');
const failures=[];
const check=(label,cond,extra)=>{if(!cond)failures.push(label+(extra!==undefined?'  <'+JSON.stringify(extra)+'>':''));};
const store={};
global.localStorage={getItem:k=>(k in store?store[k]:null),setItem:(k,v)=>{store[k]=String(v);},removeItem:k=>{delete store[k];}};
global.sessionStorage=global.localStorage;global.crypto=require('crypto').webcrypto;global.navigator={onLine:false};global.fetch=()=>Promise.reject(new Error('offline'));global.addEventListener=()=>{};global.window={addEventListener:()=>{}};global.document={addEventListener:()=>{},readyState:'complete'};
global.window.SakhiCurriculum={skill:id=>({skill_id:id,mastery_criteria:{min_attempts:3,target_accuracy:.8,independent_evidence:2},review_policy:{learning_days:1,developing_days:3,mostly_mastered_days:7,mastered_days:14}})};global.SakhiCurriculum=global.window.SakhiCurriculum;
require(path.join(root,'sakhi-progress.js'));global.SakhiProgress=global.window.SakhiProgress;require(path.join(root,'sakhi-mastery-policy.js'));
const P=global.window.SakhiProgress,M=global.window.SakhiMasteryPolicy;
function answers(n){return Array.from({length:n},(_,i)=>({question_key:'q'+i,correct:true,hintsUsed:0,tries:1,response_ms:500,evidence_mode:'objective'}));}
function complete(id,session,n){return P.completeActivity({sessionId:session,activity:{activity_id:id,skill_id:'math.demo',domain_id:'math',band:2,evidence_mode:'objective'},answers:answers(n)});}
check('mastery policy installs',P.__masteryPolicy===true);
complete('a1','s1',3);let e=P.evidence('math.demo');
check('one perfect activity is not mostly mastered',e.mastery_state!=='MOSTLY_MASTERED'&&e.mastery_state!=='MASTERED',e.mastery_state);
check('challenge can still rise independently',e.difficulty_level>=2,e.difficulty_level);
complete('a2','s1',3);e=P.evidence('math.demo');check('two strong activities are not mastered',e.mastery_state!=='MASTERED',e.mastery_state);
complete('a3','s2',3);e=P.evidence('math.demo');const g=M.gate('math.demo');
check('three strong activities across two sessions satisfy secure evidence',g&&g.secure===true,g);
check('secure evidence can carry a mastered/mostly-mastered state',e.mastery_state==='MASTERED'||e.mastery_state==='MOSTLY_MASTERED',e.mastery_state);
const prof=P.skillProfile('math.demo');check('profile exposes evidence gate',prof&&prof.evidence_gate&&prof.evidence_gate.questions>=9,prof&&prof.evidence_gate);
if(failures.length){console.error('mastery-policy FAILED:\n- '+failures.join('\n- '));process.exit(1);}console.log('mastery-policy passed: challenge rises quickly while mastery requires repeated independent evidence.');
