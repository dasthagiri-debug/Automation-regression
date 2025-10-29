const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const CreateLiveWebinar = require('../pages/CreateLiveWebinar');
const EnterLiveRoomPage = require('../pages/EnterLiveRoomPage');
const EndSessionPage = require('../pages/EndSessionPage');
const InviteAttendeePage = require('../pages/InviteAttendeePage');
const JoinAttendeeLivePage = require('../pages/JoinAttendeeLivePage');
require('../utils/hooks');

test.describe('Join Attendee', () => {

      test.beforeEach(async ({ context }) => {
  // Grant clipboard permissions to all pages in this context
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});

    test('Join Attendee @smoke', async ({ page }) => {
        // Add tag annotation for Allure
       test.info().annotations.push({ 
  type: 'tag', 
  description: 'Join Attendee For Live Webinar' 
});

test.info().annotations.push({ 
  type: 'displayName', 
  description: 'Join Attendee - Live Webinar' 
});
        const loginPage = new LoginPage(page);
        const createLiveWebinar = new CreateLiveWebinar(page);
        const enterLiveRoomPage = new EnterLiveRoomPage(page);
        const inviteAttendeePage = new InviteAttendeePage(page);
        const endsessionPage = new EndSessionPage(page);
        const joinAttendeeLivePage = new JoinAttendeeLivePage(page);

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
         await enterLiveRoomPage.enterGreenRoom();
         await enterLiveRoomPage.clickGotItButton();
         await enterLiveRoomPage.clickGoLiveButton();
         await enterLiveRoomPage.verifyLaunchEventModalLiveButton();
         await inviteAttendeePage.clickPeopleIcon();
         await inviteAttendeePage.clickInvitePeople();
         await inviteAttendeePage.selectAttendeeRole();
         await inviteAttendeePage.copyAttendeeInvitationLink();

        // Define the invitation link selector
    const linkSelector = '#attendee_form_link';

    // Join event in a new tab
    await joinAttendeeLivePage.joinAttendeeInNewTab();
    const attendeePage = await joinAttendeeLivePage.joinAttendeeInNewTab({ linkSelector });
    console.log('✅ Attendee joined the live webinar');
            
       //  await endsessionPage.clickEndSessionButton();

        
    });

});