/**
 * Created by chriswatts on 9/29/16.
 */
'use strict';

var RSVP = require('rsvp');


var top = document.getElementById('border-top');
var left = document.getElementById('border-left');
var right = document.getElementById('border-right');
var bottom = document.getElementById('border-bottom');


module.exports = {

  expand: function () {


    return new RSVP.Promise(
      function (resolve, reject) {

        var tl = new TimelineMax(
          {
            onComplete: function () {

              resolve(tl)
            },
            onCompleteScope: this

          }
        );

        tl.add ([
          TweenMax.to(top, 1, {className: "top-expanded-border"}),
          TweenMax.to(left, 1, {className: "left-expanded-border"}),
          TweenMax.to(right, 1, {className: "right-expanded-border"}),
          TweenMax.to(bottom, 1, {className: "bottom-expanded-border"})

        ]);

      })
  },
  expandInstant: function () {


    return new RSVP.Promise(
      function (resolve, reject) {

        var tl = new TimelineMax(
          {
            onComplete: function () {


              resolve(tl)
            },
            onCompleteScope: this

          }
        );

        tl.add ([
          TweenMax.set(top,  {className: "top-expanded-border"}),
          TweenMax.set(left,  {className: "left-expanded-border"}),
          TweenMax.set(right,  {className: "right-expanded-border"}),
          TweenMax.set(bottom,  {className: "bottom-expanded-border"})

        ]);

      })
  },
  collapse: function () {


    return new RSVP.Promise(
      function (resolve, reject) {

        var tl = new TimelineMax(
          {
            onComplete: function () {


              resolve(tl)
            },
            onCompleteScope: this

          }
        );

        tl.add ([
          TweenMax.to(top, 1, {className: "top-collapsed-border"}),
          TweenMax.to(left, 1, {className: "left-collapsed-border"}),
          TweenMax.to(right, 1, {className: "right-collapsed-border"}),
          TweenMax.to(bottom, 1, {className: "bottom-collapsed-border"})

        ]);

      })
  },
  collapseInstant: function () {


    return new RSVP.Promise(
      function (resolve, reject) {

        var tl = new TimelineMax(
          {
            onComplete: function () {


              resolve(tl)
            },
            onCompleteScope: this

          }
        );

        tl.add ([
          TweenMax.set(top,  {className: "top-collapsed-border"}),
          TweenMax.set(left,  {className: "left-collapsed-border"}),
          TweenMax.set(right,  {className: "right-collapsed-border"}),
          TweenMax.set(bottom,  {className: "bottom-collapsed-border"})

        ]);

      })
  }



};


