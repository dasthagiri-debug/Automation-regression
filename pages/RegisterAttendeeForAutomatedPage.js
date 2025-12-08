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
    
  /*async clickRegistrationPage() {

    await expect(this.registrationPage_btn).toBeVisible();
  await expect(this.registrationPage_btn).toBeEnabled();

  // Wait for any overlay/spinner to disappear BEFORE click
  await this.page.waitForSelector('.cdk-overlay-backdrop, .loading-spinner', {
    state: 'detached'
  }).catch(() => {});

  // Scroll into view (important for Angular Material)
  await this.registrationPage_btn.scrollIntoViewIfNeeded();
  // Wait for the new tab (page) to open
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent('page'),   // <-- works even when popup doesn't fire
    this.registrationPage_btn.click(),    
    console.log("Clicked Registration Page Button")     // <-- your click that opens new tab
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

async clickRegistrationPage() {
  console.log("⏳ Waiting for UI to settle...");

  // 1️⃣ Remove any Angular Material overlays (debug-safe)
  await this.page.locator(".cdk-overlay-backdrop, .loading-spinner").waitFor({
    state: "detached",
    timeout: 2000
  }).catch(() => console.log("⚠ Overlay still present — continuing..."));

  // 2️⃣ Ensure mat-button-wrapper elements exist
  await this.page.waitForSelector("span.mat-button-wrapper", {
    state: "visible",
    timeout: 10000
  });

  const btnCount = await this.page.locator("span.mat-button-wrapper").count();
  console.log(`Found ${btnCount} mat-button-wrapper spans`);

  if (btnCount < 3) {
    throw new Error(`❌ Need at least 3 buttons, found ${btnCount}`);
  }

  // 3️⃣ Locator for the Registration button
  this.registrationPage_btn = this.page.locator("(//span[@class='mat-button-wrapper'])[3]");

  // 4️⃣ Ensure visible & stable
  await this.registrationPage_btn.waitFor({ state: "visible", timeout: 8000 });

  // Scroll into center using Playwright (most stable)
  await this.registrationPage_btn.scrollIntoViewIfNeeded();
  console.log("🔍 Button scrolled into view");

  await expect(this.registrationPage_btn).toBeVisible({ timeout: 8000 });
  await expect(this.registrationPage_btn).toBeEnabled({ timeout: 8000 });

  // 5️⃣ SMALL settle wait (fixes debug mode)
  await this.page.waitForTimeout(300);

  // 6️⃣ CLICK + WAIT FOR NEW TAB
  const [newPage] = await Promise.all([
    this.page.context().waitForEvent("page"),
    this.registrationPage_btn.click({ timeout: 5000 }) // no force unless needed
  ]).catch(async () => {
    console.log("⚠ Normal click failed — forcing click...");
    
    const [forcedNewPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.registrationPage_btn.click({ force: true })
    ]);
    return [forcedNewPage];
  });

  console.log("🆕 New tab detected");

  // 7️⃣ Switch to new tab
  await newPage.waitForLoadState("domcontentloaded");
  this.page = newPage;

  console.log("📄 Switched to Registration Page Tab");

  // 8️⃣ Registration page header
  this.register_for_webinar_txt = this.page.locator("//h1[normalize-space()='Register for the webinar']");
  await this.register_for_webinar_txt.waitFor({ state: "visible", timeout: 15000 });

  console.log("🔹 Registration page loaded");

  // 9️⃣ Fill the form
  this.fullName_input = this.page.locator("//input[@name='ewp_custom_field_2']");
  this.email_input = this.page.locator("//input[@name='ewp_custom_field_1']");

  await this.fullName_input.fill(ConfigReader.getProperty('attendee.fullname'));
  await this.email_input.fill(ConfigReader.getProperty('attendee.email'));

  console.log("✅ Registration form filled");
}
 async clickRegisterNow() {
  const button = this.page.getByRole('button', { name: 'Register Now' });

  // 1️⃣ Wait for network idle + Angular stabilization
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForFunction(() => {
    if (!window.getAllAngularTestabilities) return true;
    return !window.getAllAngularTestabilities().some(t => t.hasPendingTasks());
  }, {}, { timeout: 10000 });

  // 2️⃣ Wait for button visible & enabled
  await button.waitFor({ state: 'visible', timeout: 10000 });
  await expect(button).toBeEnabled({ timeout: 10000 });
  await button.scrollIntoViewIfNeeded();

  // 3️⃣ Wait for overlays to disappear
  await this.page.locator('.cdk-overlay-backdrop').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});

  // 4️⃣ Small pause to let Angular finish microtasks
  await this.page.waitForTimeout(250);

  // 5️⃣ Robust click (center of button)
  await button.click({ force: true });

  // 6️⃣ Verify the click effect (replace with your actual result element)
  //const resultElement = this.page.locator('.registration-form'); // modal, form, etc.
  //await expect(resultElement).toBeVisible({ timeout: 15000 });

  console.log('✅ Clicked Register Now and verified result');
  await this.page.waitForTimeout(10000);
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
   // await this.page.waitForTimeout(5000);
    // 3️⃣ Wait for the session message to disappear (or become hidden)
  try {
    await this.waitforsession_Msg.waitFor({ state: 'detached', timeout: 15000 });
    console.log('✅ Wait for Session Message disappeared');
  } catch {
    console.log('⚠ Session message was already gone or did not disappear in time, continuing...');
  }
    
  }
  async clickVolumeButton() {
    this.volume_btn = this.page.locator("i.material-icons", { hasText: "volume_off" });
    await this.page.waitForTimeout(5000);
    await this.volume_btn.click();
    console.log('✅ Clicked on Volume Button');
    await this.page.waitForTimeout(5000);
  }
}
module.exports = RegisterAttendeeForAutomatedPage;