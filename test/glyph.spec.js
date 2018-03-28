var chai = require('chai');
var GLYPH = require('../')
describe('GLYPH test', function () {
  it('should generate keypair from seed', function () {
    const seed = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8, 0x9, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf,
      0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1e, 0x1f]);
    const message = Buffer.from('testtest', 'utf8')
    console.log(7, seed.toString('hex'))
    const keypair = new GLYPH(seed)
    const signature = keypair.sign(message)
    const result = keypair.verify(message, signature)
    console.log(signature, result)
    // console.log(keypair.publicKey().toString('hex'), keypair.privateKey().toString('hex'))
  });
})