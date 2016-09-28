'use strict';

var RSVP = require('rsvp');

var AdKit = {

  boot: function (){

    var enablerCheck = function (method, state) {

      var check = function (){
        console.log (method ());
        return method()

      };

      return new RSVP.Promise (function (resolve,reject) {
        return check() ? resolve() : Enabler.addEventListener (state,function (){

          console.log (state,"RESOLVED");
          resolve (state);

        });

      })


    }.bind(this);

    var initPromise = enablerCheck (Enabler.isInitialized.bind (Enabler),studio.events.StudioEvent.INIT);
    var loadPromise = enablerCheck (Enabler.isPageLoaded.bind (Enabler),studio.events.StudioEvent.PAGE_LOADED);
    var visiblePromise = enablerCheck (Enabler.isVisible.bind (Enabler),studio.events.StudioEvent.VISIBLE);

    return RSVP.all ([initPromise,loadPromise,visiblePromise]);


  }


};




module.exports = AdKit;