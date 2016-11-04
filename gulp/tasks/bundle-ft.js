/**
 * bundle dist for DC Studio
 * @tasks/bundle-dc
 */
'use strict';
var zip = require('gulp-vinyl-zip').zip;
var gutil = require('gulp-util');
var fs = require("fs");
var del = require('del');
var path = require('path');

var merge = require('merge-stream');

/**
 * @param gulp - function
 * @param options - object
 * options.src : Directory to copy.
 * options.dist : Destination to copy options.src to.
 * @param flags - object
 * options.sourcemap : determines if sourcemaps are to be generated
 * @returns {Function}
 */
module.exports = function (gulp, options, flags) {
  return function () {

    var arr = path.resolve(options.dist, '../');
    arr = arr.split(path.sep);
    var name = arr[arr.length - 1] + '.zip';
    var richName = arr[arr.length - 1]+'-rich' + '.zip';


    del.sync (path.join (options.dist,'/*.zip'));


    var baseZip =gulp.src(options.base.src).on('error', gutil.log)
      .pipe(zip(name).on('error', gutil.log))
      .pipe(gulp.dest(options.dist).on('error', gutil.log));

    var richZip =gulp.src(options.rich.src).on('error', gutil.log)
          .pipe(zip(richName).on('error', gutil.log))
          .pipe(gulp.dest(options.dist).on('error', gutil.log));


    return merge(baseZip,richZip)



  }
};


/*
    var arr = path.resolve(options.dist, '../');
    arr = arr.split(path.sep);
    var name = arr[arr.length - 1] + '.zip';
    return gulp.src(options.src).on('error', gutil.log)
      .pipe(zip(name).on('error', gutil.log))
      .pipe(gulp.dest(options.dist).on('error', gutil.log));

 */