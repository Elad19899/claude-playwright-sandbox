import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  static readonly URL = 'https://the-internet.herokuapp.com/login';

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.flashMessage = page.locator('#flash');
  }

  async open(): Promise<void> {
    await this.goto(LoginPage.URL);
    await this.waitForVisible(this.loginButton);
  }

  async login(username: string, password: string): Promise<void> {
    // pressSequentially types one character at a time so the input is visually observable.
    await this.usernameInput.pressSequentially(username, { delay: 80 });
    await this.passwordInput.pressSequentially(password, { delay: 80 });
    await this.loginButton.click();
  }
}
