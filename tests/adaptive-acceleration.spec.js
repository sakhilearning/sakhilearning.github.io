const {test,expect}=require('@playwright/test');

async function ready(page){
  await page.goto('/');
  await page.waitForFunction(()=>window.AdaptiveAccelerationService&&window.SakhiChallengeBank&&window.SakhiFoundationVerificationBank&&Array.isArray(window.activities)&&window.activities.length>30);
  await page.evaluate(()=>{if(window.SpeechService){window.SpeechService.speakInstruction=async()=>true;window.SpeechService.speakFeedback=async()=>true;}});
}
function attempt({id,activity,skill,domain='reading',type='tap_choice',score=1,hints=0,tries=1,seconds=8,independent=true,day='2026-09-09'}){
  return {attempt_id:id,completion_instance:id,activity_id:activity,skill_id:skill,domain,interaction_type:type,score,hint_level:hints,attempts:tries,elapsed_seconds:seconds,independent_success:independent,save_status:'SAVED',completed_at:`${day}T12:00:00.000Z`};
}

test('strong varied foundational evidence compresses review and moves readiness forward',async({page})=>{
  await ready(page);
  const result=await page.evaluate((seed)=>{
    window.data.activityAttempts=seed;
    window.data.interactionEvidence=[];
    window.data.adaptiveProfile={};
    const s=window.AdaptiveAccelerationService.skillProfile('reading.letter_sounds');
    const next=window.AdaptiveAccelerationService.recommend('reading',{currentSkillId:'reading.letter_sounds',exclude:new Set(),usedTypes:new Set()});
    return {mode:s.mode,fluent:s.metrics.fluent,difficulty:s.difficulty,nextSkill:next?.skill_id,nextId:next?.id};
  },[
    attempt({id:'a1',activity:'verify-letter-m',skill:'reading.letter_sounds',day:'2026-09-08'}),
    attempt({id:'a2',activity:'verify-letter-mst',skill:'reading.letter_sounds',type:'sort',day:'2026-09-08'}),
    attempt({id:'a3',activity:'verify-letter-m',skill:'reading.letter_sounds'}),
    attempt({id:'a4',activity:'verify-letter-mst',skill:'reading.letter_sounds',type:'sort'}),
    attempt({id:'a5',activity:'verify-letter-m',skill:'reading.letter_sounds'}),
    attempt({id:'a6',activity:'verify-letter-mst',skill:'reading.letter_sounds',type:'sort'})
  ]);
  expect(result.fluent).toBe(true);
  expect(result.mode).toBe('compressed_review');
  expect(result.difficulty).toBeGreaterThanOrEqual(2);
  expect(result.nextSkill).not.toBe('reading.letter_sounds');
  expect(['reading.short_vowels','reading.beginning_sounds']).toContain(result.nextSkill);
  expect(result.nextId).toBeTruthy();
});

test('fast inaccurate answers trigger verification, never acceleration',async({page})=>{
  await ready(page);
  const result=await page.evaluate((seed)=>{
    window.data.activityAttempts=seed;window.data.interactionEvidence=[];window.data.adaptiveProfile={};
    const s=window.AdaptiveAccelerationService.skillProfile('reading.beginning_sounds');
    const next=window.AdaptiveAccelerationService.recommend('reading',{currentSkillId:'reading.beginning_sounds',exclude:new Set(),usedTypes:new Set()});
    return {mode:s.mode,guessing:s.metrics.guessing,strong:s.metrics.strongNow,fluent:s.metrics.fluent,nextChallenge:!!next?.challenge,nextDifficulty:next?.difficulty};
  },[
    attempt({id:'g1',activity:'read-first',skill:'reading.beginning_sounds',type:'sort',score:.2,seconds:2,independent:false}),
    attempt({id:'g2',activity:'verify-beginning-multi',skill:'reading.beginning_sounds',type:'multi_select',score:.3,seconds:2,independent:false})
  ]);
  expect(result.guessing).toBe(true);
  expect(result.mode).toBe('verify');
  expect(result.strong).toBe(false);
  expect(result.fluent).toBe(false);
  expect(result.nextChallenge).toBe(false);
});

test('two difficult challenge attempts cause support rather than a dramatic downgrade',async({page})=>{
  await ready(page);
  const result=await page.evaluate((seed)=>{
    window.data.activityAttempts=seed;window.data.interactionEvidence=[];window.data.adaptiveProfile={skills:{'reading.cvc_encode.mixed':{difficulty:4,mode:'challenge'}}};
    const s=window.AdaptiveAccelerationService.skillProfile('reading.cvc_encode.mixed');
    return {mode:s.mode,misses:s.metrics.challengeMisses,difficulty:s.difficulty};
  },[
    attempt({id:'c1',activity:'acc-cvc-encode-dog',skill:'reading.cvc_encode.mixed',type:'word_builder',score:.4,hints:2,tries:3,independent:false}),
    attempt({id:'c2',activity:'acc-cvc-encode-dog',skill:'reading.cvc_encode.mixed',type:'word_builder',score:.45,hints:3,tries:3,independent:false})
  ]);
  expect(result.misses).toBe(2);
  expect(result.mode).toBe('support');
  expect(result.difficulty).toBeGreaterThanOrEqual(1);
  expect(result.difficulty).toBeLessThan(4);
});

test('difficulty remains domain specific and session planner has depth',async({page})=>{
  await ready(page);
  const result=await page.evaluate(()=>{
    window.data.activityAttempts=[];window.data.interactionEvidence=[];window.data.adaptiveProfile={domains:{reading:{difficulty:4},math:{difficulty:1}}};
    const plan=window.AdaptiveAccelerationService.planSession();
    return {reading:window.data.adaptiveProfile.domains.reading.difficulty,math:window.data.adaptiveProfile.domains.math.difficulty,count:plan.activities.length,minutes:plan.activities.reduce((n,a)=>n+Number(a.estimated_minutes||0),0),types:new Set(plan.activities.map(a=>a.interaction_type)).size,target:plan.targetMinutes};
  });
  expect(result.reading).toBe(4);expect(result.math).toBe(1);
  expect(result.count).toBeGreaterThanOrEqual(5);
  expect(result.minutes).toBeGreaterThanOrEqual(15);
  expect(result.types).toBeGreaterThanOrEqual(3);
  expect(result.target).toBe(20);
});

test('adaptive parent snapshot exposes current, ready-next, stretch and compression reason',async({page})=>{
  await ready(page);
  const snap=await page.evaluate(()=>{
    window.data.adaptiveProfile={domains:{reading:{difficulty:3,current_skill_id:'reading.cvc_decode.mixed',ready_next:'reading.cvc_encode.mixed',stretch_skill:'reading.simple_sentences'}},compressedSkills:{'reading.letter_sounds':{since:new Date().toISOString(),reason:'Consistent independent accuracy across varied tasks; foundational practice compressed to brief retrieval.'}},learningVelocity:1.5,lastSummary:'Basic sound review was shortened after demonstrated mastery.'};
    return window.AdaptiveAccelerationService.parentSnapshot();
  });
  expect(snap.domains.reading.current).toContain('mixed');
  expect(snap.domains.reading.readyNext).toContain('Spell mixed CVC');
  expect(snap.domains.reading.stretch).toContain('Decodable sentences');
  expect(snap.compressed[0].reason).toContain('compressed');
  expect(snap.lastSummary).toContain('shortened');
});