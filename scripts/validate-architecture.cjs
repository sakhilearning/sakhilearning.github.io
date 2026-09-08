const fs=require('fs');
const violations=[];
const read=f=>fs.existsSync(f)?fs.readFileSync(f,'utf8'):'';
const jsFiles=fs.readdirSync('.').filter(f=>f.endsWith('.js'));
const assignments=[
 ['SpeechService','speech-service.js'],['AssetService','asset-service.js'],['CurriculumEngine','core-learning-services.js'],['MasteryEngine','core-learning-services.js'],['LessonPlanner','core-learning-services.js'],['ProgressService','progress-service.js'],['RewardService','core-learning-services.js'],['ParentAuthService','parent-auth-service.js'],['LearnerProfileService','core-learning-services.js'],['AIContentService','core-learning-services.js'],['UIHooks','ui-hooks.js'],['ActivityRenderer','ui-hooks.js']
];
for(const [name,owner] of assignments){for(const file of jsFiles){if(file===owner)continue;const src=read(file);const re=new RegExp(`window\\.${name}\\s*=`);if(re.test(src))violations.push(`${file}: redefines ${name}; owner is ${owner}`)}}
for(const file of jsFiles){const src=read(file);if(file!=='ui-hooks.js'&&/window\.(go|setTheme|renderQuest|renderDomains|openDomain|openStructuredActivity|finishSuccess|finishAttempt)\s*=/.test(src))violations.push(`${file}: wraps/replaces an owned UI lifecycle function; subscribe to UIHooks instead`);if(file!=='core-learning-services.js'&&/window\.(makeQuest|deriveStatus|chooseActivity)\s*=/.test(src))violations.push(`${file}: replaces planning/mastery compatibility API`);if(file!=='parent-auth-service.js'&&/PARENT_HASH|sakhiParentUnlocked/.test(src))violations.push(`${file}: contains parent-auth internals`);if(file!=='persistence.js'&&file!=='progress-service.js'&&/RainbowPersistence/.test(src))violations.push(`${file}: bypasses ProgressService`);if(/SakhiVisuals/.test(src))violations.push(`${file}: obsolete SakhiVisuals API; use AssetService`);if(/assets\/hq\//.test(src))violations.push(`${file}: references removed/missing assets/hq path`)}
const index=read('index.html');
for(const file of ['design-tokens.css','core-learning-services.js','ui-hooks.js','progress-service.js','parent-auth-service.js','asset-service.js'])if(!index.includes(file))violations.push(`index.html missing ${file}`);
const order=['speech-service.js','app.js','core-learning-services.js','scheduler.js','interaction-engine.js','ui-hooks.js','progress-service.js','parent-auth-service.js','asset-service.js','visuals.js','kid-upgrade.js','adaptive-engine.js','backend-bridge.js','sakhi-shell.js'];
let last=-1;for(const file of order){const at=index.indexOf(file);if(at<0)continue;if(at<last)violations.push(`index.html script order invalid around ${file}`);last=at}
const scheduler=read('scheduler.js');if(/function\s+(chooseActivity|deriveStatus|reviewIntervalDays)/.test(scheduler))violations.push('scheduler.js still duplicates mastery/planning logic');
const adaptive=read('adaptive-engine.js');if(/document\.createElement\(['"]style['"]\)/.test(adaptive))violations.push('adaptive-engine.js injects inline style block');
const readme=read('README.md');if(/Rainbow Magic Learning Adventure/.test(readme))violations.push('README branding is stale');
if(violations.length){console.error('Architecture validation failed:\n- '+violations.join('\n- '));process.exit(1)}
console.log('Architecture validation passed: authoritative services are unique and lifecycle hooks are centralized.');
