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
		// var account = req.session.user.account;

		// // notes: 未來可能需要用到.skip(10).limit(10)
		// User.find({account: account}).populate('timelinesPost', { sort: 'updatedAt DESC' }).exec(function(err, result) {
		// 	if (err) {
  //           	res.send(500, { err: "DB Error" });
  //       	} else {
  //       		res.send({timelinesList: result[0].timelinesPost, avatar: req.session.user.img});
  //           }
		// });




        var account = req.session.user.account;
        // notes: 未來可能需要用到.skip(10).limit(10)
        User.find({account: account}).populate('timelinesPost', { sort: 'updatedAt DESC' }).exec(function (err, user) {
            if(err) {
                sails.log.error("ERR:", err);
            }
            sails.services['util'].populateDeep('user', user[0], 'timelinesPost.response', function (err, result) {
                if (err) {
                    sails.log.error("ERR:", err);
                }else {
                    res.send({timelinesList: result.timelinesPost, avatar: req.session.user.img});
                }
            });
        });

        // var account = req.session.user.account;
        // // notes: 未來可能需要用到.skip(10).limit(10)
        // User.find({account: account}).populate('timelinesPost', { sort: 'updatedAt DESC' }).exec(function (err, user) {
        //     if(err) {
        //         sails.log.error("ERR:", err);
        //     }
        //     sails.services['util'].populateDeep('user', user[0], 'timelinesPost.response', function (err, result) {
        //         if (err) {
        //             sails.log.error("ERR:", err);
        //         }else {
        //             sails.services['util'].populateDeep('timelines', result[0], 'response.author', function (err, result2) {
        //                 if (err) {
        //                     sails.log.error("ERR:", err);
        //                 }else {
        //                     res.send({timelinesList: result2.timelinesPost, avatar: req.session.user.img});
        //                 }
        //             });
        //         }
        //     });
        // });
	}
};

