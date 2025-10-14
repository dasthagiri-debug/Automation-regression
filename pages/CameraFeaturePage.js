const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CameraFeaturePage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators

     this.cameraBtn = page.locator('button.control-button.video-on, button.control-button.video-off');
  }}
  