const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://app.mediafire.com/ctj8uqjj9ybqxS');
  await new Promise(r => setTimeout(r, 10000));
  
  var valid_links = [];
  valid_links = await page.$$('button[title^=Download]');
  valid_links.shift();
  
  for (const downLink of valid_links) {
    var newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    downLink.click();
    var newPage = await newPagePromise;
    await new Promise(r => setTimeout(r, 5000));
    await newPage.click('#downloadButton');
    // await new Promise(r => setTimeout(r, 3000));
    newPage.close();
  }
})();

