const assert = require('assert');
const hydris = require('../');

function localpath(path) {
    return `file://${ __dirname }/${ path }`;
}

describe('hydris', function() {
    it('hydris is alive', () => {
        assert.ok(hydris);
    });

    it('Scraping the content of a html file', async () => {
        const html = await hydris.scrape(localpath('fixtures/index.html'), '#root');
        assert.ok(/Hello/.test(html));
    });
});
