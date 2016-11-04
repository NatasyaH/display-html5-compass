'use strict';
module.exports = function () {
  var getRichBase = function (baseURL) {
    var arr = baseURL.split('/');
    // named folder of base

    var richFolder = myFT.getManifest ('richLoads')[0].src;
    // if local testing just return base URL
    var cid = myFT.get("cID");
    var dom = myFT.get("serveDOM");
    var base = window.location.href.split(cid)[0];


    if (myFT.testMode === true) {
      return baseURL.slice(0);
    }
    if (myFT.get("serveDOM") === "") {

      return base+cid+'/richLoads'+'/'+richFolder;

    } else {
      //path to richloads on CDN
      return base+cid+'/'+richFolder;
    }
  };
  return {
    getRichBase: getRichBase
  }
};