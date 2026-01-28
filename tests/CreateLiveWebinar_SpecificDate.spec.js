const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CreateLiveWebinar = require('../pages/CreateLiveWebinar');
require('../utils/hooks');

test.describe('Create Live Webinar with Specific Date', () => {

    test('Create Live Webinar with Specific Date @smoke', async ({ page }) => {
        // Add tag annotation for Allure
        test.info().annotations.push({ type: 'tag', description: 'smoke' });

        const loginPage = new LoginPage(page);
        const createLiveWebinar = new CreateLiveWebinar(page);
        const webinarTitle = `Live Webinar ${new Date().toISOString()}`;

        // Hooks already opened URL

        await loginPage.enterUsername();
        await loginPage.enterPassword();
        await loginPage.clickLogin();
        await loginPage.verifyDashboardRedirect();

        // Validate events dashboard elements after successful login
       
        await createLiveWebinar.clickonCreateWebinar();
        await createLiveWebinar.clickLiveButton();
        await createLiveWebinar.enterWebinarTitle(webinarTitle);
        await createLiveWebinar.clickSchedulingOptions();

        await createLiveWebinar.selectTimeZone();
        await createLiveWebinar.clickNextToTemplateSelection();
        await createLiveWebinar.clickSkipAndMoveToDashboard();c
        await createLiveWebinar.verifyWebinarCreated();

        console.log('✅ Create Live Webinar with Specific Date test passed');
        console.log("addd");
    });

});
