const fs=require('fs');
const path=require('path');
const cp=require('child_process');

const root=path.join(__dirname,'..');
const bundle=path.join(root,'vendor','kokoro-runtime.js');
const allowedBuildOnly=new Set(['sharp','@huggingface/transformers','kokoro-js']);

function fail(message,detail){
  console.error('production-security FAILED: '+message);
  if(detail)console.error(detail);
  process.exit(1);
}

if(!fs.existsSync(bundle))fail('browser Kokoro bundle is missing; cannot prove runtime isolation.');
const browser=fs.readFileSync(bundle,'utf8');
/* `sharp` is a Node/native image-processing dependency used by the transformers
   package tree. Sakhi is deployed as static browser files. If any native sharp/
   libvips implementation ever enters the browser artifact, the exception below
   immediately stops being valid. */
const nativeMarkers=[/require\(["']sharp["']\)/i,/from ["']sharp["']/i,/libvips/i,/sharp\.node/i];
for(const marker of nativeMarkers){if(marker.test(browser))fail('native sharp/libvips code is present in the deployed browser bundle.',String(marker));}

const run=cp.spawnSync(process.platform==='win32'?'npm.cmd':'npm',['audit','--omit=dev','--audit-level=high','--json'],{
  cwd:root,encoding:'utf8',maxBuffer:8*1024*1024
});
let report={};
try{report=JSON.parse(run.stdout||'{}');}catch(e){fail('npm audit did not return parseable JSON.',(run.stdout||run.stderr||'').slice(0,3000));}
const vulnerabilities=report.vulnerabilities||{};
const high=[];
for(const [name,v] of Object.entries(vulnerabilities)){
  if(!v)continue;
  if(v.severity==='high'||v.severity==='critical')high.push({name,severity:v.severity,via:v.via,fixAvailable:v.fixAvailable});
}
const unexpected=high.filter(v=>!allowedBuildOnly.has(v.name));
if(unexpected.length)fail('unexpected high/critical dependency advisories found.',JSON.stringify(unexpected,null,2));
const known=high.filter(v=>allowedBuildOnly.has(v.name));
if(known.length){
  const names=new Set(known.map(v=>v.name));
  if(!names.has('sharp'))fail('the allowed dependency chain changed; review the exception before release.',JSON.stringify(known,null,2));
  console.warn('production-security: npm reports the known sharp/libvips build dependency advisory chain.');
  console.warn('production-security: native sharp/libvips code is absent from the deployed browser bundle; exception is build-time only and remains fail-closed for any new high/critical advisory.');
}
const critical=(report.metadata&&report.metadata.vulnerabilities&&report.metadata.vulnerabilities.critical)||0;
if(critical)fail('critical advisories are never accepted.',String(critical));
console.log(`production-security passed: deployed bundle excludes native sharp/libvips; ${known.length} known build-chain advisory node(s), 0 unexpected high/critical runtime advisories.`);
