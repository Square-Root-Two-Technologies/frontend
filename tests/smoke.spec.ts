import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@squareroottwo.in';
const TEST_PASS  = process.env.TEST_PASS  || 'testpass123';

async function login(page: any) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASS);
  await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  await page.waitForURL(/\/(home|my-notes)/, { timeout: 10000 });
}

// ---------------------------------------------------------------------------
// 1. Landing page
// ---------------------------------------------------------------------------
test.describe('Landing page', () => {
  test('loads and shows hero headline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('theme toggle switches dark/light', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    const btn = page.locator('button[aria-label*="mode"]').first();
    const initialClass = await html.getAttribute('class');
    await btn.click();
    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);
  });

  test('"Read all posts" link navigates to /home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /read all posts/i }).click();
    await expect(page).toHaveURL('/home');
  });

  test('"All photos" link navigates to /photos', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: /all photos/i });
    if (await link.isVisible()) {
      await link.click();
      await expect(page).toHaveURL('/photos');
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Navigation
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

  test('Search submits query and navigates to /search', async ({ page }) => {
    await page.goto('/home');
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('test');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/\/search\?q=test/);
  });

  test('logo navigates to landing page', async ({ page }) => {
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
    await page.waitForSelector('article', { timeout: 15000 });
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible();
  });

  test('/blogspace loads post grid', async ({ page }) => {
    await page.goto('/blogspace');
    await page.waitForSelector('article', { timeout: 15000 });
    const cards = page.locator('article');
    await expect(cards.first()).toBeVisible();
  });

  test('clicking a post card opens /blog/:id', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article a[href*="/blog/"]', { timeout: 15000 });
    const firstLink = page.locator('article a[href*="/blog/"]').first();
    await firstLink.click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('single blog post shows title and back link', async ({ page }) => {
    await page.goto('/home');
    await page.waitForSelector('article a[href*="/blog/"]', { timeout: 15000 });
    await page.locator('article a[href*="/blog/"]').first().click();
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: /all posts|back/i }).first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 4. Search
// ---------------------------------------------------------------------------
test.describe('Search', () => {
  test('search results page renders for a query', async ({ page }) => {
    await page.goto('/search?q=the');
    await expect(page.locator('h1, h2').filter({ hasText: /search|result/i }).first()).toBeVisible({ timeout: 10000 });
  });

  test('empty search query shows appropriate state', async ({ page }) => {
    await page.goto('/search?q=');
    await expect(page).toHaveURL(/\/search/);
  });
});

// ---------------------------------------------------------------------------
// 5. Auth
// ---------------------------------------------------------------------------
test.describe('Auth', () => {
  test('login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('signup page renders all fields', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
  });

  test('accessing /my-notes while logged out redirects to /login', async ({ page }) => {
    await page.goto('/my-notes');
    await expect(page).toHaveURL(/\/login/);
  });

  test('accessing /add-note while logged out redirects to /login', async ({ page }) => {
    await page.goto('/add-note');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login with wrong credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('wrong@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in|login|sign in/i }).click();
    await expect(page.locator('text=/error|invalid|incorrect|credentials/i').first()).toBeVisible({ timeout: 8000 });
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

  test('/photos page shows grid or empty state', async ({ page }) => {
    await page.goto('/photos');
    await page.waitForTimeout(2000);
    const hasPhotos = await page.locator('button img').count() > 0;
    const hasEmpty = await page.locator('text=/no photos/i').isVisible();
    expect(hasPhotos || hasEmpty).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. 404
// ---------------------------------------------------------------------------
test.describe('404', () => {
  test('unknown route shows 404 page', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-xyz');
    await expect(page.locator('text=404')).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// 8. Responsive — mobile viewport (run with mobile project)
// ---------------------------------------------------------------------------
test.describe('Responsive — mobile', () => {
  test('hamburger menu opens on mobile', async ({ page }) => {
    await page.goto('/home');
    const hamburger = page.locator('button[aria-label="Menu"]');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.locator('a[href="/login"], a[href="/signup"]').first()).toBeVisible();
    }
  });
});
