/**
* Boards.js
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
    category: {
    	model: 'BoardCategory'
    },
    articles: {
    	collection: 'articles',
    	via: 'board'
    }
  }
};

