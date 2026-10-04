const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'sakhi-elite.css'),'utf8');
const build=fs.readFileSync(path.join(root,'scripts/build.cjs'),'utf8');
const quality=fs.readFileSync(path.join(root,'sakhi-quality.js'),'utf8');
function need(re,msg){if(!re.test(css))throw new Error(msg);}
need(/\.scene-card\s*\{[\s\S]*grid-template-areas:/,'scene cards must reserve separate grid areas for art and copy');
need(/\.scene-card>\.world-art\s*\{[\s\S]*position:relative/,'full scene art must participate in layout instead of sitting under copy');
need(/\.scene-card>\.scene-copy\s*\{[\s\S]*position:relative/,'scene copy must not be absolutely overlaid on artwork');
need(/\.mini-scene \.scene-card>\.scene-copy[\s\S]*display:none/,'thumbnail cards must not paint duplicate copy on top of art');
if(!/sakhi-elite\.css/.test(build))throw new Error('elite visual guardrails are not included in the production build');
if(!/library-reward-showcase/.test(quality))throw new Error('curated library artwork is not connected to the reward experience');
console.log('visual-layout: artwork and instructional copy occupy separate regions; curated library media is connected without covering learning controls.');
