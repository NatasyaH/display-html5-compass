'use strict';





module.exports = function (kit) {

  if (kit === 'DC') {

    return require ('./DC')()
  }

  if (kit === 'FT') {

    //return require ('./FT')()
  }
};