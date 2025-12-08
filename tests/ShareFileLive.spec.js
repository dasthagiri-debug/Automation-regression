const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CreateLiveWebinar = require('../pages/CreateLiveWebinar');
const EnterLiveRoomPage = require('../pages/EnterLiveRoomPage');
const EndSessionPage = require('../pages/EndSessionPage');
const InviteAttendeePage = require('../pages/InviteAttendeePage');
const ShareFilePage = require('../pages/ShareFilePage');
require('../utils/hooks');

test.describe('Share File', () => {

      test.beforeEach(async ({ context }) => {
  // Grant clipboard permissions to all pages in this context
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});

    test('Share File @smoke', async ({ page }) => {
        // Add tag annotation for Allure
       test.info().annotations.push({ 
  type: 'tag', 
  description: 'Share File For Live Webinar' 
});

test.info().annotations.push({ 
  type: 'displayName', 
  description: 'Invite Attendee - Live Webinar' 
});
        const loginPage = new LoginPage(page);
        const createLiveWebinar = new CreateLiveWebinar(page);
        const enterLiveRoomPage = new EnterLiveRoomPage(page);
        const inviteAttendeePage = new InviteAttendeePage(page);
        const endsessionPage = new EndSessionPage(page);
        const shareFilePage = new ShareFilePage(page);
        const webinarTitle = `Live Webinar ${new Date().toISOString()}`;
     // Grant camera and microphone permissions on the current page context
    await page.context().grantPermissions(['camera', 'microphone']);

    // Hooks already opened URL

        await loginPage.enterUsername();
        await loginPage.enterPassword();
        await loginPage.clickLogin();
        await loginPage.verifyDashboardRedirect();

        // Validate events dashboard elements after successful login
       // await createAutomatedWebinar.closeBlackFridayPopup();
        await createLiveWebinar.clickonCreateWebinar();
        await createLiveWebinar.clickLiveButton();
        await createLiveWebinar.enterWebinarTitle(webinarTitle);
        await createLiveWebinar.clickSchedulingOptions();

        await createLiveWebinar.selectTimeZone();
        await createLiveWebinar.clickNextToTemplateSelection();
        await createLiveWebinar.clickSkipAndMoveToDashboard();
       // await createLiveWebinar.verifyWebinarCreated();

       await enterLiveRoomPage.clickEnterRoomButton();
         await enterLiveRoomPage.enterGreenRoom();
         await enterLiveRoomPage.clickGotItButton();
         await enterLiveRoomPage.clickGoLiveButton();
         await enterLiveRoomPage.verifyLaunchEventModalLiveButton();
         await inviteAttendeePage.clickPeopleIcon();
         await inviteAttendeePage.clickInvitePeople();
         await inviteAttendeePage.selectAttendeeRole();
         await inviteAttendeePage.copyAttendeeInvitationLink();
         await inviteAttendeePage.fillAttendeeDetailsAndJoin('Tester tyyu', 'tayu@gmail.com');
         await inviteAttendeePage.handleClickForSound();
         //add share file
            await shareFilePage.clickclosepopup();
            await shareFilePage.shareFileInLiveWebinar();
            await shareFilePage.checkFileSharedProperly();
            await inviteAttendeePage.gotonewAttendeeTab();
            await shareFilePage.checkFileSharedProperly();
         await inviteAttendeePage.clickAttendeeLeaveButton();
         await inviteAttendeePage.clickLeaveSession();
        await inviteAttendeePage.gotoHostPage();
        await shareFilePage.clickonStopShare();
        await endsessionPage.clickEndSessionButton();


        console.log('✅ File Shared Successfully');
        
    });

});