/**
* Response.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    article: {
		  model: 'articles'
    },
    author: {
    	model: 'user'
    },
    comment: {
      type: 'string',
      required: true
    },
    comment_image: {
      type: 'string'
    },
    nicer: {
      collection: 'user'
    }
  }
};

