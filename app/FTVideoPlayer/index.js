'use strict';

var RSVP = require( 'rsvp' );

var FTVideoPlayer = function() {

	var api = {};

	var player = null;
	var container = null;

	api.loadVideo = function( params ) {
		return new RSVP.Promise(function( resolve, reject ) {

			container = params.container;

			player = myFT.insertVideo({
				parent: container,
				video: params.videoID,
				preload: 'metadata',
				muted: params.muted,
				autoplay: params.autoplay,
				controls: params.controls
			});

			if( navigator.userAgent.indexOf( "Firefox" ) > 0 ) {
				player.video.addEventListener( "loadstart", playerLoadedHandler );
			} else {
				player.on( "playbackready", playerLoadedHandler );
			}

			function playerLoadedHandler() {
				resolve( player, "FT Player Load Promise" );
			}

		})
	};

	api.play = function() {
		return new RSVP.Promise(function( resolve, reject ) {
			player.currentTime = 0;
			player.play();
			var timer = setInterval( timerHandler, 100 );
			function timerHandler() {
				if( player.video.currentTime > 0.01 ) {
					clearInterval( timer );
					resolve( player, "FT Play Promise" );
				}
			}
		})
	};

	api.stop = function() {
		return new RSVP.Promise(function( resolve, reject ) {
			player.stop();
			resolve( player, "FT Stop Promise" );
		})
	};

	api.show = function() {
		return new RSVP.Promise(function( resolve, reject ) {
			if( container !== null ) container.style.display = "block";
			resolve();
		})
	};

	api.hide = function() {
		return new RSVP.Promise(function( resolve, reject ) {
			if( player !== null ) player.stop();
			if( container !== null ) container.style.display = "none";
			resolve();
		})
	};

	api.getPlayer = function() {
		return player;
	}
 
	return api;

};

module.exports = FTVideoPlayer;