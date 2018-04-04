const assert = require('assert');
const bin = require('../bin');
const hookStdout = require('./hook-stdout');
const hydris = require('../');
const { get } = require('http');

/*eslint max-nested-callbacks: ["error", 6]*/

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
            const html = await hydris.scrape(localpath('fixtures/index.html'), '#root');
            assert.ok(/Hello/.test(html));
        });

        it('Throw if no url will be passed', (done) => {
            hydris.scrape(null, '#root').catch(() => done());
        });
    });

    describe('hydris server', () => {
        it('Can start the server', (done) => {
            const port = 8080;
            hydris.server.start({ port }).then(server => {
                get({
                    hostname: '127.0.0.1',
                    port,
                    path: `?url=${ localpath('fixtures/index.html') }&node=#root`,
                }, async (response) => {
                    assert(response.statusCode, 200);
                    await server.close();
                    done();
                });
            });
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
