'use strict';

var adKit = require('./hook-ad-kit/AdKit');
var borderAnimationController = require('./controllers/BorderAnimationController');
var RSVP = require('rsvp');

var App = function () {

  var collapsedPartial = './collapsed.html';
  var expandedPartial = './expanded.html';
  var isAutoExpand = true;

  console.log("hello app");

  adKit.boot()
    .then(preload)
    .then (run)

  function preload() {

    var promises = [];

    if (isAutoExpand===true){
      var expanded = adKit.loadPartial(expandedPartial)
        .then(function (value) {
          return adKit.subloadPartial(document.getElementById("expandedContainer"), value)
        });
      promises.push(expanded);
    }else {
      var collapsed = adKit.loadPartial(collapsedPartial)
        .then(function (value) {
          return adKit.subloadPartial(document.getElementById("collapsedContainer"), value)
        });
      promises.push(collapsed);
    }

    // add your own promises for preloading to the array here

    return RSVP.all(promises)
  }

  function run () {
  console.log ('run');

    if (isAutoExpand) {

      adKit.requestExpand()
        .then (function (value) {return adKit.completeExpand()} )
        .then (function (value) {console.log (value)})
        .then (borderAnimationController.expandInstant )
        .then (function (value) {console.log ('border down')})
        .catch (function (error){console.log ("ERROR",error)})


    }

  }

};

module.exports = App;