'use strict';
var dest = './dist';
var config = {
  flags: {
    minify: false,
    sourcemap: true
  },
  clean: {
    src: dest
  },
  styles: {
    src: './styles/**/*',
    entry: './styles/index.styl',
    dist: dest + '/css/'
  },
  static: {
    base: {
      src: './static/base/**/!(*.fla|*.md)',
      dist: dest
    },
    collapsed: {
      src: './static/collapsed/**/!(*.fla|*.md)',
      dist: dest + "/collapsed/"
    },
    user: {
      src: './static/expandedSource/**/!(*.fla|*.md)',
      dist: dest + "/expandedSource/"
    },
    auto: {
      src: './static/expandedSource/**/!(*.fla|*.md)',
      dist: dest + "/expandedSource/"
    }
  },
  images: {
    src: ['./static/images/**/*.{gif,jpg,png,svg}'],
    dist: dest + '/images/'
  },
  tests: {
    lint: {
      src: ['./app/**/*.js', '!app/vendor/**/*.js', './gulp/**/*.js', './tests/**/*.js']
    },
    mocha: {
      src: ['./tests/**/*.js'],
      config: {
        ui: 'tdd',
        reporter: 'spec'
      }
    }
  },
  scripts: {
    app: {
      src: ['./app/**/*.js', '!./app/vendor/**/*.js', './app/templates/**/*.hbs'],
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
  },
  version: {
    css: dest + '/css/*.css',
    cssDist: dest + '/css/',
    html: dest + '/*.html',
    htmlDist: dest + '/',
    js: dest + '/js/*.js',
    jsDist: dest + '/js/',
    jsMap: dest + '/js/*.map',
    jsMapDist: dest + '/js/'
  },
  flatten: {
    entry: dest,
    folders: ['expandedSource', 'expandedSource', 'collapsed']
  },
  bower: './bower_components/',
  template_type: "DC"
};
module.exports = config;