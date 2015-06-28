toa-compress
====
compress responses middleware for toa.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## [toa](https://github.com/toajs/toa)

## Demo

```js
var Toa = require('toa')
var compress = require('../')

var app = Toa(function () {
  this.body = require('../package.json')
});

app.use(compress())

app.listen(3000)
```

**compress stream:**

```js
var fs = require('fs')
var path = require('path')
var Toa = require('toa')
var compress = require('../')

var app = Toa(function () {
  this.body = fs.createReadStream(path.resolve(__dirname, '../package.json'))
  this.type = 'json'
});
app.use(compress())

app.listen(3000)
```

## Installation

```bash
npm install toa-compress
```

## API

```js
var compress = require('toa-compress')
```
### app.use(compress([options]))

- `options.minLength`: `Number`, Default `256`, the minimum length that should compress.

```js
app.use(compress({minLength: 1024}))
```

## Licences
(The MIT License)

[npm-url]: https://npmjs.org/package/toa-compress
[npm-image]: http://img.shields.io/npm/v/toa-compress.svg

[travis-url]: https://travis-ci.org/toajs/toa-compress
[travis-image]: http://img.shields.io/travis/toajs/toa-compress.svg
