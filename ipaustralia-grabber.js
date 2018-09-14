const puppeteer = require('puppeteer');
const minimist  = require('minimist');
const path = require('path');
const scriptName = path.basename(__filename);
const fs = require('fs');

if (process.argv.length < 3) {
    console.error("Specify the search arguments!");
    console.log("Example usage: \nnode ./" + scriptName + " --word=\"abc\"");
    process.exit(1);
}

let argv = minimist(process.argv.slice(2), {
    alias: {
        w: 'word',
    },
    default: {
        'chrome': '/usr/bin/google-chrome', // @note or use: /usr/bin/chromium-browser
    }
});

(async () => {
    const url = "https://search.ipaustralia.gov.au/trademarks/search/advanced";

    const browser = await puppeteer.launch({
        executablePath: argv.chrome,
        headless: true,
        ignoreHTTPSErrors: false,
        timeout: 60000,
        args: [
            '--no-sandbox',
            '--enable-translate-new-ux',
            '--window-size=1280,768',
        ],
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 768});
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36');

    let pageName = `${argv.word}-search-form`;
    await page.goto(url, {waitUntil: ['networkidle0']}); // ['networkidle0', 'load', 'domcontentloaded']

    await page.waitForSelector('#wordSearchTerms1', {visible: true, timeout: 5000});
    await page.type('#wordSearchTerms1', argv.word);
    await page.waitFor(500);
    await page.$eval('#wordSearchTerms1', el => el.blur());
    await page.waitFor(1000);

    // @note Search Form Page
    await page.waitForSelector('.count-container .number', {visible: true, timeout: 10000});
    await page.screenshot({path: `./content/${pageName}.png`});

    // @note First Result Page
    await page.$eval('#basicSearchForm', form => form.submit());
    await page.waitForSelector('#resultsTable', {timeout: 10000});

    const totalItems = await page.$eval('.goto-last-page', el => parseInt(el.getAttribute('data-gotopage')));
    const totalPages = await page.$eval('.results-count .number', el => parseInt(el.innerText));

    let pageNum = 1;
    let bodyHtml = '';
    let breakLoop = false;
    while (pageNum <= totalPages && !breakLoop) {
        //console.log(`Page "Search Result #${pageNum}"`);
        pageName = `${argv.word}-search-result-${pageNum}`;

        bodyHtml = await page.evaluate(() => document.body.innerHTML);
        savePage(`${pageName}.html`, bodyHtml);
        await page.screenshot({path: `./content/${pageName}.png`});

        const nextLink = await page.$eval('a.js-nav-next-page', el => el).catch(err => {});
        if (!nextLink) {
            console.log('Break crawling');
            breakLoop = true;
            continue;
        }

        pageNum++;

        await page.$eval('.js-nav-next-page' , el => el.click());
        await page.waitFor(3000);
    }

    await page.close();
    await browser.close();
})();

function savePage(name, content) {
    fs.writeFile('./content/' + name + '.html', content, function(err) {
        if (err) {
            console.log(err);
            process.exit(2);
        }
    });
}
