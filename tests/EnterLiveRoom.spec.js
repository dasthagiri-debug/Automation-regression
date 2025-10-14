const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CreateLiveWebinar = require('../pages/CreateLiveWebinar');
const EnterLiveRoomPage = require('../pages/EnterLiveRoomPage');
require('../utils/hooks');

test.describe('Enter Live Room', () => {

    test('Enter Live Room @smoke', async ({ page }) => {
        // Add tag annotation for Allure
        test.info().annotations.push({ type: 'tag', description: 'smoke' });

        const loginPage = new LoginPage(page);
        const createLiveWebinar = new CreateLiveWebinar(page);
        const enterLiveRoomPage = new EnterLiveRoomPage(page);
        const webinarTitle = `Live Webinar ${new Date().toISOString()}`;
     // Grant camera and microphone permissions on the current page context
    await page.context().grantPermissions(['camera', 'microphone']);
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
        await createLiveWebinar.clickSkipAndMoveToDashboard();
       // await createLiveWebinar.verifyWebinarCreated();

       await enterLiveRoomPage.clickEnterRoomButton();
      //  await enterLiveRoomPage.CameraPermission();
      //  await enterLiveRoomPage.MicPermission();
         await enterLiveRoomPage.enterGreenRoom();
         await enterLiveRoomPage.clickGotItButton();
         await enterLiveRoomPage.clickGoLiveButton();
         await enterLiveRoomPage.verifyLaunchEventModalLiveButton();


        console.log('✅ Enter Live Room');
        
    });

});