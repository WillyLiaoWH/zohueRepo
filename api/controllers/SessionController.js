/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {
 	checkAuth: function(req, res) {
 		if(req.session.authenticated) {
			// var oldDateObj = new Date();
			// var newDateObj = new Date(oldDateObj.getTime()+6000);
			// req.session.cookie.expires = newDateObj;
			res.send(req.session.user);
		} else {
			res.send(false);
		}
	},

	checkPostAuth: function(req, res) {
		if(req.session.authenticated) {
			var board = req.param("board");
			var MobileDetect = require('mobile-detect'),
			md = new MobileDetect(req.headers['user-agent']);
			var css;
			if (md.mobile()==null){
                //PC
                css="style";
                page = "post/index";
                m="layout";
                
            }
            else{
                //mobile
                page="post/mindex";
                m="mlayout";
                css="mStyle";
            }

            Boards.find(board).exec(function(err, boards) {
	        	if(err || boards.length<1) { // 不存在 board 或有其他錯誤
	            	res.redirect('/home');
	            } else {
		            if(req.session.user.isAdmin==false && (board==17 || board==18 || board==21) ){ // 不是是管理員, 且進入一般人無法發表文章之 board
		            	res.redirect('/home');
		            }else{
		            	return res.view(page, {
		            		layout:m,
		            		scripts: [
		            		'/js/js_post/mainJS.js',
		            		'/js/js_post/cropper.min.js',
		            		'/js/js_post/crop-avatar.js',
		            		'/js/js_public/alertify.js'
		            		],
		            		stylesheets: [
		            		'/styles/css_post/'+css+'.css',
		            		'/styles/css_post/crop-avatar.css',
		            		'/styles/css_post/cropper.min.css',
		            		'/styles/importer.css'
		            		]
		            	});
		            }
		        }
		    });
                } else {
                	res.redirect('/home');
                }
            },

            create: function(req, res, next){
            	alert("create session!");
            }
        };