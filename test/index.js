'use strict'
// **Github:** https://github.com/toajs/toa-compress
//
// **License:** MIT

const fs = require('fs')
const path = require('path')
const tman = require('tman')
const request = require('supertest')
const Toa = require('toa')
const compress = require('../')

const fixtures = path.join(__dirname, 'fixtures')

function shouldNotCompress (res) {
  if (res.header['content-encoding']) throw new Error('responce compressed!')
}

tman.suite('toa-compress', function () {
  tman.it('should compress json body with gzip', function () {
    let app = new Toa()
    app.use(function () {
      this.body = require(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect('content-encoding', 'gzip')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  tman.it('should compress json body with deflate', function () {
    let app = new Toa()
    app.use(function () {
      this.body = require(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('accept-encoding', 'deflate')
      .expect('content-encoding', 'deflate')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  tman.it('should not compress json body', function () {
    let app = new Toa()
    app.use(function () {
      this.body = require(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('accept-encoding', '')
      .expect(shouldNotCompress)
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  tman.it('should compress stream json body with gzip', function () {
    let app = new Toa()
    app.use(function () {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'))
      this.type = 'json'
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect('content-encoding', 'gzip')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  tman.it('should compress stream json body with deflate', function () {
    let app = new Toa()
    app.use(function () {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'))
      this.type = 'json'
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('accept-encoding', 'deflate')
      .expect('content-encoding', 'deflate')
      .expect(require(path.join(fixtures, 'raw.json')))
  })

  tman.it('should not compress octet stream', function () {
    let app = new Toa()
    app.use(function () {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'))
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect(shouldNotCompress)
  })

  tman.it('should not compress body with small size', function () {
    let app = new Toa()
    app.use(function () {
      this.body = {foo: 'boo'}
    })
    app.use(compress())

    return request(app.listen())
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect(shouldNotCompress)
      .expect({foo: 'boo'})
  })
})
