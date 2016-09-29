'use strict';

var adKit = require('./hook-ad-kit/AdKit');
var RSVP = require('rsvp');

var App = function () {

  var collapsedPartial = './collapsed.html';
  var expandedPartial = './expanded.html';
  var isAutoExpand = true;

  console.log("hello app");

  adKit.boot()
    .then(preload);

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


  };

};

module.exports = App;