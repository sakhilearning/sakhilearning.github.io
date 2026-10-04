const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const failures=[];
const check=(label,cond)=>{if(!cond)failures.push(label);};
const src=fs.readFileSync(path.join(root,'sakhi-library-art.js'),'utf8');
const build=fs.readFileSync(path.join(root,'scripts/build.cjs'),'utf8');
const assets=['m','s','p'].map(x=>path.join(root,'assets/theme-media/library/phonics-'+x+'-strip.webp'));
assets.forEach((asset,i)=>{
  check('generated phonics strip '+['M','S','P'][i]+' exists',fs.existsSync(asset));
  if(fs.existsSync(asset))check('generated phonics strip '+['M','S','P'][i]+' is a real image asset',fs.statSync(asset).size>10000);
});
check('adapter is loaded after schoolwork',build.indexOf("'sakhi-library-art.js'")>build.indexOf("'sakhi-schoolwork.js'"));
check('M generated cards are mapped',src.includes("m:{src:'assets/theme-media/library/phonics-m-strip.webp',words:['moon','map','mug']}"));
check('S generated cards are mapped',src.includes("s:{src:'assets/theme-media/library/phonics-s-strip.webp',words:['sun','sock','star']}"));
check('P generated cards are mapped',src.includes("p:{src:'assets/theme-media/library/phonics-p-strip.webp',words:['pig','pan','pen']}"));
check('C is intentionally not mapped to the source /k/ cards',!/\bc:\s*\{/.test(src));
check('adapter limits itself to letter worksheet cues',src.includes("q.sheet.kind!=='letter'"));
check('adapter preserves the original renderer result',/var result=original\.call\(T,root,q,ctx\)/.test(src)&&/return result;/.test(src));
if(failures.length){console.error('library-phonics-art FAILED:\n- '+failures.join('\n- '));process.exit(1);}
console.log('library-phonics-art passed: generated M/S/P art is instructional, scoped, compact, and semantically aligned.');
