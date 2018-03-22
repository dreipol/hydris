import puppeteer from 'puppeteer';

export async function scrape(url, selector = 'body') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.$eval(selector, e => e.innerHTML);
    await browser.close();

    return html;
};
