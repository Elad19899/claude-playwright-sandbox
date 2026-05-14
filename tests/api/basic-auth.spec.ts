import { expect, test } from '@playwright/test';

/**
 * API-level checks against The Internet HerokuApp's HTTP Basic Auth endpoint.
 * Uses Playwright's `request` fixture — no browser is launched for these tests.
 */
const BASIC_AUTH_URL = 'https://the-internet.herokuapp.com/basic_auth';

test.describe('API: Basic Auth', () => {
  test('rejects unauthenticated requests with 401', async ({ request }) => {
    const response = await request.get(BASIC_AUTH_URL);

    expect(response.status()).toBe(401);
    expect(response.headers()['www-authenticate']).toMatch(/Basic/i);
  });

  test('accepts valid Basic credentials and returns success body', async ({ playwright }) => {
    const context = await playwright.request.newContext({
      httpCredentials: { username: 'admin', password: 'admin' },
    });

    const response = await context.get(BASIC_AUTH_URL);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toContain('Congratulations! You must have the proper credentials.');

    await context.dispose();
  });
});
