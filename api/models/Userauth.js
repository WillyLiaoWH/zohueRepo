/**
* Userauth.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	user : {
  		model : "User",
  		required: true
  	},
  	city :{
  		type: "string",
  	},
  	email:{
  		type: "string",
  	},
  	gneder:{
  		type:"string",
  	},
  	phone:{
  		type:"string",
  	},
  	bday:{
  		type:"string",
  	}

  }
};

