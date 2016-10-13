/**
 * bundle dist for DC Studio
 * @tasks/bundle-dc
 */
'use strict';
var zip = require('gulp-vinyl-zip').zip;
var gutil = require('gulp-util');

/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp,  options, flags) {
  return function () {



    return gulp.src(options.src).on('error',gutil.log)

            .pipe(zip(options.name).on('error',gutil.log))

            .pipe(gulp.dest(options.dist).on('error',gutil.log));
  }
};


