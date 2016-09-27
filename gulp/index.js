'use strict';
// vars
var gulp = require('gulp');
var config = require('./config');
var bs = require('browser-sync').create();

// two more states to minify code and create sourcemaps. The default is for local development.
gulp.task('dev', function(done) {
  config.flags.minify = false;
  config.flags.sourcemap = true;
  config.flags.type = 'dev';
  done();
});
gulp.task('prod', function(done) {
  config.flags.minify = true;
  config.flags.sourcemap = false;
  config.flags.type = 'prod';
  done();
});

// define stackable tasks
gulp.task('clean', require('./tasks/clean')(gulp, config.clean));
gulp.task('html', require('./tasks/html')(gulp,bs, config.html, config.flags));
gulp.task('sass', require('./tasks/sass')(gulp,bs, config.html));
gulp.task('images', require('./tasks/images')(gulp, bs, config.images));
gulp.task('scripts-app', require('./tasks/scripts-app')(gulp, bs, config.scripts, config.flags));
gulp.task('scripts-vendor', require('./tasks/scripts-vendor')(gulp, bs, config.html, config.flags));

// dev build specific tasks

gulp.task('scripts-vendor-dev', require('./tasks/scripts-vendor-dev')(gulp, bs, config.vendor, config.flags));






gulp.task('build-dev', gulp.series('dev','clean',gulp.parallel('html','scripts-vendor-dev','scripts-app','images','sass' )));
gulp.task('build-prod', gulp.series('prod','clean', gulp.parallel('html','scripts-vendor','scripts-app','images','sass' )));

/*



gulp.task('watch-dev', gulp.series('dev', 'build', 'watch'));
gulp.task('watch-prod', gulp.series('prod', 'build', 'watch'));
gulp.task('default', gulp.series('watch-dev'));

*/