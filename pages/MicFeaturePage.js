const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class MicFeaturePage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators
 this.micButton = page.locator('button.control-button.mic-on');
  }}