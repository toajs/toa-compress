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

module.exports = function(options) {
  options = options || {};
  var minLength = options.minLength >= 32 ? Math.floor(options.minLength) : 256;

  return function compress(ctx, Thunk) {
    var body = ctx.body;
    var compressEncoding = bestCompress(ctx.acceptsEncodings());

    return Thunk.call(ctx)(function() {
      if (this.status !== 200 || !body || !compressEncoding) return;
      if (this.response.get['Content-Encoding'] || !compressible(this.type)) return;

      if (typeof body.pipe === 'function') {
        this.set('Content-Encoding', compressEncoding);
        this.remove('Content-Length');
        this.body = body.pipe(compressEncoding === 'gzip' ? zlib.createGzip() : zlib.createDeflate());
        return;
      }

      if (typeof body === 'string') {
        body = new Buffer(body);
      } else if (!Buffer.isBuffer(body)) {
        body = new Buffer(JSON.stringify(body));
      }

      if (body.length < minLength) return;

      return function (done) {
        zlib[compressEncoding](body, done);
      };
    })(function (error, res) {
      if (error) throw error;
      if (res && res.length < body.length) {
        this.set('Content-Encoding', compressEncoding);
        this.body = res;
      }
    });
  };
};
