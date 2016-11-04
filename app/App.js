'use strict';
var RSVP = require('rsvp');
var shellAnimationController = require('./controllers/ShellAnimationController');
var collapsedAnimationController = require('./controllers/CollapsedAnimationController');
var expandedAnimationController = require('./controllers/ExpandedAnimationController');
var autoExpandedAnimationController = require('./controllers/AutoExpandedAnimationController');
var util = require('./hook-ad-kit/Util');
RSVP.on('error', function (reason, label) {
  if (label) {
    console.error(label);
  }
  console.assert(false, reason);
});
var App = function (config) {
  var adKit = require('./hook-ad-kit/Adkit')(config.templateType);
  var collapsedPartial = config.collapsedPartial;
  var expandedPartial = config.expandedPartial;
  var autoExpandedPartial = config.autoExpandedPartial;
  var isAutoExpand = config.isAutoExpand;
  var autoExpandTimer = config.autoExpandTimer;
  var expandedContainer = document.querySelector('#expandedContainer');
  var collapsedContainer = document.querySelector('#collapsedContainer');
  var expandedPreloader = document.querySelector('#expandedPreloader');
  var baseURL = util.getBaseURL();
  var richBaseURL = adKit.getRichBase(baseURL);
  //*************************************************************************************************
  // IMPLEMENTATION - YOu will need to edit these
  //*************************************************************************************************
  var preload = function () {
      console.log('preload');
      var promises = [];
      if (isAutoExpand === true) {
        promises.push(adKit.loadContent(autoExpandedPartial, expandedContainer));
      } else {
        promises.push(adKit.loadContent(collapsedPartial, collapsedContainer));
      }
      // if you need to do more preloading do it here and push your promises into the array
      return RSVP.all(promises)
    };


  //*************************************************************************************************
  // TEMPLATE - SHOULD NOT NEED TO MODIFY
  //*************************************************************************************************
  var init = function () {
    console.log(baseURL);
    console.log(richBaseURL);
    collapsedPartial = util.patchURL(collapsedPartial);
    expandedPartial = util.patchURL(expandedPartial);
    autoExpandedPartial = util.patchURL(autoExpandedPartial);
    cssUpdate();
    expandedPreloader.addEventListener('click', function () {
    });
    if (isAutoExpand !== true) {
      expandedContainer.classList.add('hidden');
    }
    return adKit.boot()
      .then(preload)
  };
  var cssUpdate = function () {
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf("css/style.css")) {
        adKit.patchCSS(document.styleSheets[i], richBaseURL);
        break;
      }
    }
  };
  return {
    init: init
  };
};
module.exports = App;