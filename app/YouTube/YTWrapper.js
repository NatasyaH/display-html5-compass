'use strict';
var RSVP = require('rsvp');
var YTWrapper = function () {
  var api = {};
  api.loadAPI = function () {

    return new RSVP.Promise(function (resolve, reject) {
      var tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = function (){

        console.log ('yt loaded');
        resolve();
      }
    })
  };

  return api;
};
module.exports = YTWrapper;