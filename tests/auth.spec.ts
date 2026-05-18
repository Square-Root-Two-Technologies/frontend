/**
 * auth.spec.ts — Authenticated session tests.
 * Runs under the 'chromium' project which loads saved storageState (logged-in).
 * If TEST_EMAIL/TEST_PASS were not set during setup, the token won't be present
 * and these tests will soft-skip themselves gracefully.
 */
import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helper — check whether the saved session actually has a token
// ---------------------------------------------------------------------------
async function requireAuth(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    test.skip(true, 'No auth token — set TEST_EMAIL and TEST_PASS to run auth tests');
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// 1. Session state — navbar should show user after loading saved auth
// ---------------------------------------------------------------------------
test.describe('Authenticated session', () => {
  test('token is present in localStorage', async ({ page }) => {
    await page.goto('/home');
    const token = await page.evaluate(() => localStorage.getItem('token'));
    if (!token) test.skip(true, 'No auth token');
    expect(token!.length).toBeGreaterThan(20);
  });

  test('navbar shows user name when logged in', async ({ page }) => {
    await page.goto('/home');
    if (!(await requireAuth(page))) return;
    // Wait for user context to hydrate
    await page.waitForTimeout(2000);
    // User button/name should appear in the nav area
    await expect(
      page.locator('nav').locator('button, span').filter({ hasText: /[A-Za-z]{2,}/ }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test('/my-notes is accessible when logged in', async ({ page }) => {
    await page.goto('/my-notes');
    if (!(await requireAuth(page))) return;
    await expect(page).toHaveURL(/\/my-notes/);
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('/add-note is accessible when logged in', async ({ page }) => {
    await page.goto('/add-note');
    if (!(await requireAuth(page))) return;
    await expect(page).toHaveURL(/\/add-note/);
    await expect(page.getByPlaceholder(/title/i)).toBeVisible({ timeout: 10000 });
  });

  test('/profile is accessible when logged in', async ({ page }) => {
    await page.goto('/profile');
    if (!(await requireAuth(page))) return;
    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 });
  });
});

// ---------------------------------------------------------------------------
// 2. My Notes page
// ---------------------------------------------------------------------------
test.describe('My Notes page', () => {
  test('shows + New post button', async ({ page }) => {
    await page.goto('/my-notes');
    if (!(await requireAuth(page))) return;
    await expect(
      page.getByRole('button', { name: /new post|add note/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test('clicking + New post navigates to /add-note', async ({ page }) => {
    await page.goto('/my-notes');
    if (!(await requireAuth(page))) return;
    await page.getByRole('button', { name: /new post|add note/i }).click();
    await expect(page).toHaveURL(/\/add-note/);
  });

  test('notes list renders (or shows empty state)', async ({ page }) => {
    await page.goto('/my-notes');
    if (!(await requireAuth(page))) return;
    await page.waitForTimeout(3000);
    const hasCards = await page.locator('[style*="border-radius"]').count() > 0;
    const hasEmpty = await page.locator('text=/haven\'t written|no notes/i').isVisible();
    expect(hasCards || hasEmpty).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. Add Note form
// ---------------------------------------------------------------------------
test.describe('Add Note form', () => {
  test('renders title input, category select, and Tiptap editor', async ({ page }) => {
    await page.goto('/add-note');
    if (!(await requireAuth(page))) return;
    await expect(page.getByPlaceholder(/title/i)).toBeVisible({ timeout: 10000 });
    // Tiptap editor — contenteditable div
    await expect(page.locator('.ProseMirror').first()).toBeVisible({ timeout: 10000 });
  });

  test('category dropdown loads options from API', async ({ page }) => {
    await page.goto('/add-note');
    if (!(await requireAuth(page))) return;
    const select = page.locator('select').first();
    await expect(select).toBeVisible({ timeout: 10000 });
    const count = await select.locator('option').count();
    expect(count).toBeGreaterThan(1);
  });

  test('Tiptap editor accepts typed content', async ({ page }) => {
    await page.goto('/add-note');
    if (!(await requireAuth(page))) return;
    const editor = page.locator('.ProseMirror').first();
    await editor.click();
    await editor.type('Hello from Playwright');
    await expect(editor).toContainText('Hello from Playwright');
  });

  test('empty title prevents submission (stays on /add-note)', async ({ page }) => {
    await page.goto('/add-note');
    if (!(await requireAuth(page))) return;
    await page.getByRole('button', { name: /save|publish|add|create/i }).click();
    await expect(page).toHaveURL(/\/add-note/);
  });
});

// ---------------------------------------------------------------------------
// 4. Full CRUD: create → verify → edit → delete
// ---------------------------------------------------------------------------
const UNIQUE_TITLE = `Playwright test ${Date.now()}`;

test.describe('Note CRUD', () => {
  test('create post, verify in My Notes, then delete', async ({ page }) => {
    await page.goto('/add-note');
    if (!(await requireAuth(page))) return;

    // Fill title
    await page.getByPlaceholder(/title/i).fill(UNIQUE_TITLE);

    // Fill editor
    const editor = page.locator('.ProseMirror').first();
    await editor.click();
    await editor.type('Created by Playwright automation test.');

    // Submit
    await page.getByRole('button', { name: /save|publish|add|create/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/add-note'), { timeout: 15000 });

    // Navigate to My Notes and find the new post
    await page.goto('/my-notes');
    await page.waitForTimeout(3000);
    await expect(page.locator(`text=${UNIQUE_TITLE}`).first()).toBeVisible({ timeout: 10000 });

    // Delete it — keep DB clean
    const card = page.locator('div').filter({ hasText: UNIQUE_TITLE }).first();
    const deleteBtn = card.getByRole('button', { name: /delete/i });
    if (await deleteBtn.isVisible()) {
      // Handle window.confirm
      page.on('dialog', (dialog) => dialog.accept());
      await deleteBtn.click();
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${UNIQUE_TITLE}`)).not.toBeVisible({ timeout: 8000 });
    }
  });

  test('edit a post title', async ({ page }) => {
    await page.goto('/my-notes');
    if (!(await requireAuth(page))) return;
    await page.waitForTimeout(3000);

    // Find any edit button
    const editBtn = page.getByRole('button', { name: /^edit$/i }).first();
    if (!(await editBtn.isVisible())) return; // no posts to edit

    await editBtn.click();
    await expect(page).toHaveURL(/\/edit-note\/.+/);

    // Change title
    const titleInput = page.getByPlaceholder(/title/i);
    const original = await titleInput.inputValue();
    await titleInput.clear();
    await titleInput.fill(`${original} — pw-edited`);

    await page.getByRole('button', { name: /save|update|publish/i }).click();
    await page.waitForURL((url) => !url.pathname.includes('/edit-note'), { timeout: 10000 });

    // Restore original title
    await page.goto('/my-notes');
    await page.waitForTimeout(2000);
    const restoreBtn = page.locator('div').filter({ hasText: /pw-edited/ }).first()
      .getByRole('button', { name: /^edit$/i });
    if (await restoreBtn.isVisible()) {
      await restoreBtn.click();
      await page.getByPlaceholder(/title/i).clear();
      await page.getByPlaceholder(/title/i).fill(original);
      await page.getByRole('button', { name: /save|update|publish/i }).click();
      await page.waitForURL((url) => !url.pathname.includes('/edit-note'), { timeout: 10000 });
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Logout
// ---------------------------------------------------------------------------
test.describe('Logout', () => {
  test('logout clears token and redirects to /login', async ({ page }) => {
    await page.goto('/home');
    if (!(await requireAuth(page))) return;
    await page.waitForTimeout(1500);

    // Open user dropdown
    const userBtn = page.locator('nav .hidden.sm\\:block button').first();
    await userBtn.click();

    await page.getByRole('button', { name: /logout/i }).click();
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });
});
