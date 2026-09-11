/* Six-month scope/sequence + fixed-trail invariants. */
const fs=require('fs'), path=require('path');
const root=path.join(__dirname,'..');
const plan=require(path.join(root,'data/six-month-plan.json'));
const snap=require(path.join(root,'curriculum-snapshot.json'));
let failures=0;
function ok(label,cond,extra){if(cond)console.log('  ok   '+label);else{failures++;console.error('  FAIL '+label+(extra===undefined?'':' '+JSON.stringify(extra)));}}
const ids=new Set(snap.skills.map(s=>s.skill_id));
const byId=Object.fromEntries(snap.skills.map(s=>[s.skill_id,s]));

console.log('\n=== Six-month plan ===');
ok('plan is tied to V3 curriculum',plan.curriculum_version==='2026.09.10-v3',plan.curriculum_version);
ok('26 weekly scopes exist',plan.weeks.length===26,plan.weeks.length);
ok('130 practice days exist',plan.days.length===130,plan.days.length);
ok('day ids are unique',new Set(plan.days.map(d=>d.day_id)).size===130);
ok('each week has five days',Array.from({length:26},(_,i)=>plan.days.filter(d=>d.week===i+1).length).every(n=>n===5));
ok('every day totals 30 planned minutes',plan.days.every(d=>d.estimated_minutes===30 && d.app_blocks.reduce((n,b)=>n+b.minutes,0)+(d.offscreen_block?.minutes||0)===30));
ok('each day targets 24 screen + 6 off-screen minutes',plan.days.every(d=>d.app_blocks.reduce((n,b)=>n+b.minutes,0)===24 && d.offscreen_block.minutes===6));
ok('every day has exactly four app mini-quests',plan.days.every(d=>d.app_blocks.length===4));
ok('every day includes reading and math',plan.days.every(d=>{const dom=d.app_blocks.map(b=>byId[b.skill_id]?.domain_id);return dom.includes('reading')&&dom.includes('math');}));
ok('every scheduled skill exists in curriculum',plan.days.every(d=>d.app_blocks.every(b=>ids.has(b.skill_id))));
ok('every off-screen block includes movement, handwriting and family talk',plan.days.every(d=>d.offscreen_block?.movement&&d.offscreen_block?.handwriting&&d.offscreen_block?.family_talk));
const total=plan.days.reduce((n,d)=>n+d.estimated_minutes,0);
ok('plan represents 65 hours of intended practice',total===3900,total);

console.log('\n=== Parent session-length policy ===');
global.window={};
require(path.join(root,'sakhi-plan.js'));
const Plan=window.SakhiPlan;
const sampleDay=plan.days[0];
ok('25-minute preference uses three app blocks',Plan.stepsForDay(sampleDay,25).length===3,Plan.stepsForDay(sampleDay,25).length);
ok('30-minute preference uses the four planned app blocks',Plan.stepsForDay(sampleDay,30).length===4,Plan.stepsForDay(sampleDay,30).length);
ok('35-minute preference adds only one confirmation block',Plan.stepsForDay(sampleDay,35).length===5,Plan.stepsForDay(sampleDay,35).length);
ok('only the 35-minute plan contains a repeat',Plan.stepsForDay(sampleDay,35).filter(x=>x.repeat).length===1);

console.log('\n=== Fixed subject trails ===');
require(path.join(root,'sakhi-curriculum.js'));
window.SakhiCurriculum.loadFrom(snap);
require(path.join(root,'sakhi-trails.js'));
const Trails=window.SakhiTrails;
const domains=snap.domains.map(d=>d.domain_id);
ok('one trail exists for every curriculum domain',domains.every(d=>Trails.TRAILS[d]&&Trails.TRAILS[d].domain===d),domains);
ok('all subject trails have five landmarks',Trails.all().every(t=>Array.isArray(t.landmarks)&&t.landmarks.length===5));
ok('each domain maps to exactly one stable theme id',new Set(domains.map(d=>d+'='+Trails.forDomain(d).theme_id)).size===domains.length);
ok('reading is always Rainbow Reading Trail',Trails.forDomain('reading').id==='rainbow_reading');
ok('math is always Crystal Number Palace',Trails.forDomain('math').id==='crystal_numbers');
ok('writing is always Butterfly Letter Studio',Trails.forDomain('writing').id==='butterfly_letters');
ok('a skill inherits only its domain trail',snap.skills.every(s=>Trails.forSkill(s.skill_id).domain===s.domain_id));

console.log('\n=== Separation guards ===');
const adaptive=fs.readFileSync(path.join(root,'sakhi-adaptive.js'),'utf8');
const activities=fs.readFileSync(path.join(root,'sakhi-activities.js'),'utf8');
const presentation=fs.readFileSync(path.join(root,'sakhi-presentation.js'),'utf8');
ok('adaptive planner never imports/reads themes or trails',!/(SakhiThemes|SakhiTrails|active_theme|theme_id)/.test(adaptive.replace(/\/\*[\s\S]*?\*\//g,'')));
ok('activity generator never reads themes or trails',!/(SakhiThemes|SakhiTrails|active_theme|theme_id)/.test(activities.replace(/\/\*[\s\S]*?\*\//g,'')));
ok('presentation does not call adaptive/progress selection',!/(SakhiAdaptive|nextActivity|nextForTarget|completeActivity|masteryOf)/.test(presentation.replace(/\/\*[\s\S]*?\*\//g,'')));

if(failures){console.error('\nPLAN/TRAIL TEST FAILED: '+failures+' check(s)');process.exit(1);}
console.log('\nPLAN/TRAIL TEST PASSED');
