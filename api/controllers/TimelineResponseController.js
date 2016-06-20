/**
 * TimelineResponseController
 *
 * @description :: Server-side logic for managing timelineresponses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {
   leaveCommentTimeline: function(req, res){
    var author=req.session.user.id;
    var comment=req.param("timeline_comment_content");
    var comment_image=req.param("timeline_comment_image");
    var timeline_id=req.param("timeline_id");
    TimelineResponse.create({author: author, comment: comment, comment_image: comment_image, timeline: timeline_id, updatedTime: new Date()}).exec(function(error, response) {
        if(error) {
            res.send(500,{err: "DB Error" });
            console.log(error);
        } else {
            Timelines.find({id: timeline_id}).populate("author").exec(function(err, timeline) {
                if(comment.length>20) {
                    var notContent=comment.substr(0, 20)+"...";
                } else {
                    var notContent=comment;
                }
                for(var i=0; i<timeline[0].follower.length; i++) {
                    if(timeline[0].follower[i]!=req.session.user.id) {
                        Notification.create({user: timeline[0].follower[i], notType: "3", from: req.session.user.id, content: notContent, alreadyRead: false, content: comment, link: "/profile?"+timeline[0].author.id, alreadySeen: false}).exec(function(err, not) {
                            if(err) {
                                console.log(err);
                                res.send({err:"DB error"});
                            }
                        });
                    }
                }
                var follower=timeline[0].follower;
                if(follower.indexOf(author)==-1) {
                    follower.push(author);
                }
                Timelines.update({id: timeline_id}, {follower: follower}).exec(function(err, timelines) {
                    if(err) {
                        console.log(err);
                        res.send({err: "DB error"});
                    } else {
                        res.send('留言成功！');
                    }
                });
            });
                // Articles.update({id: article_id},{lastResponseTime: response.createdAt}).exec(function(err, article) {
                //     if(err) {
                //         res.send(500,{err: "DB Error" });
                //         console.log(err);
                //     } else {
                //         res.send(article);
                //     }
                // });
}
});
},
editCommentTimeline: function(req, res){
    function chechAtuh(id, cb){
        TimelineResponse.find({id: id}).populate('author').exec(function(error, timeline) {
            if(error) {
                res.send(500,{err: "DB Error" });
            } else {
                if(req.session.user.account == timeline[0].author.account){
                    cb();
                }else{res.send("您沒有權限");}
            }
        });
    }
    function edit(TimelineId){
        var edit_content = req.param("edit_content");
        var edit_img = req.param("edit_img");
        TimelineResponse.update({id: TimelineId},{ comment:edit_content, comment_image:edit_img, updatedTime: new Date() }).exec(function(err, timeline) {
            if(err) {
                res.send(500,{err: "DB Error" });
                console.log(err);
            } else {
                    //console.log(timeline);
                    res.send(timeline);
                }
            });
    }
    var TimelineId = req.param("id");
        // 用 call back 先檢查 session 是否有刪除 timeline 之權限
        chechAtuh(TimelineId, function(){
            edit(TimelineId);
        });
    },
    delCommentTimeline: function(req, res){
        function chechAtuh(id, cb){
            TimelineResponse.find({id: id}).populate('author').exec(function(error, timeline) {
                if(error) {
                    res.send(500,{err: "DB Error" });
                } else {
                    if(req.session.user.account == timeline[0].author.account){
                        cb(true);
                    }else{cb(false);}
                }
            });
        }
        function del(isAuth, TimelineId){
            if(isAuth){
                TimelineResponse.destroy({id: TimelineId}).exec(function(err){
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
        var TimelineId = req.param("id");
        // 用 call back 先檢查 session 是否有刪除 timeline 之權限
        chechAtuh(TimelineId, function(isAuth){
            del(isAuth, TimelineId);
        });
    },
    clickNice: function(req, res) {
        if(typeof req.session.user == 'undefined'){
            res.send(500,{err: "您沒有權限" });
        }else{
            var TimelineId = req.param("id");
            var nicer = req.session.user;
            TimelineResponse.findOne(TimelineId).populate('nicer').populate("author").exec(function (err, timeline) {
                timeline.nicer.add(nicer);
                if(timeline.author.id!=req.session.user.id) {
                    if(timeline.comment.length>20) {
                        var notContent=timeline.comment.substr(0, 20)+"...";
                    } else {
                        var notContent=timeline.comment;
                    }
                    Notification.create({user: timeline.author.id, notType: "6", from: req.session.user.id, alreadyRead: false, content: notContent, link: "/profile?"+timeline.author.id, alreadySeen: false}).exec(function(err, not) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        }
                    });
                }
                timeline.save(function (err) { res.send({num:timeline.nicer.length+1}); });
            });
        }
    },
    cancelNice: function(req, res) {
        if(typeof req.session.user == 'undefined'){
            res.send(500,{err: "您沒有權限" });
        }else{
            var TimelineId = req.param("id");
            var nicer = req.session.user.id;
            TimelineResponse.findOne(TimelineId).populate('nicer').exec(function (err, timeline) {
                timeline.nicer.remove(nicer);
                timeline.save(function (err) { res.send({num:timeline.nicer.length-1}); });
            });
        }
    }
};

