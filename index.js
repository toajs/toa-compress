'use strict';
// **Github:** https://github.com/toajs/toa-compress
//
// **License:** MIT

var zlib = require('zlib');
var compressible = require('compressible');

var enableEncodings = Object.create(null);
enableEncodings.gzip = true;
enableEncodings.deflate = true;

function bestCompress(encodings) {
  if (!Array.isArray(encodings)) encodings = [encodings];
  for (var i = 0; i < encodings.length; i++) {
    if (enableEncodings[encodings[i]]) return encodings[i];
  }
}

module.exports = function compress(options) {
  options = options || {};
  var minLength = options.minLength >= 32 ? Math.floor(options.minLength) : 256;

  return function (callback) {
    // add compress task to "pre end stage"
    this.onPreEnd = function (done) {
      var ctx = this;
      var body = this.body;
      var compressEncoding = bestCompress(this.acceptsEncodings());

      if (this.status !== 200 || !body || !compressEncoding || this.etag) return done();
      if (this.response.get['Content-Encoding'] || !compressible(this.type)) return done();

      if (typeof body.pipe === 'function') {
        this.set('Content-Encoding', compressEncoding);
        this.remove('Content-Length');
        this.body = body.pipe(compressEncoding === 'gzip' ? zlib.createGzip() : zlib.createDeflate());
        return done();
      }

      if (typeof body === 'string') {
        body = new Buffer(body);
      } else if (!Buffer.isBuffer(body)) {
        body = new Buffer(JSON.stringify(body));
      }

      if (body.length < minLength) return done();

      zlib[compressEncoding](body, function (err, res) {
        if (err) return done(err);
        if (res && res.length < body.length) {
          ctx.set('Content-Encoding', compressEncoding);
          ctx.body = res;
        }
        done();
      });
    };

    callback();
  };
};
