const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const EventsDashboard = require('./EventsDashboard');

class CreateLiveWebinar extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators
    this.addTitle_txt = page.locator('input[placeholder="Add your webinar title..."]');
    this.schedulingOptions_btn = page.locator('button:has-text("Next : Scheduling Options")');
    this.liveWebinar_btn = page.locator('div.creation-select-box').filter({ hasText: 'Live' });
    this.timezoneSelect = page.locator('mat-select[formcontrolname="timezoneId"]');
  }
    async clickonCreateWebinar() {
    const dashboard = new EventsDashboard(this.page);
     await this.validateElementVisibility(dashboard.createWebinar_btn, 'Create Webinar Button');

    // Click the "Create a Webinar" button
    await dashboard.createWebinar_btn.click();
}
   async clickLiveButton() {
    await this.validateElementVisibility(this.liveWebinar_btn, 'Live Webinar Button');
    await this.liveWebinar_btn.click();
    console.log('✅ Clicked on Live Button');
   }

    async enterWebinarTitle(title) {
    await this.addTitle_txt.fill(title);
    console.log(`✅ Entered Webinar Title: ${title}`);
    }
    async clickSchedulingOptions() {
    await this.schedulingOptions_btn.click();
    }
}
module.exports = CreateLiveWebinar;