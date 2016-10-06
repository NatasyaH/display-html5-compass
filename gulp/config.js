'use strict';
var dest = './dist';
var config = {
  flags: {
    minify: false,
    sourcemap: true,
    type:'dev'
  },
  clean: {
    src: dest+'/**/*'
  },
  styles: {
    src: './styles/**/*',
    entry: './styles/index.styl',
    dist: dest + '/css/'
  },
  html:{
    src: './static/html/**/!(*.fla|*.md)',
    entry: './static/html/index.html',
    dist: dest
  },
  sass:{
    src: './sass/**/*.scss',
    image_src:'./static/toSprite/**/*.{gif,jpg,png,svg}',
    dist: dest + '/css/'
  },
  images: {
    src: './static/images/**/*.{gif,jpg,png,svg}',
    dist: dest + '/images/'
  },
  scripts: {
    app: {
      src: './app/**/*.js',
      entry: './app/index.js'
    },
    dist: dest + '/js/'
  },
  vendor: {
    src:'./vendor/**/*.js',

    dist: dest +'/vendor'
  },
  optimize: {
    css:{
      src:dest+'/**/*.css'
    },
    js:{
      src:dest+'/**/*.js'
    },
    html:{
      src:dest+'/**/*.html'
    },

    dist: dest

  },


  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;