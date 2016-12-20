/**
 * Created by chriswatts on 9/29/16.
 */
'use strict';
var RSVP = require('rsvp');
module.exports = {
  animateIn: function () {
    return new RSVP.Promise(
      function (resolve, reject) {
        var content = document.querySelector('#expandedContainer').querySelector('.content');
        var tl = new TimelineMax(
          {
            onComplete: function () {
              console.log('expand animation complete');
              resolve(tl)
            }
          }
        );
        tl.add([
          TweenMax.to(content, 0.5, {opacity: 1})
        ]);
      })
  },

  animateOut: function () {
    return new RSVP.Promise(
      function (resolve, reject) {
        var content = document.querySelector('#expandedContainer').querySelector('.content');
        var tl = new TimelineMax(
          {
            onComplete: function () {
              resolve(tl)
            }
          }
        );
        tl.add([
          TweenMax.to(content, 0.5, {opacity: 0})
        ]);
      })
  },

  animateEndCardIn:function() {
    return new RSVP.Promise(function( resolve, reject ) {
      var tl = new TimelineMax({
        onComplete:function() {
          resolve(tl);
        }
      });

      TweenMax.set( ".replay", { display:"block", autoAlpha:0 } );

      tl.to( ".replay", 0.5, { autoAlpha:1 } );
    })
  },

  animateEndCardOut:function() {
    return new RSVP.Promise(function( resolve, reject ) {
      var tl = new TimelineMax({
        onComplete:function() {
          TweenMax.set( ".replay", { display:"none" } );
          resolve(tl);
        }
      });
      tl.to( ".replay", 0.5, { autoAlpha:0 } );
    })
  }
};


