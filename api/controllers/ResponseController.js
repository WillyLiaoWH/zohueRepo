/**
 * ResponseController
 *
 * @description :: Server-side logic for managing responses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	leaveComment: function(req, res){
		var author=req.session.user.id;
		var comment=req.param("comment");
        var comment_image=req.param("comment_image");
		var article_id=req.param("article_id");
		Response.create({author: author, comment: comment, comment_image: comment_image, article: article_id}).exec(function(error, response) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                Articles.find({id: article_id}).exec(function(err, article) {
                    var follower=article[0].follower;
                    if(follower.indexOf(req.session.user.id)==-1) {
                        follower.push(req.session.user.id);
                    }
                    Articles.update({id: article_id},{lastResponseTime: response.createdAt, follower: follower}).exec(function(err, article) {
                        if(err) {
                            res.send(500,{err: "DB Error" });
                            console.log(err);
                        } else {
                            for(var i=0; i<article[0].follower.length; i++) {
                                if(article[0].follower[i]!=req.session.user.id) {
                                    Notification.create({user: article[0].follower[i], notType: "1", from: req.session.user.id, content: comment, alreadyRead: false}).exec(function(err, not) {
                                        if(err) {
                                            console.log(err);
                                            res.send({err:"DB error"});
                                        }
                                    });
                                }
                            }
                            res.send(article);
                        }
                    });
                });
            }
        });
	},
	updateResponseNum: function(req, res){
		var articleId = req.param("id");
        var responseNum = req.param("responseNum");
        Articles.update({id: articleId}, {responseNum: responseNum}).exec(function(error, updated) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } 
        });
	},
};

