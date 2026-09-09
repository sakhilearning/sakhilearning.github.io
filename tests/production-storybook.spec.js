const { test, expect } = require("@playwright/test");

const silentWav = Buffer.concat([
  Buffer.from(
    "UklGRsQEAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YaAEAAA=",
    "base64",
  ),
  Buffer.alloc(1200, 128),
]);

test.beforeEach(async ({ page }) => {
  await page.route("**/functions/v1/sakhi-tts", (route) =>
    route.fulfill({ status: 200, contentType: "audio/wav", body: silentWav }),
  );
  await page.goto("/");
  await page.waitForFunction(() => window.SakhiProduction);
});

test("home renders unique full-scene imagery without layout overlap", async ({
  page,
}) => {
  await expect(page.locator("#homeHeroArt .scene-image")).toBeVisible();
  await expect(page.locator(".kingdom-card")).toHaveCount(6);
  await expect(page.locator(".kingdom-card .scene-image")).toHaveCount(6);
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".kingdom-card .scene-image")].every(
      (image) => image.complete && image.naturalWidth >= 1500,
    ),
  );
  const sources = await page
    .locator(".kingdom-card .scene-image")
    .evaluateAll((images) => images.map((image) => image.getAttribute("src")));
  expect(new Set(sources).size).toBe(6);
  const layout = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const insights = document
      .querySelector(".home-insight")
      .getBoundingClientRect();
    const cards = [...document.querySelectorAll(".kingdom-card")].map((node) =>
      node.getBoundingClientRect(),
    );
    return {
      heroBeforeInsights: hero.bottom <= insights.top + 1,
      cards: cards.map(({ left, top, right, bottom }) => ({
        left,
        top,
        right,
        bottom,
      })),
      viewport: document.documentElement.clientWidth,
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    };
  });
  expect(layout.heroBeforeInsights).toBe(true);
  expect(layout.horizontalOverflow).toBe(false);
  for (const card of layout.cards) {
    expect(card.left).toBeGreaterThanOrEqual(0);
    expect(card.right).toBeLessThanOrEqual(layout.viewport + 1);
  }
});

test("activity uses the neural HTML-audio controller and stays usable", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Start Today/ }).click();
  await expect(page.locator('[data-view="activity"]')).toHaveClass(/active/);
  await expect(page.locator("#activityGuide .scene-image")).toBeVisible();
  await expect(page.locator("#interactionArea .question")).toBeVisible();
  await page
    .getByRole("button", { name: /Hear Sakhi again|Loading Sakhi/ })
    .click();
  await page.waitForFunction(() =>
    ["playing", "ready", "error"].includes(
      window.SakhiProduction.audioStatus().state,
    ),
  );
  const status = await page.evaluate(() =>
    window.SakhiProduction.audioStatus(),
  );
  expect(status.provider).toContain("ElevenLabs");
  expect(status.cacheEntries).toBeGreaterThanOrEqual(1);
});

test("mobile layout has one column and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.waitForFunction(() => window.SakhiProduction);
  await expect(page.locator("#homeHeroArt .scene-image")).toBeVisible();
  const snapshot = await page.evaluate(() => ({
    overflow:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
    columns: getComputedStyle(
      document.querySelector(".kingdom-grid"),
    ).gridTemplateColumns.split(" ").length,
    bottomNav: getComputedStyle(document.querySelector(".bottom-nav")).display,
  }));
  expect(snapshot.overflow).toBe(false);
  expect(snapshot.columns).toBe(1);
  expect(snapshot.bottomNav).toBe("grid");
});

test("parent curriculum shows evidence and distinguishes planned skills", async ({
  page,
}) => {
  page.on("dialog", (dialog) => dialog.accept("071621"));
  await page.locator('.nav [data-nav="parents"]').click();
  await expect(page.locator(".curriculum-domain")).toHaveCount(6);
  await expect(page.locator(".curriculum-path li")).toHaveCount(24);
  await expect(page.locator("[data-practice]")).toHaveCount(6);
  await expect(page.locator("#domainProgress")).toContainText(
    "Planned · not assessed",
  );
  await expect(page.locator("#parentGoal")).toContainText("0 recorded answers");
  await page.locator('[data-practice="reading"]').click();
  await expect(page.locator("#activityTitle")).toContainText("Build the Word");
});

test("letter tiles support pointer dragging, undo and completion rewards persist", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Start Today/ }).click();
  const tile = page.locator('[data-token="0"]');
  const slot = page.locator('[data-slot="0"]');
  await tile.scrollIntoViewIfNeeded();
  const from = await tile.boundingBox(),
    to = await slot.boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
    steps: 8,
  });
  await page.mouse.up();
  await expect(page.locator('[data-slot="0"]')).toContainText("m");
  await page.locator('[data-slot="0"]').click();
  await expect(page.locator('[data-slot="0"]')).not.toHaveClass(/filled/);
  for (const letter of ["m", "a", "p"])
    await page.getByRole("button", { name: letter, exact: true }).click();
  await page.locator("#check").dblclick();
  await expect(page.locator("#learningFeedback")).toContainText("spell map");
  await page.locator("#continueQuestion").click();
  for (const letter of ["s", "u", "n"])
    await page.getByRole("button", { name: letter, exact: true }).click();
  await page.locator("#check").click();
  await page.locator("#continueQuestion").click();
  await page.getByRole("button", { name: "tap", exact: true }).click();
  await page.locator("#continueQuestion").click();
  await expect(page.locator("#completionOverlay")).toBeVisible();
  await expect(page.locator("#completionText")).toContainText("Rainbow Gem");
  await expect(page.locator("#completionTreasure .treasure")).toBeVisible();
  expect(await page.evaluate(() => window.SakhiProduction.state().gems)).toBe(
    1,
  );
  await page.locator("#completionClose").click();
  await expect(page.locator("#treasureCollection")).toContainText(
    "Rainbow Gem",
  );
  await page.reload();
  expect(await page.evaluate(() => window.SakhiProduction.state().gems)).toBe(
    1,
  );
});

test("jewels allow adding, returning and correcting a number composition", async ({
  page,
}) => {
  await page.locator('[data-d="math"]').click();
  await page.getByRole("button", { name: "Add jewel 1", exact: true }).click();
  await page.locator("#check").click();
  await expect(page.locator("#learningFeedback")).toContainText(
    "Your tray has 5",
  );
  await page.locator("#continueQuestion").click();
  await page
    .getByRole("button", { name: "Return added jewel 1", exact: true })
    .click();
  for (const n of [1, 2, 3])
    await page
      .getByRole("button", { name: `Add jewel ${n}`, exact: true })
      .click();
  await page.locator("#check").click();
  await expect(page.locator("#learningFeedback")).toContainText(
    "4 and 3 make 7",
  );
});
