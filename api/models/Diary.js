/**
* Diary.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	date:{
  		type:"date",
  		required:true
  	},
  	weight:{
  		type:"integer"
  	},
  	memo:{
  		type:"string"
  	},
    //收縮壓
  	squbloodPresure:{
  		type:"integer"
  	},
    //舒張壓
    bloodPresure:{
      type:"integer"
    },
  	author:{
  		model:"User"
  	}
  }
};

