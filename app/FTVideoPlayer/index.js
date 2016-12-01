'use strict';

var RSVP = require( 'rsvp' );

var FTVideoPlayer = function() {

	var api = {};

	var player = null;

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
				if( params.autoplay ) {
					player.on( 'ended', autoPlayCompleteHandler );
				}
				resolve( player, "FT Player Load Promise" );
			}

			function autoPlayCompleteHandler() {
				console.log("AUTOPLAY COMPLETE");
			}

		})
	};
 
	return api;

};

module.exports = FTVideoPlayer;