'use strict'
// **Github:** https://github.com/toajs/toa-compress
//
// **License:** MIT

/*global describe, it*/

var fs = require('fs')
var path = require('path')
var request = require('supertest')
var Toa = require('toa')
var compress = require('../')

var fixtures = path.join(__dirname, 'fixtures')

function shouldNotCompress (res) {
  if (res.header['content-encoding']) throw new Error('responce compressed!')
}

describe('toa-compress', function () {
  it('should compress json body with gzip', function () {
    var app = Toa(function () {
      this.body = require(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect('Content-Encoding', 'gzip')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  it('should compress json body with deflate', function () {
    var app = Toa(function () {
      this.body = require(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'deflate')
      .expect('Content-Encoding', 'deflate')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  it('should not compress json body', function () {
    var app = Toa(function () {
      this.body = require(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('Accept-Encoding', '')
      .expect(shouldNotCompress)
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  it('should compress stream json body with gzip', function () {
    var app = Toa(function () {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'))
      this.type = 'json'
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect('Content-Encoding', 'gzip')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  it('should compress stream json body with deflate', function () {
    var app = Toa(function () {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'))
      this.type = 'json'
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'deflate')
      .expect('Content-Encoding', 'deflate')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  it('should not compress octet stream', function () {
    var app = Toa(function () {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect(shouldNotCompress)
  })

  it('should not compress body with small size', function () {
    var app = Toa(function () {
      this.body = {foo: 'boo'}
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect(shouldNotCompress)
      .expect({
        foo: 'boo'
      })
  })
})
