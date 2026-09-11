/* Sakhi V3 deploy gate.
 * Fails closed on architecture drift, curriculum/content gaps, accidental theme
 * control of learning, duplicate CSS ownership, broken local assets and unsafe
 * child/parent runtime regressions.
 */
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const read=f=>fs.existsSync(path.join(root,f))?fs.readFileSync(path.join(root,f),'utf8'):'';
const exists=f=>fs.existsSync(path.join(root,f));
const errors=[]; const fail=m=>errors.push(m);
const index=read('index.html'), sw=read('sw.js'), css=read('sakhi-production.css'), manifest=read('manifest.json');

const MODULES=['supabase-config.js','sakhi-cloud.js','sakhi-curriculum.js','sakhi-themes.js','sakhi-content.js','sakhi-activities.js','sakhi-plan.js','sakhi-trails.js','sakhi-presentation.js','sakhi-progress.js','sakhi-adaptive.js','sakhi-audio.js','sakhi-art.js','sakhi-templates.js','sakhi-app.js'];
MODULES.forEach(m=>{if(!exists(m))fail('missing runtime module '+m);if(!index.includes(m))fail('index.html does not load '+m);});
if(!index.includes('sakhi-production.css'))fail('index.html does not load sakhi-production.css');

/* One owner per concern: stale parallel runtimes/wrappers are deployment bugs. */
const FORBIDDEN_FILES=['app.js','interaction-engine.js','daily-journey-service.js','adaptive-engine.js','adventure-service.js','asset-service.js','persistence.js','progress-service.js','reward-service.js','settings-ui.js','speech-service.js','sakhi-production.js','sakhi-shell.js','sakhi-content-v3.js','sakhi-activities-v3.js'];
FORBIDDEN_FILES.forEach(f=>{if(exists(f))fail('competing/legacy runtime file exists: '+f);});

let snap;
try{snap=JSON.parse(read('curriculum-snapshot.json'));}catch(e){fail('curriculum-snapshot.json missing/unparseable: '+e.message);}
if(snap){
  if(snap.curriculum_version!=='2026.09.10-v3')fail('unexpected curriculum version '+snap.curriculum_version);
  const ids=snap.skills.map(s=>s.skill_id), S=new Set(ids);
  if(S.size!==ids.length)fail('duplicate skill ids in curriculum');
  const domainIds=new Set(snap.domains.map(d=>d.domain_id));
  const strandIds=new Set(snap.strands.map(s=>s.strand_id));
  snap.skills.forEach(s=>{if(!domainIds.has(s.domain_id))fail(s.skill_id+' has unknown domain '+s.domain_id);if(!strandIds.has(s.strand_id))fail(s.skill_id+' has unknown strand '+s.strand_id);(s.recommended_next||[]).forEach(n=>{if(!S.has(n))fail(s.skill_id+' recommends unknown skill '+n);});});
  (snap.prerequisites||[]).forEach(p=>{if(!S.has(p.skill_id))fail('prerequisite child unknown: '+p.skill_id);if(!S.has(p.prerequisite_skill_id))fail('prerequisite parent unknown: '+p.prerequisite_skill_id);if(p.skill_id===p.prerequisite_skill_id)fail('self prerequisite: '+p.skill_id);});
  const adj=Object.fromEntries(ids.map(id=>[id,[]]));(snap.prerequisites||[]).forEach(p=>{if(adj[p.skill_id])adj[p.skill_id].push(p.prerequisite_skill_id);});
  const color={};function walk(u,stack){color[u]=1;for(const v of adj[u]||[]){if(color[v]===1)fail('prerequisite cycle: '+stack.concat([u,v]).join(' -> '));else if(!color[v])walk(v,stack.concat([u]));}color[u]=2;}ids.forEach(id=>{if(!color[id])walk(id,[]);});
  const hasPrereq=new Set((snap.prerequisites||[]).map(p=>p.skill_id));domainIds.forEach(d=>{if(!snap.skills.some(s=>s.domain_id===d&&!hasPrereq.has(s.skill_id)))fail('domain has no entry skill: '+d);});

  /* Require migration compatibility: the 48 production V2 ids may not vanish. */
  let old;try{old=JSON.parse(read('docs/v2-curriculum-baseline.json'));}catch(e){old=null;}
  if(old&&Array.isArray(old.skill_ids))old.skill_ids.forEach(id=>{if(!S.has(id))fail('V3 removed legacy skill id '+id);});

  global.window={};
  require(path.join(root,'sakhi-content.js'));
  require(path.join(root,'sakhi-activities.js'));
  const C=window.SakhiContent,A=window.SakhiActivities;
  ids.forEach(id=>{if(!C.has(id))fail('no content bank for '+id);for(let band=1;band<=5;band++){try{const a=A.generate(id,band,'deploy-gate');if(a.questions.length!==3)fail(id+' b'+band+' did not generate 3 questions');a.questions.forEach((q,i)=>{if(!q.prompt||!q.narration)fail(id+' b'+band+' q'+i+' missing prompt/narration');if(!Array.isArray(q.hints)||q.hints.length<3)fail(id+' b'+band+' q'+i+' needs 3 progressive hints');if(q.template==='choice'&&!q.choices.map(String).includes(String(q.answer)))fail(id+' b'+band+' q'+i+' answer absent from choices');});}catch(e){fail(id+' b'+band+' generation error: '+e.message);}}});
}

