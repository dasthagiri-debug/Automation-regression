const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class EndSessionPage extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    //Locators
    this.endSessionButton = page.getByRole('button', { name: 'End Session' });
    this.confirmModal = page.locator('div.modal-container.with-header').filter({ hasText: 'Confirm End Session?' });
    this.confirmEndButton = this.confirmModal.locator('button.warning-button:has-text("Yes, End Session")');
  }
    async clickEndSessionButton() {
        await this.validateElementVisibility(this.endSessionButton, 'End Session Button');
        await this.endSessionButton.click({ timeout: 15000 });
        console.log('✅ Clicked on End Session Button');

await expect(this.confirmModal).toBeVisible({ timeout: 30000 });
console.log("✅ Confirm End Session modal appeared");

await this.confirmEndButton.scrollIntoViewIfNeeded();
await expect(this.confirmEndButton).toBeEnabled();

await this.confirmEndButton.click();
console.log("✅ Confirm End Session button clicked");
         

// 5️⃣ Optional: wait for modal to disappear
//await this.confirmModal.waitFor({ state: 'hidden', timeout: 30000 });
//console.log("✅ End Session modal closed");
        }
  }
module.exports = EndSessionPage;