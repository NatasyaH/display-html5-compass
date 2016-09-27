/**
 * Compiles sass to css
 * @tasks/sass
 */
'use strict';

var exec = require('gulp-exec');

/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @returns {Function}
 */
module.exports = function (gulp, bs, options) {
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

    return gulp.src(options.src)
      .pipe(exec('compass clean',config))
      .pipe(exec.reporter(reportOptions))
      .pipe(exec('compass compile',config))
      .pipe(exec.reporter(reportOptions))
      .pipe(bs.stream());
  };
};