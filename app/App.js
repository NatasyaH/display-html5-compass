'use strict';

var adKit = require('./hook-ad-kit/AdKit');
var borderAnimationController = require('./controllers/BorderAnimationController');
var collapsedAnimationController = require('./controllers/CollapsedAnimationController');
var expandedAnimationController = require('./controllers/ExpandedAnimationController');
var RSVP = require('rsvp');



var App = function () {

  var collapsedPartial = './collapsed.html';
  var expandedPartial = './expanded.html';
  var isAutoExpand = false;



  console.log("hello app");



   var  init = function () {
    if (isAutoExpand===true){


    }else {
      expandedAnimationController.hide();

    }

     adKit.boot()
       .then(preload)
       .then (run);

  };

  var preload = function() {

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
        .then (adKit.completeExpand)



    }else {





      collapsedAnimationController.animateIn()
        .then (function bindCatchAll (){

          document.getElementById('collapsedContainer').querySelector('.catch-all').addEventListener('click',catchAllHandler);

        })


    }

  }

  var  loadContent = function (url,container) {


    return adKit.loadPartial(url)
      .then(function (value) {
        return adKit.subloadPartial(container, value)
      });

  };


  var catchAllHandler = function () {

    adKit.exit (function (){Enabler.exit ('catch-all')});

  };


  return init();


};

module.exports = App;