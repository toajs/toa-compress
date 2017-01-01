'use strict'
// **Github:** https://github.com/toajs/toa-compress
//
// **License:** MIT

const zlib = require('zlib')
const Stream = require('stream')
const statuses = require('statuses')
const compressible = require('compressible')

const encodingMethods = Object.create(null)
encodingMethods.gzip = zlib.createGzip
encodingMethods.deflate = zlib.createDeflate

module.exports = function toaCompress (options) {
  options = options || {}
  const threshold = options.threshold >= 32 ? Math.floor(options.threshold) : 1024

  return function () {
    // add compress task to "after hooks"
    if (this.after) this.after(compress) // toa >=v2.1
    else this.onPreEnd = compress
  }

  function compress () {
    let body = this.body
    this.vary('accept-encoding')
    if (!body || this.compress === false || this.method === 'HEAD') return
    if (statuses.empty[this.response.status] || this.response.get('content-encoding')) return
    if (!(this.compress === true || compressible(this.type))) return

    let encoding = this.acceptsEncodings('gzip', 'deflate', 'identity')
    if (!encoding) this.throw(406, 'supported encodings: gzip, deflate, identity')
    if (encoding === 'identity') return

    if (!(body instanceof Stream)) {
      if (typeof body === 'string') body = new Buffer(body)
      else if (!Buffer.isBuffer(body)) body = new Buffer(JSON.stringify(body))
      if (body.length < threshold) return
    }

    this.set('content-encoding', encoding)
    this.remove('content-length')

    var stream = this.body = encodingMethods[encoding](options)
    if (body instanceof Stream) body.pipe(stream)
    else stream.end(body)
  }
}
