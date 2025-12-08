const { expect } = require('@playwright/test');
//const BasePage = require('./BasePage');


//class InviteAttendeePage extends BasePage{
  class InviteAttendeePage{
  constructor(page) {
   // super(page);
    this.page = page;

    //Locators
  this.peopleIcon = page.locator('a:has-text("People") img:visible');
   this.invitePeople = page.locator('button:has-text("Invite People")');
   this.inviteGuestsHeader = page.locator('h3:has-text("Invite Guests")');
   this.attendeeButton = page.locator('button.flex:has-text("Attendee")');
   this.AttendeeInvitationLink = page.locator('button:has-text("Copy Attendee Invitation Link")');
   this.closePopupOfAttendeeButton = page.locator('//span[@class="close-btn text-gray-dark cursor-pointer text-[24px] absolute right-5 top-5"]').nth(0);
   
   
   const leaveSpan = page.locator('span', { hasText: 'Leave' });

   // New Tab
    // newTab and its locators will be initialized later
    this.newTab = null;
    this.attendeeName = null;
    this.attendeeEmail = null;
    this.joinEventButton = null;
  }
  

  async clickPeopleIcon(){
    await this.peopleIcon.waitFor({ state: 'visible', timeout: 15000 });
   // await this.page.waitForTimeout(20000);
   // await this.peopleIcon.click({ timeout: 5000 });
    await this.peopleIcon.click({ force: true });
    console.log("People icon clicked");
  }
  async clickInvitePeople(){
    await expect(this.invitePeople).toBeVisible({ timeout: 5000 });
    await this.invitePeople.click();
    await expect(this.inviteGuestsHeader).toBeVisible();
    console.log("Invite People button clicked");
  }
  async selectAttendeeRole(){
    await expect(this.attendeeButton).toBeVisible({ timeout: 5000 });
    await this.attendeeButton.click();
    console.log("Attendee role selected");
  }
  async copyAttendeeInvitationLink(){
    await expect(this.AttendeeInvitationLink).toBeVisible({ timeout: 5000 });
    await this.AttendeeInvitationLink.click();
    console.log("Attendee Invitation Link copied");
    // Get the copied link from the clipboard (in the browser context)
  const copiedLink = await this.page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  console.log(`Copied link: ${copiedLink}`);

  // Open a new tab
 // const newTab = await this.page.context().newPage();

  // Go to the copied link
 // await newTab.goto(copiedLink);
  console.log("Opened the copied link in a new tab");
  // Open a new tab
    this.newTab = await this.page.context().newPage();

    // Go to the copied link
    await this.newTab.goto(copiedLink);
    console.log("Opened the copied link in a new tab");

    // Initialize locators on the new tab
    this.attendeeName = this.newTab.locator('#attendee_name');
    this.attendeeEmail = this.newTab.locator('[name="attendee_email"]');
    this.joinEventButton = this.newTab.locator('#join_event_btn');
  }

  // New method to fill attendee details and join event in new tab
  async fillAttendeeDetailsAndJoin(name, email) {
    await expect(this.attendeeName).toBeVisible({ timeout: 5000 });
    await this.attendeeName.fill(name);
    await this.attendeeEmail.fill(email);
    await this.joinEventButton.click(); 
        console.log("Filled attendee details and joined the event");
  }
  async handleClickForSound(){
   this.soundButton = this.newTab.locator('//span[normalize-space()="Click for sound"]');
await this.soundButton.waitFor({ state: 'visible', timeout: 15000 });
await this.soundButton.click();
console.log("Clicked on 'Click for sound' button");
  }
 async clickAttendeeLeaveButton()
 {
   this.leaveSpan = this.newTab.locator('span', { hasText: 'Leave' });
   await this.leaveSpan.click();
   console.log("Clicked on 'Leave' button");
 }

 async clickLeaveSession()
 {
  this.heading = this.newTab.locator('text="Leaving So Soon?"');
  await expect(this.heading).toBeVisible({ timeout: 5000 });
  this.leaveButton = this.newTab.locator('button', { hasText: 'Yes, Leave Session' });
  await this.leaveButton.click();
  console.log("Clicked on 'Leave Session' button");
 }

 async clickClosePopupOfAttendeeButton(){
  await this.page.bringToFront();
  await this.page.waitForLoadState('load');
   await this.closePopupOfAttendeeButton.click();
   console.log("Clicked on 'Close' button of Attendee popup");
 }
 async gotonewAttendeeTab()
 {
  await this.newTab.bringToFront();
  await this.newTab.waitForLoadState('load');
  console.log("Switched to Attendee tab");

 }
 async gotoHostPage(){
  await this.page.bringToFront();
  await this.page.waitForLoadState('load');
  console.log("Switched to Host page");
 }
  }

module.exports = InviteAttendeePage;