var assert = require('assert')
var chai = require('chai')
var GLYPH = require('../')
var data = require('./data')

function polyEqual(target, source, start, count) {
  var Q = GLYPH.Q
  for (var i = 0; i < count; ++i) {
    var n = source[start + i]
    var looper = target[i]
    if (n * 2 < Q) {
      if (n !== looper) {
        return false
      }
    } else {
      if (n - Q !== looper) {
        return false
      }
    }
  }
  return true
}

function privateKeyEqual(privateKey) {
  var s1 = data.sk.s1
  var s2 = data.sk.s2
  var Q = GLYPH.Q
  var N = GLYPH.N
  return polyEqual(s1, privateKey, 0, N) && polyEqual(s2, privateKey, N, N)
}

describe('GLYPH test', function () {
  it('should generate keypair from seed', function () {
    const seed = Buffer.from(new Uint8Array([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf,
      0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1e, 0x1f]));
    const message = Buffer.from('testtest', 'utf8')

    const keypair = new GLYPH(seed)
    const signature = keypair.sign(message)
    const result = keypair.verify(message, signature)

    assert.equal(privateKeyEqual(keypair.privateKey()), true)
    console.log(keypair.pksize, keypair.sksize, keypair.sigsize, keypair.publicKey())
    console.log(signature, result)
    assert.equal(polyEqual(keypair.publicKey(), data.pk, 0, GLYPH.N), true)

    keypair.dispose()
    // console.log(keypair.publicKey().toString('hex'), keypair.privateKey().toString('hex'))
  });
})
