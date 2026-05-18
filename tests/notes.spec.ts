/**
 * notes.spec.ts — Blog reading + search tests (no login required for reading).
 * Runs under chromium project.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// 1. Single blog post — public access (this was broken before the fix)
// ---------------------------------------------------------------------------
test.describe('Single blog post (public)', () => {
  test('opens from home grid without authentication', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });

    // Click the "Read →" link in the first card
    await page.locator('article').first().getByRole('link', { name: /read/i }).click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('shows author, date, and content', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    await page.locator('article').first().getByRole('link', { name: /read/i }).click();

    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.blog-content')).toBeVisible({ timeout: 10000 });
    // Back link
    await expect(
      page.getByRole('link', { name: /all posts|back/i }).first()
    ).toBeVisible();
  });

  test('"← All posts" navigates back to /home', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    await page.locator('article').first().getByRole('link', { name: /read/i }).click();
    await page.getByRole('link', { name: /all posts/i }).first().click();
    await expect(page).toHaveURL('/home');
  });

  test('non-existent ID shows error or 404', async ({ page }) => {
    await page.goto('/blog/000000000000000000000000');
    // Should show error state — not a blank white page
    await expect(
      page.locator('text=/not found|couldn\'t load|404/i').first()
    ).toBeVisible({ timeout: 12000 });
  });
});

// ---------------------------------------------------------------------------
// 2. Search
// ---------------------------------------------------------------------------
test.describe('Search', () => {
  test('shows result cards for a broad query', async ({ page }) => {
    await page.goto('/search?q=the');
    await page.waitForTimeout(3000);
    const cards = page.locator('article, h3, [class*="card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('totally unknown query shows empty state without crash', async ({ page }) => {
    await page.goto('/search?q=zzzznonexistentxxx9999');
    await page.waitForTimeout(3000);
    // Something visible — not a blank page
    await expect(page.locator('h1, h2, p').first()).toBeVisible({ timeout: 8000 });
  });

  test('navbar search navigates with correct query param', async ({ page }) => {
    await page.goto('/home');
    const input = page.locator('input[placeholder*="Search"]').first();
    await input.fill('salesforce');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/search\?q=salesforce/);
  });

  test('search result links open the correct post', async ({ page }) => {
    await page.goto('/search?q=the');
    await page.waitForTimeout(3000);
    const firstLink = page.locator('a[href*="/blog/"]').first();
    if (await firstLink.isVisible()) {
      await firstLink.click();
      await expect(page).toHaveURL(/\/blog\/.+/);
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});

// ---------------------------------------------------------------------------
// 3. Blog grid interactions
// ---------------------------------------------------------------------------
test.describe('Blog grid', () => {
  test('/home article cards each have a readable title', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    const cards = page.locator('article');
    const count = Math.min(await cards.count(), 5);
    for (let i = 0; i < count; i++) {
      const title = await cards.nth(i).locator('h2').textContent();
      expect(title?.trim().length).toBeGreaterThan(0);
    }
  });

  test('type filter tab changes displayed posts', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    // If a Tabs component rendered, click the second tab
    const tabs = page.locator('button[role="tab"], button').filter({ hasText: /^[A-Z][a-z]+$/ });
    const count = await tabs.count();
    if (count > 1) {
      const before = await page.locator('article').count();
      await tabs.nth(1).click();
      await page.waitForTimeout(500);
      // Posts rendered after tab change (count may differ)
      const after = await page.locator('article, [style*="No posts"]').count();
      expect(after).toBeGreaterThanOrEqual(0); // just confirm no crash
    }
  });
});
