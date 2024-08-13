# Crawling Menards


The Menards site is protected by Incapsula, so it's hard to crawl with a Web Source or Sitemap connector. 
We get blocked when Incapsula detects that we are a bot.

To get around this, we "download" the site locally, then copy into a public S3 bucket, then crawl from there.
We will use a Sitemap source.


## Downloading the site

We use [Playwright.dev](https://playwright.dev/) to download the site. We use a list of urls (file: `urls.txt`) to target the pages we want to download.

It will open a real browser and navigate to each page, then save the HTML to a file.

Use this command: 
```sh
node download_menards.js
```


## Sitemaps
Use this command: 
```sh
node create_sitemap.js
```

These are the sitemaps we created already:
```txt
https://s3.amazonaws.com/static.coveodemo.com/menards/sitemap.xml
https://s3.amazonaws.com/static.coveodemo.com/menards/howto/sitemap.xml
https://s3.amazonaws.com/static.coveodemo.com/menards/garden/sitemap.xml
```


## Sync to S3 bucket

Use this command: 
```sh
aws s3 sync main s3://static.coveodemo.com/menards/
```

