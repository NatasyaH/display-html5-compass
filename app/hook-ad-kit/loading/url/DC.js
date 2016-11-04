'use strict';
module.exports = function () {
  var getRichBase = function (baseURL) {
    var arr = baseURL.split('/');
    // named folder of base
    var baseFolder = arr[arr.length - 1];
    var richFolder = baseFolder + '-rich/';
    // dontt need seperate base URLs in DC
    return baseURL.slice(0);
  };
  return {
    getRichBase: getRichBase
  }
};