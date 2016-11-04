'use strict';
var RSVP = require('rsvp');
var util = require('../Util');
var expanding = "expanding";
var expanded = "expanded";
var collapsing = "collapsing";
var collapsed = "collapsed";
var state = collapsed;
module.exports = function () {
  var boot = function () {
    var readyPromise = new RSVP.Promise(function (resolve, reject) {

      var func = function () {
        console.log ('FT READY')
        resolve();
      }

      myFT.on("ready", func);
    });

    return readyPromise;
  };
  var requestExpand = function () {
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
  };
  var completeExpand = function () {
    return new RSVP.Promise(function (resolve, reject) {
      console.log('complete expansion requested');
      if (state !== expanding) {
        reject('Expand Not Started so cant be completed');
        return;
      }
      state = expanded;
      resolve('EXPANSION COMPLETE')
    });
  };
  var requestCollapse = function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (state !== expanded) {
        reject('AlreadyCollapsed');
        return;
      }
      state = collapsing;
      resolve('COLLAPSE START');
    });
  };
  var completeCollapse = function () {
    return new RSVP.Promise(function (resolve, reject) {
      if (state !== collapsing) {
        reject('Collapse not started so cant complete');
        return;
      }
      state = collapsed;
      resolve('COLLAPSE COMPLETE')
    });
  };
  var exit = function (closure) {
    return new RSVP.Promise(function (resolve, reject) {
      closure.call();
      resolve()
    })
  };

  var defaultClose = function () {

      Enabler.reportManualClose()

    };

  var expanded = function () {
    if (state === expanding || state === expanded) {
      return true;
    }
    return false
  };
  return {
    boot: boot,
    requestExpand: requestExpand,
    completeExpand: completeExpand,
    requestCollapse: requestCollapse,
    completeCollapse: completeCollapse,
    exit: exit,
    expanded: expanded,
    defaultClose:defaultClose
  };
};