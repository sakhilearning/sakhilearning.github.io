const fs=require('fs');
const path=require('path');
let esbuild=null;try{esbuild=require('esbuild');}catch(e){}
const root=path.join(__dirname,'..');
const dist=path.join(root,'dist');
/* package.json is the one place the version is written. Everything else --
   the build marker, the ?v= asset stamps, the service worker cache name and the
   worker registration URL -- carries __SAKHI_VERSION__ and is stamped here. The
   version used to be hand-maintained in nine files, and a bump missed the
   worker registration URL, which left a stale worker serving the old build. */
const buildId=require(path.join(root,'package.json')).version;
const stamp=text=>text.split('__SAKHI_VERSION__').join(buildId);
const moduleOrder=[
  'supabase-config.js',
  'sakhi-cloud.js',
  'sakhi-curriculum.js',
  'sakhi-trails.js',
  'sakhi-presentation.js',
  'sakhi-content.js',
  'sakhi-activities.js',
  'sakhi-quality.js',
  'sakhi-progress.js',
  'sakhi-adaptive.js',
  'sakhi-plan.js',
  'sakhi-audio.js',
  'sakhi-templates.js',
  'sakhi-schoolwork.js',
  'sakhi-wrapups.js',
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
const vendor=path.join(root,'vendor');
fs.mkdirSync(vendor,{recursive:true});
if(esbuild){
  esbuild.buildSync({
    entryPoints:[path.join(root,'scripts/kokoro-browser-entry.js')],
    outfile:path.join(vendor,'kokoro-runtime.js'),
    bundle:true,
    format:'esm',
    platform:'browser',
    target:['safari16.4'],
    mainFields:['browser','module','main'],
    conditions:['browser','import','default'],
    minify:true,
    legalComments:'none',
    define:{'process.env.NODE_ENV':'"production"'}
  });
}else{
  const existing=path.join(vendor,'kokoro-runtime.js');
  if(!fs.existsSync(existing)||fs.statSync(existing).size<1000000)throw new Error('esbuild is unavailable and the verified Kokoro browser bundle is missing');
  console.warn('esbuild unavailable; preserving the checked-in verified Kokoro browser bundle');
}
const curriculum=JSON.parse(read('data/curriculum-v3.json'));
const sixMonth=JSON.parse(read('data/six-month-plan.json'));
let phonemes={required:[],verified:[]};
try{phonemes=JSON.parse(read('assets/audio/phonemes/manifest.json'));}catch(e){}
const narrationManifest=JSON.parse(read('assets/audio/narration/manifest.json'));
const runtimeData=[
  `window.SAKHI_BUILD_ID=${JSON.stringify(buildId)};`,
  `window.SAKHI_CURRICULUM_DATA=${JSON.stringify(curriculum)};`,
  `window.SAKHI_SIX_MONTH_PLAN=${JSON.stringify(sixMonth)};`,
  `window.SAKHI_PHONEME_MANIFEST=${JSON.stringify(phonemes)};`,
  `window.SAKHI_NARRATION_MANIFEST=${JSON.stringify(narrationManifest)};`,
  `window.SAKHI_ICON_DATA=${JSON.stringify(dataUri('icon-192.png','image/png'))};`
].join('\n');
const runtimeJs=moduleOrder.map(f=>`\n/* ===== ${f} ===== */\n${read(f)}\n`).join('');
const flatCss=flattenLayers(read('sakhi-production.css'))+'\n'+read('sakhi-schoolwork.css');
/* Every substitution uses a replacer FUNCTION, never a replacement string.
   String.replace treats $&, $`, $' and $n in a replacement string as special
   patterns: sakhi-schoolwork.js contains the regex anchor '$' -- the characters
   $ and ' -- so inlining it with a string replacement silently swapped $' for
   "everything after the match" and threw away the rest of the bundle, including
   all of sakhi-app.js. The page then shipped a SyntaxError and nothing ran.
   A function replacer disables that interpretation entirely. */
const inject=value=>()=>value;
let html=read('index.template.html')
  .replace('/*__SAKHI_CSS__*/',inject(flatCss))
  .replaceAll('/*__SAKHI_ICON_DATA__*/',inject(dataUri('icon-192.png','image/png')))
  .replace('/*__SAKHI_RUNTIME_DATA__*/',inject(runtimeData))
  .replace('/*__SAKHI_RUNTIME_JS__*/',inject(runtimeJs));
/* after the modules are inlined, so the worker registration URL inside
   sakhi-app.js is stamped too */
html=stamp(html);
fs.writeFileSync(path.join(root,'index.html'),html);
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
fs.writeFileSync(path.join(dist,'index.html'),html);
/* sw.js and manifest.json are generated from templates for the same reason
   index.html is: they carry the version. */
for(const [template,output] of [['sw.template.js','sw.js'],['manifest.template.json','manifest.json']]){
  const stamped=stamp(read(template));
  fs.writeFileSync(path.join(root,output),stamped);
  fs.writeFileSync(path.join(dist,output),stamped);
}
for(const f of ['icon-180.png','icon-192.png','icon-512.png'])fs.copyFileSync(path.join(root,f),path.join(dist,f));
for(const dir of ['data','assets','vendor']){if(fs.existsSync(path.join(root,dir)))fs.cpSync(path.join(root,dir),path.join(dist,dir),{recursive:true});}
fs.writeFileSync(path.join(dist,'BUILD.txt'),`Sakhi Learning Trails ${buildId}\nSelf-contained runtime: index.html\n`);
console.log(`Built self-contained ${buildId}: index.html + dist/`);
console.log(`  runtime modules: ${moduleOrder.length}`);
console.log(`  curriculum skills: ${curriculum.skills.length}`);
console.log(`  deployment CSS bytes: ${Buffer.byteLength(flatCss)}`);
console.log(`  deployment HTML bytes: ${Buffer.byteLength(html)}`);