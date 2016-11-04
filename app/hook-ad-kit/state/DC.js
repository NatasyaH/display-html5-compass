'use strict';
var RSVP = require('rsvp');
var util = require('../Util');
module.exports = function () {
  var boot= function () {
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
  };

 var requestExpand= function () {
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
  };

  var completeExpand = function () {
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
  };

 var requestCollapse= function () {
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
  };

  var completeCollapse =function () {
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
  };

  var exit= function (closure) {
      return new RSVP.Promise(function (resolve, reject) {
        Enabler.addEventListener(studio.events.StudioEvent.EXIT, resolve);
        closure.call();
      })
    };



  return {
    boot: boot,
    requestExpand: requestExpand,
    completeExpand: completeExpand,
    requestCollapse: requestCollapse,
    completeCollapse: completeCollapse,
    exit:exit,
    get expanded() {
      if (Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDED || Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDING) {
        return true;
      }
      return false;
    }
  }
};