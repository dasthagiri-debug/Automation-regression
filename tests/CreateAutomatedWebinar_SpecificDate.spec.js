const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CreateLiveWebinar = require('../pages/CreateLiveWebinar');
const CreateAutomatedWebinarPage = require('../pages/CreateAutomatedWebinarPage');

require('../utils/hooks');

test.describe('Create Automated Webinar with Specific Date', () => {

    test('Create Automated Webinar with Specific Date @smoke', async ({ page }) => {
        // Add tag annotation for Allure
        test.info().annotations.push({ type: 'tag', description: 'smoke' });

        const loginPage = new LoginPage(page);
        const createLiveWebinar = new CreateLiveWebinar(page);
        const createAutomatedWebinar = new CreateAutomatedWebinarPage(page);
        const webinarTitle = `Automated Webinar ${new Date().toISOString()}`;

        // Hooks already opened URL

        await loginPage.enterUsername();
        await loginPage.enterPassword();
        await loginPage.clickLogin();
        await loginPage.verifyDashboardRedirect();

        // Validate events dashboard elements after successful login
       await createAutomatedWebinar.closeBlackFridayPopup();

       
        await createLiveWebinar.clickonCreateWebinar();
        await createAutomatedWebinar.clickAutomatedButton();
        await createLiveWebinar.enterWebinarTitle(webinarTitle);
        await createLiveWebinar.clickSchedulingOptions();
        await createLiveWebinar.selectTimeZone();
        await createAutomatedWebinar.clickVideoSelectionButton();
        await createAutomatedWebinar.clickAddVideoButton();
        await createAutomatedWebinar.enterVideoTitle();;
        await createAutomatedWebinar.enterVideoURL();
        await createAutomatedWebinar.clickAddVideo();
        await createAutomatedWebinar.clickContinueToTemplates();
        await createAutomatedWebinar.clickSkipToDashboard();
    });
});