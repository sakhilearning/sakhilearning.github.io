const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const build=fs.readFileSync(path.join(root,'scripts/build.cjs'),'utf8');
const source=fs.readFileSync(path.join(root,'sakhi-app.js'),'utf8');
const dist=fs.existsSync(path.join(root,'dist/index.html'))?fs.readFileSync(path.join(root,'dist/index.html'),'utf8'):'';
const sourceMarker="advanceTimer=setTimeout(function(){advanceTimer=null;if(awaitingNext){awaitingNext=false;Promise.resolve(nextQuestionReady).catch(function(){return false;}).then(nextQuestion);}},950);";
const builtMarker="advanceTimer=setTimeout(function(){advanceTimer=null;if(awaitingNext){awaitingNext=false;Promise.resolve(nextQuestionReady).catch(function(){return false;}).then(nextQuestion);}},window.SAKHI_FEEDBACK_DWELL_MS||1650);";
if(!/const FEEDBACK_DWELL_MS=1650;/.test(build))throw new Error('Production feedback dwell must remain explicitly configured at 1650ms or be intentionally reviewed.');
if(!source.includes(sourceMarker))throw new Error('Controller timing marker changed; review pacing and update the build contract intentionally.');
if(dist){
  if(!dist.includes('window.SAKHI_FEEDBACK_DWELL_MS=1650;'))throw new Error('Built app is missing the calm feedback dwell configuration.');
  if(!dist.includes(builtMarker))throw new Error('Built controller does not use the configured feedback dwell.');
}
console.log('feedback-pacing: correct-answer feedback remains visible for at least 1.65 seconds before automatic progression.');
