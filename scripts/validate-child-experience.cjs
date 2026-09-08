const fs=require('fs');
const violations=[];
const kid=fs.readFileSync('kid-upgrade.js','utf8');
const visuals=fs.readFileSync('visuals.js','utf8');
const speech=fs.readFileSync('speech-service.js','utf8');
const interaction=fs.readFileSync('interaction-engine.js','utf8');

if(/assets\/hq\//.test(kid))violations.push('kid-upgrade.js still references missing assets/hq images');
if(/<img[^>]+src=/.test(kid))violations.push('kid-upgrade.js must use the canonical SakhiVisuals renderer, not ad-hoc image tags');
if(!kid.includes('window.SakhiVisuals'))violations.push('kid-upgrade.js must use SakhiVisuals');
if(!visuals.includes('window.SakhiVisuals={sceneMarkup,sceneKey'))violations.push('visuals.js must expose the canonical scene renderer');
if(!speech.includes('normalizeNarration'))violations.push('SpeechService must normalize child-facing narration');
if(!kid.includes("first.hint_2='Moon begins with the /m/ sound.'"))violations.push('Beginning-sound hint copy regression');
if(!interaction.includes("title:'Luna’s Sound Clouds'"))violations.push('Expected reading activity missing');

if(violations.length){console.error('Child experience validation failed:\n- '+violations.join('\n- '));process.exit(1);}
console.log('Child experience valid: no broken HQ image dependency and child audio copy is normalized.');
