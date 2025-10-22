const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class LiveRoomPage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators
   
    this.chatIcon = page.locator('.ew-action-icon img', { has: page.locator(':visible') });
    this.peopleIcon = page.locator('a:has-text("People") img:visible');
    this.offersIcon = page.locator('li:has-text("Offers") a');
    this.pollsIcon = page.locator('li:has-text("Polls") a');
    this.designIcon = page.locator('a:has-text("Design")');
    this.reconnectbtn = page.locator('span:has-text("Reconnect")');
  }
  async verifyChatIcon(){
    await expect(this.chatIcon).toBeVisible();
    console.log("Chat icon is visible");
  }
  async verifyPeopleIcon(){
    await expect(this.peopleIcon).toBeVisible();
    console.log("People icon is visible");
  }
  async verifyOffersIcon(){
    await expect(this.offersIcon).toBeVisible();
    console.log("Offers icon is visible");
  }
  async verifyPollsIcon(){
    await expect(this.pollsIcon).toBeVisible();
    console.log("Polls icon is visible");
  }
  async verifyDesignIcon(){
    await expect(this.designIcon).toBeVisible();
    console.log("Design icon is visible");
  }
  async clickReconnectButton(){
    await this.reconnectbtn.toBeVisible();
    console.log("Reconnect button visible");
  }
}
module.exports = LiveRoomPage;