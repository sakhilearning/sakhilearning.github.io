const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const failures=[];
const check=(label,cond)=>{if(!cond)failures.push(label);};
const src=fs.readFileSync(path.join(root,'sakhi-library-art.js'),'utf8');
const build=fs.readFileSync(path.join(root,'scripts/build.cjs'),'utf8');
const asset=path.join(root,'assets/theme-media/library/phonics-sound-cards.webp');
check('generated phonics sprite exists',fs.existsSync(asset));
if(fs.existsSync(asset))check('sprite is a real image asset',fs.statSync(asset).size>100000);
check('adapter is loaded after schoolwork',build.indexOf("'sakhi-library-art.js'")>build.indexOf("'sakhi-schoolwork.js'"));
check('M generated cards are mapped',/m:\[\['moon'/.test(src)&&src.includes("['map'")&&src.includes("['mug'"));
check('S generated cards are mapped',/s:\[\['sun'/.test(src)&&src.includes("['sock'")&&src.includes("['star'"));
check('P generated cards are mapped',/p:\[\['pig'/.test(src)&&src.includes("['pan'")&&src.includes("['pen'"));
check('C is intentionally not mapped to the source /k/ cards',!/\bc:\s*\[/.test(src));
check('adapter limits itself to letter worksheet cues',src.includes("q.sheet.kind!=='letter'"));
check('adapter preserves the original renderer result',/var result=original\.call\(T,root,q,ctx\)/.test(src)&&/return result;/.test(src));
if(failures.length){console.error('library-phonics-art FAILED:\n- '+failures.join('\n- '));process.exit(1);}
console.log('library-phonics-art passed: generated M/S/P art is instructional, scoped, and semantically aligned.');
