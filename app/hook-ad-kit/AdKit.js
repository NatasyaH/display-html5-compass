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
        return method() ? resolve() : Enabler.addEventListener (state,resolve);

      })


    }.bind(this);

    var initPromise = enablerCheck (Enabler.isInitialized.bind (Enabler),studio.events.StudioEvent.INIT);
    var loadPromise = enablerCheck (Enabler.isPageLoaded.bind (Enabler),studio.events.StudioEvent.PAGE_LOADED);
    var visiblePromise = enablerCheck (Enabler.isVisible.bind (Enabler),studio.events.StudioEvent.VISIBLE);

    return RSVP.all ([initPromise,loadPromise,visiblePromise]);


  },
  subload: function ( url) {



  return new RSVP.Promise(function (resolve, reject) {

    function loadComplete (response) {

      console.log ('LoadComplete',response);
      return resolve (response);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {

      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {

        loadComplete(xhr.responseText);
      }


    }.bind (this);

    xhr.send();

  })

}


};




module.exports = AdKit;