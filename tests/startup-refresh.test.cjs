const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const template=fs.readFileSync(path.join(root,'index.template.html'),'utf8');
const app=fs.readFileSync(path.join(root,'sakhi-app.js'),'utf8');

if(/setTimeout\s*\(\s*function\s*\(\)\s*\{[\s\S]{0,500}bootFallback[\s\S]{0,500}\}\s*,\s*\d+\s*\)/.test(template)){
  throw new Error('Startup must not show the refresh dialog from a timer; slow iPad/cloud startup is not an error.');
}
if(!template.includes('id="bootFallback"'))throw new Error('A real startup error fallback is still required.');
if(!app.includes('function bootFailure(e)')||!app.includes("box.hidden=false")){
  throw new Error('Actual startup exceptions must still surface the fallback.');
}
if(!template.includes('window.__SAKHI_BOOTED=false'))throw new Error('Boot state marker is missing.');

console.log('Startup refresh regression passed: slow launches cannot trigger a false refresh dialog, while real boot failures remain visible.');
