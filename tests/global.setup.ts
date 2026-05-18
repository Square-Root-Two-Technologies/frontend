import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_FILE = 'playwright/.auth/user.json';

// ---------------------------------------------------------------------------
// Login once, save storage state — all authenticated tests reuse this session
// ---------------------------------------------------------------------------
setup('authenticate', async ({ page }) => {
  const email    = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASS;

  if (!email || !password) {
    // No credentials supplied — write an empty auth file so dependent projects
    // still run but will behave as logged-out (auth-specific assertions skip).
    const dir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }));
    console.warn('⚠️  TEST_EMAIL / TEST_PASS not set — auth tests will run as logged-out.');
    return;
  }

  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait until we leave /login (successful auth redirects to / or /home)
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 20000 });

  // Confirm the token landed in localStorage
  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token, 'Expected JWT in localStorage after login').not.toBeNull();

  await page.context().storageState({ path: AUTH_FILE });
  console.log('✓ Auth state saved to', AUTH_FILE);
});
