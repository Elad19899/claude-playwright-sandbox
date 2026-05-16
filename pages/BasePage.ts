import { Page, Locator, Response } from '@playwright/test';

/**
 * BasePage is the foundation for all Page Objects in the framework.
 * It holds shared utilities such as navigation, waiting, and retrieving basic page info.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the specified path.
   */
  async goto(path: string = ''): Promise<Response | null> {
    return this.page.goto(path);
  }

  /**
   * Waits for a given locator to be visible on the page.
   */
  async waitForVisible(locator: Locator, timeoutMs?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  /**
   * Returns the current page title.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Returns the current page URL.
   */
  currentUrl(): string {
    return this.page.url();
  }
}
