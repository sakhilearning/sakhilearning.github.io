const {test,expect}=require('@playwright/test');

async function unlockParent(page){
  await page.locator('[data-go="parent"]').first().click();
  await expect(page.locator('#parentGate')).toBeVisible();
  await page.locator('#parentPasscode').fill('071621');
  await page.locator('#parentUnlockBtn').click();
  await expect(page.locator('#parent')).toHaveClass(/active/);
}

test.beforeEach(async({page})=>{
  await page.goto('/');
  await page.waitForFunction(()=>window.SettingsService&&window.AdventureService&&window.AssetService&&window.LessonPlanner);
});

test('child UI hides duplicate configuration controls',async({page})=>{
  await expect(page.locator('.theme-picker')).toBeHidden();
  await expect(page.locator('.nav [data-go="baseline"]')).toBeHidden();
  await expect(page.locator('.bottom [data-go="learn"]')).toBeHidden();
  await expect(page.locator('#sakhiChildHome')).toBeVisible();
});

test('adventure setting changes presentation but not curriculum identity and persists refresh',async({page})=>{
  await unlockParent(page);
  const control=page.locator('#sakhiSettingsCard [data-setting="adventure"]');
  await control.selectOption('ocean');
  await expect(page.locator('body')).toHaveAttribute('data-adventure','ocean');
  const before=await page.evaluate(()=>{const a=(window.activities||[]).find(x=>x.interaction_type);return {id:a.id,skill:a.skill_id||a.skill,world:window.AssetService.worldFor(a)}});
  expect(before.world).toBe('ocean');
  await control.selectOption('meadow');
  const after=await page.evaluate(()=>{const a=(window.activities||[]).find(x=>x.interaction_type);return {id:a.id,skill:a.skill_id||a.skill,world:window.AssetService.worldFor(a)}});
  expect(after.id).toBe(before.id);expect(after.skill).toBe(before.skill);expect(after.world).toBe('meadow');
  await control.selectOption('ocean');
  await page.reload();
  await page.waitForFunction(()=>window.SettingsService&&window.AdventureService);
  expect(await page.evaluate(()=>window.SettingsService.get('preferred_adventure'))).toBe('ocean');
  await expect(page.locator('body')).toHaveAttribute('data-adventure','ocean');
});

test('session length and movement controls change the generated quest',async({page})=>{
  await page.evaluate(()=>{
    window.SettingsService.set('session_length','10');
    window.SettingsService.set('movement_activities',false);
    window.makeQuest();
  });
  const snapshot=await page.evaluate(()=>({target:window.data.adaptiveTargetMinutes,quest:(window.data.quest||[]).map(id=>(window.activities||[]).find(a=>a.id===id)).filter(Boolean).map(a=>({domain:a.domain,type:a.interaction_type,minutes:a.estimated_minutes||a.minutes||3}))}));
  expect(snapshot.target).toBe(10);
  expect(snapshot.quest.length).toBeGreaterThanOrEqual(3);
  expect(snapshot.quest.some(a=>a.domain==='gross'||a.type==='movement')).toBeFalsy();
  expect(snapshot.quest.reduce((n,a)=>n+Number(a.minutes||0),0)).toBeLessThanOrEqual(16);
});

test('voice off suppresses speech and reduced motion is observable',async({page})=>{
  const result=await page.evaluate(async()=>{
    window.SettingsService.set('audio_enabled',false);
    window.SettingsService.set('reduced_motion',true);
    return {spoken:await window.SpeechService.speakInstruction('test instruction'),motion:document.body.dataset.reducedMotion};
  });
  expect(result.spoken).toBe(false);
  expect(result.motion).toBe('true');
});

test('parent settings QA contains only effective controls',async({page})=>{
  await unlockParent(page);
  const card=page.locator('#sakhiSettingsCard');
  await expect(card).toBeVisible();
  await expect(card.locator('[data-setting="adventure"] option')).toHaveCount(7);
  await expect(card.locator('text=Settings QA')).toBeVisible();
  const rows=card.locator('[data-settings-qa] tr');
  await expect(rows).toHaveCount(5);
  await expect(card.locator('.qa-pass')).toHaveCount(5);
});