/* Themes/trails/presentation are downstream presentation only. */
const themes=read('sakhi-themes.js'),adaptive=read('sakhi-adaptive.js'),activities=read('sakhi-activities.js'),trails=read('sakhi-trails.js'),presentation=read('sakhi-presentation.js'),progress=read('sakhi-progress.js'),app=read('sakhi-app.js'),cloud=read('sakhi-cloud.js');
if(!themes.includes('FORBIDDEN_KEYS')||!themes.includes('deepFreeze'))fail('theme registry lost cosmetic guards');
if(/window\.SakhiCurriculum|SakhiProgress|SakhiAdaptive/.test(themes))fail('theme registry reaches learning services');
const stripComments=s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'');
if(/SakhiThemes|SakhiTrails|active_theme|theme_id/.test(stripComments(adaptive)))fail('adaptive planner reads presentation state');
if(/SakhiThemes|SakhiTrails|active_theme|theme_id/.test(stripComments(activities)))fail('activity generator reads presentation state');
if(/SakhiAdaptive|nextActivity|nextForTarget|completeActivity|masteryOf/.test(stripComments(presentation)))fail('presentation layer steers learning');
if(!/domain:'reading'.*theme_id:'unicorn_meadow'/.test(trails.replace(/\n/g,' ')))fail('reading fixed trail mapping missing');
if(!/domain:'math'.*theme_id:'ice_palace'/.test(trails.replace(/\n/g,' ')))fail('math fixed trail mapping missing');

