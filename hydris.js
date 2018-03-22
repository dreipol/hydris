'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var puppeteer = _interopDefault(require('puppeteer'));

async function scrape(url, selector = 'body') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.$eval(selector, e => e.innerHTML);
    await browser.close();

    return html;
}

var server = Object.seal({

});

var index = Object.freeze({
    server,
    scrape,
});

module.exports = index;
