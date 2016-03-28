'use strict';
var common = require('../common');
var assert = require('assert');
var path = require('path');
var fs = require('fs');

var module = require('module');

const linkTarget = path.join(common.fixturesDir,
  '/module-require-symlink/node_modules/dep2/');
const linkDir = path.join(common.fixturesDir,
  '/module-require-symlink/node_modules/dep1/node_modules/dep2');

if (common.isWindows) {
  console.log('Skipped: windows non-applicable');
  return;
} else {
  fs.symlinkSync(linkTarget, linkDir);
}

var fooModule = require(common.fixturesDir + '/module-require-symlink/foo.js');

assert.equal(fooModule.dep1.bar.version, 'CORRECT_VERSION');
assert.equal(fooModule.dep2.bar.version, 'CORRECT_VERSION');

process.on('exit', function() {
  fs.unlinkSync(linkDir);
});
