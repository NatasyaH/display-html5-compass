'use strict';
// vars
var gulp = require('gulp');
var config = require('./config');

/*
gulp.task('build', gulp.series('clean', gulp.parallel(gulp.series('static', 'static-collapsed', 'static-expanded', 'static-expanded-auto'), 'scripts', 'styles', 'images'), 'flatten', 'update-file-references'));
gulp.task('build-dev', gulp.series('dev', 'build'));
gulp.task('build-prod', gulp.series('prod', 'build', 'version'));
gulp.task('watch-dev', gulp.series('dev', 'build', 'watch'));
gulp.task('watch-prod', gulp.series('prod', 'build', 'watch'));
gulp.task('default', gulp.series('watch-dev'));

*/