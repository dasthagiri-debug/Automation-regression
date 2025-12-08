const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CreateLiveWebinar = require('../pages/CreateLiveWebinar');
const CreateAutomatedWebinarPage = require('../pages/CreateAutomatedWebinarPage');
const AddTimePage = require('../pages/AddTimePage');
const RegisterAttendeeForAutomatedPage = require('../pages/RegisterAttendeeForAutomatedPage');

require('../utils/hooks');

test.describe('Create Automated Webinar By Changing Time', () => {

    test('Create Automated Webinar by Changing Time @smoke', async ({ page }) => {
        // Add tag annotation for Allure
        test.info().annotations.push({ type: 'tag', description: 'smoke' });

        const loginPage = new LoginPage(page);
        const createLiveWebinar = new CreateLiveWebinar(page);
        const createAutomatedWebinar = new CreateAutomatedWebinarPage(page);
        const webinarTitle = `Automated Webinar ${new Date().toISOString()}`;
        const addTimePage = new AddTimePage(page);
        const registerAttendeeForAutomated = new RegisterAttendeeForAutomatedPage(page);

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
        await addTimePage.addFiveMinutesToCurrentISTTime();

       await createAutomatedWebinar.clickVideoSelectionButton();
        await createAutomatedWebinar.clickAddVideoButton();
        await createAutomatedWebinar.enterVideoTitle();;
        await createAutomatedWebinar.enterVideoURL();
        await createAutomatedWebinar.clickAddVideo();
        await createAutomatedWebinar.clickContinueToTemplates();
        await createAutomatedWebinar.clickSkipToDashboard(); 

         await registerAttendeeForAutomated.clickRegistrationPage();
        await registerAttendeeForAutomated.clickRegisterNow();
        
        await registerAttendeeForAutomated.verifyRegistrationSuccess();
        await registerAttendeeForAutomated.clickJoinRoom();
        await registerAttendeeForAutomated.verifyWaitForSessionMessage();
        await registerAttendeeForAutomated.clickVolumeButton();

    });
});