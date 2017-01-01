'use strict'
// **Github:** https://github.com/toajs/toa
//
// **License:** MIT
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
