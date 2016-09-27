/**
 * Merges all ( non LIB ) javascript files into one js file using browserify.
 * @tasks/scripts-app
 */
'use strict';
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.entry : Path to the entry js file.
 * options.dist : Destination directory for file output.
 * @param flags - object
 * flags.minify : boolean
 * flags.sourcemap : boolean
 * @returns {Function}
 */
module.exports = function(gulp, bs, options, flags) {
  return function() {
    var bundler = browserify(options.app.entry, {
      debug: flags.sourcemap,
      cache: {}
    });
    var rebundle = function() {
      return bundler.bundle()
        .pipe(source('main.build.js'))
        .pipe(gulp.dest(options.dist))
        .pipe(bs.stream());
    };
    bundler.on('update', rebundle);
    return rebundle();
  };
};