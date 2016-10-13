/**
 * BackendController
 *
 * @description :: Server-side logic for managing backends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {
    recordDownload:function(req,res){
        var isAdmin = req.session.user.isAdmin;
        if (isAdmin){
            Record.find({}).exec(function(err,list){
                if(err){
                    res.send(500,{err: "DB Error"});
                }
                else{
                    for (e=0;e<list.length;e++){
                        list[e].createdAt = new Date(list[e].createdAt).toLocaleString()
                    }
                    console.log(list)
                    var json2csv = require('json2csv');
                    var config = {
                        fields : ['user','ip', 'action','createdAt'],
                        data: list
                    };

                    //console.log(config)
                    json2csv(config, function(err, csv) {
                        // var fs = require('fs');
                        // fs.writeFile("/tmp/test", csv, function(err) {
                        //     console.log("haha")
                        // });
                    if (err) console.log(err);
                    var filename = "report.csv";
                    res.attachment(filename);
                    res.end(csv, 'UTF-8');
                });

                }
            })
}
},
setPage: function(req, res) {
    var page = req.param("page");
    if (page==="userManage"){
        res.view("backend/userManage",{
            layout: "back_layout",
            action: "loadUserList()"
        });
    }
    else if (page === "forumManage"){
        res.view("backend/forumManage",{
            layout: "back_layout",
            action:"loadForumList()"
        });

    }
    else if (page === "subscriberManage"){
        res.view("backend/subscriberManage",{
            layout: "back_layout",
            action:"loadsubscriberList()"
        });

    }
    else if (page === "edit"){

    }
    else if (page ==="record"){
        res.view("backend/record",{
            layout: "back_layout",
            action:"loadRecord(1)"
        });

    }
    else if (page ==="proInfo"){
        res.view("backend/proInfo",{
            layout: "back_layout",
            action:"loadProInfo()"
        });

    }
    else if (page ==="homepageManage"){     
        HomepagePic.find({}).exec(function(err, homepagePics) {
            fs = require('fs');
            fs.readFile('config/formula.json', 'utf8', function (err, data) {
                if (err) return console.log(err);
                // res.send(data);
                var formulaData = JSON.parse(data);
                res.view("backend/homepageManage",{
                    nicerNumWeight:formulaData.nicerNumWeight,
                    responseNumWeight:formulaData.responseNumWeight,
                    clickNumWeight:formulaData.clickNumWeight,
                    homepagePics: homepagePics,
                    layout: "back_layout",
                    action:"loadHomepage()"
                });
            });
                
        });
        

    }
    else{
        res.view("backend/default",{
            layout: "back_layout",
            action:""
        });
    }
    
},

adminLogout: function (req, res) {
    Record.create({user:req.session.user,ip:req.ip,action:"Logout"}).exec(function(err,record){
        console.log("使用者登出")
        req.session.destroy();
        res.send("success");
    })
    
},

checkAdmin: function(req, res) {
    if(typeof req.session.user != 'undefined'){
        var isAdmin = req.session.user.isAdmin;
        if (isAdmin == true){
            res.send("true");
        }else{
            res.send("false");
        }
    } else {
      res.send("false");
  }
  
},

getAllUsers: function(req, res){
    var searchUser = req.param("searchUser");
    var isAdmin = req.session.user.isAdmin;
    if (isAdmin == true) {
        User.find({or:[{account: {'contains': searchUser}}, {alias: {'contains': searchUser}}, {fname: {'contains': searchUser}}, {lname: {'contains': searchUser}}]}).populate('articlesPost').exec(function(err, allUsers) {
            if (allUsers.length==0) {
                res.send("查無結果！");
            } else {
                sails.services['util'].populateDeep('user', allUsers, 'articlesPost.report', function (err, userList) {
                    if (err) {
                        sails.log.error("ERR:", err);
                        console.log("err2");
                    }else {
                        if(userList.length>0){
                            res.send(userList);
                        }else{
                            console.log(allUsers);
                        }
                    }
                });
            }
        });
    }else{
        res.send("你不是管理員喔！");
    }
},
getRecord: function(req,res){
    var isAdmin = req.session.user.isAdmin;
    if (isAdmin){
        var num = req.param("num")
            /*
              num : 0 all
                    1 3days
                    2 1month
                    */
                    if (num == 0 ){
                        var day_filter = new Date('1/1/2014')
                    }
                    else if (num==1){
                        var day_filter = new Date() 
                        day_filter = day_filter.setDate(day_filter.getDate()-3)

                    }
                    else if (num == 2){
                        var day_filter = new Date() 
                        day_filter = day_filter.setMonth(day_filter.getMonth()-1)
                    }
                    Record.find({createdAt :{">": new Date(day_filter)} }).populate('user').exec(function(err,records){
                        if(err){
                            res.send(500,{err: "DB Error"});
                        }
                        else{
                            res.send(records);
                        }
                    })
                }
            },

    getArticles: function(req, res){ // 根據board及category撈文章。
        var board=req.param("board");
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            Articles.find({board: board}).populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
                if (err) {
                    res.send(500, { err: "DB Error" });
                } else {
                    res.send({articlesList: articlesList});
                }
            });
        }      
    },

  	getArticlesByBoards: function(req, res){ // 根據board撈文章。  
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            Articles.find().populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
                if (err) {
                    res.send(500, { err: "DB Error" });
                } else {
                    res.send({articlesList: articlesList});
                }
            });    
        } 
    },

    getArticlesByArticleId: function(req, res){ // 根據board撈文章。  
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            console.log(req.param('articleID'));
            Articles.findOne({id:req.param('articleID')}).exec(function(err, article) {
                if (err) {
                    res.send(500, { err: "DB Error" });
                } else {
                    res.send(article);
                }
            });    
        } 
    },


    backendEditArticle: function(req, res) {
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            var articleId = req.param("id");
            var newClassification = req.param("classification");
            // var newCategory = req.param("newCategory");
            var newBoard = req.param("board");
            var newTitle = req.param("title");
            var newContent = req.param("content");
            
            Articles.update({id: articleId}, {title: newTitle, content: newContent,classification:newClassification,board:newBoard }).exec(function(error, article) {
                if(error) {
                    res.send(500,{err: "DB Error" });
                    console.log(error);
                } else {
                    res.send(article);
                    // Articles.update({id: article.id},{lastResponseTime: article.updatedAt}).exec(function(err, article) {
                    //     if(err) {
                    //         res.send(500,{err: "DB Error" });
                    //         console.log(err);
                    //     } else {
                    //         res.send(article);
                    //     }
                    // });
        }
    });
        }
    },

    getArticlesByCategory: function(req, res){ // 根據category撈文章。
        var boards;
        var category=req.param("category");
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            Boards.find({category: category}).exec(function(err, boards) {
                if(err) {
                    console.log(err);
                } else {
                    var boardsArray=[];
                    boards=boards;
                    
                    for(i=0;i<boards.length;i++){
                        boardsArray.push(boards[i].id.toString());
                    }

                    Articles.find({board : boardsArray}).populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
                        if (err) {
                            res.send(500, { err: "DB Error" });
                        } else {
                            res.send({articlesList: articlesList});
                        }
                    });
                }
            });
        }
    },

    recoverArticle: function(req, res) {
        var articleId = req.param("id");
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            Articles.update({id: articleId}, {deleted: "false"}).exec(function(err) {
                if(err) {
                    console.log(error);
                    res.send(500,{err: "DB Error" });
                } else {
                    console.log('The record has been recovered.');
                    res.end();
                }
            });
        }
    },

    suspendUser: function(req, res) {
        var userID = req.param("id");
        var reason = req.param("reason");
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            User.update({id: userID}, {suspended: true}).exec(function(err) {
                if(err) {
                    console.log(error);
                    res.send(500,{err: "DB Error" });
                } else {
                    User.find({ id: userID }, {select: ['account']}).exec(function(err, userAccount) {
                        if (err) {
                            res.send(500, { err: "DB Error" });
                        } else {
                            SuspendReason.create({account: userAccount[0].account, reason: reason}).exec(function(error, response) {
                                if(error){
                                    res.send(500,{err: "DB Error" });
                                }else{
                                    console.log('The user account has been suspended.');
                                    res.send("已停止此帳號的使用權限。");
                                }
                            });  
                        }
                    });     
                }
            });
        }
    },

    recoverUser: function(req, res) {
        var userID = req.param("id");
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            User.update({id: userID}, {suspended: false}).exec(function(err) {
                if(err) {
                    console.log(error);
                    res.send(500,{err: "DB Error" });
                } else {
                    console.log('The user account has been recovered.');
                    res.send("已恢復此帳號的使用權限。");
                }
            });
        }
    },

    appeal: function(req, res) {
        var account = req.param("account");
        var appeal = req.param("appeal");
        SuspendReason.find({account:account}).exec(function(err, suspendReason){
            if(err){
                res.send(500,{err: "DB Error" });
            }else{
                var getOneRecord = suspendReason.pop();
                if(typeof getOneRecord.appeal=='undefined'){
                    getOneRecord.appeal = [{"date": new Date().toISOString(), "appeal": appeal}];
                }else{
                    getOneRecord.appeal.push({"date": new Date().toISOString(), "appeal": appeal});
                }
                getOneRecord.save(function(err){res.send("您的申訴已成功送出，我們會盡快處理，謝謝！");});
            }
        });
    },

    getAllSuspendReason: function(req, res) {
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            SuspendReason.find().exec(function(err,reason){
                if(err){
                    res.send(500,{err: "DB Error"});
                }else{
                    res.send(reason);
                }
            });
        }
    },

    getSuspendReason: function(req, res) {
        var account = req.param("account");
        var isAdmin = req.session.user.isAdmin;
        if(isAdmin == true){
            SuspendReason.findByAccount(account).exec(function(err, reason) {
                if (err) {
                    res.send(500, { err: "DB Error" });
                } else {
                    if (reason.length!=0) {
                        res.send(reason[reason.length-1]);
                    }
                }
            });
        }
    },
    
    proInfoSubmit: function(req,res){
        var type = req.param("type")
        var cancer = req.param("cancer")
        var time = req.param("time")
        var title = req.param("title")
        var author = req.param("author")
        var from = req.param("from")
        var info = req.param("proInfo");
        if(info.indexOf('.pdf')>-1)
        {
            var content ='<a href="'+info+'" target="_blank">請點擊打開pdf</a>';
        }
        else{
            var content = '<embed src="'+info+'" height="100%" width="100%" internalinstanceid="9"><div id="postContent_image"><div class="clear" id="clear"></div></div>';
        }
        
        Articles.create({ title: title, author: 45, content: content, classification: '分享', responseNum: 0, clickNum: 0, board: 21, follower: [45], lastResponseTime: new Date() }).exec(function(error, proinfo) {
            if(error) {
                console.log(error);
                res.send(500,{err: "DB Error" });
            } else {
                ProInfo.create({title:title,author:author,link:info,classification:type,cancerType:cancer,date:time,note:from,articleURL: "../article/"+proinfo.id }).exec(function(err,ret){
                    if (err){
                        res.send(500,{err:"DB Error"});
                    }
                    else{
                        res.send("OK")
                    }
                });
            }
        });
    }
};

