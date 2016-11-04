'use strict';
var RSVP = require('rsvp');
var util = require('./Util');
var PathUpdater = function (path) {
  var slice1 = path.slice(0);
  return slice1;
};
var getRichBase = function (baseURL) {
  var arr = baseURL.split('/');
  // named folder of base
  var baseFolder = arr[arr.length - 1];
  var richFolder = baseFolder + '-rich/';
  // dontt need seperate base URLs in DC
  return baseURL.slice(0);
};

var AdKit = {





};
module.exports = AdKit;