/**
/**
/**
 * GettingStartedController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	changePasswordPage: function(req, res){

 		var MobileDetect = require('mobile-detect'),
 		md = new MobileDetect(req.headers['user-agent']);
 		var page="";
 		var m;
 		var css;
 		if (md.mobile()==null){
    	    //PC
    	    page="changePassword/index";
    	    css="style";
    	    m="layout";
    	}
    	else{
    	    //mobile
    	    page="changePassword/mindex";
    	    css="mStyle";
    	    m="mlayout";
    	}
    	res.view(page, {
    		layout:m,
    		scripts: [
    		'/js/js_changePassword/mainJS.js'
    		],
    		stylesheets: [
    		'/styles/css_changePassword/'+css+'.css',
    		'/styles/importer.css']
    	});
    }
};