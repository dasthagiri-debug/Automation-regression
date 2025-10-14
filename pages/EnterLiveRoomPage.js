const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class EnterLiveRoomPage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;
  
    //Locators
  
    this.enterRoomBtn = page.getByText("Enter Room");
   
   
    this.liveroomBtn = page.getByRole('button', { name: 'Enter Live Room' });
    this.greenroomBtn = page.locator('button.primary-button', { hasText: 'Enter Green Room' });
    this.popupButton = page.locator('span.mat-button-wrapper:has-text("Join Existing Live Webinar")');
    this.container = page.locator('div.bg-white.border-gray-200.p-4');
    this.gotItBtn = this.container.getByRole('button', { name: 'Got it' });
    this.goLiveButton = page.locator('button:has-text("Go Live")');
    this.modal = page.locator('.modal-container.with-header').filter({ hasText: 'Launch the Event?' })
  

  }
  async clickEnterRoomButton() {
    await this.validateElementVisibility(this.enterRoomBtn, 'Enter Room Button');
    await this.enterRoomBtn.click({ timeout: 15000 });
    console.log('✅ Clicked on Enter Room Button');
    if (await this.popupButton.isVisible()) {
    await this.popupButton.click();
} else {
    console.log("Popup not visible, doing something else..."); 
   }
}

  async CameraPermission(){
    //Camera Off
const cameraBtn = page.locator('button.control-button.video-on, button.control-button.video-off');

// Wait for the button to be visible
await cameraBtn.scrollIntoViewIfNeeded();
await expect(cameraBtn).toBeVisible({ timeout: 5000 });

// Check state via visible SVG
const isCameraOn = await cameraBtn.locator('svg.on').isVisible();

if (isCameraOn) {
  console.log("📷 Camera is ON, turning it OFF...");
  await cameraBtn.click();
  await expect(cameraBtn.locator('svg.off')).toBeVisible({ timeout: 5000 });
  console.log("✅ Camera is now OFF");
} else {
  console.log("📷 Camera is OFF, turning it ON...");
  await cameraBtn.click();
  await expect(cameraBtn.locator('svg.on')).toBeVisible({ timeout: 5000 });
  console.log("✅ Camera is now ON");
}
  }
async MicPermission(){
    const micButton = page.locator('button.control-button.mic-on');

await micButton.scrollIntoViewIfNeeded();

const isMicOn = await micButton.evaluate(button => button.classList.contains('mic-on'));

if (isMicOn) {
  console.log("🎤 Mic is ON, turning it OFF...");
  await micButton.click();
  
  console.log("✅ Mic is now OFF");
} else {
  console.log("🎤 Mic is OFF, turning it ON...");
  await micButton.click();
  
  console.log("✅ Mic is now ON");
}
}

   
   async enterGreenRoom() {
    // Wait until visible and enabled
   await expect(this.greenroomBtn).toBeVisible({ timeout: 30000 });
await expect(this.greenroomBtn).toBeEnabled();

// Wait for loader to disappear
const loader = this.greenroomBtn.locator('span.btn-loader');
if (await loader.count() > 0) {
  await loader.waitFor({ state: 'hidden', timeout: 15000 });
}

// Click with retry fallback
try {
  await this.greenroomBtn.click({ timeout: 10000 });
  console.log("✅ Enter Green Room clicked");
} catch (err) {
  console.log("⚠️ Normal click failed, retrying with JS click...");
  const handle = await this.greenroomBtn.elementHandle();
  if (handle) {
    await page.evaluate(el => (el instanceof HTMLElement ? el.click() : null), handle);
    console.log("✅ Enter Green Room clicked via JS");
  } else {
    console.log("❌ Failed to get element handle for JS click");
  }
}
}
async clickGotItButton() {
  /*  const container = page.locator('div.bg-white.border-gray-200.p-4');
const gotItBtn = container.getByRole('button', { name: 'Got it' });
await expect(gotItBtn).toBeVisible({ timeout: 30000 });
await gotItBtn.click();
console.log("✅ Clicked Got it button");*/
//const gotItBtn = this.container.getByRole('button', { name: 'Got it' });
  await expect(this.gotItBtn).toBeVisible({ timeout: 30000 });
 await this.gotItBtn.click();
  console.log("✅ Clicked Got it button");
}

async clickGoLiveButton() {
    await expect(this.goLiveButton).toBeVisible({ timeout: 30000 });
      await this.goLiveButton.click();
      console.log("✅ Go Live button clicked");
      await this.page.waitForTimeout(30000);

}
async verifyLaunchEventModalLiveButton() {
    await expect(this.modal).toBeVisible({ timeout: 30000 });
    console.log("✅ Launch Event Modal is visible");
   //const modal = this.page.locator('.modal-container.with-header').filter({ hasText: 'Launch the Event?' });


// Title check
const title = await this.modal.locator('.modal-header h3').innerText();
console.log('Modal title:', title); // Should log "Launch the Event?"

// ✅ Handle "Go Live" button
const goLive2Btn = this.modal.getByRole('button', { name: 'Go Live' });
await expect(goLive2Btn).toBeVisible({ timeout: 30000 });

// 4️⃣ Scroll into view if necessary
await goLive2Btn.scrollIntoViewIfNeeded();
// 5️⃣ Wait until the button is visible and enabled
await expect(goLive2Btn).toBeVisible({ timeout: 30000 });
await expect(goLive2Btn).toBeEnabled();

// 6️⃣ Click the Go Live 2 button
await goLive2Btn.click();
console.log("✅ Go Live 2 overlay button clicked");
}

}


module.exports = EnterLiveRoomPage;