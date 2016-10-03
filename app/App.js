'use strict';

var RSVP = require('rsvp');

var adKit = require('./hook-ad-kit/AdKit');
var borderAnimationController = require('./controllers/BorderAnimationController');
var collapsedAnimationController = require('./controllers/CollapsedAnimationController');
var expandedAnimationController = require('./controllers/ExpandedAnimationController');
var util = require('./hook-ad-kit/Util');



RSVP.on('error', function(reason, label) {
  if (label) {
    console.error(label);
  }

  console.assert(false, reason);
});


var App = function () {

  var collapsedPartial = window.adConfig.collapsedPartial;
  var expandedPartial = window.adConfig.expandedPartial;
  var isAutoExpand = window.adConfig.isAutoExpand;

  var expandedContainer = document.querySelector('#expandedContainer');
  var collapsedContainer = document.querySelector('#collapsedContainer');

  console.log("hello app");



   var  init = function () {
    if (isAutoExpand===true){


    }else {
      expandedContainer.classList.add('hidden');

    }

     adKit.boot()
       .then(preload)
       .then (run);

  };

  var preload = function() {

    console.log ('preload');

    var promises = [];

    if (isAutoExpand===true){
      promises.push(loadContent (expandedPartial,expandedContainer));
    }else {
      promises.push(loadContent (collapsedPartial,collapsedContainer));
    }

    // add your own promises for preloading to the array here

    return RSVP.all(promises)
  };

  function run () {
    console.log ('run');
    if (isAutoExpand===true) {
      expand();
    }else {
      return collapsedAnimationController.animateIn()
        .then (bindCollapsed)
    }
  }

  var preExpand = function () {


    var promises = [];

    return RSVP.all(promises);




  };
  var postExpand = function () {


    var promises = [];

    return RSVP.all(promises);




  };

  var expand = function () {

     return adKit.requestExpand()
       .then (borderAnimationController.expandInstant )
       .then(function (){return loadContent (expandedPartial,expandedContainer)}) // reload content on each expand
       .then (preExpand)  // do your preloading or init here.
       .then (adKit.completeExpand)
       .then (expandedAnimationController.animateIn)
       .then (postExpand) // do any post expansion init here
       .then (bindExpanded)
       .then (function (){return util.removeChildren(collapsedContainer) });


  };
  var preCollapse = function () {


    var promises = [];

    return RSVP.all(promises);




  };
  var postCollapse = function () {


    var promises = [];

    return RSVP.all(promises);




  };

  var collapse = function  () {

    return adKit.requestCollapse()
      .then (preCollapse)
      .then (borderAnimationController.collapseInstant)
      .then (function (){expandedContainer.classList.add('hidden');})
      .then (function (){return loadContent (collapsedPartial,collapsedContainer)})
      .then(collapsedAnimationController.animateIn)
      .then (postCollapse)
      .then(bindCollapsed)
      .then (function (){return util.removeChildren(expandedContainer) })
      .then(adKit.completeCollapse)
  };


  var  loadContent = function (url,container) {

    console.log ('loadContent');
    container.classList.remove ('hidden');
    return adKit.loadPartial(url)
      .then(function (value) {
        return adKit.subloadPartial(container, value)
      });

  };

  var exitHandler = function () {
    if (adKit.expanded()) {
      collapse();
    }



  };


  var catchAllHandler = function () {

    return adKit.exit (function (){Enabler.exit ('catch-all')})
      .then (exitHandler);

  };

  var ctaHandler = function () {

    return adKit.exit (function (){Enabler.exit ('cta')})
      .then(exitHandler)

  };

  var bindCollapsed = function () {

    collapsedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler);
    collapsedContainer.querySelector('.cta').addEventListener('click',ctaHandler);
    collapsedContainer.querySelector('.expand').addEventListener('click',expandHandler);
  };

  var bindExpanded = function (){
    expandedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler);
    expandedContainer.querySelector('.cta').addEventListener('click',ctaHandler);

  };

  var expandHandler = function () {

    return expand();

  };

  return init();


};

module.exports = App;