const {test,expect}=require('@playwright/test');

async function ready(page){
  await page.route('**/sakhi-tts',route=>route.fulfill({status:200,contentType:'audio/mpeg',body:Buffer.alloc(1200)}));
  await page.goto('/');
  await page.waitForFunction(()=>window.ActivityRenderer&&window.ActivityContract&&window.ProgressService&&window.RainbowPersistence&&Array.isArray(window.activities)&&window.activities.length>10);
  await page.evaluate(()=>{
    const backend=window.RainbowPersistence;
    backend.backendStatus=()=>({ready:true,remote:true,configured:true,source:'TEST_AUTHORITY'});
    backend.completeActivity=async(result,activity)=>{
      const key=result.completion_instance||`${result.session_id}:${activity.id}`;
      const d=window.data;d.rewardTransactions=d.rewardTransactions||[];
      if(!d.rewardTransactions.some(x=>x.idempotency_key===`${key}:MAGIC_STAR`))d.rewardTransactions.push({transaction_id:`tx-${key}`,activity_id:activity.id,reward_type:'MAGIC_STAR',amount:1,idempotency_key:`${key}:MAGIC_STAR`,status:'SAVED'});
      const balance=d.rewardTransactions.filter(x=>x.status==='SAVED'&&x.reward_type==='MAGIC_STAR').reduce((n,x)=>n+Number(x.amount||0),0);
      return {saved:true,remote:true,duplicate:false,new_mastery_state:'INTRODUCED',mastery_score:result.score||1,reward_awarded:true,reward_balance:balance,session_progress:{status:'IN_PROGRESS',activities_completed:1}};
    };
    backend.hydrate=async d=>d;
    backend.completeSession=async s=>({saved:true,remote:true,session_id:s.session_id,status:'COMPLETED',completed_at:new Date().toISOString(),actual_duration:1,activities_completed:s.completed_activities?.length||0});
  });
}

test('activity shell and registered renderer stay visible',async({page})=>{
  await ready(page);await page.evaluate(()=>window.runActivity('math-qty'));
  const mount=page.locator('#interactionMount');await expect(mount).toBeVisible();const box=await mount.boundingBox();
  expect(box.width).toBeGreaterThan(100);expect(box.height).toBeGreaterThan(100);
  expect(await page.evaluate(()=>window.ActivityRenderer.current().activity.interaction_type)).toBe('tap_choice');
  expect(await page.evaluate(()=>window.ActivityRenderer.current().status)).toMatch(/READY|IN_PROGRESS/);
});

test('wrong answer guides and one completion produces one cached attempt and one authoritative reward projection',async({page})=>{
  await ready(page);await page.evaluate(()=>window.runActivity('math-qty'));
  await page.locator('.choice-touch[data-id="two"]').click();await expect(page.locator('#structuredFeedback')).toContainText(/count|compare|try|look/i);
  await page.waitForTimeout(360);await page.locator('.choice-touch[data-id="four"]').click();
  await page.waitForFunction(()=>window.data.activityAttempts?.some(x=>x.activity_id==='math-qty'&&x.save_status==='SAVED'));
  const first=await page.evaluate(()=>({attempts:window.data.activityAttempts.filter(x=>x.activity_id==='math-qty'&&x.save_status==='SAVED').length,rewards:window.data.rewardTransactions.filter(x=>x.activity_id==='math-qty'&&x.status==='SAVED').length,balance:window.data.rewardBalances?.MAGIC_STAR||0}));
  expect(first.attempts).toBe(1);expect(first.rewards).toBe(1);expect(first.balance).toBe(1);
});

test('Trace S uses writing evidence and path-quality threshold',async({page})=>{
  await ready(page);await page.evaluate(()=>window.runActivity('writing-trace'));
  await expect(page.locator('.activity-instruction')).toContainText('Trace the shiny S');await expect(page.locator('#traceCanvas')).toBeVisible();
  const meta=await page.evaluate(()=>({character:window.ActivityRenderer.current().activity.trace_character,skill:window.ActivityRenderer.current().activity.skill_id,threshold:window.ActivityRenderer.current().activity.completion_threshold}));
  expect(meta.character).toBe('S');expect(meta.skill.toLowerCase()).toContain('writing');expect(meta.threshold).toBeGreaterThanOrEqual(.5);
  await page.evaluate(()=>{const c=document.getElementById('traceCanvas'),pts=window.ActivityRenderer.current().state.guidePoints,r=c.getBoundingClientRect();const emit=(type,p)=>c.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,clientX:r.left+p[0]*r.width/c.width,clientY:r.top+p[1]*r.height/c.height,buttons:type==='pointerup'?0:1}));emit('pointerdown',pts[0]);for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];for(let j=1;j<=8;j++)emit('pointermove',[a[0]+(b[0]-a[0])*j/8,a[1]+(b[1]-a[1])*j/8]);}emit('pointerup',pts.at(-1));});
  await page.locator('button',{hasText:'Check My Trace'}).click();await page.waitForFunction(()=>window.data.activityAttempts?.some(x=>x.activity_id==='writing-trace'&&x.save_status==='SAVED'));
  const last=await page.evaluate(()=>window.data.activityAttempts.filter(x=>x.activity_id==='writing-trace').at(-1));
  expect(last.skill_id.toLowerCase()).toContain('writing');expect(last.completion_quality).toBeGreaterThanOrEqual(meta.threshold);
});

test('critical t and p assets are local while unvalidated phonemes fail closed',async({page,request})=>{
  await ready(page);const qa=await page.evaluate(()=>window.PhonemeAudioService.qa());
  for(const id of ['t','p']){const meta=qa.find(x=>x.grapheme===id);expect(meta.available).toBe(true);expect(meta.validation_status).toBe('SOURCE_VERIFIED');expect(meta.audio_asset).toMatch(/^\.\/assets\/audio\/phonemes\//);const res=await request.get(new URL(meta.audio_asset.replace('./','/'),'http://127.0.0.1:4173').toString());expect(res.ok()).toBe(true);expect((await res.body()).length).toBeGreaterThan(1000);}
  const m=qa.find(x=>x.phoneme_id==='phoneme_m');expect(m.available).toBe(false);expect(m.validation_status).toBe('MISSING');
});

test('Start Adventure initializes audio before entering quest and SpeechService stays HTML-media based',async({page})=>{
  await ready(page);await expect(page.locator('.sakhi-start')).toBeVisible();await page.locator('.sakhi-start').click();await expect(page.locator('#quest')).toHaveClass(/active/);
  const status=await page.evaluate(()=>window.SpeechService.getStatus());expect(status.initialized).toBe(true);expect(status.architecture).toContain('html-media');
});
