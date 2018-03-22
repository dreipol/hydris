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
        if (!params.url) {
            response.end();
        }

        try {
            const html = await scrape(params.url, params.node);
            response.setHeader('Content-Type', 'text/plain');
            response.end(html);
        } catch (e) {
            console.error(e);
            response.end('');
        }
    },
});
