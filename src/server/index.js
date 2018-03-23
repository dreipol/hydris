import { createServer } from 'http';
import { parse as parseURL } from 'url';
import { parse as parseQuery } from 'querystring';
import { scrape } from '../scraper';

export default Object.freeze({
    /**
     * Start a simple nodejs server
     * @param  {number} options.port - port where your server will start listening the requests
     * @return {http.Server} a node server
     */
    start({ port }) {
        const server = createServer(this.requestHandler.bind(this));
        server.listen(port);
        return server;
    },

    /**
     * Handle the server requests parsing the get params
     * @param {http.IncomingMessage} request - server incoming user request
     * @param {http.ServerResponse} response - server output response
     */
    requestHandler(request, response) {
        const { query } = parseURL(request.url);
        const params = parseQuery(query);
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
