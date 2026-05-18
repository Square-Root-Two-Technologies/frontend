import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // 1. Global setup — runs login once, saves auth state to file
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    // 2. Chromium — authenticated tests reuse saved login state
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testIgnore: /global\.setup\.ts/,
    },
    // 3. No-auth project — for pages that must work logged out
    {
      name: 'chromium-noauth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /smoke\.spec\.ts|ui\.spec\.ts/,
    },
    // 4. Mobile viewport
    {
      name: 'mobile',
      use: {
        ...devices['Pixel 5'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /ui\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
