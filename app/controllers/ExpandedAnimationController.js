/**
 * Created by chriswatts on 9/29/16.
 */
'use strict';

var RSVP = require('rsvp');

var container = document.querySelector('#expandedContainer');




module.exports = {

  hide: function () {


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
          TweenMax.set(container,  {className: '+=hidden'})
        ]);

      })
  },
  show: function () {


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
          TweenMax.set(container,  {className: '-=hidden'})
        ]);

      })
  }



};


