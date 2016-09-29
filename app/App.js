'use strict';

var adKit = require('./hook-ad-kit/AdKit');
var borderAnimationController = require('./controllers/BorderAnimationController');
var collapsedAnimationController = require('./controllers/CollapsedAnimationController');
var RSVP = require('rsvp');

var App = function () {

  var collapsedPartial = './collapsed.html';
  var expandedPartial = './expanded.html';
  var isAutoExpand = false;

  console.log("hello app");

  adKit.boot()
    .then(preload)
    .then (run);

  function preload() {

    var promises = [];

    if (isAutoExpand===true){
      promises.push(loadContent (expandedPartial,document.getElementById("expandedContainer")));
    }else {
      promises.push(loadContent (collapsedPartial,document.getElementById("collapsedContainer")));
    }

    // add your own promises for preloading to the array here

    return RSVP.all(promises)
  }

  function run () {
  console.log ('run');

    if (isAutoExpand) {

      adKit.requestExpand()
        .then (borderAnimationController.expandInstant )
        .then (function (value) {return adKit.completeExpand()} )
        .catch (function (error){console.log ("ERROR",error)})


    }else {

      collapsedAnimationController.animateIn();

    }

  }

  function loadContent (url,container) {


    return adKit.loadPartial(url)
      .then(function (value) {
        return adKit.subloadPartial(container, value)
      });

  }

};

module.exports = App;