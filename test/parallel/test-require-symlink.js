'use strict';
var common = require('../common');
var assert = require('assert');
var path = require('path');
var fs = require('fs');

var module = require('module');

const linkTarget1 = path.join(common.fixturesDir,
  '/module-require-symlink/directory1/node_modules/dep2/');
const linkDir1 = path.join(common.fixturesDir,
  '/module-require-symlink/directory1/node_modules/dep1/node_modules/dep2');
const linkTarget2 = path.join(common.fixturesDir,
  '/module-require-symlink/directory1/node_modules/dep1/node_modules/bar/');
const linkDir2 = path.join(common.fixturesDir,
  '/module-require-symlink/directory2/node_modules/bar');


process.on('exit', function() {
  fs.unlinkSync(linkDir1);
  fs.unlinkSync(linkDir2);
});

if (common.isWindows) {
  console.log('Skipped: windows non-applicable');
  return;
} else {
  fs.symlinkSync(linkTarget1, linkDir1);
  fs.symlinkSync(linkTarget2, linkDir2);
}

var fooModule = require(common.fixturesDir +
  '/module-require-symlink/directory1/foo.js');
var bazModule = require(common.fixturesDir +
  '/module-require-symlink/directory2/baz.js');
assert.equal(fooModule.dep1.bar.version, 'CORRECT_VERSION');
assert.equal(fooModule.dep2.bar.version, 'CORRECT_VERSION');
assert.equal(bazModule.bar.version, 'CORRECT_VERSION');
// Assert same module was not loaded twice
assert.equal(fooModule.dep1.bar.timestamp, fooModule.dep2.bar.timestamp);
assert.equal(fooModule.dep1.bar.timestamp, bazModule.bar.timestamp);
