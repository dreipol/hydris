import { createServer } from 'http';
import { parse as parseURL } from 'url';
import { parse as parseQuery } from 'querystring';
import { createScraper } from '../scraper';

export default Object.freeze({
    /**
     * Start a simple nodejs server
     * @param  {object} options - server options mixed with the scraper options
     * @param  {number} options.port - port where your server will start listening the requests
     * @param  {object} options.scraperOptions - options we want to pass to the scraper
     * @return {http.Server} a node server
     */
    async start(options) {
        const { port, ...scraperOptions } = options;
        const scraper = await createScraper(scraperOptions);
        const server = createServer(this.requestHandler.bind(this, scraper));

        // close the browser when the browser will be closed
        server.on('close', function() {
            scraper.close();
        });

        server.listen(port);

        return server;
    },

    /**
     * Handle the server requests parsing the get params
     * @param {object} scraper - persistent scraper object
     * @param {http.IncomingMessage} request - server incoming user request
     * @param {http.ServerResponse} response - server output response
     */
    requestHandler(scraper, request, response) {
        const { query } = parseURL(request.url);
        const params = parseQuery(query);
        this.responseHandler(scraper, response, params);
    },

    /**
     * Handle the server response
     * @param {object} scraper - persistent scraper object
     * @param {http.ServerResponse} response - server output response
     * @param {object} params - request parameters
     */
    async responseHandler(scraper, response, params) {
        response.setHeader('Content-Type', 'text/plain');
        const { url, node, ...userOptions } = params;

        try {
            const html = await scraper.scrape(url, node, userOptions);
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
