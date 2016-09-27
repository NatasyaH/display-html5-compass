'use strict';
var dest = './dist';
var config = {
  flags: {
    minify: false,
    sourcemap: true
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
    dist: dest
  },
  sass:{
    src: './**/**',
    dist: dest
  },
  images: {
    src: './static/images/**/*.{gif,jpg,png,svg}',
    dist: dest + '/images/'
  },scripts: {
    app: {
      src: './app/**/*.js',
      entry: './app/index.js'
    },
    vendor: {
      src: './app/vendor/**/*.js'
    },
    tests: {
      src: './tests/**/*.js'
    },
    dist: dest + '/js/'
  },
  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;