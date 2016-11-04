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
  var exits = config.exits;
  var expandedContainer = document.querySelector('#expandedContainer');
  var collapsedContainer = document.querySelector('#collapsedContainer');
  var expandedPreloader = document.querySelector('#expandedPreloader');
  var baseURL = util.getBaseURL();
  var richBaseURL = null;
  //*************************************************************************************************
  // IMPLEMENTATION - YOu will need to edit these
  //*************************************************************************************************
  var preload = function () {
    console.log('preload');
    var promises = [];
    if (isAutoExpand === true) {
      promises.push(adKit.loadContent(autoExpandedPartial, expandedContainer, richBaseURL));
    } else {
      promises.push(adKit.loadContent(collapsedPartial, collapsedContainer, richBaseURL));
    }
    // if you need to do more preloading do it here and push your promises into the array
    return RSVP.all(promises)
  };
  var run = function () {
    console.log('run');
    if (isAutoExpand === true) {
      return autoExpand();
    } else {
      return collapsedAnimationController.animateIn()
        .then(bindCollapsed)
    }
  };
  //*************************************************************************************************
  // EXPANDING TEMPLATE -  YOu will need to edit these - They can be deleted if your unit is in page.
  //*************************************************************************************************
  // for the auto expand
  var autoExpand = function () {
    return adKit.requestExpand()
      .then(function () {
        return RSVP.all([
          shellAnimationController.expand(),
          shellAnimationController.preloaderAnimateIn()
        ])
      })
      .then(function () {
        return adKit.loadContent(autoExpandedPartial, expandedContainer, richBaseURL)
      }) // reload content on each expand
      .then(shellAnimationController.preloaderAnimateOut)
      .then(autoExpandedAnimationController.animateIn)
      .then(bindExpanded)
      .then(function () {
        return util.removeChildren(collapsedContainer)
      })
      .then(function () {
        startTimer()
          .then(collapse)
          .catch(function (value) {
            console.log(value)
          })
      })// we don't return the promise here cuz we don't want the result holding execution
      .then(adKit.completeExpand)
      .catch(function (value) {
        console.log(value);
        console.log('failure on expand')
      })
  };
  // for the user expand
  var expand = function () {
    return adKit.requestExpand()
      .then(function () {
        return RSVP.all([
          shellAnimationController.expand(),
          shellAnimationController.preloaderAnimateIn()
        ])
      })
      .then(function () {
        return adKit.loadContent(expandedPartial, expandedContainer, richBaseURL)
      }) // reload content on each expand
      .then(shellAnimationController.preloaderAnimateOut)
      .then(expandedAnimationController.animateIn)
      .then(bindExpanded)
      .then(function () {
        return util.removeChildren(collapsedContainer)
      })
      .then(adKit.completeExpand)
      .catch(function (value) {
        console.log(value);
        console.log('failure on expand')
      })
  };
  var collapse = function () {
    return adKit.requestCollapse()
      .then(shellAnimationController.collapse)
      .then(function () {
        expandedContainer.classList.add('hidden');
      })
      .then(function () {
        return adKit.loadContent(collapsedPartial, collapsedContainer, richBaseURL)
      })
      .then(collapsedAnimationController.animateIn)
      .then(bindCollapsed)
      .then(function () {
        return util.removeChildren(expandedContainer)
      })
      .then(adKit.completeCollapse)
      .then(function () {
        isAutoExpand = false
      })
      .catch(function (value) {
        console.log(value);
        console.log('failure on collapse')
      })
  };
  //*************************************************************************************************
  // TEMPLATE - SHOULD NOT NEED TO MODIFY
  //*************************************************************************************************
  var init = function () {
    return adKit.boot()
      .then(function () {
        richBaseURL = adKit.getRichBase(baseURL);
        console.log(baseURL);
        console.log(richBaseURL);
        collapsedPartial = adKit.patchURL(collapsedPartial, richBaseURL);
        expandedPartial = adKit.patchURL(expandedPartial, richBaseURL);
        autoExpandedPartial = adKit.patchURL(autoExpandedPartial, richBaseURL);
        cssUpdate();
        expandedPreloader.addEventListener('click', function () {
        });
        if (isAutoExpand !== true) {
          expandedContainer.classList.add('hidden');
        }
      })
      .then(preload)
      .then(run)
  };
  var cssUpdate = function () {
    for (var i = 0; i < document.styleSheets.length; i++) {
      if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf("css/style.css")) {
        adKit.patchCSS(document.styleSheets[i], richBaseURL);
        break;
      }
    }
  };
  var bindCollapsed = function () {
    Array.prototype.slice.call(collapsedContainer.querySelectorAll('.catch-all')).map(function (item) {
      item.addEventListener('click', catchAllHandler);
    });
    Array.prototype.slice.call(collapsedContainer.querySelectorAll('.cta')).map(function (item) {
      item.addEventListener('click', ctaHandler);
    });
    Array.prototype.slice.call(collapsedContainer.querySelectorAll('.expand')).map(function (item) {
      item.addEventListener('click', expandHandler);
    });
  };
  var bindExpanded = function () {
    Array.prototype.slice.call(expandedContainer.querySelectorAll('.catch-all')).map(function (item) {
      item.addEventListener('click', catchAllHandler);
    });
    Array.prototype.slice.call(expandedContainer.querySelectorAll('.cta')).map(function (item) {
      item.addEventListener('click', ctaHandler);
    });
    Array.prototype.slice.call(expandedContainer.querySelectorAll('.close')).map(function (item) {
      item.addEventListener('click', closeHandler);
    });
  };

  var startTimer = function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (autoExpandTimer === 0 || isAutoExpand === false) {
        reject('Timer reject ' + autoExpandTimer + ' ' + isAutoExpand + ' ' + adKit.expanded());
        return
      }
      console.log('Start Auto Timer', adKit.expanded());
      var func = function () {
        console.log('Auto Timer', adKit.expanded());
        if (adKit.expanded() === true) {
          resolve()
        } else {
          reject('Timer reject ' + autoExpandTimer + ' ' + isAutoExpand + ' ' + adKit.expanded());
        }
      };
      setTimeout(func, autoExpandTimer);
    })
  };


  var exitHandler = function () {
    if (adKit.expanded()) {
      collapse();
    }
  };
  var closeHandler = function () {
    if (adKit.expanded()) {
      collapse();
    }
  };
  var catchAllHandler = function () {
    return adKit.exit(exits['catch_all'])
      .then(exitHandler);
  };
  var ctaHandler = function () {
    return adKit.exit(exits['cta'])
      .then(exitHandler)
  };
  var expandHandler = function () {
    return expand();
  };
  return {
    init: init
  };
};
module.exports = App;