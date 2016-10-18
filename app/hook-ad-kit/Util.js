/**
 * Created by chriswatts on 9/29/16.
 */
'use strict';
var RSVP = require('rsvp');
module.exports = {
  removeChildren: function (domNode) {
    return new RSVP.Promise(function (resolve, reject) {
      while (domNode.hasChildNodes()) {
        domNode.removeChild(domNode.lastChild);
      }
      requestAnimationFrame(resolve);
    });
  },
  getBaseURL: function () {
    var baseURL = location.protocol + '//' + location.host + location.pathname;
    var arr = baseURL.split('/');
    if (arr[arr.length - 1].search('.html') != -1) {
      arr.pop();
    }
    console.log(baseURL);
    return baseURL = arr.join('/').slice(0);


  }
};


