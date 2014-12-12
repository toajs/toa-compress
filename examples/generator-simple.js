'use strict';
// **Github:** https://github.com/toajs/toa
//
// **License:** MIT
var fs = require('fs');
var path = require('path');
var Toa = require('toa');
var Compress = require('../');

var compress = Compress();

Toa(function* (Thunk) {
  this.body = fs.createReadStream(path.resolve(__dirname, '../package.json'));
  this.type = 'json';
  yield compress(this, Thunk);
}).listen(3000);
