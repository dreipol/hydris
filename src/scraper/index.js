import puppeteer from 'puppeteer';

/**
 * Scrape the content of any url getting the rendered html
 * @param  {string} url - url to load
 * @param  {string} selector - DOM selector to filter the resulting html
 * @param  {object} options - Custom user options
 * @param  {puppeteer.Browser} options.browser - The browser can be injected in order to be persistent across several calls
 * @param  {boolean} options.outer - if true it will return the outer html of the selector
 * @return {string} html result
 */
export async function scrape(url, selector = 'body', options = {}) {
    if (!url) {
        throw new Error('No url parmeter was detected');
    }

    const browser = (options.browser || await puppeteer.launch(options.launchOptions));
    const page = await browser.newPage();

    // set a custom header to identify the hydris crawler
    await page.setExtraHTTPHeaders({
        'is-hydris': 'true',
    });

    await page.goto(url);
    /* istanbul ignore next */
    const html = await page.$eval(
        selector,
        (e, outer) => e[outer ? 'outerHTML' : 'innerHTML'],
        options.outer
    );

    await page.close();

    // if the browser will be injected we assume it's persistent and it should be closed in this function
    if (!options.browser) {
        await browser.close();
    }

    return html;
};

/**
 * Create a persistent scraper instance in order to fetch multiple pages with the same browser instance
 * @param  {object} options - scraper options
 * @return {Promise<{browser: *, scrape: scrape, close}>}
 * @return {puppeteer.Browser} browser - a persistent browser instance
 * @return {Browser.close} close - alias to the browser close method
 * @return {Browser.scrape} scrape - a method similar to the scrape function above having using a persistent browser instance
 */
export async function createScraper(options) {
    const browser = await puppeteer.launch(options.launchOptions);

    return {
        browser,
        scrape(url, selector, userOptions) {
            return scrape(url, selector, { browser, ...userOptions, ...options });
        },
        close: browser.close.bind(browser),
    };
}
