/**
 * smoke.spec.ts — Public-facing smoke tests (no login required).
 * Run by both chromium and chromium-noauth projects.
 */
import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// 1. Landing page
// ---------------------------------------------------------------------------
test.describe('Landing page', () => {
  test('loads and shows hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
  });

  test('theme toggle switches dark/light', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const btn  = page.locator('button[aria-label*="mode"]').first();
    const before = await html.getAttribute('class');
    await btn.click();
    const after = await html.getAttribute('class');
    expect(after).not.toBe(before);
  });

  test('"Read all posts" link navigates to /home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /read all posts/i }).click();
    await expect(page).toHaveURL('/home');
  });

  test('"All photos →" link navigates to /photos', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /all photos/i });
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL('/photos');
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Navbar
// ---------------------------------------------------------------------------
test.describe('Navbar', () => {
  test('Read link navigates to /home', async ({ page }) => {
    await page.goto('/home');
    await page.getByRole('link', { name: /^read$/i }).click();
    await expect(page).toHaveURL('/home');
  });

  test('Photos link navigates to /photos', async ({ page }) => {
    await page.goto('/home');
    await page.getByRole('link', { name: /^photos$/i }).click();
    await expect(page).toHaveURL('/photos');
  });

  test('search submits and navigates to /search', async ({ page }) => {
    await page.goto('/home');
    const input = page.locator('input[placeholder*="Search"]').first();
    await input.fill('test');
    await input.press('Enter');
    await expect(page).toHaveURL(/\/search\?q=test/);
  });

  test('logo navigates to /', async ({ page }) => {
    await page.goto('/home');
    await page.getByRole('link', { name: /√2/i }).click();
    await expect(page).toHaveURL('/');
  });
});

// ---------------------------------------------------------------------------
// 3. Blog — public reading
// ---------------------------------------------------------------------------
test.describe('Public blog reading', () => {
  test('/home loads post grid', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('/blogspace loads post grid', async ({ page }) => {
    await page.goto('/blogspace');
    await page.waitForSelector('article', { timeout: 20000 });
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('clicking a post card opens /blog/:id', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    // Click the "Read →" link inside the first card
    await page.locator('article').first().getByRole('link', { name: /read/i }).click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('single blog post shows title and back link', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    await page.locator('article').first().getByRole('link', { name: /read/i }).click();
    await expect(page.locator('h1')).toBeVisible();
    // "← All posts" or "← Back to all posts"
    await expect(page.getByRole('link', { name: /all posts|back/i }).first()).toBeVisible();
  });

  test('blog post body renders content', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article', { timeout: 20000 });
    await page.locator('article').first().getByRole('link', { name: /read/i }).click();
    await expect(page.locator('.blog-content')).toBeVisible({ timeout: 10000 });
  });
});

// ---------------------------------------------------------------------------
// 4. Search
// ---------------------------------------------------------------------------
test.describe('Search', () => {
  test('results page renders for a query', async ({ page }) => {
    await page.goto('/search?q=the');
    await expect(
      page.locator('h1, h2').filter({ hasText: /search|result/i }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('empty query stays on /search without crashing', async ({ page }) => {
    await page.goto('/search?q=');
    await expect(page).toHaveURL(/\/search/);
    await expect(page.locator('body')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 5. Auth — logged-out behaviour
// ---------------------------------------------------------------------------
test.describe('Auth (public)', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('login page has Sign up link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /sign up/i }).first()).toBeVisible();
  });

  test('signup page renders all fields', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/country/i)).toBeVisible();
    await expect(page.getByLabel(/city/i)).toBeVisible();
  });

  test('signup page has Sign in link', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('/my-notes redirects to /login when logged out', async ({ page }) => {
    // Must navigate to the app origin first so localStorage.removeItem works on localhost:3000
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/my-notes');
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  test('/add-note redirects to /login when logged out', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/add-note');
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  test('/profile redirects to /login when logged out', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
  });

  test('wrong credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('nobody@nowhere.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(
      page.locator('[style*="accent"], [style*="rgb(181"]').first()
    ).toBeVisible({ timeout: 8000 });
  });
});

// ---------------------------------------------------------------------------
// 6. Photography
// ---------------------------------------------------------------------------
test.describe('Photography', () => {
  test('/photos page loads', async ({ page }) => {
    await page.goto('/photos');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('/photos shows grid or empty state', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(2000);
    const hasPhotos = await page.locator('img').count() > 0;
    const hasEmpty  = await page.locator('text=/no photos/i').isVisible();
    expect(hasPhotos || hasEmpty).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. 404
// ---------------------------------------------------------------------------
test.describe('404', () => {
  test('unknown route shows 404', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz');
    await expect(page.locator('text=404')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 8. Mobile (chromium-noauth only — ui.spec.ts handles mobile project)
// ---------------------------------------------------------------------------
test.describe('Mobile smoke', () => {
  test('hamburger opens menu', async ({ page }) => {
    await page.goto('/home');
    const hamburger = page.locator('button[aria-label="Menu"]');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.getByRole('link', { name: /^read$/i })).toBeVisible();
    }
  });
});
