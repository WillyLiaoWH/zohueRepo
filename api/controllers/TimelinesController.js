/**
 * TimelinesController
 *
 * @description :: Server-side logic for managing timelines
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var async = require('async');
module.exports = {
    setProfilePage: function(req, res){
        var url = require('url');
        var searchID = url.parse(req.url, true).search.substring(1);

        function checkLogin(cb){ // 檢查是否登入
            if(typeof req.session.user === 'undefined' && searchID == ""){
                //res.send(500,{err: "請先登入才能查看個人頁面！" });
                res.redirect("/home");
            }else if(searchID == 'undefined'){
            }else{ // 防止此問題: jquery-ui 可能會讓使用到 crop-avatar.js 的頁面執行兩次頁面讀取
                cb();
            }
        }

        function findId(cb){ // 找出要看 timeline page 的 user id
            var id = searchID;
            if(id == ''){
                var id = req.session.user.id;
            }
            Record.create({user:req.session.user,ip:req.ip,action:("PROF "+id)}).exec(function(ret){
                console.log("動態時報"+id)
            })
            cb(id);
        }

        function findTimelineResponse(id, cb){ // 取得作者 user 資料
            // notes: 未來可能需要用到.skip(10).limit(10)
            User.find({id: id}).populate('timelinesPost', { sort: 'updatedTime DESC' }).exec(function (err, user) {
                if(user.length < 1 ){
                    res.send(500,{err: "查無此人" });
                }else{
                    if(err) {
                        sails.log.error("ERR:", err);
                    }else{
                        user.sort(function(a, b){return new Date(b.updatedTime)-new Date(a.updatedTime);});
                        cb(user[0]);
                    }
                }
            });
        }

        function getNicer(User, cb){ // 取得 user 每篇 timelinesPost 的 response、nicer 與 reporter 資料
            var async = require('async');
            if(User.timelinesPost.length < 1){
                cb(User);
            }
            async.each(User.timelinesPost, function(timeline, callback) {
                Timelines.find(timeline.id).populate('nicer', {select: ['id']}).populate('response').populate('report', {select: ['reporter']}).populate('owner', {select: ['img', 'alias', 'account','id']}).exec(function (err, result) {
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

        function addAuth(id,result,cb){ // 阿波寫的 問他XD  //大家好我是阿波，這是去把不該看到的刪掉
            if(typeof req.session.user === 'undefined'){
                cb(result);
            }else{
                var doctor=false;
                var friend=false;
                var self=false;
                var viewer = req.session.user.id;

                User.find({id:viewer}).populate('friends').exec(function(err,user){
                    if(err){
                        console.log("err3");
                    }
                    if (user[0].type=="D"){
                        doctor=true;
                    }
                    for (var i=0 ; i<user[0].friends.length;i=i+1){
                        if (user[0].friends[i].id===id){
                            friend=true;
                        }
                    }

                    if (viewer==id){
                        self=true;
                        friend=true;
                        doctor=true;
                    }
                    var len=result.timelinesPost.length;
                    for (var i=len-1;i>=0;i=i-1){
                        if (result.timelinesPost[i].auth==="self"){
                            if (!self){
                                //console.log("not self: "+JSON.stringify(result.timelinesPost[i]));
                                result.timelinesPost.splice(i,1);
                            }        
                        } 
                        else if (result.timelinesPost[i].auth==="doctor"){
                            if (!doctor){
                                //console.log("not doctor: "+JSON.stringify(result.timelinesPost[i]));
                                result.timelinesPost.splice(i,1);
                            }
                        } 
                        else if (result.timelinesPost[i].auth==="friend" ){
                            if(!friend){
                               // console.log("not friend: "+JSON.stringify(result.timelinesPost[i]));
                                result.timelinesPost.splice(i,1);
                            }
                        }
                    }
                    cb(result);
                });
            }
        }

        function AuthorQuery(timelineRes, cb){ // 找出某篇 timeline 留言的作者、nicer、reporter 等等
            TimelineResponse.find(timelineRes.id).populate('author').populate('nicer', {select: ['id']}).populate('report', {select: ['reporter']}).exec(function (err, result2) {
                if(err) {
                    console.log("err");
                }else{
                    cb(result2[0].author.alias, result2[0].author.img, result2[0].id, result2[0].nicer, result2[0].report);
                }
            });
        }

        function findTimelineResponseAuthor(Response, cb){ // 取得 user 中每篇 timelinePost 中每則 response 的 author
            if(Response.timelinesPost.length < 1){
                cb(Response);
            }
            async.each(Response.timelinesPost, function(timeline, callback) {
                var i=Response.timelinesPost.indexOf(timeline);
                if(timeline.response.length > 0){
                    async.each(timeline.response, function(timelineRes, callback2) {
                        AuthorQuery(timelineRes, function(alias, img, id, nicer, report){
                            
                            var j=timeline.response.indexOf(timelineRes);
                            Response.timelinesPost[i].response[j].id=id;
                            Response.timelinesPost[i].response[j].alias=alias;
                            Response.timelinesPost[i].response[j].img=img;
                            Response.timelinesPost[i].response[j].rnicer=nicer;
                            Response.timelinesPost[i].response[j].rreporter=report;

                            // 最後一個 timeline 且最後一個留言
                            if(Response.timelinesPost.length==i+1 & Response.timelinesPost[i].response.length==j+1){cb(Response);}
                        });
                    });
                }else{
                    if(Response.timelinesPost.length==i+1){
                        setTimeout(function() { // 半秒後如果沒有 call back，表示最後一個 timeline 且無留言
                            cb(Response);
                        }, 500);
                    }
                }
            });
        }

        function findAboutInfo(id, cb){ // 找出 about page 中, 每個項目的授權資料
            if(typeof req.session.user === 'undefined'){
                pri_id = "0"; //假設沒登入者id為0
                console.log("No login user looking at profile..."); 
            }else{
                pri_id = req.session.user.id;
            }
            
            if (pri_id === id){
                // res.send(JSON.stringify(req.session.user))
                cb(req.session.user, {"name":true,"city":true,"email":true,"gender":true,"phone":true,"bday":true} );
            }
            else{
                User.findById(id).exec(function(err, usr) {
                    if (err) {
                        res.send(500, { err: "DB Error" });
                    } else {
                        if (usr.length!=0) {
                            var ret= new Object();
                            ret.alias = usr[0].alias; console.log(usr[0].alias);
                            ret.img = usr[0].img;
                            ret.type = usr[0].type;
                            ret.primaryDisease = usr[0].primaryDisease;
                            var authcheck=require("../services/authcheck.js");
                            authcheck.authCheck(id,req,function(auth){
                                // console.log(auth)
                                if (auth.name===true){
                                    ret.lname = usr[0].lname;
                                    ret.fname = usr[0].fname 
                                }
                                if (auth.bday===true){
                                    ret.birthday = usr[0].birthday;
                                }
                                if (auth.city === true){
                                    ret.addressCity = usr[0].addressCity;
                                }
                                if (auth.email === true){
                                    ret.email = usr[0].email
                                }
                                if (auth.gender === true){
                                    ret.gender = usr[0].gender
                                }
                                if (auth.phone === true){
                                    ret.phone = usr[0].phone
                                }
                                if (auth.type === true){
                                    ret.type = usr[0].type
                                }
                                if (auth.primaryDisease === true){
                                    ret.primaryDisease = usr[0].primaryDisease
                                }  
                                // res.send(ret);
                                cb(ret,auth);
                            });
                        } else {
                            res.send(404, { err: "查無此帳號" });
                        }
                    }
                });
            }
        }

        function findAuthData(id, cb){ // 找出 about page 中, 每個項目的授權資料
            if(typeof req.session.user === 'undefined'){
                id= "0"; //假設沒登入者id為0
            }else{
               id=req.session.user.id;
            }
            
            Userauth.find({user:id}).exec(function(err,result){
                if(err){
                    res.send(500,{err:"DB error"});
                }
                if(result.length==0){
                    str='{"name":"all","city":"all","email":"all","gender":"all","phone":"all","bday":"all"}';
                    // res.send(JSON.parse(str));
                    cb(JSON.parse(str));
                }
                else{
                    // res.send(result[0]);
                    cb(result[0])
                }
            });
        }

        function findfriendStatus(target_id, cb){ // 找出與這個人的朋友關係
            if(req.session.user) {
                var my_id = req.session.user.id;
                
                User.findById(my_id).exec(function(err,usr){
                    if (err){
                        console.log(err);
                        res.send(500)
                    }
                    friendlist = usr[0].friends;
                    unconfirmedFriends = usr[0].unconfirmedFriends;
                    sentAddFriends= usr[0].sentAddFriends;
                    
                    if (friendlist.indexOf(parseInt(target_id))!=-1){
                        //res.send("friend");
                        cb("friend");
                    }else if (unconfirmedFriends.indexOf(parseInt(target_id))!=-1){
                        // res.send("unconfirmed");
                        cb("unconfirmed");
                    }else if (sentAddFriends.indexOf(parseInt(target_id))!=-1){
                        // res.send("sent");
                        cb("sent");
                    }else{
                        // res.send("no");
                        cb("no");
                    }
                });
            }
        }

        checkLogin(function(){
            findId(function(id){
                req.session.stay = id;
                findTimelineResponse(id, function(Response){
                    getNicer(Response, function(Response2){
                        addAuth(id, Response2, function(Response3){
                            findTimelineResponseAuthor(Response3, function(Response4){
                                findAboutInfo(id, function(aboutInfo,authInfo){
                                    findAuthData(id, function(authData){
                                        findfriendStatus(id, function(friendStatus){
                                            var traveler = "guest"; // 沒登入者
                                            if(typeof req.session.user !== 'undefined'){
                                                traveler = req.session.user.id;
                                            }
                                            Response4.timelinesPost.sort(function(a, b){
                                                return new Date(b.updatedTime)-new Date(a.updatedTime);
                                            });
                                            res.view("profile/index", {
                                                timeDiff: 0,
                                                ago: 0,
                                                timelinesList: Response4.timelinesPost,
                                                avatar: Response.img,
                                                alias: Response.alias,
                                                id: Response.id,                // 塗鴉牆主人
                                                traveler: traveler,             // 訪客
                                                aboutInfo: aboutInfo,           // about 頁面主人的 user 資料
                                                authInfo: authInfo,             // about 頁面每個項目的授權資料 (true/false)
                                                authData: authData,             // about 頁面每個項目的授權狀態 (all/friend/self)
                                                friendStatus: friendStatus,
                                                diseaseList: {'1':"鼻咽癌",'2':"鼻腔/副鼻竇癌",'3':"口腔癌",'4':"口咽癌",'5':"下咽癌",'6':"喉癌",'7':"唾液腺癌",'8':"甲狀腺癌",'999':"其它"},
                                                scripts: [
                                                    '/js/js_public/modalBox.js-master/modalBox-min.js',
                                                    '/js/js_public/alertify.js',
                                                    '/js/js_profile/mainJS.js',
                                                    '/js/js_post/cropper.min.js',
                                                    '/js/js_profile/crop-avatar.js'
                                                ],
                                                stylesheets: [
                                                    '/styles/css_profile/style.css',
                                                    '/styles/css_post/crop-avatar.css',
                                                    '/styles/css_post/cropper.min.css',
                                                    '/styles/importer.css',
                                                    '/styles/css_public/themes/alertify.core.css',
                                                    '/styles/css_public/themes/alertify.default.css'
                                                ]
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });           
    },
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
                        res.send("已經改為"+name+"看得到");
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
        // 基本步驟: user 發布 timeline 後會存入 DB.
        // 然後透過 express.js 的 res.render, 將 timeline 內容 render 進 views/profile/template.ejs 中, 最後得到一 html string.
        // 再透過 sails.js 內建的 res.send 將 render 好的 html string 回傳給前端.
        // 前端可透過 JQuery 把該 html string append 到想要的地方.
        function checkAtuh(cb){
            if(typeof req.session.user === 'undefined'){
                res.send(500,{err: "請先登入才能留言！" });
            }else{
                cb();
            }
        }
        function post(){
            var author=req.session.user.id;
            var content=req.param("timeline_post_content");
            var contentImg=req.param("timeline_post_image");
            var auth=req.param("timeline_post_auth");
            if(content.trim()=="" & contentImg.trim()==""){res.send(500,{err: "文章內容不能為空喔！" });}
            if(req.session.user.id == req.session.stay){
                Timelines.create({author: author, content: content, contentImg: contentImg, responseNum: "0", clickNum: "0", auth: auth, follower: [req.session.user.id], updatedTime: new Date()}).exec(function(error, timeline) {
                    if(error) {
                        res.send(500,{err: "發生錯誤了Q_Q" });
                    } else {
                        if(req.session.user.isAdmin==true) {
                            User.find({id: req.session.user.id}).exec(function(err, admin) {
                                if(err) {
                                    res.send(500,{err: "發生錯誤了Q_Q" });
                                } else {
                                    if(content.length>20) {
                                        var notContent=content.substr(0, 20)+"...";
                                    } else {
                                        var notContent=content;
                                    }
                                    for(var i=0; i<admin[0].friends.length; i++) {
                                        Notification.create({user: admin[0].friends[i], notType: "10", from: req.session.user.id, alreadyRead: false, content: notContent, link: "/profile?"+req.session.user.id, alreadySeen: false}).exec(function(err, not) {
                                            if(err) {
                                                console.log(err);
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        res.render("profile/template", {
                            timeDiff: 0,
                            ago: 0,
                            timelinesList: [timeline],
                            avatar: req.session.user.img,
                            alias: req.session.user.alias,
                            id: req.session.stay,                   // 塗鴉牆主人
                            traveler: req.session.user.id           // 訪客
                        }, function(err, html){
                            res.send(html);
                        });
                    }
                });
            }else{
                User.find({id: req.session.stay}).exec(function(error, owner) {
                    Timelines.create({author: owner[0].id, content: content, contentImg: contentImg, responseNum: "0", clickNum: "0", auth: auth, owner: author, follower: [req.session.user.id, owner[0].id], updatedTime: new Date()}).exec(function(error, timeline) {
                        if(error) {
                            res.send(500,{err: "發生錯誤了Q_Q" });
                        } else {
                            Timelines.find(timeline.id).populate('owner', {select: ['img', 'alias', 'id']}).populate('author', {select: ['img', 'alias', 'id']}).exec(function(error, timeline2) {
                                res.render("profile/template", {
                                    timeDiff: 0,
                                    ago: 0,
                                    timelinesList: [timeline2[0]],
                                    avatar: timeline2[0].author.img,
                                    alias: timeline2[0].author.alias,
                                    id: timeline2[0].author.id,             // 塗鴉牆主人
                                    traveler: req.session.user.id           // 訪客
                                }, function(err, html){
                                    res.send(html);
                                });
                            });
                            if(content.length>20) {
                                var notContent=content.substr(0, 20)+"...";
                            } else {
                                var notContent=content;
                            }
                            Notification.create({user: owner[0].id, notType: "9", from: req.session.user.id, alreadyRead: false, content: notContent, link: "/profile?"+owner[0].id, alreadySeen: false}).exec(function(err, not) {
                                if(err) {
                                    console.log(err);
                                    res.send({err:"DB error"});
                                }
                            });
                        }
                    });
                });
            }
        }

        checkAtuh(function(){
            post();
        });
    },
    editTimeline: function(req, res){
        function chechAtuh(id, cb){
            Timelines.find({id: id}).populate('author').populate('owner').exec(function(error, timeline) {
                if(error) {
                    res.send(500,{err: "DB Error" });
                } else {
                    if((timeline[0].owner != null && req.session.user.account == timeline[0].owner.account) || (timeline[0].author != null && req.session.user.account == timeline[0].author.account)){ // 有 owner 且 owner 是自己時，或是沒有 owner 但 author 是自己時
                        cb();
                    }else{res.send("沒有權限喔!");}
                }
            });
        }
        function edit(TimelineId){
            var edit_content = req.param("edit_content");
            var edit_img = req.param("edit_img");
            Timelines.update({id: TimelineId},{ content:edit_content, contentImg:edit_img, updatedTime: new Date() }).exec(function(err, timeline) {
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
            Timelines.find({id: id}).populate('author').populate('owner').exec(function(error, timeline) {
                if(error) {
                    res.send(500,{err: "DB Error" });
                } else {
                    if((timeline[0].author != null && req.session.user.account == timeline[0].author.account) || (timeline[0].owner!=null&&(req.session.user.account == timeline[0].owner.account))){
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
                        Timelines.find({author:req.session.stay}).exec(function(error, timeline){
                            if (error){
                              res.send(500,{err: "DB Error" });  
                            }else{
                                res.send({timelineLength:timeline.length});
                            }
                        });
                        // res.send('文章刪除成功！');
                    }
                });
            }else{
                res.send("沒有權限喔!");
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
            Timelines.findOne(TimelineId).populate('nicer').populate("author").exec(function (err, timeline) {
                timeline.nicer.add(nicer);
                timeline.follower.add(nicer);
                for(var i=0; i<timeline.follower.length; i++) {
                    if(timeline.follower!=req.session.user.id) {
                        if(timeline.content.length>20) {
                            var notContent=timeline.content.substr(0, 20)+"...";
                        } else {
                            var notContent=timeline.content;
                        }
                        Notification.create({user: timeline.author.id, notType: "4", from: req.session.user.id, alreadyRead: false, content: timeline.content, link: "/profile?"+timeline.author.id, alreadySeen: false}).exec(function(err, not) {
                            if(err) {
                                console.log(err);
                                res.send({err:"DB error"});
                            }
                        });
                    }
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
            Timelines.findOne(TimelineId).populate('nicer').exec(function (err, timeline) {
                timeline.nicer.remove(nicer);
                timeline.save(function (err) { res.send({num:timeline.nicer.length-1}); });
            });
        }
    }
};