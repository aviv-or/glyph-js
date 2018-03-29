var os = require('os');
var child_process = require('child_process');
var fs = require('fs')
var path = require('path')

var target = 'lib/addon-'+os.platform()+'-'+os.arch()+'.node'

if (fs.existsSync(path.resolve(__dirname, target))) {
  // do nothing
} else {
  fs.copy = function (src, dest, callBach) {
    fs.open(src, 'r', function (err, rfd) {
      fs.open(dest, 'w+', function (err, wfd) {
        var srcStream = fs.createReadStream(null, { fd: rfd });
        var destStream = fs.createWriteStream(null, { fd: wfd });
        srcStream.pipe(destStream);
        srcStream.on('close', function () {
          callBach();
        });
      });
    });
  };

  var run_installer = function () {
    child_process.exec('(node-gyp rebuild) || (exit 0)', function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (stderr.indexOf('gyp ERR!') > -1) {
        console.log('Failed to compile glyph for your platform.');
        process.exit(0);
      } else {
        fs.copy('build/Release/addon.node', target, function () {
          process.exit(0);
        });
      }
    });
  };

  var src_gyp = "binding_linux.gyp";

  switch (os.platform()) {
    case "win32":
      src_gyp = "binding_windows.gyp";
      break;
    case "darwin":
      src_gyp = "binding_darwin.gyp";
      break;
    default:
      src_gyp = "binding_linux.gyp";
      break;
  }

  console.log('Source .gyp file: ' + src_gyp);
  fs.copy(src_gyp, 'binding.gyp', function () {
    run_installer();
  });
}
