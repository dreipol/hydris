#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const { scrape } = require('../');

(async () => {
    try {
        const html = await scrape(argv.url, argv.node);
        console.log(html);
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }

    process.exit(0);
})();
