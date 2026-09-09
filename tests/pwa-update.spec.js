const {test,expect}=require('@playwright/test');

async function ready(page){
  await page.addInitScript(()=>{window.__SAKHI_TEST_DISABLE_RELOAD=true;});
  await page.goto('/');
  await page.waitForFunction(()=>window.SakhiPWAUpdateService&&window.SAKHI_BUILD_ID);
}

test('current build ID and install guidance are visible in Parent Settings',async({page})=>{
  await ready(page);
  await page.waitForFunction(()=>window.SettingsUI&&window.ParentAuthService);
  await page.evaluate(async()=>{await window.ParentAuthService.unlock('71621');window.go?.('parent');window.SettingsUI.render();});
  await expect(page.locator('#sakhiSettingsCard')).toBeVisible();
  await expect(page.locator('[data-build-id]')).not.toHaveText('');
  await expect(page.locator('[data-pwa-install]')).not.toHaveText('');
  await expect(page.locator('[data-pwa-guidance]')).toContainText(/Installed on this device|Add to Home Screen|install/i);
});

test('service worker registers and update check runs on startup',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Service-worker registration is tested in Chromium; banner logic is tested cross-browser.');
  await ready(page);
  await page.waitForFunction(()=>window.SakhiPWAUpdateService.getStatus().registered&&window.SakhiPWAUpdateService.getStatus().updateCheckAt);
  const status=await page.evaluate(()=>window.SakhiPWAUpdateService.getStatus());
  expect(status.supported).toBe(true);
  expect(status.registered).toBe(true);
  expect(status.updateCheckAt).toBeTruthy();
});

test('waiting worker shows banner, Later does not reload, Refresh sends SKIP_WAITING',async({page})=>{
  await ready(page);
  await page.evaluate(()=>{
    window.SakhiPWAUpdateService.__test.reset();
    window.__fakeWaiting={messages:[],postMessage(message){this.messages.push(message);}};
    window.SakhiPWAUpdateService.__test.showUpdateAvailable({waiting:window.__fakeWaiting});
  });
  const banner=page.locator('[data-pwa-update-banner]');
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('A new Sakhi version is ready');
  await page.locator('[data-pwa-later]').click();
  await expect(banner).toBeHidden();
  expect(await page.evaluate(()=>window.SakhiPWAUpdateService.__test.status().reloadCount)).toBe(0);
  await page.evaluate(()=>window.SakhiPWAUpdateService.__test.showUpdateAvailable({waiting:window.__fakeWaiting}));
  await page.locator('[data-pwa-refresh]').click();
  const messages=await page.evaluate(()=>window.__fakeWaiting.messages);
  expect(messages).toContainEqual(expect.objectContaining({type:'SKIP_WAITING'}));
});

test('controllerchange reloads once and cannot loop',async({page})=>{
  await ready(page);
  await page.evaluate(()=>{
    window.SakhiPWAUpdateService.__test.reset();
    window.SakhiPWAUpdateService.__test.setRefreshRequested(true);
    window.SakhiPWAUpdateService.__test.handleControllerChange();
    window.SakhiPWAUpdateService.__test.handleControllerChange();
  });
  const status=await page.evaluate(()=>window.SakhiPWAUpdateService.__test.status());
  expect(status.reloadCount).toBe(1);
});

test('active child activity is not automatically interrupted by update banner',async({page})=>{
  await ready(page);
  await page.waitForFunction(()=>window.ActivityRenderer&&window.runActivity);
  await page.evaluate(()=>{window.runActivity('math-qty');window.SakhiPWAUpdateService.__test.reset();window.__fakeWaiting={messages:[],postMessage(message){this.messages.push(message);}};window.SakhiPWAUpdateService.__test.showUpdateAvailable({waiting:window.__fakeWaiting});});
  await expect(page.locator('[data-pwa-update-banner]')).toBeVisible();
  const status=await page.evaluate(()=>({activity:window.ActivityRenderer.current()?.activity?.id,reload:window.SakhiPWAUpdateService.__test.status().reloadCount,hidden:document.querySelector('[data-pwa-update-banner]')?.hidden}));
  expect(status.activity).toBe('math-qty');
  expect(status.reload).toBe(0);
  expect(status.hidden).toBe(false);
});

test('old Sakhi caches are deleted after activation purge',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Cache deletion is verified in Chromium service-worker runtime.');
  await ready(page);
  await page.waitForFunction(()=>navigator.serviceWorker.ready);
  if(!(await page.evaluate(()=>!!navigator.serviceWorker.controller))){
    await page.reload();
    await page.waitForFunction(()=>window.SakhiPWAUpdateService&&navigator.serviceWorker.controller);
  }
  await page.evaluate(async()=>{const c=await caches.open('sakhi-magic-learning-old-e2e');await c.put('/old-e2e.txt',new Response('old'));});
  expect(await page.evaluate(async()=>caches.has('sakhi-magic-learning-old-e2e'))).toBe(true);
  await page.evaluate(async()=>{
    await new Promise(resolve=>{
      const channel=new MessageChannel();
      channel.port1.onmessage=()=>resolve();
      navigator.serviceWorker.controller.postMessage({type:'SAKHI_PURGE_CACHES'},[channel.port2]);
    });
  });
  expect(await page.evaluate(async()=>caches.has('sakhi-magic-learning-old-e2e'))).toBe(false);
});
