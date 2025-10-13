const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // ---------------------------
  // Basic Actions
  // ---------------------------
  async click(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.click({ timeout: 15000 });
  }

   async validateElementVisibility(locator, elementName) {
    await expect(locator).toBeVisible({ timeout: 5000 });
    console.log(`✅ ${elementName} is visible`);
  }

  async type(selector, text) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.fill(text, { timeout: 15000 });
  }

  async getText(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'visible', timeout: 15000 });
    return (await element.textContent()) || '';
  }

  async isVisible(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await element.isVisible();
  }

  async isEnabled(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await element.isEnabled();
  }

  async waitForVisible(selector, timeout = 15000) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'visible', timeout });
  }

  async scrollToElement(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.scrollIntoViewIfNeeded();
  }

  async expectText(selector, text) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(element).toHaveText(text, { timeout: 15000 });
  }

  // ---------------------------
  // Dropdowns
  // ---------------------------
  async selectByValue(selector, value) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.selectOption({ value });
  }

  async selectByLabel(selector, label) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.selectOption({ label });
  }

  async selectByIndex(selector, index) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    const options = await element.locator('option').all();
    if (index >= 0 && index < options.length) {
      await element.selectOption({ index });
    } else {
      throw new Error(`Index ${index} out of range for dropdown`);
    }
  }

  // ---------------------------
  // Checkboxes & Radio Buttons
  // ---------------------------
  async check(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    if (!(await element.isChecked())) await element.check();
  }

  async uncheck(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    if (await element.isChecked()) await element.uncheck();
  }

  async isChecked(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    return await element.isChecked();
  }

  // ---------------------------
  // Hover & Mouse Actions
  // ---------------------------
  async hover(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.hover();
  }

  async doubleClick(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.dblclick();
  }

  async rightClick(selector) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.click({ button: 'right' });
  }

  // ---------------------------
  // Alerts / Modals
  // ---------------------------
  async acceptAlert() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
  }

  async dismissAlert() {
    this.page.once('dialog', async (dialog) => {
      await dialog.dismiss();
    });
  }

  async getAlertText() {
    return new Promise((resolve) => {
      this.page.once('dialog', async (dialog) => {
        resolve(dialog.message());
        await dialog.dismiss();
      });
    });
  }

  // ---------------------------
  // Wait Helpers
  // ---------------------------
  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  async waitForSelector(selector, timeout = 15000) {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.waitFor({ state: 'visible', timeout });
  }
}

module.exports = BasePage;