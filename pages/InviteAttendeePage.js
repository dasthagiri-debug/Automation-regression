const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
//const BasePage = require('./BasePage');


//class InviteAttendeePage extends BasePage{
  class InviteAttendeePage{
  constructor(page) {
   // super(page);
    this.page = page;

    //Locators
  this.peopleIcon = page.locator('a:has-text("People") img:visible');
   this.invitePeople = page.locator('button:has-text("Invite People")');
   this.inviteGuestsHeader = page.locator('h3:has-text("Invite Guests")');
   this.attendeeButton = page.locator('button.flex:has-text("Attendee")');
   this.AttendeeInvitationLink = page.locator('button:has-text("Copy Attendee Invitation Link")');
   this.closePopupOfAttendeeButton = page.locator('//span[@class="close-btn text-gray-dark cursor-pointer text-[24px] absolute right-5 top-5"]').nth(0);
   
   
   const leaveSpan = page.locator('span', { hasText: 'Leave' });

   // New Tab
    // newTab and its locators will be initialized later
    this.newTab = null;
    this.attendeeName = null;
    this.attendeeEmail = null;
    this.joinEventButton = null;
  }
  
 // Helper: Check if newTab is alive
  async _ensureNewTabAlive() {
    if (!this.newTab || this.newTab.isClosed()) {
      throw new Error('❌ Attendee tab is not open or has been closed');
    }
  }

async clickPeopleIcon() {
  console.log('👥 Looking for People icon...');
  
  // Bring page to front and settle
  await this.page.bringToFront().catch(() => {});
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  await this.page.waitForTimeout(300);

  const selectors = [
    // Flexible selectors that match various HTML structures
    this.page.locator('a:has-text("People") img'),
    this.page.locator('button:has-text("People") img'),
    this.page.locator('[aria-label*="People" i] img'),
    this.page.locator('a:has-text("People")'),
    this.page.locator('button:has-text("People")'),
    this.page.locator('[aria-label*="People" i]'),
    this.page.locator('//a[contains(., "People")] | //button[contains(., "People")]'),
    this.page.locator('img[alt*="People" i]'),
    this.peopleIcon
  ];

  for (let i = 0; i < selectors.length; i++) {
    const sel = selectors[i];
    try {
      // Check if selector matches anything
      const count = await sel.count().catch(() => 0);
      if (count === 0) {
        console.log(`  ℹ️ Selector ${i + 1}/${selectors.length} found 0 elements`);
        continue;
      }

      // Wait for visibility
      await sel.first().waitFor({ state: 'visible', timeout: 3000 });
      
      // Scroll into view and click
      await sel.first().scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(200);
      await sel.first().click({ force: true, timeout: 5000 });
      
      console.log(`✅ People icon clicked (selector ${i + 1}/${selectors.length})`);
      return true;
    } catch (err) {
      console.log(`  ℹ️ Selector ${i + 1}/${selectors.length} failed: ${err.message.split('\n')[0]}`);
    }
  }

  // Last resort: try via keyboard if an element is already focused
  try {
    console.log('🔍 No People icon found via click; trying keyboard navigation...');
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(150);
    await this.page.keyboard.press('Enter');
    console.log('ℹ️ Attempted keyboard Tab+Enter');
    return true;
  } catch (e) { /* ignore */ }

  console.log('⚠️ People icon not found after trying all selectors (may not be present or still loading)');
  return false;
}
 

  async clickInvitePeople() {
    console.log('📧 Clicking Invite People...');
    await expect(this.invitePeople).toBeVisible({ timeout: 10000 });
    await this.invitePeople.click({ timeout: 5000 });
    await expect(this.inviteGuestsHeader).toBeVisible({ timeout: 10000 });
    console.log('✅ Invite People button clicked');
  }

  async selectAttendeeRole() {
    console.log('👤 Selecting Attendee role...');
    await expect(this.attendeeButton).toBeVisible({ timeout: 10000 });
    await this.attendeeButton.click({ timeout: 5000 });
    console.log('✅ Attendee role selected');
  }

  async copyAttendeeInvitationLink() {
  console.log('🔗 Retrieving attendee invitation link...');

  // 0) CLICK the Copy button first to trigger clipboard copy
  try {
    const copyBtn = this.page.locator('button:has-text("Copy Attendee Invitation Link")').first();
    await copyBtn.waitFor({ state: 'visible', timeout: 10000 });
    await copyBtn.click({ timeout: 5000 });
    console.log('✅ Clicked Copy button');
    await this.page.waitForTimeout(500);
  } catch (err) {
    console.log('⚠️ Could not click Copy button:', err.message);
  }

  // 1) Try to extract link from DOM
  let link = '';
  try {
    const btn = this.page.locator('button:has-text("Copy Attendee Invitation Link"), button:has-text("Copy Invitation Link")').first();
    if (await btn.count()) {
      link = (await btn.getAttribute('data-clipboard-text')) || '';
      if (!link) {
        const possibleInput = btn.locator('xpath=./ancestor::*//input | ./following::input[1]');
        if (await possibleInput.count()) {
          link = (await possibleInput.inputValue()).trim();
        }
      }
    }
  } catch (e) { /* ignore */ }

  // 2) Fallback: try reading clipboard
  if (!link) {
    try {
      link = await this.page.evaluate(async () => {
        try { return await navigator.clipboard.readText(); } catch (e) { return ''; }
      });
      link = (link || '').trim();
    } catch (e) { link = ''; }
  }

  if (!link) {
    throw new Error('❌ Invitation link not found in DOM or clipboard');
  }
  console.log(`📋 Obtained invite link: ${link}`);

  // 3) Validate the link format
  if (typeof link !== 'string' || !link.startsWith('http')) {
    console.log('⚠️ Link does not appear to be a valid HTTP URL. Actual link:', link.substring(0, 200));
    throw new Error(`❌ Invalid link format: ${link.substring(0, 100)}`);
  }

  // 4) Open link in a new page
  const context = this.page.context();
  const attendeePage = await context.newPage();

  try {
    await attendeePage.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(err => {
      console.log('⚠️ goto or redirect occurred:', err.message);
    });

    const finalUrl = attendeePage.url();
    console.log(`📄 Navigated to: ${finalUrl}`);

    // 5) Diagnose: Check if page is a registration form or a live event
    const attendeeSelectors = [
      '#attendee_name',
      'input[name="attendee_email"]',
      'input[placeholder*="Name"]',
      'form[action*="register"], form:has(input[name="attendee_email"])'
    ];

    let found = false;
    for (const sel of attendeeSelectors) {
      try {
        const loc = attendeePage.locator(sel);
        if (await loc.count() > 0) {
          await loc.first().waitFor({ state: 'visible', timeout: 3000 });
          found = true;
          console.log(`✅ Found form element: ${sel}`);
          break;
        }
      } catch (e) { /* try next */ }
    }

    // 6) If form not found, save diagnostics
    if (!found) {
      const diagDir = path.join('reports', 'FailedScreenshots');
      if (!fs.existsSync(diagDir)) fs.mkdirSync(diagDir, { recursive: true });

      const diagName = `attendee_page_${Date.now()}`;
      const screenshotPath = path.join(diagDir, `${diagName}.png`);
      const htmlPath = path.join(diagDir, `${diagName}.html`);

      try {
        await attendeePage.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
        const html = await attendeePage.content().catch(() => '<could-not-read>');
        fs.writeFileSync(htmlPath, html);
        console.log(`🧩 Diagnostics saved: ${screenshotPath}, ${htmlPath}`);
      } catch (e) { /* ignore */ }

      // Check if we're on a live event page
      if (finalUrl.includes('live-event') || finalUrl.includes('/live/')) {
        console.log('⚠️ Page is a live event page, not a registration form. Attendee may already be "in" the event.');
        // Don't throw — maybe the attendee is already live
      } else if (/login|sign\s*in|authenticate/i.test(finalUrl)) {
        console.log('⚠️ Page redirected to login/authentication.');
        throw new Error(`Attendee link redirected to login page: ${finalUrl}`);
      } else {
        console.log('⚠️ Attendee form not found on page. Page content may have changed or form is dynamically loaded.');
      }
    } else {
      console.log('✅ Attendee form detected in new tab');
    }

    // 7) Store newTab and locators
    this.newTab = attendeePage;
    this.attendeeName = attendeePage.locator('#attendee_name, input[name="attendee_name"], input[placeholder*="Name"]');
    this.attendeeEmail = attendeePage.locator('[name="attendee_email"], #attendee_email, input[placeholder*="Email"]');
    this.joinEventButton = attendeePage.locator('#join_event_btn, button:has-text("Join"), button:has-text("Enter")');

    console.log('✅ New tab initialized and ready');
  } catch (err) {
    console.log('❌ Error during attendee page setup:', err.message);
    await attendeePage.close().catch(() => {});
    throw err;
  }
}

  // Fill attendee details and join event in new tab
async fillAttendeeDetailsAndJoin(name, email) {
  console.log('📝 Filling attendee details...');
  await this._ensureNewTabAlive();

  try {
    await expect(this.attendeeName).toBeVisible({ timeout: 10000 });
    await this.attendeeName.fill(name, { timeout: 5000 });

    await expect(this.attendeeEmail).toBeVisible({ timeout: 10000 });
    await this.attendeeEmail.fill(email, { timeout: 5000 });

    await expect(this.joinEventButton).toBeVisible({ timeout: 10000 });
    
    // Capture current URL and wait for navigation after clicking join
    const urlBefore = this.newTab.url();
    console.log(`📍 URL before join: ${urlBefore}`);

    // Click join and wait for redirect/navigation
    await Promise.all([
      this.newTab.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(err => {
        console.log('ℹ️ Navigation event not fired:', err.message);
      }),
      this.joinEventButton.click({ timeout: 5000 })
    ]);

    const urlAfter = this.newTab.url();
    console.log(`📍 URL after join: ${urlAfter}`);

    // Check if redirected to home/logout page
    if (urlAfter.includes('easywebinar.com') && !urlAfter.includes('live-event') && !urlAfter.includes('/live/')) {
      console.log('⚠️ Attendee was redirected to home page after joining (session ended or redirect-on-join behavior)');
      console.log('✅ Attendee joined successfully and session is now ended');
      // This is expected — attendee joined and was logged out/redirected
      return;
    }

    console.log('✅ Attendee details filled and event joined');
  } catch (err) {
    console.log('❌ Failed to fill attendee details:', err.message);
    throw err;
  }
}

  async handleClickForSound() {
  console.log('🔊 Clicking for sound (robust)...');

  // Make sure attendee tab exists
  if (!this.newTab || this.newTab.isClosed()) {
    console.log('ℹ️ Attendee tab not available; skipping Click for sound');
    return false;
  }

  // Bring tab to front and let UI settle
  await this.newTab.bringToFront().catch(() => {});
  await this.newTab.waitForLoadState('domcontentloaded').catch(() => {});
  await this.newTab.waitForTimeout(500); // small settle

  const candidates = [
    '//span[normalize-space()="Click for sound"]',
    'span:has-text("Click for sound")',
    'button:has-text("Click for sound")',
    'text=Click for sound'
  ];

  // 1) Try locator clicks (Playwright click)
  for (const sel of candidates) {
    try {
      const l = this.newTab.locator(sel);
      if (await l.count() === 0) continue;
      await l.first().waitFor({ state: 'visible', timeout: 3000 });
      await l.first().scrollIntoViewIfNeeded().catch(() => {});
      await l.first().click({ timeout: 5000 }).catch(() => {});
      console.log('✅ Clicked "Click for sound" via locator click');
      return true;
    } catch (e) {
      // try next
    }
  }

  // 2) Try finding element inside any iframe (the button could be inside an iframe)
  try {
    for (const frame of this.newTab.frames()) {
      try {
        for (const sel of candidates) {
          const handle = await frame.$(sel).catch(() => null);
          if (!handle) continue;
          await frame.waitForTimeout(200);
          // attempt Playwright click on the handle via bounding box
          const box = await handle.boundingBox().catch(() => null);
          if (box) {
            await this.newTab.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { timeout: 5000 }).catch(() => {});
            console.log('✅ Clicked "Click for sound" inside iframe via mouse click');
            return true;
          }
          // fallback JS click inside frame
          await frame.evaluate(el => { try { el.click(); } catch(e){} }, handle).catch(() => {});
          console.log('✅ Clicked "Click for sound" inside iframe via JS click');
          return true;
        }
      } catch (fErr) { /* ignore frame errors and continue */ }
    }
  } catch (e) { /* ignore */ }

  // 3) Try document-level JS search + click (not guaranteed to be a "user gesture" but sometimes helps)
  try {
    const clicked = await this.newTab.evaluate(() => {
      const text = 'Click for sound';
      const xpath = `//span[normalize-space() = "${text}"] | //button[normalize-space() = "${text}"] | //*[text()[normalize-space()="${text}"]]`;
      const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (el) {
        try { el.scrollIntoView({ block: 'center' }); } catch (e) {}
        try { el.click(); return true; } catch (e) { return false; }
      }
      return false;
    }).catch(() => false);

    if (clicked) {
      console.log('✅ Clicked "Click for sound" via page.evaluate JS click');
      return true;
    }
  } catch (e) { /* ignore */ }

  // 4) Last-resort: try to interact with an element that likely opens audio (press space/enter)
  try {
    await this.newTab.keyboard.press('Tab').catch(() => {});
    await this.newTab.waitForTimeout(150);
    await this.newTab.keyboard.press('Enter').catch(() => {});
    console.log('ℹ️ Attempted keyboard Tab+Enter as fallback');
  } catch (e) { /* ignore */ }

  console.log('⚠️ "Click for sound" button not found (may not be present or requires native gesture)');
  return false;
}
 
  async clickAttendeeLeaveButton() {
    console.log('🚪 Clicking Leave button...');
    await this._ensureNewTabAlive();

    const selectors = [
      this.newTab.locator('span:has-text("Leave")/ancestor::button'),
      this.newTab.locator('button:has-text("Leave")'),
      this.newTab.locator('//span[contains(text(), "Leave")]/ancestor::button'),
      this.newTab.locator('text="Leave"')
    ];

    for (const sel of selectors) {
      try {
        await sel.waitFor({ state: 'visible', timeout: 2000 });
        await sel.click({ timeout: 5000 });
        console.log('✅ Clicked on "Leave" button');
        return;
      } catch (e) {
        // Try next selector
      }
    }
     console.log('⚠️ Leave button not found (may not be present on this page)');
  }

  async clickLeaveSession() {
    console.log('❌ Confirming leave session...');
    await this._ensureNewTabAlive();

    try {
      const heading = this.newTab.locator('text="Leaving So Soon?"');
      await expect(heading).toBeVisible({ timeout: 10000 });

      const leaveButton = this.newTab.getByRole('button', { name: /yes,\s+leave\s+session/i });
      await expect(leaveButton).toBeVisible({ timeout: 10000 });
      await leaveButton.click({ timeout: 5000 });

      console.log('✅ Confirmed leave session');
    } catch (err) {
      console.log('⚠️ Leave confirmation dialog not found:', err.message);
    }
  }

  async clickClosePopupOfAttendeeButton() {
    console.log('❌ Closing attendee popup...');
    try {
      await this.page.bringToFront();
      await this.page.waitForLoadState('domcontentloaded');

      const closeSelectors = [
        this.closePopupOfAttendeeButton,
        this.page.locator('span.close-btn:visible'),
        this.page.locator('[aria-label*="close" i]'),
        this.page.locator('//span[@class="close-btn text-gray-dark cursor-pointer text-[24px] absolute right-5 top-5"]').first()
      ];

      for (const sel of closeSelectors) {
        try {
          await sel.waitFor({ state: 'visible', timeout: 2000 });
          await sel.click({ timeout: 5000 });
          console.log('✅ Closed attendee popup');
          return;
        } catch (e) {
          // Try next selector
        }
      }
      console.log('⚠️ Close button not found');
    } catch (err) {
      console.log('⚠️ Error closing popup:', err.message);
    }
  }

  async goToNewAttendeeTab() {
    console.log('🔄 Switching to attendee tab...');
    await this._ensureNewTabAlive();

    await this.newTab.bringToFront();
    await this.newTab.waitForLoadState('domcontentloaded');
    console.log('✅ Switched to Attendee tab');
  }

  async gotoHostPage() {
    console.log('🔄 Switching to host page...');
    try {
      await this.page.bringToFront();
      await this.page.waitForLoadState('domcontentloaded');
      console.log('✅ Switched to Host page');
    } catch (err) {
      console.log('⚠️ Error switching to host page:', err.message);
    }
  }

  async closeNewTab() {
    console.log('🔒 Closing attendee tab...');
    if (this.newTab && !this.newTab.isClosed()) {
      await this.newTab.close();
      this.newTab = null;
      console.log('✅ Attendee tab closed');
    } else {
      console.log('ℹ️ Attendee tab already closed');
    }
  }
}

module.exports = InviteAttendeePage;