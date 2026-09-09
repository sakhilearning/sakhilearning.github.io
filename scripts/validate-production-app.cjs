const fs=require('fs');
const errors=[];
const read=f=>fs.existsSync(f)?fs.readFileSync(f,'utf8'):'';
const index=read('index.html'),js=read('sakhi-production.js'),css=read('sakhi-production.css'),sw=read('sw.js'),manifest=read('manifest.json');
function has(text,token,msg){if(!text.includes(token))errors.push(msg||`missing ${token}`)}
has(index,'sakhi-production.css','index must load production CSS');
has(index,'sakhi-production.js','index must load production JS');
for(const old of ['app.js','interaction-engine.js','sakhi-v3.js','daily-journey-service.js','adaptive-engine.js','visuals.js'])if(index.includes(old))errors.push(`index still loads legacy/conflicting runtime: ${old}`);
for(const name of ['Unicorn Reading Meadow','Royal Castle Academy','Ice Princess Palace','Mermaid Lagoon','Enchanted Forest Friends','Pixie Art Garden'])has(js,name,`missing world name ${name}`);
for(const token of ['OLD=','rainbowMagicLearningV2','sakhi.v3.state','sakhiMagicLearningV3','migrate','sakhi.backup'])has(js,token,`history preservation missing ${token}`);
for(const token of ['startAdventure','function start(','function complete(','function goNext(','function rewards(','function story('])has(js,token,`journey flow missing ${token}`);
for(const token of ['speechSynthesis.cancel','auto:true','serviceWorker.register'])has(js,token,`reliability feature missing ${token}`);
if((js.match(/id:'[^']+'/g)||[]).length<6)errors.push('too few production activities');
if(!css.includes('.kingdom-card')||!css.includes('.activity-view')||!css.includes('.story-art'))errors.push('CSS missing themed image/activity layout');
if(!sw.includes('sakhi-production.js')||!sw.includes('sakhi-production.css'))errors.push('service worker must cache production files');
if(!manifest.includes('Sakhi Magic Learning'))errors.push('manifest missing app name');
if(errors.length){console.error('Production Sakhi validation failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log('Production Sakhi validation passed: single runtime, themed imagery, daily journey, rewards, bedtime story, PWA update, and legacy history preservation are present.');