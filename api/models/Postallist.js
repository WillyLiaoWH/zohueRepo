/**
* Postallist.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	postalcode: {
      type: 'string',
      required: true
    },
    addressCity: {
      type: 'string',
      required: true
    },
    addressDistrict: {
      type: 'string',
      required: true
    },
  }
};

