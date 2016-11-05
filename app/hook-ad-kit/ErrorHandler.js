'use strict';
var ErrorStackParser = require('error-stack-parser');
var StackTraceGPS = require('stacktrace-gps');
var bowser = require('bowser');
var RSVP = require('rsvp');
module.exports = function (reason, label) {
    console.warn('ERROR');
    if (label) {
      console.error(label);
    }
    var parsed = ErrorStackParser.parse(reason);
    var lastFrame = parsed[0];
    console.log('FULL STACK');
    console.log(parsed);
    console.log('ERROR END POINT');
    console.log(parsed[0]);
    var callback = function myCallback(foundFunctionName) {
      console.log(foundFunctionName);
    };
    var errback = function myErrback(error) {
      console.log(StackTrace.fromError(error));
    };
    if (bowser.check({msie: "11"}, true) === false && bowser.check({msie: "10"}, true) === false) {
      var gps = new StackTraceGPS();
      RSVP.all([
        gps.pinpoint(lastFrame).then(callback, errback),
        gps.getMappedLocation(lastFrame).then(callback, errback),
        gps.findFunctionName(lastFrame).then(callback, errback)
      ]).then(function () {
        console.assert(false, reason);
      })
    } else {
      console.assert(false, reason);
    }
  };