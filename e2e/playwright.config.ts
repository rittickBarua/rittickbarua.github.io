import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for rittickbarua.com.
 *
 * BASE_URL can be overridden per run:
 *   npm run test:local  -> http://localhost:4000 (docker compose up)
 *   npm run test:prod   -> https://rittickbarua.com
 */
const BASE_URL = process.env.BASE_URL || 'http://host.docker.internal:4000';

export default defineConfig({
  testDir: './specs',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 13'] },
      testMatch: /(smoke|responsive)\.spec\.ts/,
    },
  ],
});
