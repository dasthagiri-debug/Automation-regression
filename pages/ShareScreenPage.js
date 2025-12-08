const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class ShareScreenPage 
   {
    constructor(page) {
   // super(page);
    this.page = page;

    //Locators
    //this.shareLocator = page.locator('span:has-text("Share")');

    }
}
module.exports = ShareScreenPage;
