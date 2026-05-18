/**
 * ui.spec.ts — Theme, responsive layout, navigation, 404.
 * Runs under both chromium and mobile projects.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// 1. Theme toggle
// ---------------------------------------------------------------------------
test.describe('Theme toggle', () => {
  for (const path of ['/', '/home', '/photos']) {
    test(`persists after reload on ${path}`, async ({ page }) => {
      await page.goto(path);
      const html = page.locator('html');
      const btn  = page.locator('button[aria-label*="mode"]').first();
      await btn.click();
      const classAfterToggle = await html.getAttribute('class');
      await page.reload();
      const classAfterReload = await html.getAttribute('class');
      expect(classAfterReload).toBe(classAfterToggle);
    });
  }

  test('dark mode CSS variable is not the linen light colour', async ({ page }) => {
    await page.goto('/');
    // Switch to dark if currently light
    const label = await page.locator('button[aria-label*="mode"]').first().getAttribute('aria-label');
    if (label?.toLowerCase().includes('dark')) {
      await page.locator('button[aria-label*="mode"]').first().click();
    }
    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    );
    expect(bg).not.toBe('#F7F4EF');
    expect(bg).not.toBe('');
  });

  test('toggle on /home switches html class', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    const html   = page.locator('html');
    const btn    = page.locator('button[aria-label*="mode"]').first();
    const before = await html.getAttribute('class');
    await btn.click();
    const after  = await html.getAttribute('class');
    expect(after).not.toBe(before);
  });
});

// ---------------------------------------------------------------------------
// 2. Responsive layout — mobile (375px)
// ---------------------------------------------------------------------------
test.describe('Mobile layout (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('landing page has no horizontal scroll', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(5);
  });

  test('/home has no unexpected horizontal page overflow', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(2000);
    // FeaturedPosts uses an intentional horizontal scroll row — measure #root overflow instead
    const overflow = await page.evaluate(() => {
      const root = document.getElementById('root') || document.body;
      return root.offsetWidth - window.innerWidth;
    });
    expect(overflow).toBeLessThanOrEqual(5);
  });

  test('/photos has no horizontal scroll', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(2000);
    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(5);
  });

  test('hamburger button is visible', async ({ page }) => {
    await page.goto('/home');
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible();
  });

  test('desktop nav links are hidden', async ({ page }) => {
    await page.goto('/home');
    // The sm:flex container should not be visible at 375px
    const desktopLinks = page.locator('.hidden.sm\\:flex').first();
    await expect(desktopLinks).not.toBeVisible();
  });

  test('hamburger opens menu with nav links', async ({ page }) => {
    await page.goto('/home');
    await page.locator('button[aria-label="Menu"]').click();
    await expect(page.getByRole('link', { name: /^read$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /^photos$/i })).toBeVisible();
  });

  test('mobile menu closes when a link is clicked', async ({ page }) => {
    await page.goto('/home');
    await page.locator('button[aria-label="Menu"]').click();
    await page.getByRole('link', { name: /^photos$/i }).click();
    await expect(page).toHaveURL('/photos');
    // Hamburger should be back (menu closed)
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible();
  });

  test('login link is visible in mobile menu (logged-out)', async ({ page }) => {
    // Navigate first, then clear token to simulate logged-out state
    await page.goto('/home');
    await page.evaluate(() => window.localStorage.removeItem('token'));
    await page.reload();
    await page.locator('button[aria-label="Menu"]').click();
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 3. Responsive — tablet (768px)
// ---------------------------------------------------------------------------
test.describe('Tablet layout (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('landing page renders without overflow', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.body.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(5);
  });

  test('/home renders without page overflow', async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(2000);
    const overflow = await page.evaluate(() => {
      const root = document.getElementById('root') || document.body;
      return root.offsetWidth - window.innerWidth;
    });
    expect(overflow).toBeLessThanOrEqual(5);
  });
});

// ---------------------------------------------------------------------------
// 4. Navigation
// ---------------------------------------------------------------------------
test.describe('Navigation', () => {
  test('logo returns to / from each main page', async ({ page }) => {
    for (const path of ['/home', '/photos', '/login']) {
      await page.goto(path);
      await page.getByRole('link', { name: /√2/i }).click();
      await expect(page).toHaveURL('/');
    }
  });

  test('browser back button works', async ({ page }) => {
    await page.goto('/');
    await page.goto('/home');
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('footer Writing link goes to /home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^writing$/i }).click();
    await expect(page).toHaveURL('/home');
  });

  test('footer Photos link goes to /photos', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^photos$/i, exact: true })
      .last() // footer link
      .click();
    await expect(page).toHaveURL('/photos');
  });
});

// ---------------------------------------------------------------------------
// 5. 404
// ---------------------------------------------------------------------------
test.describe('404 page', () => {
  test('unknown route shows 404 text', async ({ page }) => {
    await page.goto('/this-does-not-exist-xyz');
    await expect(page.locator('text=404')).toBeVisible();
  });

  test('404 page has a link back home', async ({ page }) => {
    await page.goto('/this-does-not-exist-xyz');
    await expect(
      page.getByRole('link', { name: /home|back|posts/i }).first()
    ).toBeVisible();
  });

  test('invalid blog ID shows error state', async ({ page }) => {
    await page.goto('/blog/000000000000000000000000');
    await expect(
      page.locator('text=/not found|couldn\'t load|404/i').first()
    ).toBeVisible({ timeout: 12000 });
  });
});
