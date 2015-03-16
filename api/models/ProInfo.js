/**
* ProInfo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	title: {
      type: 'string',
      required: true
    },
    author: {
      type: 'string',
      required: true
    },
    link: {
      type: 'string',
      required: true
    },
    classification: {
      type: 'string',
      required: true
    },
    cancerType: {
      type: 'string',
      required: true
    },
    note: {
      type: 'string',
    },
    date: {
      type: 'string',
      required: true
    }
  }
};

