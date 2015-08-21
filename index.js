'use strict';
var through2 = require('through2'),
    gutil = require('gulp-util'),
    path = require('path');

var which = require('which'),
    childProcess = require('child_process');

var commandRun = function run (command, cb) {
  which(command.cmd, function(err, cmdpath){
    if (err) {
      cb(new Error('Can\'t install! `' + command.cmd + '` doesn\'t seem to be installed.'));
      return;
    }
    var cmd = childProcess.spawn(cmdpath, command.args, {stdio: 'inherit', cwd: command.cwd || process.cwd()});
    cmd.on('close', function (code) {
      if (code !== 0) {
        return cb(new Error(command.cmd + ' exited with non-zero code ' + code));
      }
      cb();
    });
  });
};

module.exports = exports = function xmas(opts) {
  var cmd = {cmd: 'npm', args: [ 'xmas' ] };

  return through2({
      objectMode: true
    },
    function(file, enc, cb) {
      cb();
    },
    function(cb) {
      commandRun(cmd, function(err) {
        if (err) {
          return cb(err);
        }
      });
    }
  );
};
