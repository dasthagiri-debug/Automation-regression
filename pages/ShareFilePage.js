const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class ShareFilePage 
   {
    constructor(page) {
   // super(page);
    this.page = page;

    //Locators
    //this.shareLocator = page.locator('span:has-text("Share")');
   this.shareLocator =  page.getByText('Share', { exact: true });
   // this.shareFileLocator = page.getByRole('heading', { name: 'Share File Share a PowerPoint' });
    this.shareFileLocator = page.getByText('Share a PowerPoint slide or presentation material', { exact: true });
    this.selctFileFromLibraryLocator =page.locator("//span[normalize-space()='ewm -tm webinar secrets.pdf']");
    //this.selctFileFromLibraryLocator = page.locator('span.img:has(img)');
    this.shareFilebutton = page.getByRole('button', { name: 'Share' });
    this.allSlideImgs = page.locator('.ppt-slideshare > div img');
    //this.closepopupinmainpage = page.getByText('×').nth(3);
    this.closePopupOfAttendeeButton = page.locator('//span[@class="close-btn text-gray-dark cursor-pointer text-[24px] absolute right-5 top-5"]').nth(0);
    this.stopSharebutton = page.getByText('Stop Share', { exact: true });
  }
    async clickclosepopup() {
  await this.page.bringToFront();
  await this.page.waitForLoadState('load');
   await this.closePopupOfAttendeeButton.click();
   console.log("Clicked on 'Close' button of Attendee popup");
        }
    async shareFileInLiveWebinar() {
        await this.shareLocator.click();
        console.log("Clicked on Share option");
        await this.shareFileLocator.click();
        console.log("Clicked on Share File option");
        await this.selctFileFromLibraryLocator.click();
        console.log("Selected file from library");
        await expect(this.shareFilebutton).toBeVisible({ timeout: 5000 });
        await this.shareFilebutton.click();
        console.log("Clicked on Share button to share the file");
  }
   async checkFileSharedProperly()
   {
    const slideCount = await this.allSlideImgs.count();
    if (slideCount > 0) {
      console.log(`✅ File shared successfully with ${slideCount} slides.`);
    } else {
      console.log('❌ File sharing failed or no slides found.');
    }
   }
   async clickonStopShare(){
   await this.stopSharebutton.click();
   console.log("Clicked on 'Stop Share' button");
   }

    
}
module.exports = ShareFilePage;