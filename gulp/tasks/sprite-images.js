/**
 * Minify PNG, JPEG, GIF and SVG images.
 * @tasks/images
 */
'use strict';
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');

/**
 * @param gulp - function
 * @param bs - Browser sync instance
 * @param options - object
 * options.src : Directory of images to optimize.
 * options.dist : Output directory.
 * @returns {Function}
 */
module.exports = function(gulp, bs, options) {
  return function() {
    // Generate our spritesheet
    var spriteData = gulp.src(options.src).pipe(spritesmith({
      imgName: options.prefix +'-sprite.png',
      cssName: '_sprite-'+options.prefix+'.scss',
      padding:4,
      imgPath :'../images/'+options.prefix +'-sprite.png',

      cssOpts: {functions: false,prefix:options.prefix+'-map'},
      cssSpritesheetName:'spritesheet',
      cssVarMap: function (sprite) {
        sprite.name = sprite.name;
      },
      cssTemplate :'./gulp/scss_maps.template.handlebars'
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
      // DEV: We must buffer our stream into a Buffer for `imagemin`

      .pipe(gulp.dest(options.dist_img));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
      .pipe(gulp.dest(options.dist_css));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream)
      .pipe(bs.stream());
  };
};