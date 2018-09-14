const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

function parseRows(html) {
    const $ = cheerio.load(html);

    let result = [];
    $('#resultsTable tr.result').each(function(i, tr) {
        let item = {};
        item.number = parseInt($(tr).find('td.number').text().trim());
        item.logo_url = $(tr).find('td.trademark.image img').attr('src');
        item.name = $(tr).find('td.trademark.words').text().trim();
        item.classes = $(tr).find('td.classes').text().trim();
        item.status1 = $(tr).find('td.status').text().trim().match(/\n([^\n]+)/u)[1];
        item.status2 = $(tr).find('td.status p').text().trim();
        item.details_page_url = 'https://search.ipaustralia.gov.au' + $(tr).find('td.number a').attr('href');

        result.push(item);
        //process.exit(0);
    });

    return result;
}

let sourceDir = './content/';
const files = fs.readdirSync(sourceDir);

let result = {items: [], total: 0};
for (let i in files) {
    if (path.extname(files[i]) != ".html") {
        continue;
    }

    let html = fs.readFileSync(path.resolve(sourceDir, files[i]),'utf8');
    let rows = parseRows(html);

    result.items = result.items.concat(rows);
}

result.total = result.items.length;

console.log(result);
