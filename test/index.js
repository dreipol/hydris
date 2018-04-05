const assert = require('assert');
const bin = require('../bin');
const hookStdout = require('./hook-stdout');
const hydris = require('../');
const request = require('request');

/*eslint max-nested-callbacks: ['error', 6]*/

function localpath(path) {
    return `file://${ __dirname }/${ path }`;
}


describe('hydris', function() {
    this.timeout(100000);

    it('hydris is alive', () => {
        assert.ok(hydris);
    });

    describe('hydris scraping core', () => {
        it('Scraping the content of a html file', async () => {
            const html = await hydris.scrape(localpath('fixtures/index.html'));
            assert.ok(/Hello/.test(html));
        });

        it('Scraping the content of a html file with a selector', async () => {
            const html = await hydris.scrape(localpath('fixtures/index.html'), '#root');
            assert.ok(/Hello/.test(html));
        });

        it('Throw if no url will be passed', (done) => {
            hydris.scrape(null, '#root').catch(() => done());
        });
    });

    describe('hydris server', async () => {
        const port = 3000;
        const baseurl = `http://0.0.0.0:${ port }`;
        let server;

        before('It can start the server', async () => {
            server = await hydris.server.start({ port });
        });


        it('Can get the content of a DOM node', (done) => {
            request(`${ baseurl }?url=${ localpath('fixtures/index.html') }&node=%23root`, async (err, response, body) => {
                assert(response.statusCode, 200);
                assert.ok(/Hello/.test(body));
                done();
            });
        });

        it('It returns 500 in case of missing params', (done) => {
            request(`${ baseurl }?url=doo&node=%23root`, async (err, response) => {
                assert(response.statusCode, 500);
                done();
            });
        });

        after(async () => {
            await server.close();
        });
    });

    describe('hydris bin', () => {
        it('It can scrape an url', (done) => {
            const unhook = hookStdout(function(string) {
                assert.ok(/Hello/.test(string));
                unhook();
                done();
            });

            bin.run(['--url', localpath('fixtures/index.html'), '--node', '#root']);
        });

        it('It can scrape an url using arguments shortcuts', (done) => {
            const unhook = hookStdout(function(string) {
                assert.ok(/Hello/.test(string));
                unhook();
                done();
            });

            bin.run(['--u', localpath('fixtures/index.html'), '--n', '#root']);
        });

        it('It fails in case of wrong urls', async () => {
            const ret = await bin.run(['--url', '', '--node', '#root']);

            assert.equal(ret, 1);
        });

        it('It can generate the help message', (done) => {
            const unhook = hookStdout(function(string) {
                assert.ok(/Options:/.test(string));
                unhook();
                done();
            });

            bin.run([]);
        });
    });
});
