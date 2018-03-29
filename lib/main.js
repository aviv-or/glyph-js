"use strict";

var GLYPHModule = require('./glyph');
var gModule = GLYPHModule({});

var glyph_private_keysize = gModule.cwrap(
    'glyph_private_keysize', 'number', ['void']
);

var glyph_public_keysize = gModule.cwrap(
    'glyph_public_keysize', 'number', ['void']
);

var glyph_signature_size = gModule.cwrap(
    'glyph_signature_size', 'number', ['void']
);

var glyph_gen_keypair = gModule.cwrap(
    'glyph_gen_keypair', 'void', ['number', 'number', 'number']
);

var glyph_sign = gModule.cwrap(
    'glyph_sign', 'number', ['number', 'number', 'number', 'number']
);

var glyph_verify = gModule.cwrap(
    'glyph_verify', 'number', ['number', 'number', 'number', 'number']
);


/**
 *
 * @param seed {Buffer}
 * @constructor
 */
function GLYPH(seed) {
  this.sksize = glyph_private_keysize()
  this.pksize = glyph_public_keysize()
  this.sigsize = glyph_signature_size()
  this.pk = gModule._malloc(this.pksize)
  this.sk = gModule._malloc(this.sksize)
  var s = gModule._malloc(seed.length)
  gModule.writeArrayToMemory(seed, s)
  glyph_gen_keypair(this.sk, this.pk, s)
  gModule._free(s)
}

GLYPH.N = 1024
GLYPH.OMEGA = 16
GLYPH.Q = 59393

GLYPH.prototype.publicKey = function() {
  return new Int32Array(gModule.HEAP32.buffer, this.pk, GLYPH.N)
}

GLYPH.prototype.privateKey = function() {
  return new Uint8Array(gModule.HEAPU8.buffer, this.sk, this.sksize)
}

/**
 *
 * @param message {Buffer}
 * @return {Buffer}
 */
GLYPH.prototype.sign = function(message) {
  var sig = gModule._malloc(this.sigsize)
  var msg = gModule._malloc(message.length)
  gModule.writeArrayToMemory(message, msg)
  if (glyph_sign(sig, msg, message.length, this.sk)) {
    // const buffer = Buffer.from(new Uint8Array(gModule.HEAPU8.buffer, sig, this.sigsize))
    gModule._free(msg)
    return sig
  } else {
    gModule._free(msg)
    return null
  }
}

/**
 *
 * @param message {Buffer}
 * @param signature {Buffer}
 * @return {Boolean}
 */
GLYPH.prototype.verify = function(message, signature) {
  console.log(75, this.pk, message, signature)

  var msg = gModule._malloc(message.length)
  gModule.writeArrayToMemory(message, msg)
  var ret = glyph_verify(msg, message.length, signature, this.pk)
  gModule._free(msg)
  return ret
}

GLYPH.prototype.dispose = function() {
  if (this.sk) {
    gModule._free(this.sk)
    this.sk = null
  }
  if (this.pk) {
    gModule._free(this.pk)
    this.pk = null
  }
}

module.exports = GLYPH
