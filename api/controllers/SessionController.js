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

	create: function(req, res, next){
		alert("create session!");

		// if(!req.param('email') || !req.param('password')) {

		// }

		// User.findOneByEmail(req.param('email', function foundUser(err, user){
		// 	if (err)  return next(err);

		// 	if(!user){
		// 		var noAccountError=[{name: 'noAccount', message: 'error'}]
		// 		req.session.flash={
		// 			err: noAccountError
		// 		}
		// 		res.redirect('/session/new');
		// 		return;
		// 	}

		// 	bcrypt.compare(req.param('password', user.encryptedPassword, function(err,valid){
		// 		if (err)  return next(err);

		// 		if(!valid){
		// 			var usernamePasswordMismatchError=[{name: 'usernamePasswordMismatchError', message:"not match"}]
		// 		}	req.session.flash={
		// 			err: usernamePasswordMismatchError
		// 		}
		// 		res.redirect('/session/user/');
		// 		return;
		// 	}
		// 	req.session.authenticated=true;
		// 	req.session.User=User;
		// 	res.redirect('/user/show/')+user.id;
		// 	));
		// }));



	}
};

