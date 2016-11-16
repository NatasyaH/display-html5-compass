'use strict';
var RSVP = require('rsvp');

var player = null;
var supportedVideoTypes = [ // in order of priority
  'video/webm',
  'video/mp4',
  'video/ogg'
]

var DCVideoPlayer = function () {

  var videoElement = null;
  var adVideoId = 'AdVideo';

  var api = {
    get duration() {
      return player.duration;
    },
    get currentTime() {
      return player.currentTime;
    },
    get elem() {
      return player;
    }
  };

  var defaults = {
    autoplay: true
  }

  api.loadVideo = function (element, videos, options) { // eventually options would be good.
    return new RSVP.Promise(function (resolve, reject) {

      if(!element) {
        console.log('Video Player Container Missing');
        reject('Video Player Container Missing');
      }
      
      videoElement = document.createElement('video');
      var sourceElement = document.createElement('source');

      window.player = api;
      
      var multipleVideos = typeof videos == 'object';
      var supportedType = api.getVideoType(videoElement);
      var supportedExtention = '.' + supportedType.split('/')[1];
      videoElement.autoplay = options ? options.autoplay : defaults.autoplay;
      player = videoElement;

      var videoUrl = null;

      if(multipleVideos) { // did we get an array of videos? lets get the one that best suits the current browser.
        for(var v in videos){
          videoUrl = videos[v];
          
          if(videoUrl.indexOf(supportedExtention) > -1) break;
        }
        
      } else { // only one video was provided. lets compare it to all supported video types.
        videoUrl = videos;
        for(var t in supportedVideoTypes){
          var type = supportedType[t];
          var extention = '.' + type.split('/')[1];

          supportedType = type;

          if(videoUrl.indexOf(extention) != -1) break;
        }
        console.error('DCVideoPlayer: No supported video provided.')
      }

      sourceElement.src = Enabler.getUrl(videoUrl);
      sourceElement.type = supportedType;

      Enabler.loadModule(studio.module.ModuleId.VIDEO, function() { // load tracking module before the video is added to the dom to avoid race condition.
        studio.video.Reporter.attach(adVideoId, videoElement);
        videoElement.appendChild(sourceElement);
        element.appendChild(videoElement); // lets append the element after the DC module is loaded. there's a tiny chance the module would load AFTER the video is ready to play.
        videoElement.style.opacity = 0;
        console.log('videoElement',videoElement, 'element',element);
        videoElement.addEventListener('canplaythrough', function(){
          this.style.opacity = 1;
          resolve(this, 'DCVideoPlayer: Load Promise');
        }.bind(videoElement));

      });
    });
  };

  api.destroy = function(){
    if(videoElement) { videoElement.parentNode.removeChild(videoElement); }
    console.log('DCVideoPlayer: destroy');
    videoElement = null;

    studio.video.Reporter.detach(adVideoId);
  }

  api.addEventListener = function(type, handler, options){
    player.addEventListener(type, handler, options);
  }

  api.removeEventListener = function(type, handler){
    player.removeEventListener(type, handler);
  }

  api.play = function(){
    player.play();
  }

  api.stop = function(){
    player.pause();
    player.currentTime = 0;
  }

  api.seek = function(time) {
    player.currentTime = time;
  }

  api.getVideoType = function(player){
    for(var t in supportedVideoTypes) {
      var type = supportedVideoTypes[t];

      if(player.canPlayType(type)){
        return type;
      }
    }
  };

  return api;
};


module.exports = DCVideoPlayer;