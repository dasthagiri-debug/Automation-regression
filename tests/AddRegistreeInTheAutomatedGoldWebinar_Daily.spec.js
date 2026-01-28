const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CreateLiveWebinar = require('../pages/CreateLiveWebinar');
const CreateAutomatedWebinarPage = require('../pages/CreateAutomatedWebinarPage');
const CreateAutomatedGoldWebinar = require('../pages/CreateAutomatedGoldWebinarPage');
const RegisterAttendeeForAutomatedPage = require('../pages/RegisterAttendeeForAutomatedPage');
require('../utils/hooks');

test.describe('Add Registree in Automated Gold Webinar with Specific Date', () => {

    test('Add Registree in Automated Gold Webinar with Specific Date @smoke', async ({ page }) => {
        // Add tag annotation for Allure
        test.info().annotations.push({ type: 'tag', description: 'smoke' });

        const loginPage = new LoginPage(page);
        const createLiveWebinar = new CreateLiveWebinar(page);
        const createAutomatedGoldWebinar = new CreateAutomatedGoldWebinar(page);
        const createAutomatedWebinar = new CreateAutomatedWebinarPage(page);
         const registerAttendeeForAutomated = new RegisterAttendeeForAutomatedPage(page);
        const webinarTitle = `Automated Gold Webinar ${new Date().toISOString()}`;

        // Hooks already opened URL

        await loginPage.enterUsername();
        await loginPage.enterPassword();
        await loginPage.clickLogin();
        await loginPage.verifyDashboardRedirect();

        // Validate events dashboard elements after successful login
       //await createAutomatedWebinar.closeBlackFridayPopup();
       await createLiveWebinar.clickonCreateWebinar();
       await createAutomatedGoldWebinar.clickAutomatedGoldButton();
      await createLiveWebinar.enterWebinarTitle(webinarTitle);
      await createLiveWebinar.clickSchedulingOptions();
      await createAutomatedGoldWebinar.clickJustInTimeCheckbox();
        await createAutomatedWebinar.clickVideoSelectionButton();
        await createAutomatedWebinar.clickAddVideoButton();
        await createAutomatedGoldWebinar.enterVideoTitleGold();;
        await createAutomatedGoldWebinar.enterVideoURLGold();
        await createAutomatedWebinar.clickAddVideo();
        await createAutomatedWebinar.clickContinueToTemplates();
        await createAutomatedWebinar.clickSkipToDashboard();
        await registerAttendeeForAutomated.clickRegistrationPage();
        await registerAttendeeForAutomated.clickRegisterNow();
        await registerAttendeeForAutomated.verifyRegistrationSuccess();
        await registerAttendeeForAutomated.clickJoinRoom();
        await registerAttendeeForAutomated.verifyWaitForSessionMessage();
      
    });
});