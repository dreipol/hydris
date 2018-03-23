'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var puppeteer = _interopDefault(require('puppeteer'));
var http = require('http');
var url = require('url');
var querystring = require('querystring');

/**
 * Scrape the content of any url getting the rendered html
 * @param  { string } url - url to load
 * @param  { string } selector - DOM selector to filter the resulting html
 * @return { string } html result
 */
async function scrape(url$$1, selector = 'body') {
    if (!url$$1) {
        throw new Error('No url parmeter was detected');
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url$$1);

    const html = await page.$eval(selector, e => e.innerHTML);

    await browser.close();

    return html;
}

var server = Object.freeze({
    /**
     * Start a simple nodejs server
     * @param  {number} options.port - port where your server will start listening the requests
     * @return {http.Server} a node server
     */
    start({ port }) {
        const server = http.createServer(this.requestHandler.bind(this));
        server.listen(port);
        return server;
    },

    /**
     * Handle the server requests parsing the get params
     * @param {http.IncomingMessage} request - server incoming user request
     * @param {http.ServerResponse} response - server output response
     */
    requestHandler(request, response) {
        const { query } = url.parse(request.url);
        const params = querystring.parse(query);
        this.responseHandler(response, params);
    },

    /**
     * Handle the server response
     * @param {http.ServerResponse} response - server output response
     * @param {Object} params - request parameters
     */
    async responseHandler(response, params) {
        response.setHeader('Content-Type', 'text/plain');

        try {
            const html = await scrape(params.url, params.node);
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
    scrape,
});

module.exports = index;
