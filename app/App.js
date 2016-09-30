'use strict';

var adKit = require('./hook-ad-kit/AdKit');
var borderAnimationController = require('./controllers/BorderAnimationController');
var collapsedAnimationController = require('./controllers/CollapsedAnimationController');
var expandedAnimationController = require('./controllers/ExpandedAnimationController');
var RSVP = require('rsvp');



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

      collapsedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler);
      collapsedAnimationController.animateIn()


    }

  }


  var expand = function () {

     adKit.requestExpand()
      .then (borderAnimationController.expandInstant )
      .then (adKit.completeExpand)
      .then (function (){return expandedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler);})
      .then (expandedAnimationController.animateIn)


  };

  var  loadContent = function (url,container) {

    container.classList.remove ('hidden');

    return adKit.loadPartial(url)
      .then(function (value) {
        return adKit.subloadPartial(container, value)
      });

  };

  var exitHandler = function () {


    if (adKit.expanded()) {

      adKit.requestCollapse()
        .then(adKit.completeCollapse)
        .then (borderAnimationController.collapseInstant)
        .then (function (){
          expandedContainer.classList.add('hidden');
        })
        .then (loadContent (collapsedPartial,collapsedContainer))
        .then(function (){return collapsedContainer.querySelector('.catch-all').addEventListener('click',catchAllHandler)})
        .then(collapsedAnimationController.animateIn)




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

  return init();


};

module.exports = App;