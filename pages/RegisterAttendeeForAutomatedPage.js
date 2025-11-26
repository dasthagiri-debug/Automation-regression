const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
const ConfigReader = require('../utils/config');
const EventsDashboard = require('./EventsDashboard');

class RegisterAttendeeForAutomatedPage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators
   
    this.registrationPage_btn = page.locator("(//span[@class='mat-button-wrapper'])[3]");
    //this.register_for_webinar_txt = page.locator("//h1[normalize-space()='Register for the webinar']");
    //this.fullName_input = page.locator("//input[@name='ewp_custom_field_2']");
   // this.email_input = page.locator("//input[@name='ewp_custom_field_1']");
    //this.registerNow_btn = page.locator("//span[text()=' Register Now ']");
    //this.RegisterAttendeeForAutomatedMsg = page.locator("//span[contains(text(),'Congratulations! You are successfully registered f')]");
    //this.joinRoom_btn = page.getByText('JOIN ROOM', { exact: true });
   // this.waitforsession_Msg = page.locator("//div[@class='heading-top-wrapper']//span[1]");

  }
  async verifyscheduleRedirect(scheduleUrl) {
      const url = scheduleUrl || ConfigReader.getProperty('urls.schedule');
      if (!url) {
        throw new Error(
          'Schedule URL not found. Add `urls:\n  schedule: "<your schedule url>"` to configuration.yaml\n' +
          'Or pass the URL as an argument to verifyDashboardRedirect(url).'
        );
      }
  
      console.log(`✅ Verifying schedule redirect to: ${url}`);
      await expect(this.page).toHaveURL(url, { timeout: 30000 });
    }
  /*  async clickRegistrationPage() {
      await this.page.waitForTimeout(20000);
      await this.validateElementVisibility(this.registrationPage_btn, 'Registration Page Button');

    await this.registrationPage_btn.click();
    console.log('✅ Clicked on Registration Page Button');
    }*/
    
  async clickRegistrationPage() {

  // Wait for the new tab (page) to open
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent('page'),   // <-- works even when popup doesn't fire
    this.registrationPage_btn.click(),          // <-- your click that opens new tab
  ]);

  // Wait until new tab loads
  await newPage.waitForLoadState('load');

  // Switch PageObject to new tab
  this.page = newPage;
  console.log('📄 Switched to Registration Page Tab');

  // ------------------------------
  // 🔽 Actions inside the new tab
  // ------------------------------
this.register_for_webinar_txt = this.page.locator("//h1[normalize-space()='Register for the webinar']");
  // Validate text visibility
     await this.page.waitForTimeout(20000);
  await this.validateElementVisibility(
    this.register_for_webinar_txt,
    'Register for the webinar Text'
  );
    this.fullName_input = this.page.locator("//input[@name='ewp_custom_field_2']");
    this.email_input = this.page.locator("//input[@name='ewp_custom_field_1']");
  // Read test data
  const fullName = ConfigReader.getProperty('attendee.fullname');
  const email = ConfigReader.getProperty('attendee.email');

  // Fill form fields
  await this.fullName_input.fill(fullName);
  console.log(`✅ Entered Full Name: ${fullName}`);

  await this.email_input.fill(email);
  console.log(`✅ Entered Email: ${email}`);
}
  /* async registerForWebinar()
   {
    await this.validateElementVisibility(this.register_for_webinar_txt, 'Register for the webinar Text');
    const fullName = ConfigReader.getProperty('attendee.fullname');
    const email = ConfigReader.getProperty('attendee.email');

    await this.fullName_input.fill(fullName);
    console.log(`✅ Entered Full Name: ${fullName}`);

    await this.email_input.fill(email);
    console.log(`✅ Entered Email: ${email}`);
   }*/
 
    async clickRegisterNow() {
    this.registerNow_btn = this.page.locator("//span[text()=' Register Now ']");
    await this.validateElementVisibility(this.registerNow_btn, 'Register Now Button');
    await this.registerNow_btn.click();
    console.log('✅ Clicked on Register Now Button');
  }
  
  async verifyRegistrationSuccess() {
    this.RegisterAttendeeForAutomatedMsg = this.page.locator("//span[contains(text(),'Congratulations! You are successfully registered f')]");
    await this.validateElementVisibility(this.RegisterAttendeeForAutomatedMsg, 'Registration Success Message');
    console.log('✅ Verified Registration Success Message');
  }
    async clickJoinRoom() {
      this.joinRoom_btn = this.page.getByText('JOIN ROOM', { exact: true });
    await this.validateElementVisibility(this.joinRoom_btn, 'Join Room Button');
    await this.joinRoom_btn.click();
    console.log('✅ Clicked on Join Room Button');
  }
    async verifyWaitForSessionMessage() {
      this.waitforsession_Msg = this.page.locator("//div[@class='heading-top-wrapper']//span[1]");
    await this.validateElementVisibility(this.waitforsession_Msg, 'Wait for Session Message');
    console.log('✅ Verified Wait for Session Message');
  }
}
module.exports = RegisterAttendeeForAutomatedPage;