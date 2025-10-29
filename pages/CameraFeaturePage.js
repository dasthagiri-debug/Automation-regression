const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CameraFeaturePage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators

     //this.cameraBtn = page.locator('button.control-button.video-on, button.control-button.video-off');
     this.username = page.locator('span.user-name');
     this.cameraBtn = page.locator('a:has-text("Camera")');
     this.firstCameraLink = this.cameraBtn.nth(0);
  }

async toggleCamera() {
  const onLocator = this.firstCameraLink.locator('svg.on');
  const offLocator = this.firstCameraLink.locator('svg.off');
  let isCameraOn = false;

  if (await onLocator.count()) {
    await onLocator.waitFor({ state: 'visible', timeout: 5000 });
    isCameraOn = await onLocator.isVisible();
  }

  if (isCameraOn) {
    console.log("📷 Camera is ON, turning it OFF...");
    await this.firstCameraLink.click();
    if (await offLocator.count()) {
      await offLocator.waitFor({ state: 'visible', timeout: 5000 });
      await expect(offLocator).toBeVisible();
    } else {
      console.log('SVG.off element not found after turning off camera');
    }
    console.log("✅ Camera is now OFF");
  } else {
    console.log("📷 Camera is OFF, turning it ON...");
    await this.firstCameraLink.click();
    if (await onLocator.count()) {
      await onLocator.waitFor({ state: 'visible', timeout: 5000 });
      await expect(onLocator).toBeVisible();

    } else {
      console.log('SVG.on element not found after turning on camera');
    }
    console.log("✅ Camera is now ON");
  }
}
}
  module.exports = CameraFeaturePage;
   