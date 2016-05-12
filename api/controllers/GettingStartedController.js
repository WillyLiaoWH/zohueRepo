/**
/**
/**
 * GettingStartedController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {
 	gettingStartedPage: function(req, res){

 		var MobileDetect = require('mobile-detect'),
 		md = new MobileDetect(req.headers['user-agent']);
 		var page="";
 		var m;
 		var css;
 		if (md.mobile()==null){
    	    //PC
    	    page="gettingStarted/index";
    	    css="style";
    	    m="layout";
    	}
    	else{
    	    //mobile
    	    page="gettingStarted/mindex";
    	    css="mStyle";
    	    m="mlayout";
    	}
    	res.view(page, {
    		layout:m,
    		scripts: [
    		'/js/js_gettingStarted/mainJS.js'
    		],
    		stylesheets: [
    		'/styles/css_gettingStarted/'+css+'.css',
    		'/styles/importer.css']
    	});
    }
};