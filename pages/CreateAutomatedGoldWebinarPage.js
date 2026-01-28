const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const EventsDashboard = require('./EventsDashboard');
const ConfigReader = require('../utils/config');

class CreateAutomatedGoldWebinar extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators
    this.closeBlackFriday_btn = page.locator("//mat-icon[normalize-space()='close']");
    this.automatedGold_btn = page.locator("//h6[normalize-space()='Automated Gold']");
    this.justInTime_btn = page.locator("div.box-input-form.inner-dates-block input[type='checkbox']");
    this.videoTitleGold_input = page.locator("input[placeholder='Video Title']");
    this.videoURLGold_input = page.locator("input[placeholder='Add video URL']");
    this.minsInput = page.locator("//input[@placeholder='Min(s)']");
     }


  async clickAutomatedGoldButton() {
    await this.validateElementVisibility(this.automatedGold_btn, 'Automated Webinar Button');
    await this.automatedGold_btn.click();
    console.log('✅ Clicked on Automated Button');
   }

   async clickJustInTimeCheckbox() {
    await this.validateElementVisibility(this.justInTime_btn, 'Just In Time Checkbox');
    await this.justInTime_btn.check();
    console.log('✅ Checked Just In Time Checkbox');
   }
   async enterVideoTitleGold(videoTitle) {
    await this.validateElementVisibility(this.videoTitleGold_input, 'Video Title Input Field');
    const title = videoTitle || ConfigReader.getProperty('webinars.videotitle');
    await this.videoTitleGold_input.fill(title);
    console.log(`✅ Entered Video Title: ${title}`);
}
   async enterVideoURLGold(videoURL) {

    await this.validateElementVisibility(this.videoURLGold_input, 'Video URL Input Field');
        const URL = videoURL || ConfigReader.getProperty('webinars.videourl');
        await this.videoURLGold_input.fill(URL);
        console.log(`✅ Entered Video URL: ${URL}`);
        await this.page.waitForTimeout(20000);
        await this.videoURLGold_input.press('Enter');
        await this.minsInput.waitFor({ state: 'visible' });
        console.log("⏳ Min(s) field is now visible");
}

}
  module.exports = CreateAutomatedGoldWebinar;