/* Exactly one learning-mutation owner. */
if(!progress.includes('function completeActivity'))fail('progress owner has no completeActivity');
if(!progress.includes('if(result.placementProbe)'))fail('placement credit is not committed through completeActivity');
if(/\.persist\s*\(|mastery_state\s*=|placement_credited\s*=/.test(stripComments(adaptive)))fail('adaptive planner mutates/persists learning state');
for(const f of fs.readdirSync(root).filter(f=>/^sakhi-.*\.js$/.test(f)&&f!=='sakhi-progress.js')){
  const src=stripComments(read(f));
  if(/localStorage\.setItem\(\s*['"]sakhi\.learner\.state/.test(src))fail(f+' writes learner state outside progress owner');
  if(/\.mastery_state\s*=/.test(src))fail(f+' assigns mastery_state outside progress owner');
}
if((progress.match(/Cloud\.batch\(/g)||[]).length<1)fail('completeActivity has no logical cloud batch path');

/* Cloud truthfulness and data integrity. */
if(!cloud.includes('sakhi.cloud.deadletter'))fail('cloud layer has no dead-letter queue');
if(!cloud.includes('function batch('))fail('cloud layer has no logical batch envelope');
if(/dropping unsendable/i.test(cloud))fail('cloud layer still silently drops unsendable writes');
const signInBody=(cloud.match(/async function signIn\([\s\S]*?\n  }/)||[''])[0];
if(/setStatus\(STATUS\.CONNECTED/.test(signInBody))fail('signIn reports CONNECTED before authenticated learner-data probe');
if(!cloud.includes('resolution=merge-duplicates'))fail('cloud upserts lost idempotent merge semantics');

/* Parent gate is a child deterrent, never a hard-coded secret. */
if(/var\s+PASS\s*=|const\s+PASS\s*=|071621/.test(app))fail('hard-coded parent passcode returned');
if(!app.includes("sakhi.parent.until")||!app.includes('PARENT_TTL'))fail('parent gate has no inactivity expiry');

/* Audio: isolated phonemes may never go through generic browser TTS. */
const audio=read('sakhi-audio.js');
if(!audio.includes('function playPhoneme'))fail('audio owner missing playPhoneme');
if(!/fetchVoice\(\s*sym\s*,\s*['\"]phoneme['\"]/.test(audio))fail('audio has no dedicated phoneme gateway request');
if(!audio.includes('function speakStructured')||!audio.includes('function speakQuestion'))fail('structured narration/phoneme sequencing missing');
const playPhonemeBody=(audio.match(/async function playPhoneme\([\s\S]*?\n  }/)||[''])[0];
if(/speechSynthesis/.test(playPhonemeBody))fail('isolated phoneme path falls back to browser speech synthesis');

/* Six-month cadence + fixed subject coverage. */
let plan;try{plan=JSON.parse(read('data/six-month-plan.json'));}catch(e){fail('six-month plan missing/unparseable');}
if(plan){if(plan.weeks.length!==26)fail('plan does not contain 26 weeks');if(plan.days.length!==130)fail('plan does not contain 130 days');const skillMap=snap?Object.fromEntries(snap.skills.map(s=>[s.skill_id,s])):{};plan.days.forEach(d=>{const mins=d.app_blocks.reduce((n,b)=>n+b.minutes,0)+(d.offscreen_block?.minutes||0);if(mins!==30||d.estimated_minutes!==30)fail(d.day_id+' is not a 30-minute plan');if(d.app_blocks.length!==4)fail(d.day_id+' must have four app blocks');const dom=d.app_blocks.map(b=>skillMap[b.skill_id]?.domain_id);if(!dom.includes('reading')||!dom.includes('math'))fail(d.day_id+' must include reading and math');d.app_blocks.forEach(b=>{if(!skillMap[b.skill_id])fail(d.day_id+' schedules unknown '+b.skill_id);});});}

/* HTML identity/accessibility basics. */
const ids=[...index.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
const dupIds=ids.filter((v,i)=>ids.indexOf(v)!==i);if(dupIds.length)fail('duplicate HTML ids: '+[...new Set(dupIds)].join(', '));
if(!index.includes('class="skip-link"'))fail('missing skip link');
if(!index.includes('meta name="viewport"'))fail('missing mobile viewport');
if(index.includes('data-nav="themes"'))fail('child UI still exposes mood/theme picker');
if(/INTRO|SUPPORTED|INDEPENDENT|CHALLENGE/.test(index))fail('technical difficulty labels leaked into static child UI');

/* CSS ownership: fixed cascade layers, no !important, no duplicate selector in
   the same media context. Responsive overrides are allowed only inside @media. */
const layerDecl='@layer reset, tokens, base, layout, components, scenes, states, utilities;';
if(!css.includes(layerDecl))fail('stylesheet does not declare the fixed cascade layer order');
if(/!important\b/.test(css))fail('stylesheet uses !important');
function duplicateSelectors(source){
  source=source.replace(/\/\*[\s\S]*?\*\//g,'');const seen=new Map(),dupes=[];
  function propsOf(body){const out=[];body.split(';').forEach(part=>{const i=part.indexOf(':');if(i>0){const p=part.slice(0,i).trim();if(/^--[\w-]+$|^-?[a-z][\w-]*$/i.test(p))out.push(p);}});return out;}
  function parse(text,ctx){let i=0;while(i<text.length){while(i<text.length&&/\s/.test(text[i]))i++;if(i>=text.length)break;let start=i,inStr=null,paren=0;while(i<text.length){const c=text[i];if(inStr){if(c==='\\')i++;else if(c===inStr)inStr=null;}else if(c==='"'||c==="'")inStr=c;else if(c==='(')paren++;else if(c===')')paren--;else if(paren===0&&(c==='{'||c===';'))break;i++;}const head=text.slice(start,i).trim();if(i>=text.length)break;if(text[i]===';'){i++;continue;}let bodyStart=++i,depth=1,inS=null;while(i<text.length&&depth){const c=text[i];if(inS){if(c==='\\')i++;else if(c===inS)inS=null;}else if(c==='"'||c==="'")inS=c;else if(c==='{')depth++;else if(c==='}')depth--;i++;}const body=text.slice(bodyStart,i-1);if(!head)continue;if(/^@media\b/.test(head))parse(body,ctx+'|'+head.replace(/\s+/g,' '));else if(/^@layer\b/.test(head))parse(body,ctx+'|'+head.replace(/\s+/g,' '));else if(/^@(supports|container)\b/.test(head))parse(body,ctx+'|'+head.replace(/\s+/g,' '));else if(/^@keyframes\b/.test(head)||/^@font-face\b/.test(head)){}else if(!head.startsWith('@')){const props=propsOf(body);head.split(',').map(x=>x.trim().replace(/\s+/g,' ')).filter(Boolean).forEach(sel=>{const key=ctx+'|'+sel;const prior=seen.get(key)||new Set();const overlaps=props.filter(p=>prior.has(p));if(overlaps.length)dupes.push(sel+' redefines '+overlaps.join('/')+' ['+ctx+']');props.forEach(p=>prior.add(p));seen.set(key,prior);});}}
  }
  parse(source,'base');return [...new Set(dupes)];
}
const cssDupes=duplicateSelectors(css);if(cssDupes.length)fail('duplicate CSS selector ownership: '+cssDupes.slice(0,12).join(', '));

/* Local asset references must exist; arbitrary third-party images are forbidden. */
const assetSources=[index,css,read('sakhi-art.js'),read('sakhi-content.js'),trails];
const localRefs=new Set();assetSources.forEach(src=>{for(const m of src.matchAll(/\.\/assets\/[A-Za-z0-9_./-]+\.(?:png|jpg|jpeg|webp|svg|ogg|mp3)/g))localRefs.add(m[0].replace(/^\.\//,''));});
localRefs.forEach(f=>{if(!exists(f))fail('referenced local asset missing: '+f);});
assetSources.forEach((src,i)=>{if(/https?:\/\/[^)'"\s]+\.(?:png|jpg|jpeg|webp|svg)/i.test(src))fail('remote image hotlink found in presentation source #'+i);});

/* PWA. */
if(!/navigator\.serviceWorker\.register\(/.test(app))fail('app does not register service worker');
MODULES.concat(['sakhi-production.css','curriculum-snapshot.json','data/six-month-plan.json']).forEach(m=>{if(!sw.includes(m))fail('service worker does not cache '+m);});
if(!manifest.includes('Sakhi Learning Trails'))fail('manifest has wrong app identity');
['icon-180.png','icon-192.png','icon-512.png'].forEach(f=>{if(!exists(f))fail('missing app icon '+f);});
if(!index.includes('apple-touch-icon'))fail('missing iOS home icon link');

/* Active documentation must match the runtime, so stale service names cannot
   quietly reintroduce a second architecture in the next maintenance pass. */
const ACTIVE_DOCS=['README.md','ARCHITECTURE.md','CONTROL_AUDIT.md','docs/ARCHITECTURE.md','docs/AUDIO.md','docs/CURRICULUM.md','docs/SUPABASE.md','docs/QA.md','docs/SAKHI_SOURCE_OF_TRUTH.md'];
const STALE_SERVICES=['SpeechService','PhonemeAudioService','AssetService','AdventureService','SettingsService','ParentAuthService','CurriculumEngine','MasteryEngine','LessonPlanner','ProgressService','RewardService','ActivityRenderer'];
ACTIVE_DOCS.forEach(f=>{const src=read(f);STALE_SERVICES.forEach(name=>{if(src.includes(name))fail(f+' refers to removed V2 service '+name);});});

/* Required V3 migrations/documented backend upgrade. */
if(!exists('migrations/20260909_theme_configuration.sql'))fail('missing prerequisite theme/reward migration');
if(!exists('migrations/20260910_v3_foundation.sql'))fail('missing V3 backend migration');

if(errors.length){console.error('Sakhi V3 validation FAILED:\n- '+errors.join('\n- '));process.exit(1);}
console.log([
  'Sakhi V3 production validation passed:',
  '  - '+MODULES.length+' runtime modules, one owner per concern',
  '  - curriculum graph sound ('+(snap?snap.skills.length:0)+' skills, '+(snap?snap.prerequisites.length:0)+' prerequisite edges)',
  '  - all skills generate at all 5 bands',
  '  - fixed subject trails are presentation-only',
  '  - learning writes centralized; cloud batches + dead-letter protection present',
  '  - 26 weeks / 130 days / 30 minutes per day validated',
  '  - layered CSS has no !important or duplicate selector ownership',
  '  - local assets, PWA shell, audio architecture and migrations validated'
].join('\n'));
