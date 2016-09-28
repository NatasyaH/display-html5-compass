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

    var stub = function () {return new RSVP.Promise (function (resolve,reject){ return resolve()} );};
    //add additional preloaders here

    var collapsed = adKit.subload (collapsedPartial);

    return RSVP.all ([stub,collapsed])
  }

};




module.exports = App;