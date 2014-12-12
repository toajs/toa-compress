'use strict';
// **Github:** https://github.com/toajs/toa-compress
//
// **License:** MIT

/*global describe, it, before, after, beforeEach, afterEach*/

var fs = require('fs');
var path = require('path');
var request = require('supertest');
var Toa = require('toa');
var Compress = require('../');

var fixtures = path.join(__dirname, 'fixtures');

function shouldNotCompress(res) {
  if (res.header['content-encoding']) throw new Error('responce compressed!');
}

describe('toa-compress', function() {
  it('should compress json body with gzip', function(done) {
    var compress = Compress();
    var app = Toa(function(Thunk) {
      this.body = require(path.join(fixtures, 'raw.json'));
      return compress(this, Thunk);
    });

    request(app.listen(3000))
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect('Content-Encoding', 'gzip')
      .expect(require(path.join(fixtures, 'raw.json')), done);
  });

  it('should compress json body with deflate', function(done) {
    var compress = Compress();
    var app = Toa(function(Thunk) {
      this.body = require(path.join(fixtures, 'raw.json'));
      return compress(this, Thunk);
    });

    request(app.listen(3000))
      .get('/')
      .set('Accept-Encoding', 'deflate')
      .expect('Content-Encoding', 'deflate')
      .expect(require(path.join(fixtures, 'raw.json')), done);
  });

  it('should not compress json body', function(done) {
    var compress = Compress();
    var app = Toa(function(Thunk) {
      this.body = require(path.join(fixtures, 'raw.json'));
      return compress(this, Thunk);
    });

    request(app.listen(3000))
      .get('/')
      .set('Accept-Encoding', '')
      .expect(shouldNotCompress)
      .expect(require(path.join(fixtures, 'raw.json')), done);
  });

  it('should compress stream json body with gzip', function(done) {
    var compress = Compress();
    var app = Toa(function(Thunk) {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'));
      this.type = 'json';
      return compress(this, Thunk);
    });

    request(app.listen(3000))
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect('Content-Encoding', 'gzip')
      .expect(require(path.join(fixtures, 'raw.json')), done);
  });

  it('should compress stream json body with deflate', function(done) {
    var compress = Compress();
    var app = Toa(function(Thunk) {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'));
      this.type = 'json';
      return compress(this, Thunk);
    });

    request(app.listen(3000))
      .get('/')
      .set('Accept-Encoding', 'deflate')
      .expect('Content-Encoding', 'deflate')
      .expect(require(path.join(fixtures, 'raw.json')), done);
  });

  it('should not compress octet stream', function(done) {
    var compress = Compress();
    var app = Toa(function(Thunk) {
      this.body = fs.createReadStream(path.join(fixtures, 'raw.json'));
      return compress(this, Thunk);
    });

    request(app.listen(3000))
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect(shouldNotCompress)
      .end(done);
  });

  it('should not compress body with small size', function(done) {
    var compress = Compress();
    var app = Toa(function(Thunk) {
      this.body = {
        foo: 'boo'
      };
      return compress(this, Thunk);
    });

    request(app.listen(3000))
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect(shouldNotCompress)
      .expect({
        foo: 'boo'
      }, done);
  });

});
