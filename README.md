# hydris

[![Build Status][circleci-image]][circleci-url]

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]


## Usage

```js
import hydris from 'hydris';

(async function() {
    const html = await hydris.scrape('https://dreipol.ch', '#root');
    console.log(html); // node innerHTML (included javascript generated markup)
}());
```

[circleci-image]:https://circleci.com/gh/dreipol/hydris/tree/master.svg?style=svg&circle-token=dddff0c380aa369c298e337753e3a4e94877a0ca
[circleci-url]:https://circleci.com/gh/dreipol/hydris/tree/master

[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE

[npm-version-image]:http://img.shields.io/npm/v/hydris.svg?style=flat-square
[npm-downloads-image]:http://img.shields.io/npm/dm/hydris.svg?style=flat-square
[npm-url]:https://npmjs.org/package/hydris

## API

