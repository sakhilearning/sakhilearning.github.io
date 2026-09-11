const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..');
function read(f){return fs.readFileSync(path.join(root,f),'utf8');}
const c=JSON.parse(read('data/curriculum-v3.json')),p=JSON.parse(read('data/six-month-plan.json'));
if(c.domains.length!==8)throw new Error('Expected 8 domains');
if(c.skills.length<85)throw new Error('Expected at least 85 skills');
const ids=new Set(c.skills.map(s=>s.skill_id));if(ids.size!==c.skills.length)throw new Error('Duplicate skill id');
for(const s of c.skills){if(!s.domain_id)throw new Error('Skill missing domain '+s.skill_id);for(const pre of s.prerequisites||[])if(!ids.has(pre))throw new Error(`Missing prerequisite ${pre}`);}
const visiting=new Set(),done=new Set(),byId=Object.fromEntries(c.skills.map(s=>[s.skill_id,s]));
function walk(id){if(visiting.has(id))throw new Error('Prerequisite loop at '+id);if(done.has(id))return;visiting.add(id);for(const q of byId[id].prerequisites||[])walk(q);visiting.delete(id);done.add(id);}c.skills.forEach(s=>walk(s.skill_id));
if(p.weeks.length!==26||p.weeks.reduce((n,w)=>n+w.days.length,0)!==130)throw new Error('Plan must be 26 weeks / 130 days');
for(const w of p.weeks)for(const d of w.days){if(d.total_minutes!==30)throw new Error('Day not 30 minutes');const domains=d.missions.map(m=>m.domain);for(const core of ['reading','math','writing'])if(!domains.includes(core))throw new Error('Missing daily core '+core);for(const m of d.missions)if(!ids.has(m.skill_id))throw new Error('Unknown planned skill '+m.skill_id);}
const adaptive=read('sakhi-adaptive.js'),activities=read('sakhi-activities.js'),plan=read('sakhi-plan.js'),curriculum=read('sakhi-curriculum.js'),templates=read('sakhi-templates.js'),audio=read('sakhi-audio.js');
if(/SakhiTrails|SakhiPresentation/.test(adaptive))throw new Error('Adaptive must not read presentation');
if(/SakhiTrails|SakhiPresentation/.test(activities))throw new Error('Activities must not read presentation');
if(/mastery_state\s*=/.test(adaptive))throw new Error('Adaptive writes mastery directly');
if(!/SAKHI_SIX_MONTH_PLAN/.test(plan))throw new Error('Session planner is not connected to six-month plan');
if(!/SAKHI_CURRICULUM_DATA/.test(curriculum))throw new Error('Curriculum has no embedded deployment fallback');
if(/reset:function\(\)\{[^}]*render\(root,q,ctx\)/.test(templates))throw new Error('Template reset recreates controller and can leave stale state');
if(/FAULT\.SILENT|kind\s*===\s*['"]SILENT['"]|Sound is on, but nothing is coming out/.test(audio))throw new Error('Legacy false SILENT detector is present');
const progress=read('sakhi-progress.js');if(!/completeActivity/.test(progress))throw new Error('Missing completion path');
const css=read('sakhi-production.css');if(/!important/.test(css))throw new Error('CSS contains !important');if(!/@layer reset,tokens,base,layout,components,states,utilities/.test(css))throw new Error('Missing CSS source layers');
const html=read('index.template.html');const idMatches=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);if(new Set(idMatches).size!==idMatches.length)throw new Error('Duplicate HTML id');
const hotlinks=[...fs.readdirSync(root).filter(f=>/\.(js|css|html)$/.test(f)).flatMap(f=>[...read(f).matchAll(/https?:\/\/[^'"\s)]+\.(?:png|jpe?g|webp|svg)/gi)].map(m=>m[0]))];if(hotlinks.length)throw new Error('Remote image hotlink found');
console.log('Sakhi V3 RC2 source validation passed:');
console.log(` - ${c.skills.length} skills across 8 persistent subject trails`);
console.log(' - prerequisite graph sound');
console.log(' - 26 weeks / 130 days / 30 minutes validated');
console.log(' - six-month plan drives session pacing while adaptive owns readiness');
console.log(' - adaptive/activity layers do not read presentation');
console.log(' - mastery writes centralized in Progress');
console.log(' - controller reset and legacy SILENT detector regressions blocked');
console.log(' - CSS source layers present; no !important');
console.log(' - no duplicate DOM ids or remote image hotlinks');
