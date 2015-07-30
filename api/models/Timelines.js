/**
* Timelines.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    author: {
      model: 'user',
      required: true
    },
    content: {
      type: 'string',
      //required: true
    },
    contentImg: {
      type: 'json',
      //required: true
    },
    response: {
      collection: 'TimelineResponse',
      via: 'timeline'
    },
    responseNum: {
      type: 'string',
      required: true
    },
    clickNum: {
      type: 'string',
      required: true
    },
    nicer: {
      collection: 'user'
    },
    report: {
      collection: 'TimelineReport',
      via: 'timeline'
    },
    auth:{
      type:'string',
    },
    follower: {
      collection: 'user',
    },
  }
};

