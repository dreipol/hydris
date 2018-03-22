import puppeteer from 'puppeteer';

export async function scrape(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: 'example.png' });

    await browser.close();
};
