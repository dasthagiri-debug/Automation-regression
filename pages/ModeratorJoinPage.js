
const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class ModeratorJoinPage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators

  
    this.ModeratorButton = page.locator("//button[normalize-space()='Moderator']");
    this.copyModeratorInvitationLinkButton = page.getByRole('button', { name: 'Copy Moderator Invitation Link' });
    this.ModeratorEvent = page.locator("//h4[normalize-space()='Moderate the event as']");
    this.ModeratorName = page.locator("//input[@id='moderator']");
    this.joinEventButton = page.locator("//button[@id='join_event_btn']");
    this.moderatorLeave = page.locator("//span[normalize-space()='Leave']");
    this.closePopupOfModeratorButton = page.locator('//span[@class="close-btn text-gray-dark cursor-pointer text-[24px] absolute right-5 top-5"]').nth(0);

    //this.presenterName = page.locator("#presenter_name");
    //this.presenterEmail = page.locator("//input[@placeholder='Enter your email']");
   // this.joinEventButton = page.locator("#join_event_btn");
     // newTab and its locators will be initialized later
    this.newTab = null;
    this.presentEvent = null;
    this.presenterName = null;
    this.presenterEmail = null;
    this.joinEventButton = null;
  }

    async clickModeratorButton(){
    await expect(this.ModeratorButton).toBeVisible({ timeout: 5000 });
    await this.ModeratorButton.click();
    console.log("Moderator selected");
        
    }

    async clickCopyModeratorInvitationLinkButton(){
    await expect(this.copyModeratorInvitationLinkButton).toBeVisible({ timeout: 5000 });
    await this.copyModeratorInvitationLinkButton.click();
    console.log("Presenter Invitation Link copied");
    // Get the copied link from the clipboard (in the browser context)
  const copiedLink = await this.page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  console.log(`Copied link: ${copiedLink}`);
  console.log("Opened the copied link in a new tab");
  // Open a new tab
    this.newTab = await this.page.context().newPage();

    // Go to the copied link
    await this.newTab.goto(copiedLink);
    console.log("Opened the copied link in a new tab");

  }
        
    async fillModeratorDetailsAndJoin(name, email) {

    // Initialize locators on the new tab
    this.ModeratorEvent = this.newTab.locator("//h4[normalize-space()='Moderate the event as']");
   this.ModeratorName = this.newTab.locator("//input[@id='moderator']");
    this.joinEventButton = this.newTab.locator('#join_event_btn');

    await expect(this.ModeratorEvent).toBeVisible({ timeout: 5000 });
    await expect(this.ModeratorName).toBeVisible({ timeout: 5000 });
    await this.ModeratorName.fill(name);
    await this.joinEventButton.click(); 
    await this.newTab.waitForTimeout(20000);
        console.log("Filled Moderator details and joined the event");
  }

  async ModeratorhandleClickForSound(){
this.soundButton = this.newTab.locator('//span[normalize-space()="Click for sound"]');
await this.soundButton.waitFor({ state: 'visible', timeout: 15000 });
await this.soundButton.click();
console.log("Clicked on 'Click for sound' button");
  }
  async clickModeratorLeaveButton()
 {
   this.leaveSpan = this.newTab.locator('span', { hasText: 'Leave' });
   await this.leaveSpan.click();
   console.log("Clicked on 'Leave' button");
 }

 async clickModeratorLeaveSession()
 {
  this.heading = this.newTab.locator('text="Leaving So Soon?"');
  await expect(this.heading).toBeVisible({ timeout: 5000 });
  this.leaveButton = this.newTab.locator('button', { hasText: 'Yes, Leave Session' });
  await this.leaveButton.click();
  console.log("Clicked on 'Leave Session' button");
 }
  async clickClosePopupOfModeratorButton(){
  await this.page.bringToFront();
  await this.page.waitForLoadState('load');
   await this.closePopupOfModeratorButton.click();
   console.log("Clicked on 'Close' button of Moderator popup");
 }

}

module.exports = ModeratorJoinPage;


