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
        if(req.session.user.id) {
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

    seeNotification: function(req, res) {
        var id=req.session.user.id;
        Notification.update({alreadySeen: false, user:id}, {alreadySeen: true}).exec(function(err, not){
            if(err) {
                console.log(err);
                res.send(500, {err: "DB error"});
            } else {
                res.send("成功");
            }
        });
    }
};

