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
                    Articles.update({id: article_id},{lastResponseTime: response.createdAt, follower: follower}).exec(function(err, article2) {
                        if(err) {
                            res.send(500,{err: "DB Error" });
                            console.log(err);
                        } else {
                            if(comment.length>20) {
                                var notContent=comment.substr(0, 20)+"...";
                            } else {
                                var notContent=comment;
                            }
                            for(var i=0; i<article2[0].follower.length; i++) {
                                if(article2[0].follower[i]!=req.session.user.id) {
                                    Notification.create({user: article2[0].follower[i], notType: "1", from: req.session.user.id, content: notContent, alreadyRead: false, link: "/article/"+article_id, alreadySeen: false}).exec(function(err, not) {
                                        if(err) {
                                            console.log(err);
                                            res.send({err:"DB error"});
                                        }
                                    });
                                }
                            }
                            res.send(article2);
                        }
                    });
                });
            }
        });
	},


    editCommentArticle: function(req, res){
        function chechAtuh(id, cb){
            Response.find({id: id}).populate('author').exec(function(error, response) {
                if(error) {
                    res.send(500,{err: "DB Error" });
                } else {
                    if(req.session.user.account == response[0].author.account){
                        cb();
                    }else{res.send("您沒有權限");}
                }
            });
        }
        function edit(responseId){
            var edit_content = req.param("edit_content");
            var edit_img = req.param("edit_img");
            Response.update({id: responseId},{ comment:edit_content, comment_image:edit_img, updatedTime: new Date() }).exec(function(err, response) {
                if(err) {
                    res.send(500,{err: "DB Error" });
                    console.log(err);
                } else {
                    //console.log(timeline);
                    res.send(response);
                }
            });
        }
        var responseId = req.param("id");
        // 用 call back 先檢查 session 是否有刪除 timeline 之權限
        chechAtuh(responseId, function(){
            edit(responseId);
        });
    },
    delCommentArticle: function(req, res){
        function chechAtuh(id, cb){
            Response.find({id: id}).populate('author').exec(function(error, response) {
                if(error) {
                    res.send(500,{err: "DB Error" });
                } else {
                    if(req.session.user.account == response[0].author.account){
                        cb(true);
                    }else{cb(false);}
                }
            });
        }
        function del(isAuth, responseId){
            if(isAuth){
                Response.destroy({id: responseId}).exec(function(err){
                    if(err) {
                        res.send(500,{err: "DB Error" });
                    } else {
                        res.send('文章刪除成功！');
                    }
                });
            }else{
                res.send("您沒有權限");
            }
        }
        var responseId = req.param("id");
        // 用 call back 先檢查 session 是否有刪除 timeline 之權限
        chechAtuh(responseId, function(isAuth){
            del(isAuth, responseId);
        });
    }

};

