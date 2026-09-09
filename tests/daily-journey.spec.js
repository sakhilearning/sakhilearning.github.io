const {test,expect}=require('@playwright/test');
async function ready(page){
  await page.goto('/');
  await page.waitForFunction(()=>window.DailyJourneyService&&window.SakhiDomainThemeRegistry&&window.ActivityRenderer&&Array.isArray(window.activities)&&window.activities.length>10);
  await page.evaluate(()=>{window.SpeechService.speakInstruction=async()=>true;window.SpeechService.speakFeedback=async()=>true;window.SpeechService.speakStory=async()=>true;window.SpeechService.unlockAudio=async()=>true;});
}

test('home uses child-first continuous journey and no baseline child nav',async({page})=>{
  await ready(page);
  await expect(page.locator('#home')).toContainText('Hi, Princess!');
  await expect(page.locator('#home')).toContainText('Start Today’s Adventure');
  await expect(page.locator('#dailyJourneyHome')).toContainText('Home → Adventure → Rewards → Story');
  await expect(page.locator('.nav [data-go="baseline"]')).toHaveCount(0);
  await expect(page.locator('.bottom [data-go="baseline"]')).toHaveCount(0);
});

test('today adventure shows trail and launches a full-page themed activity',async({page})=>{
  await ready(page);
  await page.locator('button', {hasText:'Start Today’s Adventure'}).first().click();
  await expect(page.locator('#dailyAdventureTrail')).toBeVisible();
  await expect(page.locator('#questCards')).toHaveClass(/journey-card-list-hidden/);
  await expect(page.locator('#activityRunner .journey-activity-page')).toBeVisible();
  await expect(page.locator('.journey-activity-header')).toBeVisible();
  await expect(page.locator('.activity-hear')).toContainText('Hear Sakhi');
  const box=await page.locator('#interactionMount').boundingBox();
  expect(box.width).toBeGreaterThan(100);expect(box.height).toBeGreaterThan(100);
});

test('reward celebration includes required summary and optional bedtime story',async({page})=>{
  await ready(page);
  await page.evaluate(()=>window.DailyJourneyService.showAdventureComplete());
  await expect(page.locator('#journeyCelebration')).toContainText('You Finished Today’s Adventure!');
  await expect(page.locator('#journeyCelebration')).toContainText('Magic Stars');
  await expect(page.locator('#journeyCelebration')).toContainText('Bedtime Story');
  await page.locator('#journeyCelebration button', {hasText:'Bedtime Story'}).click();
  await expect(page.locator('#bedtimeStoryPanel')).toBeVisible();
  await expect(page.locator('#bedtimeStoryPanel')).toContainText('Sakhi’s Calm Rainbow Story');
});

test('domain theme registry maps required learning domains',async({page})=>{
  await ready(page);
  const themes=await page.evaluate(()=>Object.fromEntries(Object.entries(window.SakhiDomainThemeRegistry.themes).map(([k,v])=>[k,v.display_name])));
  expect(themes.reading).toBe('Unicorn Reading Meadow');
  expect(themes.math).toBe('Royal Math Quest');
  expect(themes.logic).toBe('Ice Princess Pattern Play');
  expect(themes.science).toBe('Mermaid Science Lab');
  expect(themes.language).toBe('Forest Story Adventure');
  expect(themes.writing).toBe('Pixie Writing Garden');
});
