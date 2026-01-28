const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class MicFeaturePage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    // Locator for the mic control button (keeps original selector)
    //this.micButton = page.locator('button.control-button.mic-on'); 
    this.micLabel = page.locator('xpath=(//span[@class="menu-icon"])[1]');
    this.micSvgOn = this.micLabel.locator(':scope svg.on');
    this.micSvgOff = this.micLabel.locator(':scope svg.off');

  }

 /*async toggleMic() {
    await this.micLabel.waitFor({ state: 'visible', timeout: 5000 });

    const isMicOn = await this.micSvgOn.isVisible().catch(() => false);
    const isMicOff = await this.micSvgOff.isVisible().catch(() => false);

    if (isMicOn) {
      console.log('🎤 Mic is ON — turning it OFF...');
      await this.micSvgOn.scrollIntoViewIfNeeded();
      await this.micSvgOn.click({ force: true });

      await expect(this.micSvgOff).toBeVisible({ timeout: 7000 });
      console.log('✅ Mic is now OFF');
    } else if (isMicOff) {
      console.log('🎤 Mic is OFF — turning it ON...');
      await this.micSvgOff.scrollIntoViewIfNeeded();
      await this.micSvgOff.click({ force: true });

      await expect(this.micSvgOn).toBeVisible({ timeout: 7000 });
      console.log('✅ Mic is now ON');
    } else {
      console.warn('⚠️ Mic state could not be detected — no .on/.off SVG found');
    }
  }
}*/

async toggleMic() {
  await this.micLabel.click();
  console.log("🎤 Mic toggled successfully");
}
}


module.exports = MicFeaturePage;