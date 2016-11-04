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
    var baseURL =  location.protocol + '//' + location.host + location.pathname.slice(0).replace(/\/index(.*?)\.html/,'/');

    if (baseURL.charAt(baseURL.length-1) !=='/') {

      baseURL = baseURL+'/'
    }


    console.log(baseURL);
    return baseURL


  }

}


