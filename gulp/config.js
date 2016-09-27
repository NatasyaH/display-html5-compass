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
    src: './**/**',
    dist: dest
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
  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;