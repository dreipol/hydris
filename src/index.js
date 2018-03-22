import puppeteer from 'puppeteer';
import server from './server/index';

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://google.com');
    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();

export default Object.freeze({
    server,
});
