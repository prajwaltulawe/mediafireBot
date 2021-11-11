const puppeteer = require('puppeteer');
const express = require('express');
const app = express();
const port = 8080;

app.use(express.static('public'));


app.get('/linkFetched', (req, res) =>{
  
  if (req.query.folderLink) {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      // await page.goto('https://app.mediafire.com/ctj8uqjj9ybqxS'); /* Exapmle Link */
      await page.goto(req.query.folderLink);
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
        // await new Promise(r => setTimeout(r, 3000)); /* Try this for slow network connection..! */
        newPage.close();
      }
    })();
    res.send(`<center><h1>Downloading Files... </h1></center>`);
  }else{
    res.send(`<center><h1>Downloading Failed... </h1></center>`);
  }

})

app.listen(port, ()=>{
  console.log(`App running on ${port}`);
})

