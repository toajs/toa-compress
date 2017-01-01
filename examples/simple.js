'use strict'
// **Github:** https://github.com/toajs/toa
//
// **License:** MIT
const Toa = require('toa')
const compress = require('../')

const app = new Toa()
app.use(compress())
app.use(function () {
  this.body = require('../package.json')
})

app.listen(3000)
