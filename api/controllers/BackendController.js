/**
 * BackendController
 *
 * @description :: Server-side logic for managing backends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    getSuspendReason: function(req, res) {
        SuspendReason.find().exec(function(err,reason){
            if(err){
                res.send(500,{err: "DB Error"});
            }else{
                res.send(reason);
            }
        })
    },

  	index: function(req, res) {
	    res.view({
	    	layout: false
	    });
  	},
    
    adminLogout: function (req, res) {
        req.session.destroy();
        res.send("success");
    },

    checkAdmin: function(req, res) {
        if(typeof req.session.user != 'undefined'){
            var isAdmin = req.session.user.isAdmin;
            //     User.update({account: isAdmin}, {isAdmin: true}).exec(function(err) {
            //         if(err) {
            //             console.log("sss");
            //             res.send("true");
            //         } else {
            //             console.log('fff');
            //             res.send("false");
            //         }
            //     });
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
            Record.find({}).populate('user').exec(function(err,records){
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
                            //console.log(userAccount[0].account);
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
    }
};

