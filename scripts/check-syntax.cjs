const fs=require('fs'),cp=require('child_process'),path=require('path');
const root=path.join(__dirname,'..');
const files=fs.readdirSync(root).filter(f=>/^sakhi-.*\.js$/.test(f)||f==='supabase-config.js'||f==='sw.js');
for(const f of files)cp.execFileSync(process.execPath,['--check',path.join(root,f)],{stdio:'pipe'});
console.log(`Syntax check passed: ${files.length} JavaScript files`);
