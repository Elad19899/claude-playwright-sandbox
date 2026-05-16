import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

/**
 * UI tests for the authentication flows.
 */
test.describe('Authentication', () => {
  /**
   * Verifies that a user can successfully log in using valid credentials
   * and sees the secure area flash message.
   */
  test('logs in successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    await expect(loginPage.flashMessage).toBeVisible();
    await expect(loginPage.flashMessage).toContainText('You logged into a secure area!');
    await expect(page).toHaveURL(/\/secure$/);

    await page.close();
  });
});
