'use strict';
var RSVP = require('rsvp');
var util = require('./Util');
var PathUpdater = function (path) {
  var slice1 = path.slice(0);
  var cid = myFT.get("cID");
  var dom = myFT.get("serveDOM");
  var base = window.location.href.split(cid)[0];
  return slice1;
  // local
  if (myFT.testMode === true) {
    return slice1;
  }
  if (myFT.get("serveDOM") === "") {
    //staging path
    base = path.replace("./", "../../richLoads/");
  } else {
    //cdn path
    base = path.replace("./", "../");
  }
  return base;
};
var getRichBase = function (baseURL) {
  var arr = baseURL.split('/');
  // named folder of base
  var baseFolder = arr[arr.length - 1];
  var richFolder = baseFolder + '-rich/';
  // if local testing just return base URL
  if (myFT.testMode === true) {
    return baseURL.slice(0);
  }
  if (myFT.get("serveDOM") === "") {

    // patch to richloads on staging
    arr[arr.length - 2] = 'richLoads';
    arr[arr.length - 1] = richFolder;
    return arr.join('/');
  } else {
    //path to richloads on CDN
    return baseURL.slice(0);
  }
};
var patchURL = function (text) {
  var absURL = '';
  absURL = text.replace(/\.\//g, getRichBase(util.getBaseURL()));
  return absURL;
};
var expanding = "expanding";
var expanded = "expanded";
var collapsing = "collapsing";
var collapsed = "collapsed";
var state = collapsed;
var AdKit = {
  boot: function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (myFT.hasLoaded === true) {
        resolve();
      } else {
        myFT.on("ready", resolve);
      }
    })
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
      if (state !== collapsed) {
        reject('AlreadyExpanded');
        return;
      }
      myFT.expand();
      state = expanding;
      resolve('EXPANSION START');
    });
  },
  completeExpand: function () {
    return new RSVP.Promise(function (resolve, reject) {
      console.log('complete expansion requested');
      if (state !== expanding) {
        reject('Expand Not Started so cant be completed');
        return;
      }
      state = expanded;
      resolve('EXPANSION COMPLETE')
    });
  },
  requestCollapse: function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (state !== expanded) {
        reject('AlreadyCollapsed');
        return;
      }
      state = collapsing;
      resolve('COLLAPSE START');
    });
  },
  completeCollapse: function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (state !== collapsing) {
        reject('Collapse not started so cant complete');
        return;
      }
      state = collapsed;
      resolve('COLLAPSE COMPLETE')
    });
  },
  exit: function (closure) {
    return new RSVP.Promise(function (resolve, reject) {
      closure.call();
      resolve()
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
          var oldRel = oldURLsplit[oldURLsplit.length-2] +'/'+oldURLsplit[oldURLsplit.length-1];

          oldRel =oldRel.replace('(','').replace(')','').replace('"','');

          var newBase = getRichBase(util.getBaseURL());
          var newURL = 'url("'+ newBase +oldRel +'")';
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
    if (state === expanding || state === expanded) {
      return true;
    }
    return false
  },
    catchAllExit: function () {
      myFT.clickTag(1);

    },
    ctaExit: function () {
      myFT.clickTag(2);

    }
};
module.exports = AdKit;