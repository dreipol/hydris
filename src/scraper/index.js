import puppeteer from 'puppeteer';

/**
 * Scrape the content of any url getting the rendered html
 * @param  { string } url - url to load
 * @param  { string } selector - DOM selector to filter the resulting html
 * @return { string } html result
 */
export async function scrape(url, selector = 'body') {
    if (!url) {
        throw new Error('No url parmeter was detected');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const html = await page.$eval(selector, e => e.innerHTML);

    await browser.close();

    return html;
};
