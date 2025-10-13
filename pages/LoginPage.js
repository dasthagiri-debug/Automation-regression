const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const ConfigReader = require('../utils/config');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.txtEmail = page.getByLabel('Email address/Username');
    this.txtPassword = page.getByLabel('Password');
    this.btnLogin = page.locator('button[type="submit"]');
  }

  async enterUsername(username) {
    const user = username || ConfigReader.getProperty('credentials.username');
    if (!user) throw new Error('Username not found in configuration.yaml under credentials.username');

    await this.txtEmail.waitFor({ state: 'visible', timeout: 30000 });
    await this.txtEmail.fill(user);
  }

  async enterPassword(password) {
    const pass = password || ConfigReader.getProperty('credentials.password');
    if (!pass) throw new Error('Password not found in configuration.yaml under credentials.password');

    await this.txtPassword.waitFor({ state: 'visible', timeout: 30000 });
    await this.txtPassword.fill(pass);
  }

  async clickLogin() {
    await this.btnLogin.waitFor({ state: 'visible', timeout: 30000 });
    await this.btnLogin.click();
  }

  async verifyDashboardRedirect(dashboardUrl) {
    const url = dashboardUrl || ConfigReader.getProperty('urls.dashboard');
    if (!url) {
      throw new Error(
        'Dashboard URL not found. Add `urls:\n  dashboard: "<your dashboard url>"` to configuration.yaml\n' +
        'Or pass the URL as an argument to verifyDashboardRedirect(url).'
      );
    }

    console.log(`✅ Verifying dashboard redirect to: ${url}`);
    await expect(this.page).toHaveURL(url, { timeout: 30000 });
  }

  async pause() {
    if (this.page && typeof this.page.pause === 'function') {
      await this.page.pause();
    } else {
      debugger;
    }
  }
}
module.exports = LoginPage ; 