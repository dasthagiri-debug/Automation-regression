const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const EventsDashboard = require('../pages/EventsDashBoard');
require('../utils/hooks');

test.describe('Events Dashboard validation', () => {

    test('Verify Events Dasboard @smoke', async ({ page }) => {
        // Add tag annotation for Allure
        test.info().annotations.push({ type: 'tag', description: 'smoke' });

        const loginPage = new LoginPage(page);

        // Hooks already opened URL

        await loginPage.enterUsername();
        await loginPage.enterPassword();
        await loginPage.clickLogin();
        await loginPage.verifyDashboardRedirect();

        // Validate events dashboard elements after successful login
        const eventsDashboard = new EventsDashboard(page);
        await eventsDashboard.validateDashboardVisibility();

        console.log('✅ Login + Events Dashboard validation test passed');
    });

});