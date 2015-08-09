/**
* Notification.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	user: {
  		model: 'user',
  	},
  	notType: {
  		type: 'string',
  	},
  	/*
  		1: 追蹤的文章有留言
  		2: 追蹤的文章有按讚
  		3: 動態有留言
  		4: 動態有按讚
  		5: 文章的留言有按讚
  		6: 動態的留言有按讚
  		7: 有人加你好友
  		8: 已經成為好友
  	*/
  	from: {
  		model: 'user',
  	},
  	content: {
  		type: 'string',
  	},
  	alreadyRead: {
  		type: 'boolean',
  	},
    alreadySeen: {
      type: 'boolean',
    },
    link: {
      type: 'string',
    },
  }
};

