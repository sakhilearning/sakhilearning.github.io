const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),dir=path.join(root,'assets/audio/narration'),manifestPath=path.join(dir,'manifest.json');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8')),required=JSON.parse(fs.readFileSync(path.join(dir,'texts-v5.json'),'utf8')),files={};
for(const text of required){const name=manifest.files[text];if(!name||!fs.existsSync(path.join(dir,name)))throw new Error('Missing narration for: '+text);files[text]=name;}
const keep=new Set(Object.values(files));let removed=0;
for(const name of fs.readdirSync(dir)){if(name.endsWith('.mp3')&&!keep.has(name)){fs.unlinkSync(path.join(dir,name));removed++;}}
manifest.files=files;fs.writeFileSync(manifestPath,JSON.stringify(manifest));
console.log(`Narration pack pruned: ${required.length} prompts kept, ${removed} unused clips removed.`);
