'use strict';
var RSVP = require('rsvp');
var util = require('./Util');
var PathUpdater = function (path) {
  var slice1 = path.slice(0);
  return slice1;
};
var getRichBase = function (baseURL) {
  var arr = baseURL.split('/');
  // named folder of base
  var baseFolder = arr[arr.length - 1];
  var richFolder = baseFolder + '-rich/';
  // dontt need seperate base URLs in DC
  return baseURL.slice(0);
};
var patchURL = function (text) {
  var absURL = '';
  absURL = text.replace(/\.\//g, getRichBase(util.getBaseURL()));
  return absURL;
};
var AdKit = {
  boot: function () {
    var enablerCheck = function (method, state) {
      var check = function () {
        console.log(method());
        return method()
      };
      return new RSVP.Promise(function (resolve, reject) {
        return method() ? resolve() : Enabler.addEventListener(state, resolve);
      })
    }.bind(this);
    var initPromise = enablerCheck(Enabler.isInitialized.bind(Enabler), studio.events.StudioEvent.INIT);
    var loadPromise = enablerCheck(Enabler.isPageLoaded.bind(Enabler), studio.events.StudioEvent.PAGE_LOADED);
    var visiblePromise = enablerCheck(Enabler.isVisible.bind(Enabler), studio.events.StudioEvent.VISIBLE);
    return RSVP.all([initPromise, loadPromise, visiblePromise]);
  },
  loadPartial: function (url) {
    return new RSVP.Promise(function (resolve, reject) {
      var loadComplete = function (response) {
        console.log('partial loaded');
        return resolve(response);
      };
      var xhr = new XMLHttpRequest();
      xhr.open('GET', PathUpdater(url));
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          loadComplete(xhr.responseText);
        }
      }.bind(this);
      xhr.send();
    })
  },
  subloadPartial: function (container, html) {
    console.log('subloadPartial');
    var loadBackgroundImg = function (target) {
      console.log('load background images');
      var divs = target.querySelectorAll('div');
      var retArray = [];
      for (var i = 0; i < divs.length; i++) {
        var obj = divs[i];
        var imagePath = window.getComputedStyle(obj).getPropertyValue("background-image").match(/http(.*?).(?:jpg|gif|png)/);
        if (imagePath !== null) {
          imagePath = imagePath[0];
          console.log('load background image =', imagePath);
          retArray.push(
            new RSVP.Promise(function (resolve, reject) {
              var img = new Image();
              img.onload = function () {
                console.log('single background loaded');
                resolve()
              }.bind(this);
              img.src = imagePath;
            })
          )
        }
      }
      return RSVP.all(retArray);
    };
    var loadImgTags = function (target) {
      console.log('loadImgTags');
      var retArray = [];
      var divs = target.querySelectorAll('img');
      for (var i = 0; i < divs.length; i++) {
        var item = divs[i].src;
        retArray.push(
          new RSVP.Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
              console.log('single image loaded');
              resolve()
            }.bind(this);
            img.src = item;
          })
        )
      }
      return RSVP.all(retArray);
    };
    return new RSVP.Promise(function (resolve, reject) {
      util.removeChildren(container)
        .then(function () {
          console.log('add html');
          container.innerHTML = html
        })
        .then(function () {
          return RSVP.all([
            loadImgTags(container),
            loadBackgroundImg(container)
          ])
        }) // need to return promise to keep flow going since it is async
        .then(resolve)
    });
  },
  requestExpand: function () {
    return new RSVP.Promise(function (resolve, reject) {
      console.log('expansion requested');
      // only allow expand if not expanding already
      if (Enabler.getContainerState() !== studio.sdk.ContainerState.EXPANDED && Enabler.getContainerState() !== studio.sdk.ContainerState.EXPANDING) {
        var func = function () {
          Enabler.removeEventListener(studio.events.StudioEvent.EXPAND_START, func);
          resolve('EXPANSION START')
        };
        Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, func);
        Enabler.requestExpand();
      } else {
        reject('AlreadyExpanded');
      }
    });
  },
  completeExpand: function () {
    return new RSVP.Promise(function (resolve, reject) {
      console.log('complete expansion requested');
      if (Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDING) {
        var func = function () {
          Enabler.removeEventListener(studio.events.StudioEvent.EXPAND_FINISH, func);
          resolve('EXPANSION COMPLETE')
        };
        Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, func);
        Enabler.finishExpand();
      } else {
        reject('Expand Not Started so cant be completed');
      }
    });
  },
  requestCollapse: function () {
    return new RSVP.Promise(function (resolve, reject) {
       // only collapse if expanded
      if (Enabler.getContainerState() == studio.sdk.ContainerState.EXPANDED) {
        var func = function () {
          Enabler.removeEventListener(studio.events.StudioEvent.COLLAPSE_START, func);
          console.log('!!!!!');
          resolve('COLLAPSE START')
        };
        Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, func);
        Enabler.requestCollapse();
      } else {
        reject('AlreadyCollapsed');
      }
    });
  },
  completeCollapse: function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (Enabler.getContainerState() === studio.sdk.ContainerState.COLLAPSING) {
        var func = function () {
          Enabler.removeEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, func);
          resolve('COLLAPSE COMPLETE')
        };
        Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, func);
        Enabler.finishCollapse();
      } else {
        reject('Collapse not started so cant complete');
      }
    });
  },
  exit: function (closure) {
    return new RSVP.Promise(function (resolve, reject) {
      Enabler.addEventListener(studio.events.StudioEvent.EXIT, resolve);
      closure.call();
    })
  },
  patchCSS: function (styleSheet) {
    return new RSVP.Promise(function (resolve, reject) {
      var rules = styleSheet.cssRules || styleSheet.rules;
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];
        if (rule.cssText.search('../images') != -1) {
          // console.log(rule.cssText);
          //console.log(rule.style.backgroundImage);
          var oldURL = rule.style.backgroundImage.slice(0);
          var oldURLsplit = oldURL.split('/');
          var oldRel = oldURLsplit[oldURLsplit.length - 2] + '/' + oldURLsplit[oldURLsplit.length - 1];
          oldRel = oldRel.replace('(', '').replace(')', '').replace('"', '');
          var newBase = getRichBase(util.getBaseURL());
          var newURL = 'url("' + newBase + oldRel + '")';
          rule.style.backgroundImage = '';
          rule.style.backgroundImage = newURL;
          console.log(rule.style.backgroundImage, newURL);
        }
      }
      resolve()
    })
  },
  patchURL: patchURL,
  expanded: function () {
    if (Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDED || Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDING) {
      return true;
    }
    return false;
  },
  catchAllExit: function () {
    Enabler.exit('catch_all');
  },
  ctaExit: function () {
    Enabler.exit('cta');
  }
};
module.exports = AdKit;