'use strict';
var common = require('../common');
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

const linkTarget = path.join(common.fixturesDir,
  '/module-require-symlink/node_modules/dep2/');

const linkDir = path.join(common.fixturesDir,
  '/module-require-symlink/node_modules/dep1/node_modules/dep2');

if (common.isWindows) {
  // On Windows, creating symlinks requires admin privileges.
  // We'll only try to run symlink test if we have enough privileges.
  exec('whoami /priv', function(err, o) {
    if (err || o.indexOf('SeCreateSymbolicLinkPrivilege') == -1) {
      console.log('Skipped: insufficient privileges');
      return;
    } else {
      test();
    }
  });
} else {
  test();
}

function test() {
  process.on('exit', function () {
    fs.unlinkSync(linkDir);
  });

  fs.symlinkSync(linkTarget, linkDir);

  var fooModule = require(common.fixturesDir + '/module-require-symlink/foo.js');

  assert.equal(fooModule.dep1.bar.version, 'CORRECT_VERSION');
  assert.equal(fooModule.dep2.bar.version, 'CORRECT_VERSION');
}
