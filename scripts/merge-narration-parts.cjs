const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),dir=path.join(root,'assets/audio/narration'),manifestPath=path.join(dir,'manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
for(const name of fs.readdirSync(dir).filter(name=>/^manifest-part-\d+\.json$/.test(name)).sort()){
  const part=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
  Object.assign(manifest.files,part.files||{});
  fs.unlinkSync(path.join(dir,name));
}
fs.writeFileSync(manifestPath,JSON.stringify(manifest));
const texts=JSON.parse(fs.readFileSync(path.join(dir,'texts-v5.json'),'utf8'));
const missing=texts.filter(text=>!manifest.files[text]||!fs.existsSync(path.join(dir,manifest.files[text])));
if(missing.length)throw new Error(`${missing.length} narration mappings are still missing`);
console.log(`Narration manifests merged: ${Object.keys(manifest.files).length} mappings, ${texts.length} required prompts covered.`);
