const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const dist=path.join(root,'dist');
const buildId='3.0.0-rc3';
const moduleOrder=[
  'supabase-config.js',
  'sakhi-cloud.js',
  'sakhi-curriculum.js',
  'sakhi-trails.js',
  'sakhi-presentation.js',
  'sakhi-content.js',
  'sakhi-activities.js',
  'sakhi-progress.js',
  'sakhi-adaptive.js',
  'sakhi-plan.js',
  'sakhi-audio.js',
  'sakhi-templates.js',
  'sakhi-app.js'
];
function read(f,enc='utf8'){return fs.readFileSync(path.join(root,f),enc);}
function flattenLayers(css){
  let out='',i=0;
  while(i<css.length){
    if(css.startsWith('@layer ',i)){
      const brace=css.indexOf('{',i),semi=css.indexOf(';',i);
      if(semi!==-1&&(brace===-1||semi<brace)){i=semi+1;continue;}
      if(brace===-1)throw new Error('Malformed @layer block');
      let depth=1,j=brace+1;
      while(j<css.length&&depth){if(css[j]==='{')depth++;else if(css[j]==='}')depth--;j++;}
      if(depth)throw new Error('Unclosed @layer block');
      out+='\n'+css.slice(brace+1,j-1)+'\n';i=j;continue;
    }
    out+=css[i++];
  }
  return out.trim()+'\n';
}
function dataUri(file,mime){return `data:${mime};base64,${read(file,null).toString('base64')}`;}
const curriculum=JSON.parse(read('data/curriculum-v3.json'));
const sixMonth=JSON.parse(read('data/six-month-plan.json'));
let phonemes={required:[],verified:[]};
try{phonemes=JSON.parse(read('assets/audio/phonemes/manifest.json'));}catch(e){}
const runtimeData=[
  `window.SAKHI_BUILD_ID=${JSON.stringify(buildId)};`,
  `window.SAKHI_CURRICULUM_DATA=${JSON.stringify(curriculum)};`,
  `window.SAKHI_SIX_MONTH_PLAN=${JSON.stringify(sixMonth)};`,
  `window.SAKHI_PHONEME_MANIFEST=${JSON.stringify(phonemes)};`,
  `window.SAKHI_ICON_DATA=${JSON.stringify(dataUri('icon-192.png','image/png'))};`
].join('\n');
const runtimeJs=moduleOrder.map(f=>`\n/* ===== ${f} ===== */\n${read(f)}\n`).join('');
const flatCss=flattenLayers(read('sakhi-production.css'));
let html=read('index.template.html')
  .replace('/*__SAKHI_CSS__*/',flatCss)
  .replaceAll('/*__SAKHI_ICON_DATA__*/',dataUri('icon-192.png','image/png'))
  .replace('/*__SAKHI_RUNTIME_DATA__*/',runtimeData)
  .replace('/*__SAKHI_RUNTIME_JS__*/',runtimeJs);
fs.writeFileSync(path.join(root,'index.html'),html);
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
fs.writeFileSync(path.join(dist,'index.html'),html);
for(const f of ['manifest.json','sw.js','icon-180.png','icon-192.png','icon-512.png'])fs.copyFileSync(path.join(root,f),path.join(dist,f));
for(const dir of ['data','assets']){if(fs.existsSync(path.join(root,dir)))fs.cpSync(path.join(root,dir),path.join(dist,dir),{recursive:true});}
fs.writeFileSync(path.join(dist,'BUILD.txt'),`Sakhi Learning Trails ${buildId}\nSelf-contained runtime: index.html\n`);
console.log(`Built self-contained ${buildId}: index.html + dist/`);
console.log(`  runtime modules: ${moduleOrder.length}`);
console.log(`  curriculum skills: ${curriculum.skills.length}`);
console.log(`  deployment CSS bytes: ${Buffer.byteLength(flatCss)}`);
console.log(`  deployment HTML bytes: ${Buffer.byteLength(html)}`);
