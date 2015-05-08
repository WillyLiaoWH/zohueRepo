/**
 * TimelinesController
 *
 * @description :: Server-side logic for managing timelines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	postTimeline: function(req, res){
		var author=req.session.user.id;
		var content=req.param("timeline_post_content");
		var contentImg=req.param("timeline_post_image");
		if(content.trim()=="" & contentImg.trim()==""){res.send(500,{err: "DB Error" });};

		Timelines.create({author: author, content: content, contentImg: contentImg, responseNum: "0", clickNum: "0"}).exec(function(error, timeline) {
            if(error) {
                res.send(500,{err: "DB Error" });
            } else {
                res.send(timeline);
                // Timelines.update({id: timeline.id},{lastResponseTime: timeline.updatedAt}).exec(function(err, timeline) {
                //     if(err) {
                //         res.send(500,{err: "DB Error" });
                //         console.log(err);
                //     } else {
                //         console.log(timeline);
                //         res.send(timeline);
                //     }
                // });
            }
        });
	},
    delTimeline: function(req, res){
        function chechAtuh(id, cb){
            Timelines.find({id: id}).populate('author').exec(function(error, timeline) {
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
                Timelines.destroy({id: TimelineId}).exec(function(err){
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
	setTimelinePage: function(req, res){
        var d = new Date().getTime();
        function checkLogin(cb){
            if(req.session.user === 'undefined' & req.param("account") === 'undefined'){
                res.send(500,{err: "DB Error" });
            }else{
                cb();
            }
        }

        function findAccount(cb){
            var account = req.param("account");
            if(account === 'undefined'){
                var account = req.session.user.account;
            }
            cb(account);
        }

        function findTimeline(account, cb){
            // notes: 未來可能需要用到.skip(10).limit(10)
            User.find({account: account}).populate('timelinesPost', { sort: 'updatedAt DESC' }).exec(function (err, user) {
                if(err) {
                    sails.log.error("ERR:", err);
                    console.log("err1");
                }
                sails.services['util'].populateDeep('user', user[0], 'timelinesPost.response', function (err, result) {
                    if (err) {
                        sails.log.error("ERR:", err);
                        console.log("err2");
                    }else {
                        cb(result);
                    }
                });
            });
        }

        function findTimelineResponse(user, cb){
            var async = require('async');
            async.each(user.timelinesPost, function(timeline, callback) {
                Timelines.find(timeline.id).populate('response', { sort: 'updatedAt DESC' }).exec(function (err, response) {
                    var i=user.timelinesPost.indexOf(timeline);
                    user.timelinesPost[i]=response[0];
                    if(i+1==user.timelinesPost.length){cb(user);}
                });
            });
        }

        function AuthorQuery(timelineRes, cb){
            TimelineResponse.find(timelineRes.id).populate('author').exec(function (err, result2) {
                if(err) {
                    console.log("err");
                }else{
                    cb(result2[0].author.alias, result2[0].author.img);
                }
            });
        }

        function findTimelineResponseAuthor(Response, cb){
            var async = require('async');

            setTimeout(function() { // 一秒後如果沒有 call back，表示最後一個 timeline 且無留言
                cb(Response);
            }, 500);

            async.each(Response.timelinesPost, function(timeline, callback) {
                async.each(timeline.response, function(timelineRes, callback2) {
                    AuthorQuery(timelineRes, function(alias, img){
                        var i=Response.timelinesPost.indexOf(timeline);
                        var j=timeline.response.indexOf(timelineRes);
                        Response.timelinesPost[i].response[j].alias=alias;
                        Response.timelinesPost[i].response[j].img=img;

                        // 最後一個 timeline 且最後一個留言
                        if(Response.timelinesPost.length==i+1 & Response.timelinesPost[i].response.length==j+1){cb(Response);}
                    });
                });
            });
        }

        checkLogin(function(){
            findAccount(function(account){
                findTimeline(account, function(Timeline){
                    findTimelineResponse(Timeline, function(TimelineResponse){
                        findTimelineResponseAuthor(TimelineResponse, function(TimelineResponseAuthor){
                            var n = new Date().getTime();
                            console.log(n-d);
                            res.send({timelinesList: TimelineResponseAuthor.timelinesPost, avatar: Response.img, alias: Response.alias});
                        });
                    });
                });
            });
        });
	}
};

