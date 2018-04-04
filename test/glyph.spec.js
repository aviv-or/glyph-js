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
  var N = GLYPH.N
  return polyEqual(s1, privateKey, 0, N) && polyEqual(s2, privateKey, N, N)
}

function publicKeyEqual(publicKey) {
  var s1 = data.pk
  var N = GLYPH.N
  return polyEqual(s1, publicKey, 0, N)
}

describe('GLYPH test', function () {

  const message = Buffer.from('testtest', 'utf8')

  it('should generate keypair from seed', function () {
    const seed = Buffer.from(new Uint8Array([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf,
      0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1e, 0x1f]));

    const keypair = new GLYPH(seed)
    assert.equal(privateKeyEqual(keypair.privateKey()), true)

    var sig = keypair.sign(message)
    //
    var ret = keypair.verify(sig, message)
    assert.equal(ret, 1)

    keypair.dispose()
  });

  it('should sign & verify', function () {
    this.timeout(20 * 1000)

    for(var i=1; i < 100; i++){
      var keypair = new GLYPH();

      var sig = keypair.sign(message)
      if(!sig) {
        console.log("signature failure round %d!\n",i);
      }

      // if(!keypair.verify(sig, message)) {
      //   console.log("verification failure round %d!\n",i);
      //   break;
      // }

      if(!GLYPH.verify(sig, message, keypair.publicKey())) {
        console.log("verification failure round %d!\n",i);
        break;
      }

      keypair.dispose()
    }
  });
})
