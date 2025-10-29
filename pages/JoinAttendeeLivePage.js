  const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class JoinAttendeeLivePage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;
    this.context = context;

    //Locators
    this.attendeeName = page.locator('#attendee_name');
    this.attendeeEmail = page.locator('[name="attendee_email"]');
    this.joinEventButton = page.locator('#join_event_btn');
    
  }
     async joinAttendeeInNewTab(name, email, linkSelector) {
    // Wait for the new tab to open
    const [newPage] = await Promise.all([
      this.context.waitForEvent('page'),
      this.page.click(linkSelector),
    ]);

    // Wait for the new tab to load
    await newPage.waitForLoadState('load');

    // Reuse locators in the new tab
    const attendeeName = newPage.locator(this.attendeeNameLocator);
    const attendeeEmail = newPage.locator(this.attendeeEmailLocator);
    const joinEventButton = newPage.locator(this.joinEventButtonLocator);

    // Fill in the attendee form
    await attendeeName.fill(name);
    await attendeeEmail.fill(email);
    await joinEventButton.click();

    // Optionally, wait for confirmation or close the new tab
    // await newPage.waitForSelector('selector_of_confirmation');
    // await newPage.close();
  }
}

module.exports = JoinAttendeeLivePage;
