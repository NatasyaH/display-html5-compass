/**
 * fixes FT manifest
 * @tasks/html
 */
'use strict';
var gulpif = require('gulp-if');
var replace = require('gulp-replace');
var path = require('path');
/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @returns {Function}
 */
module.exports = function (gulp, bs, options, flags) {
  return function () {
    var arr = path.resolve(options.dist, '../');
    arr = arr.split(path.sep);
    var richName = arr[arr.length - 1] + '-rich';
    return gulp.src(options.src)
      .pipe(replace('RICH-NAME', richName))
      .pipe(gulp.dest(options.dist))
      .pipe(bs.stream());
  };
};