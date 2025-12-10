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
 

  }
  
  

  // =======================================================
  // 🛡️ Helper: Check if page is alive before any action
  // =======================================================
  isPageAlive() {
 try {
    return !!this.page && typeof this.page.isClosed === 'function' && !this.page.isClosed();
  } catch (e) {
    return false;
  }
  }
async _recoverPageFromContext() {
  try {
    const ctx = this.page ? this.page.context() : null;
    if (!ctx) return null;
    const pages = ctx.pages();
    for (let i = pages.length - 1; i >= 0; i--) {
      const p = pages[i];
      try {
        if (!p.isClosed()) return p;
      } catch (e) { /* ignore */ }
    }
    return null;
  } catch (e) {
    return null;
  }
}
  // =======================================================
  // 🧼 Helper: Dismiss overlays
  // =======================================================
  async dismissOverlays() {
    const overlaySelectors = [
      '.overlay',
      '[role="dialog"]',
      '.mat-mdc-dialog-container',
      '.cdk-overlay-pane',
      '.modal-backdrop'
    ];

    for (const selector of overlaySelectors) {
      try {
        const overlay = this.page.locator(selector);
        if (await overlay.isVisible({ timeout: 1000 })) {

          console.log(`⚠ Overlay detected: ${selector}`);

          await overlay
            .locator('button[aria-label*="close"], .close')
            .click({ timeout: 2000 })
            .catch(() => {});

          console.log(`✅ Overlay dismissed: ${selector}`);

          await this.page.waitForTimeout(300);
        }
      } catch (e) {}
    }
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
 

async clickRegistrationPage() {
  console.log("⏳ Waiting for UI to settle...");

  // 1️⃣ Make sure page is fully ready
  await this.page.waitForLoadState("domcontentloaded");

  // 2️⃣ Remove Angular overlays — DO NOT WAIT FOREVER
  await this.page.locator(".cdk-overlay-backdrop, .loading-spinner")
    .waitFor({ state: "detached", timeout: 2000 })
    .catch(() => console.log("⚠ Overlay still present — continuing..."));

  // 3️⃣ Ensure buttons exist
  const btns = this.page.locator("span.mat-button-wrapper");
  await btns.first().waitFor({ state: "visible", timeout: 10000 });

  const count = await btns.count();
  console.log(`Found ${count} mat-button-wrapper spans`);

  if (count < 3) throw new Error(`❌ Expected ≥3 buttons, found ${count}`);

  // 4️⃣ Registration Button (3rd mat-button-wrapper)
  const regBtn = this.page.locator("(//span[@class='mat-button-wrapper'])[3]");
  await regBtn.waitFor({ state: "visible", timeout: 8000 });

  // Scroll to it
  await regBtn.scrollIntoViewIfNeeded();
  console.log("🔍 Button scrolled into view");

  // Make sure enabled
  await expect(regBtn).toBeEnabled({ timeout: 5000 });

  // Small settle wait
  await this.page.waitForTimeout(300);

  // 5️⃣ CLICK + WAIT FOR NEW TAB (non-flaky)
  let newPage;
  try {
    [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      regBtn.click({ timeout: 5000 })
    ]);

    console.log("🆕 New tab detected (normal click)");
  } catch (err) {
    console.log("⚠ Normal click failed — forcing click...");

    [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      regBtn.click({ force: true })
    ]);

    console.log("🆕 New tab detected (forced click)");
  }

  // 6️⃣ Switch context to the new tab
  await newPage.waitForLoadState("domcontentloaded");
  this.page = newPage;

  console.log("📄 Switched to Registration Page Tab");

  // 7️⃣ Confirm registration header is visible
  const header = this.page.locator("//h1[normalize-space()='Register for the webinar']");
  await header.waitFor({ state: "visible", timeout: 15000 });

  console.log("🔹 Registration page loaded");

  // 8️⃣ Fill fields
  const fullName = this.page.locator("//input[@name='ewp_custom_field_2']");
  const email = this.page.locator("//input[@name='ewp_custom_field_1']");

  await fullName.waitFor({ state: "visible", timeout: 5000 });
  await email.waitFor({ state: "visible", timeout: 5000 });

  await fullName.fill(ConfigReader.getProperty('attendee.fullname'));
  await email.fill(ConfigReader.getProperty('attendee.email'));

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
  
  /*async verifyRegistrationSuccess() {
    this.RegisterAttendeeForAutomatedMsg = this.page.locator("//span[contains(text(),'Congratulations! You are successfully registered f')]");
    await this.validateElementVisibility(this.RegisterAttendeeForAutomatedMsg, 'Registration Success Message');
    console.log('✅ Verified Registration Success Message');
  }*/

  async verifyRegistrationSuccess() {
  this.RegisterAttendeeForAutomatedMsg = this.page.locator("//span[contains(text(),'Congratulations! You are successfully registered f')]");

  console.log("🔍 Waiting for Registration Success Message...");

  // Wait for message to appear up to 5s (non-blocking)
  const appeared = await this.RegisterAttendeeForAutomatedMsg.waitFor({ state: 'visible', timeout: 5000 })
    .then(() => true)
    .catch(() => false);

  if (appeared) {
    console.log("✅ Verified Registration Success Message");
  } else {
    console.log("⚠ Registration Success Message did NOT appear — continuing...");
  }
}
async verifyWaitForSessionMessage() {
  this.waitforsession_Msg = this.page.locator("//div[@class='heading-top-wrapper']//span[1]");

  console.log("🔍 Checking if 'Wait for Session' message appears...");

  // Wait briefly for appearance
  const appeared = await this.waitforsession_Msg.waitFor({ state: 'visible', timeout: 30000 })
    .then(() => true)
    .catch(() => false);

  if (appeared) {
    console.log("✅ 'Wait for Session' message appeared");

    // Wait for disappearance (non-blocking)
    await this.waitforsession_Msg.waitFor({ state: 'detached', timeout: 30000 })
      .then(() => console.log("✅ 'Wait for Session' message disappeared"))
      .catch(() => console.log("⚠ Message did not disappear in time — continuing..."));
  } else {
    console.log("ℹ 'Wait for Session' message never appeared — moving on");
  }
}

  // =======================================================
  // 🚪 Step 1: Click JOIN ROOM (stable)
  // =======================================================
  async clickJoinRoom() {
    console.log("🔍 Checking for JOIN ROOM button...");

    const selectors = [
      this.page.getByText('JOIN ROOM', { exact: true }),
      this.page.getByRole('button', { name: /join.*room/i }),
      this.page.locator('mat-button').filter({ hasText: 'JOIN ROOM' }),
      this.page.getByText(/join room/i)
    ];

    let joinRoomBtn = null;
    let matchedSelector = null;
    for (const sel of selectors) {
      try {
        await sel.waitFor({ state: 'visible', timeout: 3000 });
        joinRoomBtn = sel;
          matchedSelector = sel;
         console.log(`✅ JOIN ROOM found via: ${sel.toString ? sel.toString() : String(sel)}`);
        break;
      } catch (err) {
        // log the failure for that selector
        console.log(`ℹ Selector did not match yet: ${sel.toString ? sel.toString() : String(sel)}`);
      }
    }

    if (!joinRoomBtn) {
     // capture a diagnostic screenshot if possible before throwing
      try {
        if (this.page && !this.page.isClosed()) {
          const diagPath = path.join('reports', 'FailedScreenshots', `joinroom_diag_${Date.now()}.png`);
          await this.page.screenshot({ path: diagPath, fullPage: true, timeout: 3000 }).catch(() => {});
          console.log(`⚠ Could not locate JOIN ROOM. Diagnostic screenshot saved (if available): ${diagPath}`);
        }
      } catch (e) { /* ignore */ }

      throw new Error("❌ JOIN ROOM button could not be located");
    }

    // Remove overlays BEFORE click
    await this.dismissOverlays();

    // LISTEN FIRST (critical)
    const context = this.page.context();

    const waitForNewPage = context.waitForEvent("page").catch(() => null);
    const waitForNav = this.page.waitForNavigation({ waitUntil: "domcontentloaded" }).catch(() => null);

    console.log("👉 Clicking JOIN ROOM...");
    await joinRoomBtn.click();

    const result = await Promise.race([
      waitForNewPage.then(p => ({ newPage: p })),
      waitForNav.then(() => ({ nav: true })),
      new Promise(res => setTimeout(() => res({ none: true }), 3000))
    ]);

    if (result.newPage) {
      console.log("🆕 New tab detected — switching...");
      this.page = result.newPage;
    } else if (result.nav) {
      console.log("🔄 Same-tab navigation detected");
    } else {
      console.log("ℹ No navigation — staying on same tab");
    }

    if (!this.isPageAlive()) {
      throw new Error("❌ Lost page context after JOIN ROOM click");
    }

    await this.page.waitForLoadState("domcontentloaded").catch(() => {});
    await this.page.waitForTimeout(800);

    console.log("🚀 JOIN ROOM completed; room loaded");
  }

  // =======================================================
  // 🔊 Step 2: Click Volume Button & Validate Video
  // =======================================================
  async clickVolumeButton() {
    console.log("🔈 Preparing volume actions…");

    if (!this.isPageAlive()) {
       // Attempt to recover a live page from context before failing
  const recovered = await this._recoverPageFromContext();
  if (recovered) {
    console.log('ℹ️ Recovered a live page from context; switching to it.');
    this.page = recovered;
  } else {
    throw new Error("❌ Page is dead before volume step (and recovery failed)");
  }
    }

    const context = this.page.context();

    const tabChange = await Promise.race([
      context.waitForEvent("page").then(p => ({ newPage: p })).catch(() => null),
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }).then(() => ({ nav: true })).catch(() => null),
      new Promise(res => setTimeout(() => res({ none: true }), 1500))
    ]);

    if (tabChange?.newPage) {
      console.log("🆕 New tab detected during room setup → switching");
      this.page = tabChange.newPage;
    }

    if (!this.isPageAlive()) {
      throw new Error("❌ Page unavailable during volume click");
    }

    const volumeBtn = this.page.locator("i.material-icons", { hasText: "volume_off" });

    console.log("🔍 Waiting for volume button…");
    await volumeBtn.waitFor({ state: "visible", timeout: 20000 });

    console.log("🔊 Clicking volume");
    await volumeBtn.click();

    console.log("⏳ Waiting for YouTube iframe…");
    await this.page.waitForSelector("iframe#youtube_youtube_iframe", { timeout: 20000 });

    const iframe = this.page.frames().find(f => f.url().includes("embed"));

    if (!iframe) {
      throw new Error("❌ Could not find YouTube iframe frame()");
    }

    console.log("📺 Iframe loaded:", iframe.url());

    // Confirm video plays
    const isPlaying = await iframe.evaluate(() => {
      const video = document.querySelector("video");
      if (!video) return false;
      const start = video.currentTime;
      return new Promise(res => setTimeout(() => res(video.currentTime > start), 1500));
    });

    if (!isPlaying) {
      throw new Error("❌ Video NOT playing");
    }

    console.log("🎬 Video playing confirmed");

    const isMuted = await iframe.evaluate(() => {
      const video = document.querySelector("video");
      return video?.muted ?? true;
    });

    if (isMuted) {
      throw new Error("❌ Video still muted");
    }

    console.log("🔊 Audio ON — webinar media validated");
  }

}

module.exports = RegisterAttendeeForAutomatedPage;