"use strict";

var GLYPHModule = require('./lib/glyph');
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


function prepareHeapForBuffer(nbytes, buffer) {
  var ptr = gModule._malloc(nbytes)
  var dataHeap = new Uint8Array(gModule.HEAPU8.buffer, ptr, nbytes)
  if (buffer) {
    dataHeap.set(new Uint8Array(buffer))
  }
  return dataHeap
}

/**
 *
 * @param seed {Buffer | null}
 * @constructor
 */
function GLYPH(seed) {
  this.sksize = glyph_private_keysize()
  this.pksize = glyph_public_keysize()
  this.sigsize = glyph_signature_size()

  this.pk = gModule._malloc(this.pksize)
  this.sk = gModule._malloc(this.sksize)
  var s = null
  if (seed) {
    s = prepareHeapForBuffer(seed.byteLength, seed)
  }
  glyph_gen_keypair(this.sk, this.pk, s && s.byteOffset)
  if (s) {
    gModule._free(s.byteOffset)
  }
}

GLYPH.N = 1024
GLYPH.OMEGA = 16
GLYPH.Q = 59393

/**
 *
 * @return {Buffer}
 */
GLYPH.prototype.publicKey = function () {
  return Buffer.from(new Uint8Array(gModule.HEAPU8.buffer, this.pk, this.pksize))
}

/**
 *
 * @return {Buffer}
 */
GLYPH.prototype.privateKey = function () {
  return Buffer.from(new Uint8Array(gModule.HEAPU8.buffer, this.sk, this.sksize))
}

/**
 *
 * @param message {Buffer}
 * @param sk {Number}
 * @return {Buffer}
 */
function sign(message, sk) {
  var sigsize = glyph_signature_size()
  var sig = gModule._malloc(sigsize)
  var msg = prepareHeapForBuffer(message.byteLength, message)
  let buffer = null
  if (glyph_sign(sig, msg.byteOffset, message.byteLength, sk)) {
    buffer = Buffer.from(new Uint8Array(gModule.HEAPU8.buffer, sig, sigsize))
  }
  gModule._free(msg.byteOffset)
  gModule._free(sig)
  return buffer
}

/**
 *
 * @param message {Buffer}
 * @return {Buffer}
 */
GLYPH.prototype.sign = function (message) {
  return sign(message, this.sk)
}

/**
 *
 * @param message {Buffer}
 * @param privateKey {Buffer}
 * @return {Buffer}
 */
GLYPH.sign = function (message, privateKey) {
  var sk = prepareHeapForBuffer(privateKey.length, privateKey)
  var ret = sign(message, sk.byteOffset)
  gModule._free(sk.byteOffset)
  return ret
}

/**
 *
 * @param message {Buffer}
 * @param signature {Buffer}
 * @param pk {Number}
 * @return {Boolean}
 */
function verify(message, signature, pk) {
  var msg = prepareHeapForBuffer(message.byteLength, message)
  var sig = prepareHeapForBuffer(signature.byteLength, signature)
  var ret = glyph_verify(msg.byteOffset, message.byteLength, sig.byteOffset, pk)
  gModule._free(msg.byteOffset)
  gModule._free(sig.byteOffset)
  return ret
}

/**
 *
 * @param message {Buffer}
 * @param signature {Buffer}
 * @return {Boolean}
 */
GLYPH.prototype.verify = function (signature, message) {
  return verify(message, signature, this.pk)
}

GLYPH.verify = function (signature, message, pk) {
  var publicKey = prepareHeapForBuffer(pk.length, pk)
  var ret = verify(message, signature, publicKey.byteOffset)
  gModule._free(publicKey.byteOffset)
  return ret
}

GLYPH.prototype.dispose = function () {
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
