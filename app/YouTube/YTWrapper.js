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




var ConfigNoHistory = function (height, width, id, length) {

  var playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    disablekb: 1,
    iv_load_policy: 3,
    cc_load_policy: 0,
    adformat: '1_8', // prevents video from showing up in user YT history so auto play videos don't get flagged as spam
    controls: 0,
    html5: 1,
    origin: document.domain,
    fs: 0
  };

  if (!isNaN(length)) {

    playerVars.end = length;
  }

  return params = {
    height: height,
    width: width,
    videoId: id,
    playerVars: playerVars
  };



};

var ConfigWithHistory = function (height, width, id, length) {

  var playerVars = {
    rel: 0,
    showinfo: 0,
    enablejsapi: 1,
    disablekb: 1,
    iv_load_policy: 3,
    cc_load_policy: 0,

    controls: 1,
    html5: 1,
    origin: document.domain,
    fs: 0
  };

  if (!isNaN(length)) {

    playerVars.end = length;
  }

  return params = {
    height: height,
    width: width,
    videoId: id,
    playerVars: playerVars
  };



};






module.exports = {
  YTWrapper:YTWrapper,
  ConfigNoHistory:ConfigNoHistory,
  ConfigWithHistory:ConfigWithHistory


};