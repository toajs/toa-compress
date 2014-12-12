'use strict';
// **Github:** https://github.com/toajs/toa
//
// **License:** MIT
var Toa = require('toa');
var Compress = require('../');

var compress = Compress();

Toa(function (Thunk) {
  this.body = require('../package.json');
  return compress(this, Thunk);
}).listen(3000);
