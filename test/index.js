const assert = require('assert');
const hydris = require('../');

/*eslint max-nested-callbacks: ["error", 6]*/

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

    it('Throw if no url will be passed', (done) => {
        hydris.scrape(null, '#root').catch(() => done());
    });
});
