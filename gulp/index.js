'use strict';
// vars
var gulp = require('gulp');
var config = require('./config');
var bs = require('browser-sync').create();

// two more states to minify code and create sourcemaps. The default is for local development.
gulp.task('dev', function(done) {
  config.flags.minify = false;
  config.flags.sourcemap = true;
  done();
});
gulp.task('prod', function(done) {
  config.flags.minify = true;
  config.flags.sourcemap = false;
  done();
});

// define stackable tasks
gulp.task('clean', require('./tasks/clean')(gulp, config.clean));
gulp.task('html', require('./tasks/html')(gulp,bs, config.html));
gulp.task('sass', require('./tasks/sass')(gulp,bs, config.html));
gulp.task('images', require('./tasks/images')(gulp, bs, config.images));
gulp.task('scripts-app', require('./tasks/scripts-app')(gulp, bs, config.scripts, config.flags));
gulp.task('scripts-vendor', require('./tasks/scripts-vendor')(gulp, bs, config.html, config.flags));

/*
gulp.task('build', gulp.series('clean', gulp.parallel(gulp.series('static', 'static-collapsed', 'static-expanded', 'static-expanded-auto'), 'scripts', 'styles', 'images'), 'flatten', 'update-file-references'));
gulp.task('build-dev', gulp.series('dev', 'build'));
gulp.task('build-prod', gulp.series('prod', 'build', 'version'));
gulp.task('watch-dev', gulp.series('dev', 'build', 'watch'));
gulp.task('watch-prod', gulp.series('prod', 'build', 'watch'));
gulp.task('default', gulp.series('watch-dev'));

*/