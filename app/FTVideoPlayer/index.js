'use strict';

var RSVP = require( 'rsvp' );

var FTVideoPlayer = function() {

	var api = {};

	var player = null;
	var container = null;

	api.loadVideo = function( params ) {
		return new RSVP.Promise(function( resolve, reject ) {

			player = myFT.insertVideo({
				parent: params.container,
				video: params.videoID,
				preload: 'metadata',
				muted: params.muted,
				autoplay: params.autoplay
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

	api.autoPlayVideo = function() {
		return new RSVP.Promise(function( resolve, reject ) {
			player.play();

			TweenMax.ticker.addEventListener( "tick", tickHandler );
			function tickHandler(){
				if( player.video.currentTime > 0.01 ) {
					TweenMax.ticker.removeEventListener( "tick", tickHandler );
					resolve( player, "FT Autoplay Promise" );
				}
			}

		})
		
	};

	api.play = function() {
		return new RSVP.Promise(function( resolve, reject ) {
			player.currentTime = 0;
			player.play();

			TweenMax.ticker.addEventListener( "tick", tickHandler );
			function tickHandler(){
				if( player.video.currentTime > 0.01 ) {
					TweenMax.ticker.removeEventListener( "tick", tickHandler );
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
			if( container !== null ) container.style.visibility = "display";
			resolve();
		})
	};

	api.hide = function() {
		return new RSVP.Promise(function( resolve, reject ) {
			if( player !== null ) player.stop();
			if( container !== null ) container.style.visibility = "hidden";
			resolve();
		})
	};
 
	return api;

};

module.exports = FTVideoPlayer;