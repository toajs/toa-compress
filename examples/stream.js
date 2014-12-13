'use strict';
// **Github:** https://github.com/toajs/toa
//
// **License:** MIT
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
