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

  var collapsedPartial = './collapsed.html';
  var expandedPartial = './expanded.html';
  var isAutoExpand = false;

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
  }

  function run () {


    console.log ('run');




    if (isAutoExpand===true) {

      expand();

    }else {


      return collapsedAnimationController.animateIn()
        .then (function (){
          collapsedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler);
          collapsedContainer.querySelector('.expand').addEventListener('click',expandHandler);
        })


    }

  }


  var expand = function () {

     return adKit.requestExpand()
       .then(function (){return loadContent (expandedPartial,expandedContainer)}) // reload content on each expand
       .then (borderAnimationController.expandInstant )
       .then (adKit.completeExpand)
       .then (expandedAnimationController.animateIn)
       .then (function (){expandedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler);})
       .then (function (){return util.removeChildren(collapsedContainer) });


  };


  var collapse = function  () {

    return adKit.requestCollapse()
      .then(adKit.completeCollapse)
      .then (borderAnimationController.collapseInstant)
      .then (function (){expandedContainer.classList.add('hidden');})
      .then (function (){return loadContent (collapsedPartial,collapsedContainer)})
      .then(collapsedAnimationController.animateIn)
      .then(function (){
        collapsedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler);
        collapsedContainer.querySelector('.expand').addEventListener('click',expandHandler);
      })
      .then (function (){return util.removeChildren(expandedContainer) });
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

  var expandHandler = function () {

    return expand();

  };

  return init();


};

module.exports = App;