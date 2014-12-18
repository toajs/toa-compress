toa-compress v1.1.1 [![Build Status](https://travis-ci.org/toajs/toa-compress.svg)](https://travis-ci.org/toajs/toa-compress)
====
compress responses middleware for toa.

## [toa](https://github.com/toajs/toa)

## Demo

```js
var Toa = require('toa');
var compress = require('../');

var app = Toa(function (Thunk) {
  this.body = require('../package.json');
});

app.use(compress());

app.listen(3000);
```

**compress stream:**

```js
var fs = require('fs');
var path = require('path');
var Toa = require('toa');
var compress = require('../');

var app = Toa(function (Thunk) {
  this.body = fs.createReadStream(path.resolve(__dirname, '../package.json'));
  this.type = 'json';
});
app.use(compress());

app.listen(3000);
```

## Installation

```bash
npm install toa-compress
```

## API

```js
var compress = require('toa-compress');
```
### app.use(compress([options]))

- `options.minLength`: `Number`, Default `256`, the minimum length that should compress.

```js
app.use(compress({minLength: 1024}));
```

## Licences
(The MIT License)
