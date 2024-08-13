const fs = require('fs');

function createSitemap(urlsFile, subfolder) {
  let urls = fs.readFileSync(urlsFile, 'utf8').split('\n').map(i => i.trim()).filter(i => i.length > 0);
  urls = [...new Set(urls)];
  urls = urls.map(url => url.replace('https://www.siteone.com/en/articles/', `https://s3.amazonaws.com/static.coveodemo.com/siteone/${subfolder}`));

  urls = urls.map(url => `<url>\n\t<loc>${url}</loc>\n\t<lastmod>2023-09-21</lastmod>\n</url>`);
  fs.writeFileSync(`main/${subfolder}sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`);
}

createSitemap('siteone_articles.txt', '');
