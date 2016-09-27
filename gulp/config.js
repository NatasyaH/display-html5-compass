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
  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;