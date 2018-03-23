# hydris

Generic node service to handle SSR for SPA made with any kind of frontend framework.
It uses [puppeteer](https://github.com/GoogleChrome/puppeteer) under the hood and it requires Chrome to be installed on your client.

[![Build Status][circleci-image]][circleci-url]

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]


## Usage

### As node service

```js
import { scrape } from 'hydris';

(async function() {
    const html = await hydris.scrape('https://dreipol.ch', '.main-footer--contacts>.main-footer--link');
    console.log(html); // +41 43 322 06 44 (node innerHTML included javascript generated markup)
}());
```

### As Proxy Server

You can use hydris as a proxy server to render your javascrpt contents as string

```js
import { server } from 'hydris';

server.start({ port: 3000 }) // server running on 0.0.0.0:3000
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
  [ ] multithread requests handling for the proxy server
  [ ] persistent browser scraper to improve the performances

[circleci-image]:https://circleci.com/gh/dreipol/hydris/tree/master.svg?style=svg&circle-token=dddff0c380aa369c298e337753e3a4e94877a0ca
[circleci-url]:https://circleci.com/gh/dreipol/hydris/tree/master

[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE

[npm-version-image]:http://img.shields.io/npm/v/hydris.svg?style=flat-square
[npm-downloads-image]:http://img.shields.io/npm/dm/hydris.svg?style=flat-square
[npm-url]:https://npmjs.org/package/hydris
