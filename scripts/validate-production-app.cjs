const fs=require('fs'),path=require('path'); const root=path.join(__dirname,'..');
function read(f){return fs.readFileSync(path.join(root,f),'utf8')}
const c=JSON.parse(read('data/curriculum-v3.json')), p=JSON.parse(read('data/six-month-plan.json'));
if(c.domains.length!==8)throw new Error('Expected 8 domains');
if(c.skills.length!==85)throw new Error('Expected 85 skills');
const ids=new Set(c.skills.map(s=>s.skill_id)); if(ids.size!==c.skills.length)throw new Error('Duplicate skill id');
for(const s of c.skills)for(const pre of s.prerequisites||[])if(!ids.has(pre))throw new Error(`Missing prerequisite ${pre}`);
const visiting=new Set(),done=new Set(),byId=Object.fromEntries(c.skills.map(s=>[s.skill_id,s]));
function walk(id){if(visiting.has(id))throw new Error('Prerequisite loop at '+id);if(done.has(id))return;visiting.add(id);for(const p of byId[id].prerequisites||[])walk(p);visiting.delete(id);done.add(id)} c.skills.forEach(s=>walk(s.skill_id));
if(p.weeks.length!==26||p.weeks.reduce((n,w)=>n+w.days.length,0)!==130)throw new Error('Plan must be 26 weeks / 130 days');
for(const w of p.weeks)for(const d of w.days){if(d.total_minutes!==30)throw new Error('Day not 30 minutes');for(const m of d.missions)if(!ids.has(m.skill_id))throw new Error('Unknown planned skill '+m.skill_id);}
const adaptive=read('sakhi-adaptive.js'), activities=read('sakhi-activities.js'), trails=read('sakhi-trails.js');
if(/SakhiTrails|SakhiPresentation/.test(adaptive))throw new Error('Adaptive must not read presentation');
if(/SakhiTrails|SakhiPresentation/.test(activities))throw new Error('Activities must not read presentation');
if(/mastery_state\s*=/.test(adaptive))throw new Error('Adaptive writes mastery directly');
const progress=read('sakhi-progress.js'); if(!/completeActivity/.test(progress))throw new Error('Missing completion path');
const css=read('sakhi-production.css'); if(/!important/.test(css))throw new Error('CSS contains !important'); if(!/@layer reset,tokens,base,layout,components,states,utilities/.test(css))throw new Error('Missing CSS layers');
const html=read('index.html'); const idMatches=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]); if(new Set(idMatches).size!==idMatches.length)throw new Error('Duplicate HTML id');
const hotlinks=[...fs.readdirSync(root).filter(f=>/\.(js|css|html)$/.test(f)).flatMap(f=>[...read(f).matchAll(/https?:\/\/[^'"\s)]+\.(?:png|jpe?g|webp|svg)/gi)].map(m=>m[0]))]; if(hotlinks.length)throw new Error('Remote image hotlink found');
console.log('Sakhi V3 RC1 validation passed:');console.log(' - 85 skills across 8 persistent subject trails');console.log(' - prerequisite graph sound');console.log(' - 26 weeks / 130 days / 30 minutes validated');console.log(' - adaptive/activity layers do not read presentation');console.log(' - mastery writes centralized in Progress');console.log(' - CSS layers present; no !important');console.log(' - no duplicate DOM ids or remote image hotlinks');
