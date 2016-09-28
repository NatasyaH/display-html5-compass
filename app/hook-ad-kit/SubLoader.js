'use strict';

var RSVP = require('rsvp');

var SubLoader = function (parentID, url) {

  var parent = document.getElementById(parentID);

  return new RSVP.Promise(function (resolve, reject) {

    function loadComplete (response) {

      console.log ('LoadComplete',response);
      return (resolve (response));
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {

      if (xhr.status!==200) {return reject ('status!==200');}

      loadComplete(xhr.responseText);
    }.bind (this);

    xhr.send();

  })

};

module.exports = SubLoader;