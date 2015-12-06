/**
 * NotificationController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getNotification: function(req, res) {
        var user=req.session.user.id;
        Notification.find({user: user}).populate("from").exec(function(err, not){
        	if(err) {
        		console.log(err);
        		res.send(500, {err: "DB error"});
        	} else {
                not.sort(function(a, b){return new Date(b.createdAt)-new Date(a.createdAt);});
        		// if(not.length>=10) {
        		// 	res.send(not.slice(0, 10));
        		// } else {
        			res.send(not);
        		// }
        		
        	}
        });
    },

    checkNotification: function(req, res) {
        var id=req.param("id");
        console.log(id);
        Notification.update({id: id}, {alreadyRead: true, alreadySeen: true}).exec(function(err, not) {
            if(err) {
                console.log(err);
                res.send(500, {err: "DB error"});
            } else {
                res.send("成功");
            }
        });
    },

    countNotification: function(req, res) {
        if(req.session.user) {
            var id=req.session.user.id;
            Notification.find({user: id, alreadySeen: false}).exec(function(err, not){
                if(err) {
                    console.log(err);
                    res.send(500, {err: "DB error"});
                } else {
                    res.send({num: not.length});
                }
            });
        }
    },

    // seeNotification: function(req, res) {
    //     if(req.session.user) {
    //         var id=req.session.user.id;
    //         Notification.update({alreadySeen: false, user:id}, {alreadySeen: true}).exec(function(err, not){
    //             if(err) {
    //                 console.log(err);
    //                 res.send(500, {err: "DB error"});
    //             } else {
    //                 res.send("成功");
    //             }
    //         });
    //     }
    // },

    // getNotification: function(req, res) {
    //     var user=req.session.user.id;
    //     Notification.find({user: user}).populate("from").exec(function(err, not){
    //         if(err) {
    //             console.log(err);
    //             res.send(500, {err: "DB error"});
    //         } else {
    //             not.sort(function(a, b){return new Date(b.createdAt)-new Date(a.createdAt);});
    //             // if(not.length>=10) {
    //             //  res.send(not.slice(0, 10));
    //             // } else {
    //                 res.send(not);
    //             // }
                
    //         }
    //     });
    // },

    setNotificationPage: function(req, res) {
        if(req.session.authenticated) {
            var id=req.session.user.id;
            Notification.update({alreadySeen: false, user:id}, {alreadySeen: true}).exec(function(err, not){
                if(err) {
                    console.log(err);
                    res.send(500, {err: "DB error"});
                } else {
                    Notification.find({user: id}).populate("from").exec(function(err, not){
                        if(err) {
                            console.log(err);
                            res.send(500, {err: "DB error"});
                        } else {
                            not.sort(function(a, b){return new Date(b.createdAt)-new Date(a.createdAt);});
                            // if(not.length>=10) {
                            //  res.send(not.slice(0, 10));
                            // } else {
                            res.view("notifications/index", {
                                not: not,
                                scripts: [
                                    '/js/js_public/modalBox.js-master/modalBox-min.js',
                                    '/js/js_public/alertify.js',
                                    '/js/js_notifications/mainJS.js'
                                  ],
                                stylesheets: [
                                    '/styles/importer.css',
                                    '/styles/css_public/themes/alertify.core.css',
                                    '/styles/css_public/themes/alertify.default.css',
                                    '/styles/css_notifications/style.css'
                                  ]
                             });
                            // }
                            
                        }
                     });
                }
            });
        }else {
            res.send(false);
        }
    },


};

