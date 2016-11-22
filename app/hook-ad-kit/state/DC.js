'use strict';
var RSVP = require('rsvp');
var util = require('../Util');
module.exports = function () {
  var boot = function () {
    var enablerCheck = function (method, state) {
      var check = function () {
        
        var result = method();
        
        console.log( state,result);
        return result
      };
      return new RSVP.Promise(function (resolve, reject) {
        
        if (check()=== true) {
  
          console.log( state,check(),"VERIFIED");
          
          resolve()
        }else {
          Enabler.addEventListener(state, function () {
            console.log( state,check(),"EVENT VERIFIED");
            resolve()
          });
        }
        
                
      })
    }.bind(this);
    return new RSVP.Promise(function (resolve, reject) {
      enablerCheck(function () {
        var ret = Enabler.isInitialized();
        return ret
      }, studio.events.StudioEvent.INIT)
        .then(function () {
          return enablerCheck(function () {
            var ret = Enabler.isPageLoaded();
            return ret;
          }, studio.events.StudioEvent.PAGE_LOADED)
        })
        .then(function () {
          return enablerCheck(function () {
            var ret = Enabler.isVisible();
            return ret
          }, studio.events.StudioEvent.VISIBLE)
        })
        .then(resolve)
    })
  };
  var requestExpand = function () {
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
  var requestCollapse = function () {
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
  var completeCollapse = function () {
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
  var exit = function (closure) {
    return new RSVP.Promise(function (resolve, reject) {
      Enabler.addEventListener(studio.events.StudioEvent.EXIT, resolve);
      closure.call();
    })
  };
  var defaultClose = function () {
    Enabler.reportManualClose()
  };
  var expanded = function () {
    // console.log(Enabler.getContainerState());
    if (Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDED || Enabler.getContainerState() === studio.sdk.ContainerState.EXPANDING) {
      return true;
    }
    return false;
  };
  return {
    boot: boot,
    requestExpand: requestExpand,
    completeExpand: completeExpand,
    requestCollapse: requestCollapse,
    completeCollapse: completeCollapse,
    exit: exit,
    expanded: expanded,
    defaultClose: defaultClose
  };
};