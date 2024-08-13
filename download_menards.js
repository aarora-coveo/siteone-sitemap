const fs = require('fs');
const { chromium } = require('playwright');

const URL_FILES = ["siteone_articles.txt"];

const delay = ms => new Promise(res => setTimeout(res, ms));

const savePage = async (page, path, outputFolder) => {
  const filePath = outputFolder + path.split('//www.siteone.com/en')[1];

  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${path}`);
    return;
  }

  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await delay(1000);

  // create folder on file system from filepath
  const folderPath = filePath.split('/').slice(0, -1).join('/');
  fs.mkdirSync(folderPath, { recursive: true });

  // write file to folder
  const html = await page.content();
  fs.writeFileSync(filePath, html);
  console.log(`Saved ${path}`);
};

//
// main
//
(async () => {
  const browser = await chromium.launch({
    product: 'chrome',
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  await browser.browserType().launchPersistentContext('./my-profile');

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setExtraHTTPHeaders({
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ja;q=0.7',
    'cache-control': 'max-age=0',
    'referer': 'https://www.siteone.com/en/articles/',
    'sec-ch-ua': '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  });

  await page.goto('https://www.siteone.com/en/articles/');
  await page.waitForLoadState('networkidle');
  await delay(3000);

  // read urls
  for (const url_file of URL_FILES) {
    const urls = fs.readFileSync(url_file, 'utf8').split('\n').map(i => i.trim()).filter(i => i.length > 0);
    // use the file name to set the output folder: url_howto.txt ==> howto
    const outputFolder = 'main/' + (url_file.split('_')[1] || '').split('.')[0];
    for (const url of urls) {
      await savePage(page, url, outputFolder);
    }
  }

  await browser.close();

  console.log('\n\nDone.\n');
})();
