/**
 * Compiles sass to css
 * @tasks/sass
 */
'use strict';
var child_exec = require('child_process').exec;
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags,clean) {
  return function () {
    var config = {
      continueOnError: false, // default = false, true means don't emit error event
      pipeStdout: false // default = false, true means stdout is written to file.contents
    };
    var reportOptions = {
      err: true, // default = true, false means don't write err
      stderr: true, // default = true, false means don't write stderr
      stdout: true // default = true, false means don't write stdout
    };
    return new Promise(function (resolve, reject) {
      var vars = "";
      if (flags.sourcemap === true) {
        vars = ' --sourcemap --debug-info'
      } else {
        vars = ' --no-sourcemap --no-debug-info'
      }
      vars += '';
      var callbackOne = function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        child_exec('compass compile --trace' + vars, config, callbackTwo);
      };
      var callbackTwo = function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        bs.reload()
        resolve()
      };

      
      if (clean=== true) {
        child_exec('compass clean', callbackOne);
      }else {
        child_exec('compass compile --trace' + vars, config, callbackTwo);
      }
    })
  };
};


