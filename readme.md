# HTML5 Rich Media Display Template

A rich media display template using gulp,browserify and sass

## Dependencies

* Node - Globals
    * Browserify
    * Gulp 4

## Gulp Commands

### gulp build-dev

Dev build without minification and including sourcemaps.

### gulp watch-dev

Generates dev build then watch and reload via Browsersync

### gulp build-prod

production build without source maps and with additional steps such as js concatenation and image conversions. **NO MINIFICATION** is done in this build

### gulp watch-dev

Generates prod build then watch and reload via Browsersync


### gulp build-prod-optimize

Generates a production build with minification.


## Implementation Notes

### Styles and Spriting

System uses sass and for all styling and LibSass for compilation. All styles go in /sass/style.scss.

spritesheet images should be kept separate and placed in static/toSprite. The system supports 4 spritesheets. 2 for the collapsed and 2 for the expanded. This allows the user to separate the sprites however they wish. The intent is that the foreground spritesheets are used for images that need transparency and the background one is for images that are opaque.

when new images are placed in static/toSprite the spritesheets and their sass partials need to be recompiled before they can be used. The dev server will do this automatically or you can run **gulp sprite-all** to compile them yourself. Each spritesheet is searchable in sass using the custom spriting mixins. You need to provide the variable name of the spritesheet and the original image name in order to find the sprite. The file names will be dasherized and all underscores (_) will be converted to dashes (-). There are custom functions to use sprites as retina or standard resolution. Examples can be found in **style.scss**.

#### Spritesheet optimization

When doing a dev **build** all the spritesheets are generated as .pngs. When a **prod** build both pngs and jpgs are generated. The **foreground** sheets will still use ths pngs while the **background** ones will use jpg. The jpgs are optimized with a compression of 80, the pngs are still there so you can optimize them again yourself if you want.

### Images

images for the spritesheets should go in /toSprite. Regular images go in /images. No image optimization is done at any time. Image optimization must be done by hand.

### Javascript

Any 3rd party libs should be included in /vendor then referenced in the index.html. Place those references within this comment tag <!-- build:js js/vendor.js -->. Scripts placed there will be automatically concatenated in order during production.

All application code goes in /app. All code here will be bundled via Browserify.

The system uses rsvp as a promise polyfill and the control flow is all done with promises. There are 4 main functions in /app/App.js you will need to modify: preload, run, expand and contract.

If you need to do additional preloading before the unit is made visible add those promises to preload. After preload is complete run is called if the unit is an in-page or a user initiated expand. If the unit is a auto expand, expand is called. If the unit is an expanding unit most of of your logic goes in expand and collapse. I have left those entire functions exposed because I don't know where in that promise chain you will need to insert your custom promises.

You can change the unit type in index.html.

### HTML and Subloading

These system is design to load html partials for the collapsed and expanded states as polite loads. You can construct your DOM for those sections in the stub files in /static/html. These are loaded as needed.

### Configuring The Ad

All the ad configuration options are located in index.html.