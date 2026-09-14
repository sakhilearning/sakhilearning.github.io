const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const app = read('sakhi-app.js');
const audio = read('sakhi-audio.js');
const presentation = read('sakhi-presentation.js');
const css = read('sakhi-production.css');

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
if (/Audio\.warm\(\)/.test(app) || /controllerchange|location\.replace/.test(app)) {
  throw new Error('Boot must not preload the voice model or reload the page during service-worker activation');
}
if (/async function start\(\)[\s\S]{0,180}await ensureVoiceReady/.test(app) || /async function startTrail\(domain\)[\s\S]{0,180}await ensureVoiceReady/.test(app)) {
  throw new Error('Opening an activity must not wait for voice preparation');
}

console.log('Interaction regression passed: instant activity open, tablet-safe controls, guarded transitions, and single-play narration');
