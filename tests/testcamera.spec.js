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
  await page.goto('https://accounts-uat.easywebinar.com');
  await page.locator("[type='text']").fill("dasthagiri+uat2@easywebinar.com");
  await page.locator("[type='password']").fill("Welcome@123");
  await page.locator("[type='submit']").click();

  // Wait for home page
  await page.waitForURL('https://uat.easywebinar.com/home/', { timeout: 60000 });

  // Locate Explore Now link
  const exploreNow = page.locator('a:has-text("Explore Now")');
  await expect(exploreNow).toBeVisible({ timeout: 30000 });

  // Handle new tab
  const [newPage] = await Promise.all([
    page.context().waitForEvent('page'),
    exploreNow.click(),
  ]);

  // Wait for Events page
  await newPage.waitForURL('https://uat.easywebinar.com/v2/events', { timeout: 120000 });

  // Wait for Automated Gold button
  const goldButton = newPage.locator('#mat-button-toggle-4-button');
  await expect(goldButton).toBeVisible({ timeout: 30000 });
  await goldButton.click();

  console.log('Landed on Events page:', newPage.url());

  // Click Create a Webinar button (click button itself)
  const createWebinarBtn = newPage.locator('button:has-text("Create a Webinar")');
  await expect(createWebinarBtn).toBeVisible({ timeout: 60000 });
  await createWebinarBtn.click();

  // Wait for webinar title input
  const addTitle = newPage.locator('input[placeholder="Add your webinar title..."]');
  await expect(addTitle).toBeVisible({ timeout: 60000 });
  await addTitle.fill('Auto Webinar Title');

  // Click Next
  const nextBtn = newPage.locator('button:has-text("Next : Scheduling Options")');
  await expect(nextBtn).toBeVisible({ timeout: 30000 });
  await nextBtn.click();

  // selected time
  const timeBtn = newPage.locator('//span[contains(text(), "Next : Template Selection")]');
  await expect(timeBtn).toBeVisible({ timeout: 30000 });
  await timeBtn.click();

  //dashboard
  const dashBtn = newPage.getByRole('button', { name: 'Skip & move to dashboard' });
  await expect(dashBtn).toBeVisible({ timeout: 30000 });
  await dashBtn.click();

  //Enter Room
  const enterRoomBtn = newPage.getByText("Enter Room");
  await expect(enterRoomBtn).toBeVisible({ timeout: 30000 });
  await enterRoomBtn.click();
  await newPage.waitForTimeout(30000);

  const popupButton = newPage.locator('span.mat-button-wrapper:has-text("Join Existing Live Webinar")');

if (await popupButton.isVisible()) {
    await popupButton.click();
} else {
    // Fallback action if popup/button is not visible
    console.log("Popup not visible, doing something else...");
    // Example: click another button
    // await page.locator('span.mat-button-wrapper:has-text("Other Button")').click();
}


const cameraBtn = newPage.locator('button.control-button.video-on, button.control-button.video-off');

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

 // ✅ Enter Green Room (modal, not new page)
  const greenroomBtn = newPage.locator('button.primary-button:has-text("Enter Green Room")');
  await greenroomBtn.scrollIntoViewIfNeeded();
  await greenroomBtn.waitFor({ state: 'visible', timeout: 30000 });

  // Wait for loader if present
  try {
    await greenroomBtn.locator('span.btn-loader').waitFor({ state: 'hidden', timeout: 15000 });
  } catch {
    console.log("⚠️ Loader not found, continuing...");
  }

  // Click with fallback
  try {
    await greenroomBtn.click({ timeout: 10000 });
    console.log("✅ Enter Green Room clicked normally");
  } catch {
    console.log("⚠️ Normal click failed, using JS click");
    const handle = await greenroomBtn.elementHandle();
    if (handle) {
      // @ts-ignore
      await newPage.evaluate(el => el.click(), handle);
    }
  }
 // Wait for the Green Room modal content
  const greenRoomModal = newPage.getByText('Test your Audio, Video and Device Compatibility');
  await expect(greenRoomModal).toBeVisible({ timeout: 30000 });

 const secondButton = newPage.locator('(//button[@type="button"])[2]');
 await secondButton.click();
// Wait for overlay to appear
const overlay = newPage.locator('.ew-video-controls-box.mic-settings.open-dropdown');
await expect(overlay).toBeVisible({ timeout: 5000 });

 //check mic button
 const micBtn = overlay.locator('button.control-button.mic-on, button.control-button.mic-off');

// get the full class attribute
const micClass = await micBtn.getAttribute('class');

// @ts-ignore
if (micClass.includes('mic-on')) {
  console.log('🎤 Mic is ON');
// @ts-ignore
} else if (micClass.includes('mic-off')) {
  console.log('🔇 Mic is OFF');
} else {
  console.log('❓ Mic state could not be determined');
}

// check camera button in live page
const cameraBtnLive = overlay.getByRole('button', { name: /camera/i });

if (await cameraBtnLive.innerText() === 'Stop camera') {
  console.log('📷 Camera is ON');
} else if (await cameraBtnLive.innerText() === 'Start camera') {
  console.log('📷 Camera is OFF');
}

// Modal container
const modal = page.locator('.modal-container.with-header');
await expect(modal).toBeVisible();

// Title check
const title = await modal.locator('.modal-header h3').innerText();
console.log('Modal title:', title); // Should be "Launch the Event?"



// OR confirm "Go Live"
const goLiveButton = modal.locator('button:has-text("Go Live")');
await goLiveButton.click();


  // ✅ Handle Go Live 2 (opens a popup)
const goLive2Btn = newPage.getByRole('button', { name: 'Go Live' });

const [goLivePopup] = await Promise.all([
  newPage.context().waitForEvent('page'), // wait for popup
  goLive2Btn.click(),                     // trigger popup
]);
await goLivePopup.waitForLoadState('domcontentloaded');
console.log("✅ Go Live popup opened");


});

