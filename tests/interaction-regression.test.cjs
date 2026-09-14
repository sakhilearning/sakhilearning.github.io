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

console.log('Interaction regression passed: guarded next-adventure flow, single-play narration, and visible contextual scenes');
