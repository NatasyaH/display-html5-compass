#HTML5 Rich Media Display Template

A rich media display template using gulp,browserify and sass

##Dependencies

* Node - Globals
    * Browserify
    * Gulp 4
* Ruby
    * sass
    * compass


## Gulp Commands

### gulp build-dev

Dev build without minification and including sourcemaps.

### gulp watch-dev

Generates dev build then watch and reload via Browsersync

### gulp build-prod-optimize

Generates a production build with minification.


## Implementation Notes

### Styles

System uses sass and compass for all styling and spritesheeting. All styles go in /sass/style.scss. spritesheet images should be kept separate and placed in /toSprite. Examples of how to use hte sprite system are in the style.scss. As many images as possible should be consolidated in the spritesheets.

### Images

images for the spritesheets should go in /toSprite. Regular images go in /images.

### Javascript

Any 3rd party libs should be included in /vendor then referenced in the index.html. Place those references within this comment tag <!-- build:js js/vendor.js -->. Scripts placed there will be automatically concatenated in order during production.

All application code goes in /app. All code here will be bundled via Browserify.

The system uses rsvp as a promise polyfill and the control flow is all done with promises. There are 4 main functions in /app/App.js you will need to modify: preload, run, expand and contract.

If you need to do additional preloading before the unit is made visible add those promises to preload. After preload is complete run is called if the unit is an in-page or a user initiated expand. If the unit is a auto expand, expand is called. If the unit is an expanding unit most of of your logic goes in expand and collapse. I have left those entire functions exposed because I don't know where in that promise chain you will need to insert your custom promises.

You can change the unit type in index.html. 

### HTML and Subloading

These system is design to load html partials for the collapsed and expanded states as polite loads. You can construct your DOM for those sections in the stub files in /static/html. These are loaded as needed.