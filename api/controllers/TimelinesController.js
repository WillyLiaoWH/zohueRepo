/**
 * TimelinesController
 *
 * @description :: Server-side logic for managing timelines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    auth_set:function(req,res){
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
        function set(isAuth ,id,target){
            if(isAuth){
                Timelines.update({id:id},{auth:target}).exec(function(err,timeline){
                    if(err){
                        res.send(500,{err:"DB error"})
                    }
                    else{
                        var name;
                        if (target=="all")
                            name="全部人";
                        else if(target=="doctor")
                            name="醫生";
                        else if(target=="friend")
                            name="朋友";
                        else
                            name="自己";
                        res.send("已經改為"+target+"看得到");
                    }
                });
            }
            else{
                res.send("No permission");
            }
        }
        var id = req.param("id");
        var target = req.param("target");
        chechAtuh(id, function(isAuth){
            set(isAuth, id,target);
        });
          
    },
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
    editTimeline: function(req, res){
        function chechAtuh(id, cb){
            Timelines.find({id: id}).populate('author').exec(function(error, timeline) {
                if(error) {
                    res.send(500,{err: "DB Error" });
                } else {
                    if(req.session.user.account == timeline[0].author.account){
                        cb();
                    }else{res.send("No permission");}
                }
            });
        }
        function edit(TimelineId){
            var edit_content = req.param("edit_content");
            var edit_img = req.param("edit_img");
            Timelines.update({id: TimelineId},{ content:edit_content, contentImg:edit_img }).exec(function(err, timeline) {
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
        function checkLogin(cb){ // 檢查是否登入
            if(req.session.user === 'undefined' & req.param("account") === 'undefined'){
                res.send(500,{err: "DB Error" });
            }else{
                cb();
            }
        }

        function findAccount(cb){ // 取出欲瀏覽 profile 頁面的作者帳號
            var account = req.param("account");
            if(account === 'undefined'){
                var account = req.session.user.account;
            }
            cb(account);
        }

        function findTimelineResponse(account, cb){ // 取得作者 user 資料
            // notes: 未來可能需要用到.skip(10).limit(10)
            User.find({account: account}).populate('timelinesPost', { sort: 'updatedAt DESC' }).exec(function (err, user) {
                if(err) {
                    sails.log.error("ERR:", err);
                    console.log("err1");
                }
                cb(user[0]);
                // sails.services['util'].populateDeep('user', user[0], 'timelinesPost.response', function (err, result) {
                //     if (err) {
                //         sails.log.error("ERR:", err);
                //         console.log("err2");
                //     }else {
                //          cb(result);
                //     }
                // });
            });
        }

        function getNicer(User, cb){ // 取得 user 每篇 timelinesPost 的 response 與 nicer 資料
            var async = require('async');
            async.each(User.timelinesPost, function(timeline, callback) {
                Timelines.find(timeline.id).populate('nicer', {select: ['id']}).populate('response').exec(function (err, result) {
                    if(err) {
                        console.log("err");
                    }else{
                        var i=User.timelinesPost.indexOf(timeline);
                        User.timelinesPost[i]=result[0];
                        if(User.timelinesPost.length==i+1){cb(User);}
                    }
                });
            });
        }

        function addAuth(account,result,cb){ // 阿波寫的 問他XD
            var doctor=false;
            var friend=false;
            var self=false;
            var viewer = req.session.user.account;

            User.find({account:viewer}).populate('friends').exec(function(err,user){
                if(err){
                    console.log("err3");
                }
                if (user[0].type=="D"){
                    doctor=true;
                }
                for (var i=0 ; i<user[0].friends.length;i=i+1){
                    if (user[0].friends[i].account==account)
                        friend=true;
                }
            });

            if (viewer==account){
                self=true;
                friend=true;
                doctor=true;
            }
            var len=result.timelinesPost.length;
            for (var i=len-1;i>=0;i=i-1){
                if (result.timelinesPost[i].auth==="self"){
                    if (!self){
                        console.log("not self: "+JSON.stringify(result.timelinesPost[i]));
                        result.timelinesPost.splice(i,1);
                    }
                                
                } 
                else if (result.timelinesPost[i].auth==="doctor"){
                    if (!doctor){
                        console.log("not doctor: "+JSON.stringify(result.timelinesPost[i]));
                        result.timelinesPost.splice(i,1);
                    }
                } 
                else if (result.timelinesPost[i].auth==="friend" ){
                    if(!friend){
                        console.log("not friend: "+JSON.stringify(result.timelinesPost[i]));
                        result.timelinesPost.splice(i,1);
                    }
                }
            }
            cb(result);
        }

        function AuthorQuery(timelineRes, cb){
            TimelineResponse.find(timelineRes.id).populate('author').populate('nicer', {select: ['id']}).exec(function (err, result2) {
                if(err) {
                    console.log("err");
                }else{
                    cb(result2[0].author.alias, result2[0].author.img, result2[0].author.account, result2[0].nicer);
                }
            });
        }

        function findTimelineResponseAuthor(Response, cb){ // 取得 user 中每篇 timelinePost 中每則 response 的 author
            var async = require('async');

            setTimeout(function() { // 一秒後如果沒有 call back，表示最後一個 timeline 且無留言
                cb(Response);
            }, 500);

            async.each(Response.timelinesPost, function(timeline, callback) {
                async.each(timeline.response, function(timelineRes, callback2) {
                    AuthorQuery(timelineRes, function(alias, img, account, nicer){
                        var i=Response.timelinesPost.indexOf(timeline);
                        var j=timeline.response.indexOf(timelineRes);
                        Response.timelinesPost[i].response[j].account=account;
                        Response.timelinesPost[i].response[j].alias=alias;
                        Response.timelinesPost[i].response[j].img=img;
                        Response.timelinesPost[i].response[j].rnicer=nicer;

                        // 最後一個 timeline 且最後一個留言
                        if(Response.timelinesPost.length==i+1 & Response.timelinesPost[i].response.length==j+1){cb(Response);}
                    });
                });
            });
        }

        checkLogin(function(){
            findAccount(function(account){
                findTimelineResponse(account, function(Response){
                    getNicer(Response, function(Response2){
                        addAuth(account, Response2, function(Response3){
                            findTimelineResponseAuthor(Response3, function(Response4){
                                res.send({timelinesList: Response4.timelinesPost, avatar: Response.img, alias: Response.alias, account: Response.account});
                            });
                        });
                    });
                });
            });
        });
	},
    clickNice: function(req, res) {
        if(typeof req.session.user == 'undefined'){
            res.send(500,{err: "您沒有權限" });
        }else{
            var TimelineId = req.param("id");
            var nicer = req.session.user;
            Timelines.findOne(TimelineId).populate('nicer').exec(function (err, timeline) {
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
            Timelines.findOne(TimelineId).populate('nicer').exec(function (err, timeline) {
                timeline.nicer.remove(nicer);
                timeline.save(function (err) { res.send({num:timeline.nicer.length-1}); });
            });
        }
    }
};

