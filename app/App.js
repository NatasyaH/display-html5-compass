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



  init();
  adKit.boot()
    .then(preload)
    .then (run);


  function init() {
    if (isAutoExpand===true){


    }else {
      expandedAnimationController.hide();

    }

  }

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
        .then (adKit.completeExpand)



    }else {



      collapsedAnimationController.animateIn()
        .then (function () {

          bindButtons(document.querySelectorAll('.catch-all'),function (){Enabler.exit('CatchAll')})


        })

    }

  }

  function loadContent (url,container) {


    return adKit.loadPartial(url)
      .then(function (value) {
        return adKit.subloadPartial(container, value)
      });

  }


  function bindButtons (nodeList,closure){



    for (var i = 0; i < nodeList.length; i++) {
      var obj = nodeList[i];

      obj.addEventListener ('click',generateExit(closure)  )

    }

  }

  function exitHandler (closure) {

    adkit.exit(closure)
      .then (function (){console.log ('exit handled')})

  }

  function generateExit (closure) {


    return function () {

      exitHandler(closure)
    }




  }




};

module.exports = App;