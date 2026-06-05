import { test, expect } from '@playwright/test';

test('landing page loads with all key sections', async ({ page }) => {
  await page.goto('/parley/');
  await expect(page.locator('h1')).toContainText('transcribed');
  for (const id of ['#demo', '#features', '#how', '#privacy', '#quickstart']) {
    await expect(page.locator(id)).toHaveCount(1);
  }
  await expect(page.locator('[data-demo]')).toBeVisible();
});

test('quickstart tabs switch panels', async ({ page }) => {
  await page.goto('/parley/');
  await page.locator('[data-tab="run"]').click();
  await expect(page.locator('[data-panel="run"]')).toBeVisible();
  await expect(page.locator('[data-panel="clone"]')).toBeHidden();
});

test.describe('reduced motion', () => {
  test.use({ colorScheme: 'dark', reducedMotion: 'reduce' });
  test('notes thread is fully visible immediately', async ({ page }) => {
    await page.goto('/parley/');
    const blocks = page.locator('[data-stage-notes] [data-note-block]');
    const n = await blocks.count();
    for (let i = 0; i < n; i++) {
      await expect(blocks.nth(i)).toBeVisible();
    }
  });
});
