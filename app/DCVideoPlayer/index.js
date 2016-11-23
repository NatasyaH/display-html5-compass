'use strict';
var RSVP = require('rsvp');

var supportedVideoTypes = [ // in order of priority
  'video/webm',
  'video/mp4',
  'video/ogg'
];

var DCVideoPlayer = function () {

  console.log('DCVideoPlayer: New instance.');
  
  var _videoElement = null;
  var _sourceElement = null;
  var _videoId = null;
  var _resolve = null;
  var _reject = null;
  var _container = null;
  var _player = null;

  var api = {
    get duration() {
      return _player.duration;
    },
    get currentTime() {
      return _player.currentTime;
    },
    get elem() {
      return _player;      
    }
  };

  api.players = [];

  var defaults = {
    autoplay: true//,
    //destroyOnComplete: false // to be implemented later
  }

  window.players = api.players;

  api.load = function (container, videos, id, options) { // eventually options would be good.
    return new RSVP.Promise(function (resolve, reject) {

      _resolve = resolve;
      _reject = reject;
      _container = container;
      _videoId = id || 'video' + new Date().getTime();

      if(!container) {
        console.log('DCVideoPlayer - ', _videoId + ': Video Player Container Missing');
        _reject('DCVideoPlayer - ', _videoId + ': Video Player Container Missing');
      }
      
      _videoElement = document.createElement('video');
      _sourceElement = document.createElement('source');

      window.player = api;
      
      var multipleVideos = typeof videos == 'object';
      var supportedType = api.getVideoType(_videoElement);
      var supportedExtention = '.' + supportedType.split('/')[1];
      _videoElement.autoplay = options ? options.autoplay : defaults.autoplay;
      _player = _videoElement;

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
        console.error('DCVideoPlayer -', _videoId + ': No supported video provided.')
      }

      _sourceElement.src = Enabler.getUrl(videoUrl);
      _sourceElement.type = supportedType;

      var playerData = {
        id: _videoId,
        container: _container,
        element: _videoElement,
        source: _sourceElement,
        resolve: _resolve,
        reject: _reject
      };

      api.players.push(playerData);

      Enabler.loadModule(studio.module.ModuleId.VIDEO, initPlayer.bind(playerData)); // load tracking module before the video is added to the dom to avoid race condition.
    });
  };

  var initPlayer = function (){
    studio.video.Reporter.attach(this.id, this.element);
    this.element.appendChild(this.source);
    this.container.appendChild(this.element); // lets append the container after the DC module is loaded. there's a tiny chance the module would load AFTER the video is ready to play.
    this.element.style.opacity = 0;
    this.element.addEventListener('canplaythrough', function(){
      this.element.style.opacity = 1;
      this.resolve('DCVideoPlayer -', this.id + ': Load Promise');
    }.bind(this));
  }

  api.destroy = function(selected){
    var target = null;
    var id = null;
    var index = null;

    if(getObjectType(selected) == 'HTMLDivElement'){
      for(var i in api.players){
        var player = api.players[i];
        if(player.element == selected) {
          id = player.id;
          target = selected;
          console.log('player',player);
          index = i;
        }
      }
    } else if(getObjectType(selected) == 'String') { // selected is probably an id
      for(var i in api.players){
        var player = api.players[i];
        if(player.id == selected) {
          target = player.element;
          id = player.id;
          console.log('player',player);
          index = i;
        }
      }
    } else if(getObjectType(selected) == 'Array') { // selected is probably a list of elements
      for(var i in selected) {
        api.destroy(selected[i]);
      }
      return;
    } else { // nothing specific selected so destroy all
      for(var i = api.players.length - 1; i >= 0; i--) {
        api.destroy(api.players[i].id);
      }
      api.players = [];
      return;
    }

    //console.log('hm', target, id, players);
    if(!target) {
      console.log('DCVideoPlayer - Error: Cannot find element to destroy:', selected);
      return;
    }


    studio.video.Reporter.detach(id);

    target.parentNode.removeChild(target);
    api.players[index] = null;
    api.players.splice(index,1);

    console.log('DCVideoPlayer -', id + ': destroyed');
  }

  api.destroyAll = function(){
    console.log('DCVideoPlayer: Destroying all players.');
    for(var i = api.players.length - 1; i >= 0; i--) {
      api.destroy(api.players[i].id);
    }
  }

  api.addEventListener = function(type, handler, options){
    _player.addEventListener(type, handler, options);
  }

  api.removeEventListener = function(type, handler){
    _player.removeEventListener(type, handler);
  }

  api.play = function(){
    _player.play();
  }

  api.stop = function(){
    _player.pause();
    _player.currentTime = 0;
  }

  api.seek = function(time) {
    _player.currentTime = time;
  }

  api.getVideoType = function(player){
    for(var t in supportedVideoTypes) {
      var type = supportedVideoTypes[t];

      if(player.canPlayType(type)){
        return type;
      }
    }
  };

  api.getVideoById = function(id){
    for(var i in api.players){
      var player = api.players[i];
      if(player.id == id) return player.element
    }
  }

  var getObjectType = function(object){
    return Object.prototype.toString.call(object).split(' ')[1].replace(']','');
  }

  return api;
};


module.exports = DCVideoPlayer;