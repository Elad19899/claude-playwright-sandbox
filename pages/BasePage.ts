import { Page, Locator, Response } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = ''): Promise<Response | null> {
    return this.page.goto(path);
  }

  async waitForVisible(locator: Locator, timeoutMs?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  currentUrl(): string {
    return this.page.url();
  }
}
