'use strict';

var puppeteer = require('puppeteer');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

/**
 * Scrape the content of any url getting the rendered html
 * @param  { string } url - url to load
 * @param  { string } selector - DOM selector to filter the resulting html
 * @param  { Object } options - Custom user options
 * @param  { puppeteer.Browser } options.browser - The browser can be injected in order to be persistent across several calls
 * @return { string } html result
 */
async function scrape(url$$1, selector = 'body', options = {}) {
    if (!url$$1) {
        throw new Error('No url parmeter was detected');
    }

    const browser = (options.browser || await puppeteer.launch());
    const page = await browser.newPage();

    await page.goto(url$$1);
    /* istanbul ignore next */
    const html = await page.$eval(selector, e => e.innerHTML);

    await page.close();

    // if the browser will be injected we assume it's persistent and it should be closed in this function
    if (!options.browser) {
        await browser.close();
    }

    return html;
}
/**
 * Create a persistent scraper instance in order to fetch multiple pages with the same browser instance
 * @return {Promise<{browser: *, scrape: scrape, close}>}
 * @return { puppeteer.Browser } browser - a persistent browser instance
 * @return { Browser.close } close - alias to the browser close method
 * @return { Browser.scrape } scrape - a method similar to the scrape function above having using a persistent browser instance
 */
async function createScraper() {
    const browser = await puppeteer.launch();

    return {
        browser,
        async scrape(url$$1, selector) {
            return await scrape(url$$1, selector, { browser });
        },
        close: browser.close.bind(browser),
    };
}

var server = Object.freeze({
    /**
     * Start a simple nodejs server
     * @param  {number} options.port - port where your server will start listening the requests
     * @return {http.Server} a node server
     */
    async start({ port }) {
        const scraper = await createScraper();
        const server = http.createServer(this.requestHandler.bind(this, scraper));

        // close the browser when the browser will be closed
        server.on('close', async function() {
            return await scraper.close();
        });

        server.listen(port);

        return server;
    },

    /**
     * Handle the server requests parsing the get params
     * @param {Object} scraper - persistent scraper object
     * @param {http.IncomingMessage} request - server incoming user request
     * @param {http.ServerResponse} response - server output response
     */
    requestHandler(scraper, request, response) {
        const { query } = url.parse(request.url);
        const params = querystring.parse(query);
        this.responseHandler(scraper, response, params);
    },

    /**
     * Handle the server response
     * @param {Object} scraper - persistent scraper object
     * @param {http.ServerResponse} response - server output response
     * @param {Object} params - request parameters
     */
    async responseHandler(scraper, response, params) {
        response.setHeader('Content-Type', 'text/plain');

        try {
            const html = await scraper.scrape(params.url, params.node);
            response.write(html);
        } catch (e) {
            console.error(e, e.message);
            response.statusCode = 500;
            response.write('It was not possible to render the page :(\n\n\n');
            response.write('Error Message:\n');
            response.write(e.message);
        }

        response.end();
    },
});

var index = Object.freeze({
    server,
    createScraper,
    scrape,
});

module.exports = index;
