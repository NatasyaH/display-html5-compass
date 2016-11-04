'use strict';
module.exports = function () {
  var getRichBase = function (baseURL) {
    var arr = baseURL.split('/');
    // named folder of base
    var richFolder = myFT.getManifest('richLoads')[0].src;
    // if local testing just return base URL
    var cid = myFT.get("cID");
    var dom = myFT.get("serveDOM");
    var base = window.location.href.split(cid)[0];
    console.log(baseURL);
    console.log(richFolder);
    console.log(cid);
    console.log(dom);
    console.log(base);
    var ret = '';
    if (myFT.testMode === true) {
      ret = baseURL.slice(0);
      return ret
    }
    if (dom === "") {
      ret = base + cid + '/richLoads' + '/' + richFolder+'/';
      return ret
    } else {
      //path to richloads on CDN
      ret = base + cid + '/' + richFolder+'/';
      return ret
    }
  };
  return {
    getRichBase: getRichBase
  }
};