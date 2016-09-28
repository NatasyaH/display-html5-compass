'use strict';

var adKit = require ('./hook-ad-kit/AdKit');
var RSVP = require('rsvp');

var App = function () {

  var collapsedPartial = './collapsed.html';

  console.log ("hello app");

  adKit.boot()
    .then(function (value){ console.log ("App Booted"); return value })
    .then (preload)
    .then (function (value) {console.log ("preloaded")});


  function preload () {



    return adKit.loadPartial (collapsedPartial)
      .then (function (value){return adKit.subloadPartial(document.getElementById("collapsedContainer"),value)})


  }

};




module.exports = App;