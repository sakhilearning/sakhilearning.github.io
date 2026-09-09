const fs=require('fs');
const files={
 contract:fs.readFileSync('activity-contract.js','utf8'),
 engine:fs.readFileSync('interaction-engine.js','utf8'),
 progress:fs.readFileSync('progress-service.js','utf8'),
 reward:fs.readFileSync('reward-service.js','utf8'),
 persistence:fs.readFileSync('persistence.js','utf8'),
 css:fs.readFileSync('runtime-stability.css','utf8'),
 speech:fs.readFileSync('speech-service.js','utf8')
};
const fail=[];
for(const field of ['activity_id','session_id','domain','skill_id','difficulty','interaction_type','learning_objective','instruction_text','spoken_instruction','character_prompt','items','targets','correct_answer','distractors','hint_1','hint_2','hint_3','success_feedback','retry_feedback','mastery_signal','estimated_minutes','visual_assets','audio_assets','reward_rules','completion_rules'])if(!files.contract.includes(`'${field}'`))fail.push(`contract missing ${field}`);
for(const type of ['tap_choice','multi_select','drag_drop','sort','match','memory','sequence','word_builder','number_manipulative','pattern_builder','find_it','trace','story_choice','movement','offline_activity','creative_activity'])if(!files.engine.includes(`${type}:`))fail.push(`renderer registry missing ${type}`);
for(const state of ['LOADING','READY','IN_PROGRESS','HINTED','COMPLETED','SAVING','SAVED','ERROR'])if(!files.contract.includes(`'${state}'`))fail.push(`state machine missing ${state}`);
for(const event of ['ACTIVITY_SCHEMA_INVALID','ACTIVITY_RENDER_ZERO_SIZE','ACTIVITY_RENDER_FAILED','ACTIVITY_COMPLETED','ATTEMPT_SAVE_STARTED','ATTEMPT_SAVE_SUCCESS','ATTEMPT_SAVE_FAILED','MASTERY_UPDATED','REWARD_CREATED','REWARD_SAVE_FAILED'])if(!(files.engine+files.progress+files.reward+files.contract).includes(event))fail.push(`runtime log missing ${event}`);
if(/function\s+makeQuest\s*\(/.test(files.engine))fail.push('interaction engine still owns lesson planning');
if(/data\.shinyStars\s*\+\+/.test(files.engine))fail.push('renderer directly increments reward balance');
if(!files.progress.includes('saveAttempt')||!files.progress.includes('completeSession'))fail.push('ProgressService completion API incomplete');
if(!files.reward.includes('idempotency_key')||!files.reward.includes('recordForActivity'))fail.push('RewardService idempotency incomplete');
if(!files.persistence.includes("from('reward_transactions')")||!files.persistence.includes('completeSession'))fail.push('backend reward/session persistence missing');
if(!files.engine.includes('traceMetrics')||!files.engine.includes('completion_threshold')||!files.engine.includes('minimum_stroke_points'))fail.push('TraceCanvas uses weak touch-count completion');
if(!files.css.includes('#interactionMount')||!files.css.includes('min-height:240px')||!files.css.includes('--z-activity'))fail.push('activity visibility/layer contract missing');
if(/browserSpeak\(clean/.test(files.speech)&&/speakPhoneme[\s\S]{0,500}browserSpeak/.test(files.speech))fail.push('phoneme path falls back to browser speech');
if(fail.length){console.error('Runtime stability validation failed:\n- '+fail.join('\n- '));process.exit(1)}
console.log('Runtime stability validation passed: one activity contract, one renderer registry, save-before-reward flow, idempotent rewards, real trace threshold and visible interaction shell.');
