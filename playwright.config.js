// @ts-check
/* const { devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  retries :0,

  timeout: 100 * 1000,
  expect: {
  
    timeout: 10000
  },
  
  //reporter: 'html',
  
  reporter: [['html', { outputFolder: `reports/html-report-${Date.now()}`, open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  /* use: {

    browserName : 'chromium',
    headless : true,
    screenshot : 'on',
    trace : 'retain-on-failure',//off,on
  video: 'retain-on-failure',     // optional: record video on failure
  outputDir: 'test-results', 
    
    
    
  },


}; */

/* module.exports = config; */

const { defineConfig } = require('@playwright/test');
const { getProperty } = require('./utils/config');

const headlessValue = getProperty('web.headless');
const headless = headlessValue === true || headlessValue === 'true'; // converts YAML value to boolean

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [
    ['list'],
    ['allure-playwright']
  ],
  use: {
    headless: headless,               // <-- false = headed mode
    browserName: getProperty('web.browser') || 'chromium',
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
});