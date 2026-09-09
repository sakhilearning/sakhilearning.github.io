const fs=require('fs');
const errors=[];
const read=f=>fs.existsSync(f)?fs.readFileSync(f,'utf8'):'';
const bank=read('challenge-bank.js');
const foundation=read('foundation-verification-bank.js');
const adaptive=read('adaptive-acceleration-service.js');
const parent=read('adaptive-engine.js');
const persistence=read('persistence.js');
const index=read('index.html');
const sw=read('sw.js');
const adds=(bank.match(/add\(\{/g)||[]).length;
const verifies=(foundation.match(/id:'verify-/g)||[]).length;
if(adds<20)errors.push(`challenge bank too small: ${adds}`);
if(verifies<4)errors.push(`foundational verification bank too small: ${verifies}`);
for(const token of ["phase:'mixed'","phase:'challenge'","phase:'transfer'","difficulty:5","skill_id:'reading.cvc_decode.mixed'","skill_id:'math.number_bonds'","skill_id:'logic.coding_sequences'"])if(!bank.includes(token))errors.push(`challenge bank missing ${token}`);
for(const token of ["skill_id:'reading.letter_sounds'","skill_id:'reading.short_vowels'","skill_id:'reading.beginning_sounds'"])if(!foundation.includes(token))errors.push(`foundation verification missing ${token}`);
for(const token of ['guessing','fluent','strongNow','challengeMisses','compressedSkills','replanAfterSave','extend_session','TARGET_MINUTES=20','learningVelocity','nextReadySkills','recentContent'])if(!adaptive.includes(token))errors.push(`adaptive engine missing ${token}`);
if(!adaptive.includes("mode=m.guessing?'verify'"))errors.push('fast inaccurate behavior must not advance; verify mode missing');
if(!adaptive.includes('m.challengeMisses>=2'))errors.push('two-challenge-miss scaffold rule missing');
if(!adaptive.includes('p.compressedSkills[skillId]'))errors.push('compressed review evidence missing');
if(!adaptive.includes("window.addEventListener('sakhi-runtime-event'"))errors.push('within-session replanning hook missing');
for(const token of ['Current challenge:','Ready next:','Stretch:','Compressed review'])if(!parent.includes(token))errors.push(`parent readiness UI missing ${token}`);
for(const token of ['adaptive_state','domain_levels','learning_velocity','challenge_mode','independent_success','completion_quality'])if(!persistence.includes(token))errors.push(`persistence missing ${token}`);
for(const file of ['challenge-bank.js','foundation-verification-bank.js','adaptive-acceleration-service.js']){if(!index.includes(file))errors.push(`index missing ${file}`);if(!sw.includes(file))errors.push(`service worker missing ${file}`);}
const indexOrder=['interaction-engine.js','challenge-bank.js','foundation-verification-bank.js','adaptive-acceleration-service.js','ui-hooks.js'];let last=-1;for(const file of indexOrder){const at=index.indexOf(file);if(at<last)errors.push(`adaptive script order invalid around ${file}`);last=at;}
if(/gifted|genius|elite/i.test(bank+foundation+adaptive+parent))errors.push('child intelligence/ranking labels are forbidden');
if(errors.length){console.error('Adaptive acceleration validation failed:\n- '+errors.join('\n- '));process.exit(1)}
console.log(`Adaptive acceleration valid: ${verifies} compressed verification activities + ${adds} vetted higher-demand activities, within-session progression, guessing protection, challenge fallback, domain-specific readiness, and persistent adaptive state.`);