const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const failures=[];
const check=(label,ok)=>{if(!ok)failures.push(label);};

/* Marking is curriculum-driven and must never make voice practice mandatory for
   unrelated academic questions. */
global.window={};
const kindById={'reading.fluency':'fluency','language.retell':'retell','math.addition_10':'add','writing.uppercase':'trace_letter'};
window.SakhiCurriculum={skill:id=>({skill_id:id,kind:kindById[id]||'choice'})};
window.SakhiActivities={generate:id=>({skill_id:id,questions:[{template:id==='writing.uppercase'?'trace':'choice',prompt:'Practice',answer:'done'}]})};
require(path.join(root,'sakhi-normalize.js'));
check('oral fluency should opt into voice practice',window.SakhiActivities.generate('reading.fluency').questions[0].voice_practice===true);
check('retell should opt into voice practice',window.SakhiActivities.generate('language.retell').questions[0].voice_practice===true);
check('math should not opt into microphone practice',!window.SakhiActivities.generate('math.addition_10').questions[0].voice_practice);
check('tracing should not request microphone practice',!window.SakhiActivities.generate('writing.uppercase').questions[0].voice_practice);

const voice=fs.readFileSync(path.join(root,'sakhi-voice-practice.js'),'utf8');
const css=fs.readFileSync(path.join(root,'sakhi-voice-practice.css'),'utf8');
const build=fs.readFileSync(path.join(root,'scripts/build.cjs'),'utf8');
check('recordings must not be uploaded',!/(?:fetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|SakhiCloud|enqueue\s*\()/i.test(voice));
check('recordings must not be persisted',!/(?:localStorage|sessionStorage|indexedDB)/i.test(voice));
check('recordings must never change learner scoring',!/(?:SakhiProgress|completeActivity|recordQuestion|mastery)/.test(voice));
check('microphone tracks are explicitly stopped',/getTracks[\s\S]*\.stop\s*\(/.test(voice));
check('temporary audio URLs are explicitly revoked',/revokeObjectURL/.test(voice));
check('recordings auto-stop to bound microphone exposure',/30000/.test(voice));
check('recorder uses one click state machine, not competing onclick handlers',!(/record\.onclick/.test(voice))&&/record\.addEventListener\('click'/.test(voice));
check('voice practice explains that it is optional',/Optional practice/.test(voice));
check('voice practice states it never changes score',/never changes your score/.test(voice));
check('buttons meet coarse-pointer target floor',/min-height:44px/.test(css));
check('mobile controls collapse safely',/@media\(max-width:520px\)/.test(css));
const templateAt=build.indexOf("'sakhi-templates.js'");
const voiceAt=build.indexOf("'sakhi-voice-practice.js'");
check('voice wrapper is bundled after templates',templateAt>=0&&voiceAt>templateAt);
check('voice CSS is bundled into production',build.includes("read('sakhi-voice-practice.css')"));

if(failures.length){console.error('oral-practice FAILED:\n- '+failures.join('\n- '));process.exit(1);}
console.log('oral-practice passed: oral skills opt in; microphone practice is optional, ephemeral, score-independent, track-safe and layout-safe.');
