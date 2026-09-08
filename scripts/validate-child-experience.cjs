const fs=require('fs');
const violations=[];
const read=f=>fs.readFileSync(f,'utf8');
const kid=read('kid-upgrade.js'),visuals=read('visuals.js'),assets=read('asset-service.js'),speech=read('speech-service.js'),interaction=read('interaction-engine.js'),shell=read('sakhi-shell.js');
if(/assets\/hq\//.test(kid+visuals+assets))violations.push('child visuals reference missing assets/hq paths');
if(/<img[^>]+src=/.test(kid))violations.push('kid-upgrade.js must not create ad-hoc activity image tags');
if(!kid.includes('window.AssetService')&&!kid.includes('AssetService'))violations.push('kid experience must use AssetService for activity asset preload');
if(!visuals.includes('window.AssetService'))violations.push('visuals.js must consume AssetService');
if(!assets.includes('window.AssetService=service'))violations.push('AssetService source missing');
if(!speech.includes('normalizeNarration'))violations.push('SpeechService must normalize child-facing narration');
if(!interaction.includes("hint_2:'Moon begins with the /m/ sound.'"))violations.push('Beginning-sound hint must be fixed in canonical activity data');
if(/Mmmmoon/.test(interaction+kid))violations.push('legacy Mmmmoon copy returned');
if(!shell.includes("START TODAY'S ADVENTURE"))violations.push('child home must expose START TODAY\'S ADVENTURE');
for(const label of ['Story Castle','Number Kingdom','Puzzle Palace','Discovery World','Create & Play'])if(!shell.includes(label))violations.push(`child home missing ${label}`);
if(violations.length){console.error('Child experience validation failed:\n- '+violations.join('\n- '));process.exit(1)}
console.log('Child experience valid: canonical assets, corrected phonics copy, simple adventure home and no missing HQ references.');
