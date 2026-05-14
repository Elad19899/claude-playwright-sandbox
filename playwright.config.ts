import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: false }],
  ],

  use: {
    trace: 'on-first-retry',
    /* Run headed locally so the browser is visible; stay headless on CI. */
    headless: !!process.env.CI,
    /* Slow each Playwright action so data entry is observable when running locally. */
    launchOptions: {
      slowMo: process.env.CI ? 0 : 300,
    },
  },

  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
