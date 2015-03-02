/**
* FullSignup.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	account: {
  		type: 'string',
  		unique: true,
  		required: true
  	},
  	fname: {
  		type: 'string'
  	},
  	lname: {
  		type: 'string'
  	}, 
  	img: {
  		type: 'string'
  	}, 
    forgetQ: {
    	type: 'string'
    },
    forgetA: {
    	type: 'string'
    }, 
   	gender: {
   		type: 'string'
   	}, 
   	phone: {
   		type: 'string'
   	},
   	addressCity: {
   		type: 'string'
   	},
    addressDistrict: {
    	type: 'string'
    },
    address: {
    	type: 'string'
    },
    birthday: {
    	type: 'string'
    },
    primaryDisease: {
      type: 'string'
    },
    selfIntroduction: {
    	type: 'string'
    },
    postalCode: {
    	type: 'string'
    }
  }
};

