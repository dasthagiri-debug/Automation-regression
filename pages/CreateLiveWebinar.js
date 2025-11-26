
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
    this.panel = page.locator('div.mat-select-panel');
    this.option = page.locator('mat-option >> text="(UTC+05:30)-Chennai, Kolkata, Mumbai, New Delhi"');
    this.templateSelection_btn = page.locator('//span[contains(text(), "Next : Template Selection")]');
    this.skipAndMoveToDashboard_btn = page.getByRole('button', { name: 'Skip & move to dashboard' });
    this.enterRoomBtn = page.getByText("Enter Room");

  }
    async clickonCreateWebinar() {
    const dashboard = new EventsDashboard(this.page);
     await this.validateElementVisibility(dashboard.createWebinar_btn, 'Create Webinar Button');

    // Click the "Create a Webinar" button
    await dashboard.createWebinar_btn.click({ timeout: 15000 });
    console.log('✅ Clicked Create a Webinar button');
      // Wait for next page or modal to appear
 // await this.page.waitForLoadState('networkidle', { timeout: 3000 });
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

    async selectTimeZone() {
    await this.timezoneSelect.click();
    await this.validateElementVisibility(this.panel, 'Timezone Dropdown Panel');
    await this.option.click();
    console.log('✅ Selected Timezone: (UTC+05:30)-Chennai, Kolkata, Mumbai, New Delhi');
    }
    
    async clickNextToTemplateSelection() {
    await this.templateSelection_btn.click();
    console.log('✅ Clicked on Next to Template Selection Button');
    }

    async clickSkipAndMoveToDashboard() {
        await this.skipAndMoveToDashboard_btn.click();
        console.log('✅ Clicked on Skip & move to dashboard Button');
    }
    async verifyWebinarCreation() {
        await this.validateElementVisibility(this.enterRoomBtn, 'Enter Room Button');
        expect(await this.enterRoomBtn.isVisible()).toBeTruthy();
        console.log('✅ Webinar creation verified successfully');
    }
}
module.exports = CreateLiveWebinar;