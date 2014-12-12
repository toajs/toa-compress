toa-compress v1.0.0 [![Build Status](https://travis-ci.org/toajs/toa-compress.svg)](https://travis-ci.org/toajs/toa-compress)
====
Compress responses for toa.

## [toa](https://github.com/toajs/toa)

## Demo

```js
var Toa = require('toa');
var Compress = require('toa-compress');

var compress = Compress();

Toa(function (Thunk) {
  this.body = require('../package.json');
  return compress(this, Thunk);
}).listen(3000);
```

**using generator:**

```js
var fs = require('fs');
var path = require('path');
var Toa = require('toa');
var Compress = require('toa-compress');

var compress = Compress();

Toa(function* (Thunk) {
  this.body = fs.createReadStream(path.resolve(__dirname, '../package.json'));
  this.type = 'json';
  yield compress(this, Thunk);
}).listen(3000);
```

## Installation

```bash
npm install toa-compress
```

## API

```js
var Compress = require('toa-compress');
```
### compress = Compress([options])

- `options.minLength`: `Number`, Default `256`, the minimum length that should compress.

```js
var compress = Compress({minLength: 1024});
```

### compress(context, Thunk)

Return thunk.

```js
compress(this, Thunk);
```

## Licences
(The MIT License)
