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
		TimelineResponse.create({author: author, comment: comment, comment_image: comment_image, timeline: timeline_id}).exec(function(error, response) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
            	res.send('留言成功！');
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
                res.send("No permission");
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
            TimelineResponse.findOne(TimelineId).populate('nicer').exec(function (err, timeline) {
                timeline.nicer.add(nicer);
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

