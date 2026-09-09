const {test,expect}=require('@playwright/test');

async function ready(page){
  await page.goto('/');
  await page.waitForFunction(()=>window.ActivityRenderer&&window.ActivityContract&&window.ProgressService&&Array.isArray(window.activities)&&window.activities.length>10);
  await page.evaluate(()=>{window.SpeechService.speakInstruction=async()=>true;window.SpeechService.speakFeedback=async()=>true;});
}

test('activity shell and registered renderer stay visible',async({page})=>{
  await ready(page);
  await page.evaluate(()=>window.runActivity('math-qty'));
  const mount=page.locator('#interactionMount');
  await expect(mount).toBeVisible();
  const box=await mount.boundingBox();
  expect(box.width).toBeGreaterThan(100);expect(box.height).toBeGreaterThan(100);
  expect(await page.evaluate(()=>window.ActivityRenderer.current().activity.interaction_type)).toBe('tap_choice');
  expect(await page.evaluate(()=>window.ActivityRenderer.current().status)).toMatch(/READY|IN_PROGRESS/);
});

test('wrong answer guides, correct answer saves exactly one attempt and reward, refresh retains both',async({page})=>{
  await ready(page);
  await page.evaluate(()=>window.runActivity('math-qty'));
  await page.locator('.choice-touch[data-id="two"]').click();
  await expect(page.locator('#structuredFeedback')).toContainText(/count|compare|try|look/i);
  await page.waitForTimeout(360);
  await page.locator('.choice-touch[data-id="four"]').click();
  await page.waitForFunction(()=>window.data.activityAttempts?.some(x=>x.activity_id==='math-qty'&&x.save_status==='SAVED'));
  const first=await page.evaluate(()=>({attempts:window.data.activityAttempts.filter(x=>x.activity_id==='math-qty'&&x.save_status==='SAVED').length,rewards:window.data.rewardTransactions.filter(x=>x.activity_id==='math-qty'&&x.status==='SAVED').length,balance:window.data.rewardBalances?.MAGIC_STAR||0}));
  expect(first.attempts).toBe(1);expect(first.rewards).toBe(1);expect(first.balance).toBeGreaterThanOrEqual(1);
  await page.reload();
  await page.waitForFunction(()=>window.data&&window.RewardService);
  const after=await page.evaluate(()=>({attempts:window.data.activityAttempts?.filter(x=>x.activity_id==='math-qty'&&x.save_status==='SAVED').length||0,rewards:window.data.rewardTransactions?.filter(x=>x.activity_id==='math-qty'&&x.status==='SAVED').length||0}));
  expect(after.attempts).toBe(1);expect(after.rewards).toBe(1);
});

test('Trace S shows correct canvas and requires path-quality evidence',async({page})=>{
  await ready(page);
  await page.evaluate(()=>window.runActivity('writing-trace'));
  await expect(page.locator('.activity-instruction')).toContainText('Trace the shiny S');
  await expect(page.locator('#traceCanvas')).toBeVisible();
  const meta=await page.evaluate(()=>({character:window.ActivityRenderer.current().activity.trace_character,skill:window.ActivityRenderer.current().activity.skill_id,threshold:window.ActivityRenderer.current().activity.completion_threshold}));
  expect(meta.character).toBe('S');expect(meta.skill.toLowerCase()).toContain('writing');expect(meta.threshold).toBeGreaterThanOrEqual(.5);
  await page.evaluate(()=>{
    const c=document.getElementById('traceCanvas'),pts=window.ActivityRenderer.current().state.guidePoints,r=c.getBoundingClientRect();
    const emit=(type,p)=>c.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,clientX:r.left+p[0]*r.width/c.width,clientY:r.top+p[1]*r.height/c.height,buttons:type==='pointerup'?0:1}));
    emit('pointerdown',pts[0]);
    for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];for(let j=1;j<=8;j++)emit('pointermove',[a[0]+(b[0]-a[0])*j/8,a[1]+(b[1]-a[1])*j/8]);}
    emit('pointerup',pts.at(-1));
  });
  await page.locator('button', {hasText:'Check My Trace'}).click();
  await page.waitForFunction(()=>window.data.activityAttempts?.some(x=>x.activity_id==='writing-trace'&&x.save_status==='SAVED'));
  const evidence=await page.evaluate(()=>({writing:(window.data.evidence?.['writing::Letter formation']||[]).length,reading:(window.data.evidence?.['reading::Letter sounds']||[]).length,last:window.data.activityAttempts.filter(x=>x.activity_id==='writing-trace').at(-1)}));
  expect(evidence.writing).toBeGreaterThan(0);expect(evidence.reading).toBe(0);expect(evidence.last.completion_quality).toBeGreaterThanOrEqual(meta.threshold);
});

test('critical t and p assets are local and loadable',async({page,request})=>{
  await ready(page);
  const reg=await page.evaluate(()=>window.SAKHI_PHONEME_REGISTRY);
  for(const id of ['t','p']){
    expect(reg[id].audio_asset).toMatch(/^\.\/assets\/audio\/phonemes\//);
    expect(reg[id].source_verified).toBe(true);
    const res=await request.get(new URL(reg[id].audio_asset.replace('./','/'),'http://127.0.0.1:4173').toString());
    expect(res.ok()).toBe(true);expect((await res.body()).length).toBeGreaterThan(1000);
  }
});
