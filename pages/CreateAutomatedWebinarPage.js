const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const EventsDashboard = require('./EventsDashboard');
const ConfigReader = require('../utils/config');

class CreateAutomatedWebinar extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators
   // this.closeBlackFriday_btn = page.locator("//mat-icon[normalize-space()='close']");
    this.closeBlackFriday_btn = this.page.locator("span.close-dialog"); 
    this.automated_btn = page.locator("//mat-radio-button[@id='mat-radio-3']");
    this.videoselection_btn = page.locator("//button[@class='mat-focus-indicator large-btn-ew mat-flat-button mat-button-base mat-accent ng-star-inserted']//div[@class='mat-ripple mat-button-ripple']");
    this.addVideo_btn= page.locator("//button[@class='mat-focus-indicator padding-right-15px-ew medium-btn-ew mat-flat-button mat-button-base mat-accent ng-star-inserted']//mat-icon[@role='img'][normalize-space()='add']");
    this.videotitle_btn = page.locator("//input[@id='mat-input-3']");
    this.videourl_btn = page.locator("//input[@name='video_url']");
    this.addvideo_btn = page.locator("//span[text()='Add Video ']");
    this.continueToTemplates_btn = page.locator("//span[text()='Continue to Templates']");
    this.skipToDashboardBtn = page.locator("//span[text()='Skip & move to dashboard ']");
    this.minsInput = page.locator("//input[@placeholder='Min(s)']");
  }
  
  async closeBlackFridayPopup() {
    try {
    // Wait up to 5 seconds for the popup to appear
    await this.closeBlackFriday_btn.waitFor({ state: 'visible', timeout: 5000 });
    console.log(await this.closeBlackFriday_btn.isVisible());
    console.log(await this.closeBlackFriday_btn.isEnabled());
    // Click the close button
    await this.closeBlackFriday_btn.click({ force: true }); // force in case overlay blocks it
    console.log("✅ Closed Black Friday Popup");

  } catch (err) {
    // If waitFor times out → popup not visible
    console.log("ℹ️ Black Friday Popup not visible, no action taken");
  }
}
  

  async clickAutomatedButton() {
    await this.validateElementVisibility(this.automated_btn, 'Automated Webinar Button');
    await this.automated_btn.click();
    console.log('✅ Clicked on Automated Button');
   }
    async clickVideoSelectionButton() {
    await this.validateElementVisibility(this.videoselection_btn, 'Video Selection Button');
    await this.videoselection_btn.click();
    console.log('✅ Clicked on Video Selection Button');
  }
  async clickAddVideoButton() {
    await this.validateElementVisibility(this.addVideo_btn, 'Add Video Button');
    await this.addVideo_btn.click();
    console.log('✅ Clicked on Add Video Button');
  }


async enterVideoTitle(videoTitle) {
    await this.validateElementVisibility(this.videotitle_btn, 'Video Title Input Field');
    const title = videoTitle || ConfigReader.getProperty('webinars.videotitle');
    await this.videotitle_btn.fill(title);
    console.log(`✅ Entered Video Title: ${title}`);
}

  async enterVideoURL(videoURL) {
    await this.validateElementVisibility(this.videourl_btn, 'Video URL Input Field');
    const URL = videoURL || ConfigReader.getProperty('webinars.videourl');
    await this.videourl_btn.fill(URL);
    console.log(`✅ Entered Video URL: ${URL}`);
    await this.page.waitForTimeout(5000);
    await this.videourl_btn.press('Enter');
    await this.minsInput.waitFor({ state: 'visible' });
    console.log("⏳ Min(s) field is now visible");
  }
 
  /*async clickAddVideo() {
    await this.validateElementVisibility(this.addvideo_btn, 'Add Video Button');
    await this.addvideo_btn.waitFor({ state: 'visible' });
await this.addvideo_btn.waitFor({ state: 'attached' });
await this.addvideo_btn.waitFor({ state: 'stable' });
await this.addvideo_btn.click();
    console.log('✅ Clicked on Add Video Button');
  await this.page.waitForTimeout(5000);
  }*/

  async clickAddVideo() {
  await this.validateElementVisibility(this.addvideo_btn, 'Add Video Button');
  await expect(this.addvideo_btn).toBeVisible();
  await expect(this.addvideo_btn).toBeEnabled();

  // Wait for any overlay/spinner to disappear BEFORE click
 /*await this.page.waitForSelector('.cdk-overlay-backdrop, .loading-spinner', {
    state: 'detached'
  }).catch(() => {});
*/
await this.page.waitForTimeout(300); // micro-wait

for (let i = 0; i < 10; i++) { // max 2 seconds
  const count = await this.page.locator(".cdk-overlay-backdrop, .loading-spinner").count();
  if (count === 0) break; // overlay gone → safe to continue
  await this.page.waitForTimeout(200);
}

console.log("⏳ Overlay check completed");
  // Scroll into view (important for Angular Material)
  await this.addvideo_btn.scrollIntoViewIfNeeded();

  // Check if the button is clickable
  await this.addvideo_btn.click({ trial: true });

  // Actual click
  await this.addvideo_btn.click();
  console.log('✅ Clicked on Add Video Button');
}

  async clickContinueToTemplates() {
  await this.validateElementVisibility(this.continueToTemplates_btn, 'Continue to Templates Button');
  
  await expect(this.continueToTemplates_btn).toBeVisible();
  await expect(this.continueToTemplates_btn).toBeEnabled();

  await this.continueToTemplates_btn.click();
  console.log('✅ Clicked on Continue to Templates Button');

  return new EventsDashboard(this.page);
}

  async clickSkipToDashboard() {
    await this.validateElementVisibility(this.skipToDashboardBtn, 'Skip to Dashboard Button');
    await this.skipToDashboardBtn.click();
    console.log('✅ Clicked on Skip to Dashboard Button');
    return new EventsDashboard(this.page);
  }
}
  module.exports = CreateAutomatedWebinar;