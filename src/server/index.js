import { createServer } from 'http';
import { parse as parseURL } from 'url';
import { parse as parseQuery } from 'querystring';
import { scrape } from '../scraper';

export default Object.freeze({
    start({ port }) {
        const server = createServer(this.requestHandler.bind(this));
        server.listen(port);
        return server;
    },
    requestHandler(request, response) {
        const { query } = parseURL(request.url);
        const params = parseQuery(query);
        return this.responseHandler(response, params);
    },
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
