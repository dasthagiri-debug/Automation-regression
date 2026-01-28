const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { getProperty } = require('./config');

test.beforeEach(async ({ page }) => {
  const url = getProperty('web.url');
  await page.goto(url);
  page.setDefaultTimeout(30000);
  console.log(`✅ Navigated to URL from YAML: ${url}`);
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    const screenshotDir = path.join('reports', 'FailedScreenshots');
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });

    const screenshotPath = path.join(
      screenshotDir,
      `${testInfo.title.replace(/\s+/g, '_')}.png`
    );
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Screenshot saved at ${screenshotPath}`);

    // Attach screenshot to Allure
    await testInfo.attach('Screenshot', {
      path: screenshotPath,
      contentType: 'image/png'
    });
    // --- Video ---
    if (page.video()) {
      const videoDir = path.join('reports', 'FailedVideos');
      if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

      const videoPath = path.join(
        videoDir,
        `${testInfo.title.replace(/\s+/g, '_')}.webm`
      );
      await page.video().saveAs(videoPath);
      console.log(`🎬 Failed test video saved at ${videoPath}`);
        // Attach video to Allure
      await testInfo.attach('Video', {
        path: videoPath,
        contentType: 'video/webm'
      });

      // --- Optional: automatically open video locally ---
      const platform = process.platform;
      if (platform === 'darwin') {
        exec(`open "${videoPath}"`); // macOS
      }
    }
  }
});