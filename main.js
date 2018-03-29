var os = require('os');
var oldpath = process.cwd();
process.chdir(module.filename.replace('main.js',''));
var addon = require('./lib/addon-'+os.platform()+'-'+os.arch());
process.chdir(oldpath);


module.exports = {
  createKey: function (seed) {
    return addon.genKey(seed);
  },
  sign: function (message, privateKey) {
    var abi = addon.sign(message, privateKey);
    var status = abi.status;
    if (status) {
      return abi.buffer.slice(0, abi.buffer.length)
    } else {
      return null
    }
  },
  verify: function (signature, message, publicKey) {
    return addon.verify(signature, message, publicKey);
  }
};
