const { test } = require('@playwright/test');
const LoginPage = require('../pages/loginPage');
require('../utils/hooks');
test.describe('Login Positive Flow', () => {

    test('Login with valid credentials should redirect to dashboard @smoke', async ({ page }) => {
        // Add tag annotation for Allure
        test.info().annotations.push({ type: 'tag', description: 'smoke' });

        const loginPage = new LoginPage(page);

        // Hooks already opened URL

        await loginPage.enterUsername();
        await loginPage.enterPassword();
        await loginPage.clickLogin();
        await loginPage.verifyDashboardRedirect();

        console.log('✅ Login positive flow test passed');
    });

});