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

// dev build specific tasks
gulp.task('scripts-vendor-dev', require('./tasks/scripts-vendor-dev')(gulp, bs, config.vendor, config.flags));

//Prod specifc tasks
gulp.task('scripts-vendor', require('./tasks/scripts-vendor')(gulp, bs, config.html, config.flags));
gulp.task('optimize-css', require('./tasks/optimize-css')(gulp,config.optimize,config.flags));
gulp.task('optimize-js', require('./tasks/optimize-js')(gulp,config.optimize,config.flags));
gulp.task('optimize-html', require('./tasks/optimize-html')(gulp,config.optimize,config.flags));




// define watch actions
gulp.task('watch', function(done) {
  bs.init({
    server: {
      baseDir: config.server.root
    },
    online:false,
    port: config.server.port,
    reloadDelay:1000,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });

  gulp.watch(config.images.src, gulp.series('images'));
  gulp.watch(config.scripts.app.src, gulp.series('scripts-app'));
  gulp.watch(config.html.src, gulp.series('html'));
  gulp.watch([config.sass.src,config.sass.image_src], gulp.series('sass'));


  if (config.flags.type ==="dev") {

    gulp.watch(config.vendor.src, gulp.series('scripts-vendor-dev'));

  }
  if (config.flags.type ==="prod") {

    gulp.watch([config.html.entry,config.vendor.src ], gulp.series('scripts-vendor'));

  }


  done();
});

gulp.task('build-dev', gulp.series('dev','clean',gulp.parallel('html','scripts-vendor-dev','scripts-app','images','sass' )));
gulp.task('build-prod', gulp.series('prod','clean', gulp.parallel('html','scripts-vendor','scripts-app','images','sass' )));
gulp.task('optimize', gulp.series('prod',gulp.parallel ('optimize-css','optimize-js','optimize-html')));
gulp.task('watch-dev', gulp.series('dev', 'build-dev', 'watch'));
gulp.task('watch-prod', gulp.series('prod', 'build-prod', 'watch'));
gulp.task('default', gulp.series('watch-dev'));
