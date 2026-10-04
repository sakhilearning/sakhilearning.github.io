const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const css=fs.readFileSync(path.join(root,'sakhi-layout-guardrails.css'),'utf8');
const build=fs.readFileSync(path.join(root,'scripts/build.cjs'),'utf8');
const failures=[];
function expect(label,cond){if(!cond)failures.push(label);}
expect('instructional media must be max-width constrained',/\.assessment-visual[\s\S]*max-width:100%/.test(css));
expect('question media containers must clip their own overflow',/\.assessment-visual,[\s\S]*overflow:hidden/.test(css));
expect('shape and worksheet images must scale inside their container',/\.shape-wrap img[\s\S]*max-width:100%/.test(css));
expect('answer areas must remain above instructional media',/\.answer-grid[\s\S]*z-index:2/.test(css));
expect('child-facing prompts must wrap rather than overlap',/\.question-prompt[\s\S]*overflow-wrap:anywhere/.test(css));
expect('layout guardrails must be included in the production CSS bundle',build.includes("read('sakhi-layout-guardrails.css')"));
if(failures.length){console.error('layout-safety FAILED:\n- '+failures.join('\n- '));process.exit(1);}
console.log('layout-safety passed: instructional media, prompts and answer layers are constrained by production-wide overlap guardrails.');
