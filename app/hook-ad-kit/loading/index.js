'use strict';
var RSVP = require('rsvp');
var util = require('../Util');
module.exports = function () {
  var patchCSS = function (styleSheet, richBaseURL) {
    return new RSVP.Promise(function (resolve, reject) {
      var rules = styleSheet.cssRules || styleSheet.rules;
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j];
        if (rule.cssText.search('../images') != -1) {
          // console.log(rule.cssText);
          console.log(rule.style.backgroundImage);
          var oldURL = rule.style.backgroundImage.slice(0);
          var oldURLsplit = oldURL.split('/');
          var oldRel = oldURLsplit[oldURLsplit.length - 2] + '/' + oldURLsplit[oldURLsplit.length - 1];
          oldRel = oldRel.replace('(', '').replace(')', '').replace('"', '');
          var newURL = 'url("' + richBaseURL + oldRel + '")';
          rule.style.backgroundImage = '';
          rule.style.backgroundImage = newURL;
          console.log(rule.style.backgroundImage, newURL);
        }
      }
      resolve()
    })
  };

 var loadPartial = function (url) {
    return new RSVP.Promise(function (resolve, reject) {
      var loadComplete = function (response) {
        console.log('partial loaded');
        return resolve(response);
      };
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          loadComplete(xhr.responseText);
        }
      }.bind(this);
      xhr.send();
    })
  };


  var subloadPartial = function  (container, html) {
    console.log('subloadPartial');
    var loadBackgroundImg = function (target) {
      console.log('load background images');
      var divs = target.querySelectorAll('div');
      var retArray = [];
      for (var i = 0; i < divs.length; i++) {
        var obj = divs[i];
        var imagePath = window.getComputedStyle(obj).getPropertyValue("background-image").match(/http(.*?).(?:jpg|gif|png)/);
        if (imagePath !== null) {
          imagePath = imagePath[0];
          console.log('load background image =', imagePath);
          retArray.push(
            new RSVP.Promise(function (resolve, reject) {
              var img = new Image();
              img.onload = function () {
                console.log('single background loaded');
                resolve()
              }.bind(this);
              img.src = imagePath;
            })
          )
        }
      }
      return RSVP.all(retArray);
    };
    var loadImgTags = function (target) {
      console.log('loadImgTags');
      var retArray = [];
      var divs = target.querySelectorAll('img');
      for (var i = 0; i < divs.length; i++) {
        var item = divs[i].src;
        retArray.push(
          new RSVP.Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
              console.log('single image loaded');
              resolve()
            }.bind(this);
            img.src = item;
          })
        )
      }
      return RSVP.all(retArray);
    };
    return new RSVP.Promise(function (resolve, reject) {
      util.removeChildren(container)
        .then(function () {
          console.log('add html');
          container.innerHTML = html
        })
        .then(function () {
          return RSVP.all([
            loadImgTags(container),
            loadBackgroundImg(container)
          ])
        }) // need to return promise to keep flow going since it is async
        .then(resolve)
    });
  };

  var patchURL= function (text,richBase) {
       var absURL = '';
       absURL = text.replace(/\.\//g, richBase);
       return absURL;
     };

  var loadContent = function  (url, container,richBaseURL) {
      console.log('loadContent');
      container.classList.remove('hidden');
      return loadPartial(url)
        .then(function (value) {
          value = patchURL(value,richBaseURL);
          return subloadPartial(container, value)
        });
    };




  return {
    patchCSS: patchCSS,
    loadContent:loadContent,
    patchURL:patchURL
  }
};
