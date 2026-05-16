import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * LoginPage encapsulates locators and interactions for the /login page
 * of The Internet HerokuApp.
 */
export class LoginPage extends BasePage {
  static readonly URL = "https://the-internet.herokuapp.com/login";

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  /**
   * Initializes locators for the login page.
   */
  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel("Username");
    this.passwordInput = page.getByLabel("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.flashMessage = page.locator("#flash");
  }

  /**
   * Navigates to the login page and waits for it to finish loading by ensuring the login button is visible.
   */
  async open(): Promise<void> {
    await this.goto(LoginPage.URL);
    await this.waitForVisible(this.loginButton);
  }

  /**
   * Performs the login action by filling in credentials and submitting the form.
   */
  async login(username: string, password: string): Promise<void> {
    // pressSequentially types one character at a time so the input is visually observable.
    await this.usernameInput.pressSequentially(username, { delay: 80 });
    await this.passwordInput.pressSequentially(password, { delay: 80 });
    await this.loginButton.click();
  }
}
