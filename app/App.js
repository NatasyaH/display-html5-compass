'use strict';

var adKit = require ('./hook-ad-kit/AdKit');

var App = function () {

  console.log ("hello app");

  adKit.boot().then(function (){ console.log ("App Booted"); })


};




module.exports = App;