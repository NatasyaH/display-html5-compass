'use strict';
module.exports = function () {
  var getRichBase = function (baseURL) {
    return baseURL.slice(0);
  };
  return {
    getRichBase: getRichBase
  }
};