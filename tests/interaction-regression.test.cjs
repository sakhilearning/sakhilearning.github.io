const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('sakhi-app.js');
const audio = read('sakhi-audio.js');
if (!/sakhi\.v3\.active-adventure/.test(app) || !/Continue my adventure/.test(app) || !/loadRun\(\)/.test(app)) {
  throw new Error('Active adventures must survive app restarts without requiring cloud sign-in');
}
if (!/prefetchActivity/.test(app) || !/naturalInflight/.test(audio) || !/fetchServerPart/.test(audio)) {
  throw new Error('Kokoro narration must be prefetched and de-duplicated across question pages');
}
const presentation = read('sakhi-presentation.js');
const css = read('sakhi-production.css');

if (!/Adaptive\.pick\(domain,\[\]\)/.test(app) || !/if\(launching\)return;launching=true/.test(app)) {
  throw new Error('Every trail must launch a deterministic adaptive activity and reject duplicate launch taps');
}
if (!/advanceTimer=setTimeout[\s\S]*if\(awaitingNext\)[\s\S]*nextQuestion\(\)/.test(app) || !/function nextQuestion\(\)\{clearAdvance\(\)/.test(app)) {
  throw new Error('Completed answers must advance automatically exactly once');
}
if (!/async function continueAfter\(\)[\s\S]*if\(transitioning\|\|!overlay\.classList\.contains\('show'\)\)return[\s\S]*missionIndex=previousIndex\+1[\s\S]*await loadMission\(\)/.test(app)) {
  throw new Error('Next-adventure transition must be guarded, advance its index, and await the next mission');
}
if (!/if\(activityCompleted\)return;activityCompleted=true/.test(app)) {
  throw new Error('Activity completion must be idempotent so rewards and overlays cannot duplicate');
}
if (!/Audio\.stopAll\(\);narrationRun\+\+;overlay\.classList\.remove\('show'\)/.test(app)) {
  throw new Error('Next-adventure transition must stop narration before changing activities');
}
if (!/playbackEpoch\+\+/.test(audio) || !/if\(!isCurrent\(requestId\)\)return false/.test(audio)) {
  throw new Error('Narration must invalidate stale requests before they can play and echo');
}
if (!/function mediaFor\(domain,skill,template,index\)/.test(presentation) || !/Pres\.scene\(d,p,\{kind:'activity',skill:current\.skill_title/.test(app)) {
  throw new Error('Generated scenes must be selected with activity context');
}
if (!/body\[data-view="activity"\] #activityScene\{display:block/.test(css)) {
  throw new Error('Generated activity scenes must be visible, not hidden as background-only media');
}
if (!/@media \(pointer:coarse\) and \(max-width:1400px\)[\s\S]*\.quest-card\{width:100%[\s\S]*\.activity-actions\{position:sticky/.test(css)) {
  throw new Error('Touch-tablet activity layout must keep the question and Next action inside the viewport');
}
if (!/Audio\.warm\(\)\.catch/.test(app) || /controllerchange|location\.replace/.test(app)) {
  throw new Error('Boot must warm the server voice in the background without reloading the page');
}
if (/NATURAL_IMPORT|KokoroTTS|from_pretrained|tts\.generate/.test(audio)) {
  throw new Error('The learning page must never initialize a browser-side Kokoro model');
}
if (/async function start\(\)[\s\S]{0,180}await ensureVoiceReady/.test(app) || /async function startTrail\(domain\)[\s\S]{0,180}await ensureVoiceReady/.test(app)) {
  throw new Error('Opening an activity must not wait for voice preparation');
}

console.log('Interaction regression passed: background server voice warm-up, instant activity open, tablet-safe controls, guarded transitions, and single-play narration');
