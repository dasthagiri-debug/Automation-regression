const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');


class AddTimePage
   {
    constructor(page) {
   // super(page);
    this.page = page;

    //Locators
    this.timeInput = page.getByPlaceholder('Time');
    

    }
    async addFiveMinutesToCurrentISTTime() {
   

// CLEAR existing time
//await timeInput.fill('');    
 await this.timeInput.clear();

// Get current IST time as Date object
let now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

// Add 5 minutes
now.setMinutes(now.getMinutes() + 2);

// Format back to hh:mm AM/PM
const istTime = now.toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata'
});

// Fill the updated time
await this.timeInput.fill(istTime);
console.log(`✅ Added 5 minutes to current IST time: ${istTime}`);
}

 
   }
module.exports = AddTimePage;