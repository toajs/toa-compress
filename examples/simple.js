'use strict';
// **Github:** https://github.com/toajs/toa
//
// **License:** MIT
var Toa = require('toa');
var compress = require('../');

var app = Toa(function (Thunk) {
  this.body = require('../package.json');
});

app.use(compress());

app.listen(3000);
