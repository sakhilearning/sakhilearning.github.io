const fs=require('fs'),path=require('path');
const version=require('../package.json').version;
const root=path.join(__dirname,'..'),dist=path.join(root,'dist');
function read(f){return fs.readFileSync(path.join(dist,f),'utf8');}
if(!fs.existsSync(path.join(dist,'index.html')))throw new Error('dist/index.html missing');
const html=read('index.html');
if(/<script\s+[^>]*src=/i.test(html))throw new Error('Deployment HTML still depends on external runtime JS');
if(/<link\s+[^>]*rel=["']stylesheet["']/i.test(html))throw new Error('Deployment HTML still depends on external CSS');
if(!/window\.SAKHI_CURRICULUM_DATA=/.test(html))throw new Error('Embedded curriculum fallback missing');
if(!/window\.SAKHI_SIX_MONTH_PLAN=/.test(html))throw new Error('Embedded six-month plan missing');
if(!/window\.SAKHI_NARRATION_MANIFEST=/.test(html))throw new Error('Embedded narration index missing');
if(!/window\.SakhiApp=/.test(html))throw new Error('App runtime not embedded');
if(!/\.today-card\{/.test(html))throw new Error('Compiled CSS not embedded');
if(/@layer\s/.test(html))throw new Error('Deployment CSS still contains @layer and may fail on older browsers');
if(!html.includes(version))throw new Error(`${version} build marker missing`);
if(html.includes('/*__SAKHI_'))throw new Error('Unresolved build placeholder in deployment HTML');
/* Parse what actually ships. 4.7.0 deployed a bundle whose inlined runtime hit
   a SyntaxError on load, so not one line of the app ran -- and every check here
   still passed, because they grep the HTML. The build had spliced the template's
   own tail (including a </script>) into the middle of the runtime, which closed
   the script early and left the remaining modules sitting in the page as inert
   text, where `window.SakhiApp=` still matched. Grepping cannot tell running
   code from text; parsing can. */
const vm=require('vm');
const inlineScripts=[...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
if(!inlineScripts.length)throw new Error('Deployment HTML has no inline runtime script');
inlineScripts.forEach((code,i)=>{
  try{new vm.Script(code,{filename:`dist/index.html inline script ${i+1}`});}
  catch(e){throw new Error(`Inline script ${i+1} of ${inlineScripts.length} does not parse: ${e.message}`);}
});
/* A premature </script> shows up as extra blocks, so the count is itself a
   signal that something was spliced into the runtime. */
if(inlineScripts.length>2)throw new Error(`Deployment HTML has ${inlineScripts.length} inline scripts; the runtime should be at most two (boot data + modules)`);
if(!/\/\* ===== sakhi-app\.js ===== \*\//.test(inlineScripts[inlineScripts.length-1]))throw new Error('The last module is not inside the runtime script — the bundle was cut short');
if(!/class=\"world-art\"/.test(html)||!/mission-story/.test(html))throw new Error('Immersive world presentation missing from deployment');
if(!/af_heart/.test(html)||!/NATURAL_SPEED=\.86/.test(html)||!/describeQuestion/.test(html)||!/startKeepAlive/.test(html)||!/prepare:loadNaturalVoice/.test(html)||!/playWithHtmlAudio/.test(html)||!/voicePrepare/.test(html))throw new Error('Detailed non-blocking Kokoro readiness gate missing from deployment');
if(!/loadNarrationManifest/.test(html)||!/fetchLocalPart/.test(html)||!/naturalMode:'kokoro-local-first'/.test(html)||!/if\(APPLE_MOBILE\)throw new Error\('This line is not in the instant iPad narration pack\.'/ .test(html)||/NATURAL_IMPORT|KokoroTTS|from_pretrained|tts\.generate/.test(html))throw new Error('Bundled iPad-first Kokoro path is missing or browser model loading remains');
if(/speechSynthesis|SpeechSynthesisUtterance|naturalMode:APPLE_MOBILE\?'apple-system'/.test(html))throw new Error('Robotic browser speech remains in deployment');
if(/SakhiCloud\.speak\(/.test(html))throw new Error('Deployment narration still depends on the exhausted paid provider');
for(const f of ['manifest.json','sw.js','icon-180.png','icon-192.png','icon-512.png','vendor/kokoro-runtime.js'])if(!fs.existsSync(path.join(dist,f)))throw new Error('Missing deploy file '+f);
const vendor=read('vendor/kokoro-runtime.js');if(!/numThreads=1/.test(vendor)||!/proxy=!1/.test(vendor))throw new Error('Built Kokoro runtime is not single-threaded for iPad');
const days=JSON.parse(fs.readFileSync(path.join(dist,'data/six-month-plan.json'),'utf8')).weeks.reduce((n,w)=>n+w.days.length,0);
if(days!==130)throw new Error('Deployed six-month plan is incomplete');
console.log('Deployment validation passed:');
console.log(' - self-contained CSS + runtime JS');
console.log(' - embedded curriculum + six-month plan fallbacks');
console.log(' - no CSS @layer dependency in shipped HTML');
console.log(' - 130 learning days present');
const narration=JSON.parse(fs.readFileSync(path.join(dist,'assets/audio/narration/manifest.json'),'utf8'));
const narrationRequired=JSON.parse(fs.readFileSync(path.join(dist,'assets/audio/narration/texts-v5.json'),'utf8'));
if(narrationRequired.some(text=>!narration.files[text]||!fs.existsSync(path.join(dist,'assets/audio/narration',narration.files[text]))))throw new Error('Bundled narration pack is incomplete');
console.log(` - ${version} localhost-safe email confirmation, instant local narration, adaptive trails, and exact synced resume embedded`);
