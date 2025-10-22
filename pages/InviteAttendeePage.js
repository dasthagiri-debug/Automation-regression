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
  }

  async clickPeopleIcon(){
    await this.peopleIcon.click({ timeout: 5000 });
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
  const newTab = await this.page.context().newPage();

  // Go to the copied link
  await newTab.goto(copiedLink);
  console.log("Opened the copied link in a new tab");
  }
}

module.exports = InviteAttendeePage;