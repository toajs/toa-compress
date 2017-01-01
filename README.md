toa-compress
====
compress responses middleware for toa.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

## [toa](https://github.com/toajs/toa)

## Demo

```js
const Toa = require('toa')
const compress = require('../')

const app = new Toa()
app.use(compress())
app.use(function () {
  this.body = require('../package.json')
})

app.listen(3000)
```

**compress stream:**

```js
const fs = require('fs')
const path = require('path')
const Toa = require('toa')
const compress = require('../')

const app = new Toa()
app.use(compress())
app.use(function () {
  this.body = fs.createReadStream(path.resolve(__dirname, '../package.json'))
  this.type = 'json'
})

app.listen(3000)
```

## Installation

```bash
npm install toa-compress
```

## API

```js
const compress = require('toa-compress')
```
### app.use(compress([options]))

- `options.threshold`: `Number`, Default `1024`, the threshold length that should compress.

```js
app.use(compress({threshold: 1024}))
```

## Licences
(The MIT License)

[npm-url]: https://npmjs.org/package/toa-compress
[npm-image]: http://img.shields.io/npm/v/toa-compress.svg

[travis-url]: https://travis-ci.org/toajs/toa-compress
[travis-image]: http://img.shields.io/travis/toajs/toa-compress.svg

[downloads-url]: https://npmjs.org/package/toa-compress
[downloads-image]: http://img.shields.io/npm/dm/toa-compress.svg?style=flat-square
