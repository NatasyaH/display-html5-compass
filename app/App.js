'use strict';

var adKit = require('./hook-ad-kit/AdKit');
var RSVP = require('rsvp');

var App = function () {

  var collapsedPartial = './collapsed.html';

  console.log("hello app");

  adKit.boot()
    .then(function (value) {
      console.log("App Booted");
      return value
    })
    .then(preload)
    .then(function (value) {
      console.log("preloaded")
    });

  function preload() {

    var collapsed = adKit.loadPartial(collapsedPartial)
      .then(function (value) {
        return adKit.subloadPartial(document.getElementById("collapsedContainer"), value)
      });

    var stub = function () {
      return new RSVP.Promise(function (resolve, reject) {
        return resolve()
      })
    };
    // hash is loaded in parallel
    //add more promises here to do more preloading
    var promises = {
      collapsed: collapsed,
      users: stub
    };

    return RSVP.hash(promises)
  }

};

module.exports = App;