/**
* TimelineResponse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	timeline: {
		model: 'timelines'
    },
    author: {
    	model: 'user'
    },
    comment: {
      type: 'string'
    },
    comment_image: {
      type: 'string'
    },
    nicer: {
      collection: 'user'
    },
    report: {
      collection: 'TimelineResponseReport',
      via: 'timelineResponse'
    },
    follower: {
      collection: 'user',
    },
  }
};

