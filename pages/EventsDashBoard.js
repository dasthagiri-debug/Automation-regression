const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class EventsDashboard extends BasePage{
  constructor(page) {
    super(page);
    this.page = page;

    // Locators
    this.userIntials_btn = page.locator("span.ng-star-inserted span.user-image-sidenav.circle.user-initals-block.user-inital-1")
    this.myWebinars_txt = page.getByRole('heading', { name: 'My Webinars' });
    this.createWebinar_btn = page.getByRole('button', { name: 'Create a Webinar' });
    this.all_btn = page.locator('#mat-button-toggle-1-button');
    this.live_btn = page.locator('#mat-button-toggle-2-button');
    this.automated_btn = page.locator('#mat-button-toggle-3');
    this.automatedGold_btn = page.locator('#mat-button-toggle-4');
    this.webinars_btn = page.locator('span.dashboard-icon-ew:has-text("Webinars")');
    this.people_btn = page.locator('a:has(span.dashboard-icon-ew:has-text("People"))');
    this.library_btn = page.locator('a').filter({ hasText: 'Library' });
    this.help_btn = page.locator('a:has(span.dashboard-icon-ew:has-text("HELP"))');
    this.settings_btn = page.locator('a:has(span.dashboard-icon-ew:has-text("Settings"))')
  }

  // -----------------------------
  // Validate visibility with logging
  // -----------------------------
  async validateElementVisibility(element, name) {
    try {
      await expect(element).toBeVisible();
      console.log(`✅ ${name} is visible`);
    } catch (err) {
      console.log(`❌ ${name} is NOT visible`);
    }
  }

  async validateDashboardVisibility() {
    await this.validateElementVisibility(this.userIntials_btn, 'User Intials button');
    await this.validateElementVisibility(this.myWebinars_txt, 'My Webinars Heading');
    await this.validateElementVisibility(this.createWebinar_btn, 'Create Webinar Button');
    await this.validateElementVisibility(this.all_btn, 'All Button');
    await this.validateElementVisibility(this.live_btn, 'Live Button');
    await this.validateElementVisibility(this.automated_btn, 'Automated Button');
    await this.validateElementVisibility(this.automatedGold_btn, 'Automated Gold Button');
    await this.validateElementVisibility(this.webinars_btn, 'Webinars Button');
    await this.validateElementVisibility(this.people_btn, 'People Button');
    await this.validateElementVisibility(this.library_btn, 'Library Button');
    await this.validateElementVisibility(this.help_btn, 'Help Button');
    await this.validateElementVisibility(this.settings_btn, 'Settings Button');
  }
}

module.exports = EventsDashboard;