// @ts-check
//const { test, expect } = require('@playwright/test');

const { test, expect, chromium } = require('@playwright/test');

test('login and create webinar', async () => {
  // Launch browser and create context with permissions
  const browser = await chromium.launch({ headless: false }); // headless:false so you can see actions
  const context = await browser.newContext({
    permissions: ['camera', 'microphone'],   // <-- allow camera + mic
  });
  const page = await context.newPage();


  // Login
  await page.goto('https://accounts-uat.easywebinar.com/login');
  await page.locator("[type='text']").fill("easywebinar4@gmail.com");
  await page.locator("[type='password']").fill("Uday@63121");
  await page.locator("[type='submit']").click();

  // Wait for home page
  await page.waitForURL('https://uat.easywebinar.com/v2/events', { timeout: 60000 });

  

  // Click Create a Webinar button (click button itself)
  const createWebinarBtn = page.locator('button:has-text("Create a Webinar")');
  await expect(createWebinarBtn).toBeVisible({ timeout: 60000 });
  await createWebinarBtn.click();
 console.log ("✅ Clicked Create a Webinar button");

  // Wait for webinar title input
  const addTitle = page.locator('input[placeholder="Add your webinar title..."]');
  await expect(addTitle).toBeVisible({ timeout: 60000 });
  await addTitle.fill('Auto Webinar Title');

  // Click Next
  const nextBtn = page.locator('button:has-text("Next : Scheduling Options")');
  await expect(nextBtn).toBeVisible({ timeout: 30000 });
  await nextBtn.click();
  console.log("✅ Clicked Next : Scheduling Options");

  // Click the mat-select to open dropdown

const timezoneSelect = page.locator('mat-select[formcontrolname="timezoneId"]');

// Wait until it's visible
await expect(timezoneSelect).toBeVisible({ timeout: 30000 });

// Click to open dropdown
await timezoneSelect.click();
console.log("✅ Clicked Timezone dropdown");

// Wait for panel to appear


const panel = page.locator('div.mat-select-panel');
await panel.waitFor({ state: 'visible' });
await expect(panel).toBeVisible({ timeout: 10000 });

// Pick option by visible text

const option = panel.locator('mat-option >> text="(UTC+05:30)-Chennai, Kolkata, Mumbai, New Delhi"');

// 4. Scroll the option into view (important for long lists)
await option.scrollIntoViewIfNeeded();

// 5. Click the option
await option.click();

console.log("✅ Selected Asia/Kolkata timezone");

  await page.waitForTimeout(2000); // wait for 2 seconds to ensure selection is registered
  // selected time
  const timeBtn = page.locator('//span[contains(text(), "Next : Template Selection")]');
  await expect(timeBtn).toBeVisible({ timeout: 30000 });
  await timeBtn.click();

  //dashboard
  const dashBtn = page.getByRole('button', { name: 'Skip & move to dashboard' });
  await expect(dashBtn).toBeVisible({ timeout: 30000 });
  await dashBtn.click();

  //Enter Room
  const enterRoomBtn = page.getByText("Enter Room");
  await expect(enterRoomBtn).toBeVisible({ timeout: 30000 });
  await enterRoomBtn.click();
  await page.waitForTimeout(30000);

  const popupButton = page.locator('span.mat-button-wrapper:has-text("Join Existing Live Webinar")');

if (await popupButton.isVisible()) {
    await popupButton.click();
} else {
    // Fallback action if popup/button is not visible
    console.log("Popup not visible, doing something else...");
    // Example: click another button
    // await page.locator('span.mat-button-wrapper:has-text("Other Button")').click();
}

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
//Microphone OFF 

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

// ✅ Enter Green Room (modal, not new page) or Live Room

const liveroomBtn = page.getByRole('button', { name: 'Enter Live Room' });
const greenroomBtn = page.locator('button.primary-button', { hasText: 'Enter Green Room' });
// Wait until visible and enabled
await expect(greenroomBtn).toBeVisible({ timeout: 30000 });
await expect(greenroomBtn).toBeEnabled();

// Wait for loader to disappear
const loader = greenroomBtn.locator('span.btn-loader');
if (await loader.count() > 0) {
  await loader.waitFor({ state: 'hidden', timeout: 15000 });
}

// Click with retry fallback
try {
  await greenroomBtn.click({ timeout: 10000 });
  console.log("✅ Enter Green Room clicked");
} catch (err) {
  console.log("⚠️ Normal click failed, retrying with JS click...");
  const handle = await greenroomBtn.elementHandle();
  if (handle) {
    await page.evaluate(el => (el instanceof HTMLElement ? el.click() : null), handle);
    console.log("✅ Enter Green Room clicked via JS");
  } else {
    console.log("❌ Failed to get element handle for JS click");
  }
}
  // Wait for the Green Room modal content
  //const greenRoomModal = newPage.getByText('Test your Audio, Video and Device Compatibility');
  //await expect(greenRoomModal).toBeVisible({ timeout: 30000 });

  // Easy cast Got it Button
const container = page.locator('div.bg-white.border-gray-200.p-4');
const gotItBtn = container.getByRole('button', { name: 'Got it' });
await expect(gotItBtn).toBeVisible({ timeout: 30000 });
await gotItBtn.click();
console.log("✅ Clicked Got it button");


// OR confirm "Go Live"
const goLiveButton = page.locator('button:has-text("Go Live")');
await expect(goLiveButton).toBeVisible({ timeout: 30000 });
  await goLiveButton.click();
  console.log("✅ Go Live button clicked");
  await page.waitForTimeout(30000);

 


  // ✅ Handle Go Live 2 (opens a popup)

const modal = page
  .locator('.modal-container.with-header')
  .filter({ hasText: 'Launch the Event?' });

await expect(modal).toBeVisible();

// Title check
const title = await modal.locator('.modal-header h3').innerText();
console.log('Modal title:', title); // Should log "Launch the Event?"

// ✅ Handle "Go Live" button
const goLive2Btn = modal.getByRole('button', { name: 'Go Live' });
await expect(goLive2Btn).toBeVisible({ timeout: 30000 });

// 4️⃣ Scroll into view if necessary
await goLive2Btn.scrollIntoViewIfNeeded();
// 5️⃣ Wait until the button is visible and enabled
await expect(goLive2Btn).toBeVisible({ timeout: 30000 });
await expect(goLive2Btn).toBeEnabled();

// 6️⃣ Click the Go Live 2 button
await goLive2Btn.click();
console.log("✅ Go Live 2 overlay button clicked");

await page.waitForTimeout(30000);
await page.locator('button:has-text("End Session")').waitFor({ state: 'visible', timeout: 60000 });

console.log("✅ Go Live clicked, live screen is visible"); 



//End Session
  const endSessionButton = page.getByRole('button', { name: 'End Session' });
  await expect(endSessionButton).toBeVisible({ timeout: 30000 });
  await endSessionButton.click();
  console.log("✅ End Session button clicked");

  
 // 2️⃣ Wait for the confirmation modal to appear
const confirmModal = page.locator('div.modal-container.with-header')
    .filter({ hasText: 'Confirm End Session?' });
await expect(confirmModal).toBeVisible({ timeout: 30000 });
console.log("✅ Confirm End Session modal appeared");

// 3️⃣ Locate the "Yes, End Session" button **inside the modal**
const confirmEndButton = confirmModal.locator('button.warning-button:has-text("Yes, End Session")');
await confirmEndButton.scrollIntoViewIfNeeded();
await expect(confirmEndButton).toBeEnabled();

// 4️⃣ Click the button
await confirmEndButton.click();
console.log("✅ Confirm End Session button clicked");

// 5️⃣ Optional: wait for modal to disappear
await confirmModal.waitFor({ state: 'hidden', timeout: 30000 });
console.log("✅ End Session modal closed");


});

