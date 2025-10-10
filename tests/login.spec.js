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

  // ✅ Enter Green Room (modal, not new page)
  
 const greenroomBtn = newPage.locator('button.primary-button:has-text("Enter Green Room")');
await greenroomBtn.scrollIntoViewIfNeeded();
// ✅ Wait until button is visible and enabled
await greenroomBtn.waitFor({ state: 'visible', timeout: 30000 });
await expect(greenroomBtn).toBeEnabled();

// ✅ If loader exists, wait until it's gone
const loader = greenroomBtn.locator('span.btn-loader');
if (await loader.count() > 0) {
  await loader.waitFor({ state: 'hidden', timeout: 15000 });
}

// ✅ Click (with retry fallback)
try {
  await greenroomBtn.click({ timeout: 10000 });
  console.log("✅ Enter Green Room clicked");
} catch (err) {
  console.log("⚠️ Normal click failed, retrying with JS click...");
  const handle = await greenroomBtn.elementHandle();
  if (handle) {
    // @ts-ignore
    await newPage.evaluate(el => el.click(), handle);
  }
}
await newPage.waitForTimeout(30000);

  // Wait for the Green Room modal content
  //const greenRoomModal = newPage.getByText('Test your Audio, Video and Device Compatibility');
  //await expect(greenRoomModal).toBeVisible({ timeout: 30000 });

  


// OR confirm "Go Live"
const goLiveButton = newPage.locator('button:has-text("Go Live")');
await expect(goLiveButton).toBeVisible({ timeout: 30000 });
  await goLiveButton.click();
  console.log("✅ Go Live button clicked");
  await newPage.waitForTimeout(30000);

 


  // ✅ Handle Go Live 2 (opens a popup)

const modal = newPage
  .locator('.modal-container.with-header')
  .filter({ hasText: 'Launch the Event?' });

await expect(modal).toBeVisible();

// Title check
const title = await modal.locator('.modal-header h3').innerText();
console.log('Modal title:', title); // Should log "Launch the Event?"

// ✅ Handle "Go Live" button
const goLive2Btn = modal.getByRole('button', { name: 'Go Live' });
await expect(goLive2Btn).toBeVisible({ timeout: 30000 });
await goLive2Btn.click();
console.log("✅ Go Live button clicked");
await newPage.waitForTimeout(30000);
await newPage.locator('button:has-text("End Session")').waitFor({ state: 'visible', timeout: 60000 });


console.log("✅ Go Live clicked, new screen is visible");


  const endSessionButton = newPage.getByRole('button', { name: 'End Session' });
  await expect(endSessionButton).toBeVisible({ timeout: 30000 });
  await endSessionButton.click();
  console.log("✅ End Session button clicked");
  await newPage.waitForTimeout(30000);

  const confirmEndButton = newPage.getByRole('button', { name: 'Yes, End Session' });
  await expect(confirmEndButton).toBeVisible({ timeout: 30000 });
  
  await confirmEndButton.click();
  console.log("✅ Confirm End Session button visible");
//  await page.getByText('Select Session').click();
});

