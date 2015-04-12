/**
* User.js
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
    password: {
      type: 'string',
      required: true
    },
    alias: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      // required: true
    },
    isFullSignup: {
      type: 'boolean',
      required: true
    },
    fname: {
      type: 'string',
    },
    lname: {
      type: 'string',
    },
    img: {
      type: 'string',
    },
    forgetQ: {
      type: 'string',
    },
    forgetA: {
      type: 'string',
    },
    gender: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
    addressCity: {
      type: 'string',
    },
    addressDistrict: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    birthday: {
      type: 'string',
    },
    primaryDisease: {
      type: 'string',
    },
    selfIntroduction: {
      type: 'string',
    },
    articlesPost: {
      collection: 'articles',
      via: 'author'
    },
    reponsesLeave: {
      collection: 'response',
      via: 'author'
    },
    FBmail:{
      type:'string'
    },
    friends:{
      collection: 'user'
    },
    unconfirmedFriends:{
      collection: 'user'
    },
    sentAddFriends:{
      collection: 'user'
    },
    blackList:{
      collection: 'user'
    }
  }
};