# hydris

Generic node service to handle SSR for SPA made with any kind of frontend framework.
It uses [puppeteer](https://github.com/GoogleChrome/puppeteer) under the hood and it requires Chrome to be installed on your client.

[![Build Status][circleci-image]][circleci-url]
[![Coverage Status][coverage-image]][coverage-url]

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]


## Usage

### As node service

```js
import { scrape } from 'hydris';

(async function() {
    const html = await scrape('https://dreipol.ch', '.main-footer--contacts>.main-footer--link', {
        launchOptions: {
            // options that will be passed to puppeteer.launch
            defaultViewport: { width: 1024, height: 768 },    
        }
    });
    console.log(html); // +41 43 322 06 44 (node innerHTML included javascript generated markup)
}());
```

### As Proxy Server

You can use hydris as a proxy server to render your javascript contents as string

```js
import { server } from 'hydris';
import { cpus } from 'os';
import cluster from 'cluster';

if (cluster.isMaster) {
    for (let i = 0; i < cpus().length; i++) {
        cluster.fork();
    }
} else {
    // server running on 0.0.0.0:3000
    server.start({
        port: 3000,
        launchOptions: {
            // options that will be passed to puppeteer.launch
            defaultViewport: { width: 1024, height: 768 },    
        }
    });
}

// 0.0.0.0:3000?url=https://dreipol.ch&node=.main-footer--contacts>.main-footer--link
// +41 43 322 06 44

```

### Via CLI

You can use hydris also via cli

```bash
npm i hydris -g
hydris --url https://www.dreipol.ch --node ".main-footer--contacts>.main-footer--link"
+41 43 322 06 44
```

## TODO
  - [x] requests handling via process forking ([see also](#as-proxy-server) and [here](http://www.acuriousanimal.com/2017/08/18/using-cluster-module-with-http-servers.html))
  - [x] persistent browser scraper to improve the performances

[circleci-image]:https://circleci.com/gh/dreipol/hydris/tree/master.svg?style=svg&circle-token=dddff0c380aa369c298e337753e3a4e94877a0ca
[circleci-url]:https://circleci.com/gh/dreipol/hydris/tree/master

[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE

[npm-version-image]:http://img.shields.io/npm/v/hydris.svg?style=flat-square
[npm-downloads-image]:http://img.shields.io/npm/dm/hydris.svg?style=flat-square
[npm-url]:https://npmjs.org/package/hydris

[coverage-image]: https://img.shields.io/coveralls/dreipol/hydris/master.svg?style=flat-square
[coverage-url]: https://coveralls.io/r/dreipol/hydris/?branch=master
