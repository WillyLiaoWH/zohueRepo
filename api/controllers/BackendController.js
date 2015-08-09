/**
 * BackendController
 *
 * @description :: Server-side logic for managing backends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  	index: function(req, res) {
  		// if(session["admin"]=true){
  		// 	res.view({
		  //   	//_layoutFile: '',
		  //   	//view: 'backend/adminPage',
		  //   	layout: false
			 //      // partials: {
			 //      //   head: 'partials/head',
			 //      //   tail: '../partials/tail',
			 //      // },
		  //   });
  		// }else{
  		// 	res.send(500,{err: "DB Error" });
  		// }

	    res.view({
	    	//_layoutFile: '',
	    	//view: 'backend/adminLoginPage',
	    	layout: false
		      // partials: {
		      //   head: 'partials/head',
		      //   tail: '../partials/tail',
		      // },
	    });


  	},

    adminLogin: function(req, res) {
        var adminAccount = req.param("adminAccount");
        var adminPassword = req.param("adminPassword");

        Admins.find({account: adminAccount}).exec(function(error, admin) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            }else{
                if (admin.length!=0) {
                    if (adminPassword==admin[0].password) {
                        req.session.admin = adminAccount;
                        res.send("登入成功");
                    } else {
                        res.send("密碼錯誤！");
                    }
                } else {
                    res.send("此帳號不存在！");
                }
            } 
        });
    },
    
    adminLogout: function (req, res) {
        req.session.destroy();
        res.send("success");
    },

    checkAdmin: function(req, res) {
        var adminAccount=req.session.admin;
        Admins.find({account: adminAccount}).exec(function(error, admin){
            if(error){
                console.log(error);
            }else{
                if (admin.length!=0) {
                    res.send("true");
                }else{
                    res.send("false");
                }
            }
        });
    },

    createAdmin: function(req, res) {
        var adminAccount = req.param("adminAccount");
        var adminPassword = req.param("adminPassword");

        Admins.create({account: adminAccount, password: adminPassword}).exec(function(error, article) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } 
        });
    },

    getAllUsers: function(req, res){
        var searchUser = req.param("searchUser");
        var adminAccount=req.session.admin;
        Admins.find({account: adminAccount}).exec(function(error, admin){
            if(error){
                console.log(error);
            }else{
                if (admin.length!=0) {
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
            }
        });
    },

    getArticles: function(req, res){ // 根據board及category撈文章。
        var board=req.param("board");

        Articles.find({board: board}).populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                res.send({articlesList: articlesList});
            }
        });    
    },

  	getArticlesByBoards: function(req, res){ // 根據board撈文章。   
        Articles.find().populate('author').populate('nicer').populate('report').populate('board').exec(function(err, articlesList) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                res.send({articlesList: articlesList});
            }
        });        
	},

    getArticlesByCategory: function(req, res){ // 根據category撈文章。
        var boards;
        var category=req.param("category");

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
    },

    recoverArticle: function(req, res) {
        var articleId = req.param("id");
        Articles.update({id: articleId}, {deleted: "false"}).exec(function(err) {
            if(err) {
                console.log(error);
                res.send(500,{err: "DB Error" });
            } else {
                console.log('The record has been recovered.');
                res.end();
            }
        });
    },
};

