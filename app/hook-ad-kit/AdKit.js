'use strict';
var AdKit = function (kit) {
  var ret = {};
  var mapToObject = function (source, target) {
    var props = Object.getOwnPropertyNames(source);
    for (var i = 0; i < props.length; i++) {
      target[props[i]] = source[props[i]];
    }
  };

  mapToObject(require('./loading')(), ret);

  if (kit === AdKit.DC) {
    mapToObject(require('./state/DC')(), ret);
    mapToObject(require('./loading/url/DC')(), ret);

  }
  if (kit === AdKit.FT) {
    mapToObject(require('./state/FT')(), ret);
        mapToObject(require('./loading/url/FT')(), ret);

  }
  return ret;
};
AdKit.DC = "DC";
AdKit.FT = "FlashTalking";
module.exports = AdKit;