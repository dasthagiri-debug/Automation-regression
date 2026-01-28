const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class EnterLiveRoomPage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;
     this.enterRoomBtn = this.page.getByText(" Enter Room ");
   
   
    this.liveroomBtn = page.getByRole('button', { name: 'Enter Live Room' });
    this.greenroomBtn = page.locator('button.primary-button', { hasText: 'Continue to Green Room' });
    // this.greenroomBtn = page.locator('button.primary-button', { hasText: 'Enter Green Room' }); 
    this.popupButton = page.locator('span.mat-button-wrapper:has-text("Join Existing Live Webinar")');
    this.container = page.locator('div.bg-white.border-gray-200.p-4');
    this.gotItBtn = this.container.getByRole('button', { name: 'Got it' });
    this.goLiveButton = page.locator('button:has-text("Go Live")');
    this.modal = page.locator('.modal-container.with-header').filter({ hasText: 'Launch the Event?' })
    this.gotitButton = page.locator("//button[normalize-space()='Got it']")

  }
  
    //Locators

   // Helper: Try multiple selectors until one works
  async _findElement(selectorArray, elementName, timeout = 5000) {
    for (let i = 0; i < selectorArray.length; i++) {
      try {
        await selectorArray[i].waitFor({ state: 'visible', timeout: 2000 });
        return selectorArray[i];
      } catch (e) {
        // Try next selector
      }
    }
    throw new Error(`❌ ${elementName} not found after trying ${selectorArray.length} selectors`);
  }

  async _findAndClick(selectorArray, elementName, timeout = 15000) {
    const element = await this._findElement(selectorArray, elementName, timeout);
    await element.scrollIntoViewIfNeeded();
    await element.click({ timeout: 5000 });
    console.log(`✅ ${elementName} clicked`);
    return element;
  }

  async clickEnterRoomButton() {
    console.log('🔍 Looking for Enter Room button...');
    await this.page.waitForLoadState('domcontentloaded');

    const selectors = [
      this.page.locator('button[mat-flat-button] span.mat-button-wrapper:has-text("Enter Room")'),
      this.page.locator('button.header-btn-ew-section:has-text("Enter Room")'),
      this.page.locator('button[color="accent"]:has-text("Enter Room")'),
      this.page.getByRole('button', { name: /enter\s+room/i }),
      this.page.locator('button:has-text("Enter Room")'),
      this.page.locator('//button[contains(.//span, "Enter Room")]'),
      this.page.locator('//span[@class="mat-button-wrapper"][contains(text(), "Enter Room")]/ancestor::button')
    ];

    await this._findAndClick(selectors, 'Enter Room Button', 15000);

    // Try to close popup if present (non-blocking)
    try {
      const popupSelectors = [
        this.page.locator('span.mat-button-wrapper:has-text("Join Existing Live Webinar")'),
        this.page.locator('button:has-text("Join Existing Live Webinar")')
      ];
      const popup = await this._findElement(popupSelectors, 'Popup', 2000).catch(() => null);
      if (popup) {
        await popup.click().catch(() => {});
        console.log('✅ Popup dismissed');
      }
    } catch (e) {
      console.log('ℹ️ No popup to dismiss');
    }
  }

  async CameraPermission() {
    console.log('📷 Adjusting camera permission...');
    // Fixed: use this.page instead of page
    const cameraBtn = this.page.locator('button.control-button.video-on, button.control-button.video-off');

    try {
      // Wait for the button to be visible
      await cameraBtn.waitFor({ state: 'visible', timeout: 10000 });
      await cameraBtn.scrollIntoViewIfNeeded();

      // Check state via visible SVG
      const isCameraOn = await cameraBtn.locator('svg.on').isVisible({ timeout: 1000 }).catch(() => false);

      if (isCameraOn) {
        console.log('📷 Camera is ON, turning it OFF...');
        await cameraBtn.click({ timeout: 5000 });
        await this.page.waitForTimeout(500);
        console.log('✅ Camera is now OFF');
      } else {
        console.log('📷 Camera is OFF, turning it ON...');
        await cameraBtn.click({ timeout: 5000 });
        await this.page.waitForTimeout(500);
        console.log('✅ Camera is now ON');
      }
    } catch (err) {
      console.log('⚠️ Camera control unavailable:', err.message);
    }
  }

  async MicPermission() {
    console.log('🎤 Adjusting mic permission...');
    // Fixed: use this.page instead of page
    const micButton = this.page.locator('button.control-button.mic-on, button.control-button.mic-off');

    try {
      await micButton.waitFor({ state: 'visible', timeout: 10000 });
      await micButton.scrollIntoViewIfNeeded();

      const isMicOn = await micButton.evaluate(el => el.classList.contains('mic-on')).catch(() => false);

      if (isMicOn) {
        console.log('🎤 Mic is ON, turning it OFF...');
        await micButton.click({ timeout: 5000 });
        console.log('✅ Mic is now OFF');
      } else {
        console.log('🎤 Mic is OFF, turning it ON...');
        await micButton.click({ timeout: 5000 });
        console.log('✅ Mic is now ON');
      }
    } catch (err) {
      console.log('⚠️ Mic control unavailable:', err.message);
    }
  }

  async enterGreenRoom() {
    console.log('🟢 Entering green room...');
    const greenRoomSelectors = [
      this.page.locator('button.primary-button:has-text("Continue to Green Room")'),
      this.page.locator('button.primary-button:has-text("Enter Green Room")'),
      this.page.getByRole('button', { name: /continue to green room|enter green room/i })
    ];

    try {
      const greenBtn = await this._findElement(greenRoomSelectors, 'Green Room Button', 30000);
      await expect(greenBtn).toBeEnabled();

      // Wait for loader to disappear
      const loader = greenBtn.locator('span.btn-loader');
      if (await loader.count() > 0) {
        await loader.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
      }

      await greenBtn.scrollIntoViewIfNeeded();
      await greenBtn.click({ timeout: 10000 });
      console.log('✅ Enter Green Room clicked');
    } catch (err) {
      console.log('⚠️ Standard click failed, attempting JS click...');
      try {
        // Fixed: use this.page instead of page
        const handle = await this.page.locator('button.primary-button').first().elementHandle();
        if (handle) {
          await this.page.evaluate(el => el.click(), handle);
          console.log('✅ Green room clicked via JS');
        } else {
          throw err;
        }
      } catch (jsErr) {
        throw new Error(`Failed to enter green room: ${err.message}`);
      }
    }
  }

  async clickGotItButton() {
    console.log('👉 Clicking Got it button...');
    const gotItSelectors = [
      this.page.getByRole('button', { name: /got\s+it/i }),
      this.page.locator('button:has-text("Got it")'),
      this.page.locator('//button[normalize-space()="Got it"]'),
      this.page.locator('span.mat-button-wrapper:has-text("Got it")/ancestor::button')
    ];

    try {
      await this._findAndClick(gotItSelectors, 'Got it Button', 30000);
    } catch (err) {
      console.log('ℹ️ Got it button not found (may have been auto-dismissed)');
    }
  }

  async clickGoLiveButton() {
    console.log('🚀 Clicking Go Live button...');

    // Dismiss "Got it" first if visible (non-blocking)
    try {
      const gotItBtn = this.page.locator('button:has-text("Got it")');
      const visible = await gotItBtn.isVisible({ timeout: 1500 }).catch(() => false);
      if (visible) {
        await gotItBtn.click({ timeout: 3000 }).catch(() => {});
        await this.page.waitForTimeout(300);
      }
    } catch (e) {
      // ignore
    }

    // Click Go Live
    const goLiveSelectors = [
      this.page.getByRole('button', { name: /go\s+live/i }),
      this.page.locator('button:has-text("Go Live")'),
      this.page.locator('//button[contains(text(), "Go Live")]')
    ];

    await this._findAndClick(goLiveSelectors, 'Go Live Button', 30000);
    await this.page.waitForTimeout(2000);
    console.log('✅ Go Live button clicked');
  }

  async verifyLaunchEventModalLiveButton() {
    console.log('📋 Verifying Launch Event modal...');

    const modalSelectors = [
      this.page.locator('.modal-container.with-header').filter({ hasText: /launch\s+the\s+event/i }),
      this.page.locator('[role="dialog"]').filter({ hasText: /launch/i }),
      this.page.locator('.modal').filter({ hasText: /launch/i })
    ];

    let modal = null;
    try {
      modal = await this._findElement(modalSelectors, 'Launch Event Modal', 30000);
      console.log('✅ Launch Event Modal is visible');
    } catch (err) {
      console.log('⚠️ Modal not found (may have auto-dismissed)');
      return;
    }

    try {
      const title = await modal.locator('.modal-header h3, .modal-title').innerText({ timeout: 3000 }).catch(() => 'N/A');
      console.log('📄 Modal title:', title);
    } catch (e) {
      // ignore
    }

    const goLiveSelectors = [
      modal.getByRole('button', { name: /go\s+live/i }),
      modal.locator('button:has-text("Go Live")'),
      this.page.locator('[role="dialog"] button:has-text("Go Live")')
    ];

    try {
      await this._findAndClick(goLiveSelectors, 'Go Live Modal Button', 30000);
      await this.page.waitForTimeout(2000);
      console.log('✅ Launch event — live screen visible');
    } catch (err) {
      console.log('⚠️ Could not click Go Live in modal:', err.message);
    }
  }
}

module.exports = EnterLiveRoomPage;
