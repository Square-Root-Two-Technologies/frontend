/**
 * photos.spec.ts — Photography page + landing page photo section.
 * Runs under chromium project.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// 1. /photos page
// ---------------------------------------------------------------------------
test.describe('Photos page', () => {
  test('loads with h1 heading', async ({ page }) => {
    await page.goto('/photos');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('shows photo grid or empty state', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(3000);
    const hasImages = await page.locator('img').count() > 0;
    const hasEmpty  = await page.locator('text=/no photos/i').isVisible();
    expect(hasImages || hasEmpty).toBe(true);
  });

  test('photo images all load (no broken images)', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(3000);
    const images = page.locator('img');
    const count  = await images.count();
    if (count === 0) return;

    for (let i = 0; i < Math.min(count, 6); i++) {
      const w = await images.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(w, `Image ${i} has naturalWidth 0 — likely broken`).toBeGreaterThan(0);
    }
  });

  test('clicking a photo opens lightbox', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(3000);

    // Photos are in button wrappers in the gallery
    const clickable = page.locator('button').filter({ has: page.locator('img') }).first();
    if (!(await clickable.isVisible())) return; // no photos — skip

    await clickable.click();
    const lightbox = page.locator('[class*="yarl"], [class*="lightbox"], [role="dialog"]').first();
    await expect(lightbox).toBeVisible({ timeout: 5000 });
  });

  test('lightbox closes on Escape', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(3000);
    const clickable = page.locator('button').filter({ has: page.locator('img') }).first();
    if (!(await clickable.isVisible())) return;

    await clickable.click();
    const lightbox = page.locator('[class*="yarl"], [class*="lightbox"], [role="dialog"]').first();
    await expect(lightbox).toBeVisible({ timeout: 5000 });
    await page.keyboard.press('Escape');
    await expect(lightbox).not.toBeVisible({ timeout: 3000 });
  });

  test('lightbox has a download button', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(3000);
    const clickable = page.locator('button').filter({ has: page.locator('img') }).first();
    if (!(await clickable.isVisible())) return;

    await clickable.click();
    await expect(
      page.locator('[aria-label*="download" i], [class*="download" i]').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('lightbox shows navigation arrows when multiple photos', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(3000);
    const photos = page.locator('button').filter({ has: page.locator('img') });
    if (await photos.count() < 2) return;

    await photos.first().click();
    const lightbox = page.locator('[class*="yarl"], [class*="lightbox"], [role="dialog"]').first();
    await expect(lightbox).toBeVisible({ timeout: 5000 });
    // yarl renders next/prev as buttons with aria-labels
    await expect(
      lightbox.locator('button[aria-label*="next" i], button[aria-label*="previous" i]').first()
    ).toBeVisible({ timeout: 3000 });
  });
});

// ---------------------------------------------------------------------------
// 2. Landing page photography section
// ---------------------------------------------------------------------------
test.describe('Landing page — photography section', () => {
  test('#photography section is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#photography')).toBeVisible({ timeout: 8000 });
  });

  test('"All photos →" link navigates to /photos', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /all photos/i })).toBeVisible();
    await page.getByRole('link', { name: /all photos/i }).click();
    await expect(page).toHaveURL('/photos');
  });

  test('photo cells render (real photos or placeholders)', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const cells = page.locator('.lp-photo-cell');
    const count = await cells.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('photo cells link to /photos', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    const link = page.locator('.lp-photo-cell').first().locator('xpath=ancestor-or-self::a');
    if (await link.count() > 0) {
      const href = await link.first().getAttribute('href');
      expect(href).toContain('/photos');
    }
  });
});
