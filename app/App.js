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
  var richBaseURL = adKit.getRichBase (baseURL);


  //*************************************************************************************************
  // IMPLEMENTATION - YOu will need to edit these
  //*************************************************************************************************
  //*************************************************************************************************
  // TEMPLATE - SHOULD NOT NEED TO MODIFY
  //*************************************************************************************************
  var init = function () {

    console.log (baseURL);
    console.log (richBaseURL);

    //collapsedPartial = adKit.patchURL(collapsedPartial);
    //expandedPartial = adKit.patchURL(expandedPartial);
    //autoExpandedPartial = adKit.patchURL(autoExpandedPartial);
  };
  return init();
};
module.exports = App;