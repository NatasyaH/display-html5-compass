'use strict';
var dest = './dist';
var path = require('path');
var config = {
  flags: {
    minify: false,
    sourcemap: true,
    type: 'dev'
  },
  clean: {
    src: dest + '/**/*'
  },
  styles: {
    src: './styles/**/*',
    entry: './styles/index.styl',
    dist: dest + '/css/'
  },
  html: {
    src: './static/html/**/!(*.fla|*.md|*.js)',
    entry: './static/html/index.html',
    dist: dest
  },
  ft_manifest: {
      src: './static/html/**/*manifest.js',
      entry: './static/html/index.html',
      dist: dest
    },

  sass: {
    src: './sass/**/*.scss',
    watch_src: ['./sass/**/*.scss', '!./sass/spritesheets/**/*.scss'],
    image_src: './static/toSprite/**/*.{gif,jpg,png,svg}',
    dist: dest + '/css/'
  },
  images: {
    src: './static/images/**/*.{gif,jpg,png,svg}',
    dist: dest + '/images/'
  },
  videos: {
    src: './static/videos/**/*.{ogg,mp4,webm}',
    dist: dest + '/videos/'
  },
  sprite: {
    collapsed_foreground: {
      src: './static/toSprite/collapsed/foreground/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'collapsed-foreground',
      jpg_conversion: false,
      quality: 80
    },
    collapsed_background: {
      src: './static/toSprite/collapsed/background/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'collapsed-background',
      jpg_conversion: true,
      quality: 80
    },
    expanded_foreground: {
      src: './static/toSprite/expanded/foreground/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'expanded-foreground',
      jpg_conversion: false,
      quality: 80
    },
    expanded_background: {
      src: './static/toSprite/expanded/background/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'expanded-background',
      jpg_conversion: true,
      quality: 80
    },
    auto_expanded_foreground: {
      src: './static/toSprite/auto_expanded/foreground/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'auto-expanded-foreground',
      jpg_conversion: false,
      quality: 80
    },
    auto_expanded_background: {
      src: './static/toSprite/auto_expanded/background/**/*.png',
      img_root: '/images/',
      dist_img: dest + '/images/',
      dist_img_source: dest + '/images/_assets',
      dist_css: './sass/spritesheets',
      prefix: 'auto-expanded-background',
      jpg_conversion: true,
      quality: 80
    }
  },
  scripts: {
    app: {
      src: './app/**/*.js',
      entry: './app/index.js'
    },
    dist: dest + '/js/'
  },
  vendor: {
    src: './vendor/**/*.js',
    dist: dest + '/vendor'
  },
  optimize: {
    css: {
      src: dest + '/**/*.css'
    },
    js: {
      src: [dest + '/**/*.js', '!' + dest + '/**/*manifest.js']
    },
    html: {
      src: dest + '/**/*.html'
    },
    sprite_image:{
      src: [
        path.join(dest, '/**/*-sprite.png'),
        path.join(dest,  '/**/*-sprite.jpg')
      ]
      
    },
    
    
    dist: dest
  },
  rename_backup: {
    src: path.join(dest, '/*.jpg'),
    dist: path.join(dest)
  },
  
  
  bundle: {
    dc: {
      src: [dest + '/**/*.*', '!' + dest + '/**/manifest.js', '!' + dest + '/**/__*.png', '!' + dest + '/**/.*'],
      dist: dest,
      name: 'banner.zip'
    },
    ft: {
      base: {
        src: [
          dest + '/**/*.js',
          dest + '/**/*.css',
          '!' + dest + '/**/.*',
          dest + '/index.html'
        ]
      },
      rich: {
        src: [
          dest + '/**/*.{gif,jpg,png,svg}',
          '!' + dest + '/**/.*',
          '!' + dest + '/**/__*.png',
          '!' + dest + '/*.{gif,jpg,png,svg}',
          dest + '/*.html'
        ]
      },
      dist: dest
    }
  },
  server: {
    root: dest,
    port: 8080
  }
};
module.exports = config;