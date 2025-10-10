
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://uat.easywebinar.com/');
  await page.locator('#inputUsername').click();
  await page.locator('#inputUsername').click();
  await page.locator('#inputUsername').fill('dasthagiri+uat2@easywebinar.com');
  await page.locator('#inputPassword').click();
  await page.locator('#inputPassword').fill('Welcome@123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Explore Now navigates in same tab, not popup
// Wait for home page
  await page.waitForURL('https://uat.easywebinar.com/home/', { timeout: 60000 });

  // Locate Explore Now link
  const exploreNow = page.locator('a:has-text("Explore Now")');
  await expect(exploreNow).toBeVisible({ timeout: 30000 });

  // Handle new tab
  const [page1] = await Promise.all([
    page.context().waitForEvent('page'),
    exploreNow.click(),
  ]);
  
  await page1.goto('https://uat.easywebinar.com/v2/events');
  await page1.getByRole('button', { name: 'Automated Gold (4)' }).click();
  await page1.getByRole('button', { name: 'Create a Webinar' }).click();
  await page1.getByRole('textbox', { name: 'Add your webinar title...' }).click();
  await page1.getByRole('textbox', { name: 'Add your webinar title...' }).fill('Record');
  await page1.getByRole('button', { name: 'Next : Scheduling Options' }).click();
  await page1.getByRole('button', { name: 'Next : Template Selection' }).click();
  await page1.getByRole('button', { name: 'Skip & move to dashboard' }).click();
  await page1.getByRole('button', { name: 'Enter Room' }).click();
  await page1.goto('https://uat.easywebinar.com/live-room/webinar-live-go?webinar_id=136781&did=15885&sid=45558');
  await page1.getByRole('button').first().click();
  await page1.getByRole('button').first().click();
  await page1.getByRole('button').nth(1).click();
  await page1.getByRole('button').nth(1).click();
  await page1.getByRole('button', { name: 'Enter Green Room' }).click();
  await page1.getByRole('button', { name: 'Go Live' }).click();
  await page1.getByRole('button', { name: 'Go Live' }).nth(1).click();
  await page1.getByRole('listitem').filter({ hasText: 'CameraMute micStop' }).locator('a').click();
  await page1.getByRole('listitem').filter({ hasText: 'CameraMute micStop' }).locator('a').click();
  await page1.getByRole('listitem').filter({ hasText: 'MicMicrophone Select your' }).locator('a').click();
  await page1.getByRole('listitem').filter({ hasText: 'MicMicrophone Select your' }).locator('a').click();
  await page1.getByRole('listitem').filter({ hasText: 'Camera DDMute micStart' }).locator('a').click();
  await page1.getByRole('button', { name: 'End Session' }).click();
  await page1.getByRole('button', { name: 'Yes, End Session' }).click();
  await page1.goto('https://uat.easywebinar.com/webinar-live-end/?id=136781');
});


import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://accounts-test.easywebinar.com/login');
  await page.getByRole('textbox', { name: 'Email address/Username' }).click();
  await page.getByRole('textbox', { name: 'Email address/Username' }).fill('rojaramani.kongari@softobiz.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Welcome@1234');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.goto('https://test-v2.easywebinar.com/v2/events');
  await page.locator('ew-menu').getByRole('img').first().click();
  await page.getByRole('radio', { name: 'Live A live stream set to a' }).click();
  await page.goto('https://test-v2.easywebinar.com/v2/events');
  await page.getByText('motion_play Webinars').click();
  await page.getByText('motion_play Webinars').click();
  await page.getByText('peoplePeople').click();
  await page.goto('https://test-v2.easywebinar.com/v2/events');
  await page.getByText('motion_play Webinars').click();
  await page.locator('a').filter({ hasText: 'Library' }).click();
  await page.goto('https://test-v2.easywebinar.com/v2/events');
  await page.getByText('helpHELP').click();
  await page.locator('.cdk-overlay-backdrop').click();
  await page.getByRole('heading', { name: 'My Webinars' }).click();
  await page.getByRole('button', { name: 'All (11)' }).click();
  await page.getByRole('button', { name: 'Live (7)' }).click();
  await page.getByRole('button', { name: 'Automated (3)' }).click();
  await page.getByRole('button', { name: 'Automated Gold (1)' }).click();
  await page.getByRole('button', { name: 'Create a Webinar' }).click();
  await page.getByText('close').click();
  await page.getByText('RK').click();
});