/**
 * ArticlesController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
	setBoardPage: function(req, res){
        var tab=req.param("tab");
        var classification;
        switch (tab) {
            case "all":
              classification="";
              break;
            case "motion":
              classification="病況與心情"
              break;
            case "share":
              classification="分享";
              break;
            case "problem":
              classification="問題";
              break;
            case "others":
              classification="其它";
              break;
        }
        var board=req.param("board");
        var boards;
        var boardCate;

        if(board==21) { // 專業知識論壇頁面不開放
            res.send(500, { err: "DB Error" });
        }
        
        BoardCategory.find().exec(function(err, boardCateList) {
            boardCate=boardCateList;
        });

        Articles.find({classification: {'contains': classification}, board: board, deleted: "false"}).populate('author').populate('nicer').populate('report').populate('board').populate("response").exec(function(err, articlesList) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                Boards.find({id: board}).populate('category').exec(function(err, board) {
                    if(err || board.length<1) {
                        res.send(500, { err: "DB Error" });
                    } else {
                        Boards.find({category: board[0].category.id}).exec(function(err, boardsList) {
                            boards=boardsList;
                            res.send({articlesList: articlesList, board: board[0], boards: boards, boardCate: boardCate});
                        });
                    }
                });
            }
        });
	},

    setBoardFrontPage: function(req, res){
        var tab=req.param("tab");
        var classification;
        switch (tab) {
            case "all":
              classification="";
              break;
            case "motion":
              classification="心情"
              break;
            case "share":
              classification="分享";
              break;
            case "problem":
              classification="問題";
              break;
            case "others":
              classification="其它";
              break;
        }
        var board=req.param("board");
        var boards;
        var boardCate;
        
        BoardCategory.find().exec(function(err, boardCateList) {
            boardCate=boardCateList;
        });

        Articles.find({classification: {'contains': classification}, deleted: "false"}).populate('author').populate('nicer').populate('report').populate('board').populate("response").exec(function(err, articlesList) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                // TBD revise
                if(articlesList[0]!==undefined){
                    Boards.find({id: articlesList[0].board.id}).populate('category').exec(function(err, board) {
                        if(err) {
                            res.send(500, { err: "DB Error" });
                        } else {
                            Boards.find({category: board[0].category.id}).exec(function(err, boardsList) {
                                boards=boardsList;
                                res.send({articlesList: articlesList, board: board[0], boards: boards, boardCate: boardCate});
                            });
                        }
                    });
                }else{
                    res.send({articlesList: [], board: 0, boards: boards, boardCate: boardCate});
                }
            }
        });    
        
    },

    setAllBoardPage: function(req, res){ // 在後台使用，可以根據board category撈文章。
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
    
    setArticlePage: function(req, res){
        response=[];
        responseNice=[];
        responseNiceCount=[];
        Response.find({article: req.param('article_id')}).populate('author').exec(function(error, responseList) {
            if (error) {
                res.send(500, { err: "DB Error" });
            } else {
                response=responseList;
                for(i=0; i<response.length; i++) {
                    var temp_niceCount = 0;
                    isNice=false;
                    if(req.session.authenticated) {
                        for(j=0; j<response[i].nicer.length; j++) {
                            if(response[i].nicer[j].account==req.session.user.account) {
                                isNice=true;
                                temp_niceCount=temp_niceCount+1;
                            }
                        }
                    }
                    responseNice.push(isNice);
                    responseNiceCount.push(temp_niceCount);
                }

            }
        });

        function RUNI_NiceCount(responseList, cb){
            responseNiceCount=[];
            if(responseList.length==0){
                cb(responseNiceCount);
            }

            for(i=0; i<responseList.length; i++) {
                var count_temp = 0;
                var kk=0;
                Response.find({id: responseList[i].id}).populate("nicer").exec(function(error, response) {
                    if(error) {
                        res.send(500,{err: "DB Error" });
                        console.log(error);
                    } else {
                        count_temp = response[0].nicer.length;
                        responseNiceCount.push(count_temp);
                        kk=kk+1
                        console.log(kk)
                        if(kk >= responseList.length){ // 硬幹 asynchronous
                            cb(responseNiceCount);
                        }
                    }
                });
            }
        }
        function R_NiceCount(cb){
            Response.find({article: req.param('article_id'), }).populate('author').exec(function(error, responseList) {
                if (error) {
                    res.send(500, { err: "DB Error" });
                } else {
                    cb(responseList);
                }
            });
        }
        Articles.find({id: req.param('article_id')}).populate('author').populate('response').populate('report').exec(function(err, articlesList) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                if(articlesList.length==0) {
                    res.send(404, "查無此文章");
                } else if(articlesList[0].deleted&&articlesList[0].deleted=="true") {
                    res.send(404, "查無此文章");
                } else {
                    //找到文章了
                    //先記錄要讀文章這件事
                    if (req.session.authenticated){
                        Record.create({user:req.session.user,ip:req.ip,action:"READ article "+articlesList[0].id}).exec(function(err,ret){
                            console.log("開啟文章")
                        });
                    }
                    else{
                        Record.create({user:null,ip:req.ip,action:"READ article "+articlesList[0].id}).exec(function(err,ret){
                            console.log("開啟文章")
                        });
                    }


                    if(req.session.authenticated && 
                        req.session.user.id==articlesList[0].author.id) {
                        isAuthor=true;
                    } else {
                        isAuthor=false;
                    }
                    if(req.session.authenticated && articlesList[0].nicer) {
                        isNice=false;
                        for(i=0; i<articlesList[0].nicer.length; i++) {
                            if(articlesList[0].nicer[i]&&req.session.user.id==articlesList[0].nicer[i].id) {
                                isNice=true;
                                break;
                            }
                        }
                    } else {
                        isNice=false;
                    }
                    if(req.session.authenticated && articlesList[0].follower.indexOf(req.session.user.id)!=-1) {
                        var isFollower=true;
                    } else {
                        var isFollower=false;
                    }

                    var isReport=false;
                    var reportCount=articlesList[0].report.length;
                    if(req.session.authenticated) {
                        Report.find({article: req.param('article_id'), reporter: req.session.user.id}).exec(function(err, report){
                            if(err) {
                                console.log(err);
                            } else {
                                if(report && report.length!=0) {
                                    isReport=true;
                                } else {
                                    isReport=false;
                                }
                            }
                        });
                    } else {
                        isReport=false;
                    }

                    if(req.session.authenticated) {
                        login=true;
                    } else {
                        login=false;
                    }
                    R_NiceCount(function(responseList){
                        RUNI_NiceCount(responseList, function(responseNiceCount){
                            res.send({articleList: articlesList, isAuthor: isAuthor, isNice: isNice, 
                                responseList: response, responseNice: responseNice, login: login, lnicer: articlesList[0].nicer.length, 
                                responseNiceCount:responseNiceCount, isReport: isReport, reportCount: reportCount, isFollower: isFollower});
                        });
                    });
                }
            }
        });
    },
    
	postArticle: function(req, res){
        
		var title=req.param("title");
        var classification=req.param("classification");
		var author=req.session.user.id;
		var content=req.param("content");
        var responseNum=req.param("responseNum");
        var clickNum=req.param("clickNum");
        var board=req.param("board");
        var follower=[req.session.user.id];
        
        // if(!req.session.user) {
        //     res.send({err: "尚未登入"});
        // } else {
    		Articles.create({title: title, author: author, content: content, classification: classification, responseNum: responseNum, clickNum: clickNum, board: board, follower: follower}).exec(function(error, article) {
                if(error) {
                    console.log(title);console.log(author);console.log(content);
                    res.send(500,{err: "DB Error" });
                    console.log(error);
                } else {
                    
                    Articles.update({id: article.id},{lastResponseTime: article.updatedAt}).exec(function(err, article2) {
                        if(err) {
                            res.send(500,{err: "DB Error" });
                            console.log(err);
                        } else {

                            if(article2[0].board==19||article2[0].board==20) {
                                if(title.length>20) {
                                    var notContent=title.substr(0, 20)+"...";
                                } else {
                                    var notContent=title;
                                }
                                Notification.create({user: 45, notType: "11", from: req.session.user.id, alreadyRead: false, content: notContent, link: "/article/"+article2[0].id, alreadySeen: false}).exec(function(err, not) {
                                    if(err) {
                                        console.log(err);
                                    }
                                });
                                //寄信給管理者
                                //引用 nodemailer  
                                var list
                                if (article2[0].board==19){
                                    var list = ["r03725041@ntu.edu.tw","r03725042@ntu.edu.tw","r03725035@ntu.edu.tw"]

                                }
                                else if (article2[0].board==20){
                                    var list = ["r04725020@ntu.edu.tw","r04725019@ntu.edu.tw","jeffweilee@gmail.com"]
                                }
                                var nodemailer = require('nodemailer');  
                                var transporter = nodemailer.createTransport({  
                                    service: 'Gmail',  
                                    auth: {  
                                     user: 'ntu.cpcp@gmail.com',  
                                     pass: 'lckung413'  
                                    }  
                                });  
                                var options = {  
                                    //寄件者  
                                    from: "頭頸癌病友加油站 <ntu.cpcp@gmail.com>",  
                                    //收件者  
                                    to: list[ article2[0].id % 3],   
                                    
                                    //主旨  
                                    subject: "[系統訊息] 使用者發問", // Subject line  
                                    
                                    //嵌入 html 的內文  
                                    html: article2[0].content+"<br><br><a href=http://zohue.im.ntu.edu.tw/article/"+article2[0].id+">link</a>",   
                                       
                                };  
                                
                                //發送信件方法  
                                transporter.sendMail(options, function(error, info){  
                                    if(error){  
                                        console.log(error);  
                                    }else{  
                                        console.log('訊息發送: ' + info.response);  
                                    }  
                                });  
                            }
                            Record.create({user:req.session.user,ip:req.ip,action:"POST article "+article2[0].id}).exec(function(err,record){
                                console.log("發表文章")
                                res.send(article2);
                            })
                            
                        }
                    });
                }
            });
	},
    syncArticleToTimeline: function(req, res){
        var author=req.session.user.id;
        var content=req.param("timeline_post_content");
        var contentImg=req.param("timeline_post_image");
        var auth=req.param("timeline_post_auth");
        var board = req.param("timeline_post_board");
        var isAdmin = req.session.user.isAdmin;

        if( isAdmin == true && board == "17"){
            Timelines.create({author: author, content: content, contentImg: contentImg, responseNum: "0", clickNum: "0", auth: auth, updatedTime: new Date()}).exec(function(error, timeline) {
                if(error) {
                    res.send(500,{err: "發生錯誤了Q_Q" });
                } else {
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
                            res.send({timelinesList: [timeline], avatar: req.session.user.img, alias: req.session.user.alias, id: req.session.user.id});
                        }
                    });
                }
            });
        }
    },

    changeArticle: function(req, res) {
        var articleId = req.param("id");
        var newTitle = req.param("newTitle");
        var newContent = req.param("newContent");
        
        Articles.update({id: articleId}, {title: newTitle, content: newContent}).exec(function(error, article) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                Articles.update({id: article.id},{lastResponseTime: article.updatedAt}).exec(function(err, article) {
                    if(err) {
                        res.send(500,{err: "DB Error" });
                        console.log(err);
                    } else {
                        res.send(article);
                    }
                });
            }
        });
    },


    updateClickNum: function(req, res) {
        var id = req.param("id");
        var clickNum = req.param("clickNum");
        
        Articles.update({id: id}, {clickNum: clickNum}).exec(function(error, updated) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                res.send("clickNum 更新嚕");
            }
        });
    },

    setEliteArticle: function(req, res) {
        var articleId = req.param("id");
        
        Articles.update({id: articleId}, {elite: "1"}).exec(function(err) {
            if(err) {
                console.log(error);
                res.send(500,{err: "DB Error" });
            } else {
                console.log('The article record id:'+ articleId +' has been set to be elite');
                res.send("已標記為精華文章");
            }
        });
    },

    cancelEliteArticle: function(req, res) {
        var articleId = req.param("id");
        
        Articles.update({id: articleId}, {elite: "0"}).exec(function(err) {
            if(err) {
                console.log(error);
                res.send(500,{err: "DB Error" });
            } else {
                console.log('The article record id:'+ articleId +' has been set NOT to be elite');
                res.send("已標記為非精華文章");
            }
        });
    },

    deleteArticle: function(req, res) {
        var articleId = req.param("id");
        
        Articles.update({id: articleId}, {deleted: "true"}).exec(function(err) {
            if(err) {
                console.log(error);
                res.send(500,{err: "DB Error" });
            } else {
                console.log('The record has been deleted');
                res.send("已刪除文章");
            }
        });
    },

    clickNice: function(req, res) {
        var articleId = req.param("article_id");
        Articles.find({id: articleId}).exec(function(error, article) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log("error"+error);
            } else {
                var newNicer=article[0].nicer;
                var newFollower=article[0].follower;
                if(req.session.user) {
                    if(newNicer.indexOf(req.session.user.id)==-1) {
                        newNicer.push(req.session.user.id);
                    }
                    if(newFollower.indexOf(req.session.user.id)==-1) {
                        newFollower.push(req.session.user.id);
                    }
                }
                
                Articles.update({id: articleId}, {nicer: newNicer, follower: newFollower}).exec(function(error, updated) {
                    if(error) {
                        res.send(500,{err: "DB Error" });
                        console.log("error2"+error);
                    } else {
                        if(updated[0].title.length>20) {
                            var notContent=updated[0].title.substr(0, 20)+"...";
                        } else {
                            var notContent=updated[0].title;
                        }
                        for(var i=0; i<updated[0].follower.length; i++) {
                            if(updated[0].follower[i]!=req.session.user.id) {
                                Notification.create({user: updated[0].follower[i], notType: "2", from: req.session.user.id, alreadyRead: false, link: "/article/"+articleId, content: notContent, alreadySeen: false}).exec(function(err, not) {
                                    if(err) {
                                        console.log(err);
                                        res.send({err:"DB error"});
                                    }
                                });
                            }
                        }
                        res.send({num:updated[0].nicer.length});
                    }
                });
            }
        });
    },

    cancelNice: function(req, res) {
        console.log("cancel");
        var articleId = req.param("article_id");
        Articles.find({id: articleId}).populate("nicer").exec(function(error, article) {
            if(error) {
                res.send(500,{err: "DB Error" });
            } else {
                var niceList=article[0].nicer;
                var newNiceList=[];
                for(i=0; i<niceList.length; i++) {
                    if(niceList[i]&&niceList[i].id!=req.session.user.id) {
                        newNiceList.push(niceList[i]);
                    }
                }
                Articles.update({id: articleId}, {nicer: newNiceList}).exec(function(error, updated) {
                    if(error) {
                        res.send(500,{err: "DB Error" });
                    } else {
                        res.send({num:updated[0].nicer.length});
                    }
                });
            }
        });
    },

    clickReport: function(req, res) {
        var articleId = req.param("article_id");
        var reason = req.param("reason");
        Report.create({article: articleId, reporter: req.session.user.id, reason: reason}).exec(function(error, report) {
            if(error) {
                console.log("error:"+error);
                res.send(500, {err: "DB Error"});
            }
        });
        Articles.find({id: articleId}).populate('report').exec(function(error, article) {
            if(error) {
                res.send(500, {err: "DB Error"});
                console.log(error);
            } else {
                res.send({num: article[0].report.length});
            }
        });
    },

    cancelReport: function(req, res) {
        var articleId = req.param("article_id");
        Articles.find({id: articleId}).populate("report").exec(function(error, article) {
            if(error) {
                res.send(500,{err: "DB Error" });
            } else {
                Report.destroy({article: articleId, reporter: req.session.user.id}).exec(function(error) {
                    if(error) {
                        console.log(error);
                        res.send(500, {err: "DB Error"});
                    } else {
                        res.send({num: article[0].report.length-1});
                    }
                });
            }
        });
    },

    niceResponse: function(req, res) {
        var response_id = req.param("response_id");
        Response.find({id: response_id}).populate("nicer").exec(function(error, response) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                var niceList=response[0].nicer;
                if(!niceList) {
                    niceList=[];
                }
                niceList.push(req.session.user);

                Response.update({id: response_id}, {nicer: niceList}).exec(function(error, updated) {
                    if(error) {
                        res.send(500,{err: "DB Error" });
                        console.log(error);
                    } else {

                        if(updated[0].author!=req.session.user.id) {
                            if(updated[0].comment.length>20) {
                                var notContent=updated[0].comment.substr(0, 20)+"...";
                            } else {
                                var notContent=updated[0].comment;
                            }
                            Notification.create({user: updated[0].author, notType: "6", from: req.session.user.id, alreadyRead: false, link: "/article/"+updated[0].article, content: notContent, alreadySeen: false}).exec(function(err, not) {
                                if(err) {
                                    console.log(err);
                                    res.send({err:"DB error"});
                                }
                            });
                        }
                        res.send(updated);
                    }
                });
            }
        });
    },

    notNiceResponse: function(req, res) {
        var response_id = req.param("response_id");
        Response.find({id: response_id}).populate("nicer").exec(function(error, response) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                var niceList=response[0].nicer;
                index=niceList.indexOf(req.session.user);
                niceList.splice(index, 1);
                Response.update({id: response_id}, {nicer: niceList}).exec(function(error, updated) {
                    if(error) {
                        res.send(500,{err: "DB Error" });
                        console.log(error);
                    } else {
                        res.send(updated);
                    }
                });
            }
        });
    },

    searchArticle: function(req, res){
        var keyword = req.param("keyword");
        var board=req.param("board");
        console.log(keyword);

        var tab=req.param("tab");
        var classification;
        switch (tab) {
            case "all":
              classification="";
              break;
            case "motion":
              classification="心情"
              break;
            case "share":
              classification="分享";
              break;
            case "problem":
              classification="問題";
              break;
            case "others":
              classification="其它";
              break;
        }

        var boardCate;
        BoardCategory.find().exec(function(err, boardCateList) {
            boardCate=boardCateList;
        });

        //Articles.find({ title: { 'contains': keyword }, classification: {'contains': classification}}).populate("author").populate('nicer').exec(function(err,found){
        Articles.find({classification: {'contains': classification}, deleted: "false"}).populate("author", {alias: {'contains': keyword }}).populate("nicer").exec(function(err,found){
            if (err){
                res.send(500, { err: "DB Error" });
            } else{
                if(found){
                    
                    Articles.find({ title: { 'contains': keyword }, classification: {'contains': classification}, deleted: "false"}).populate("author").populate('nicer').populate("report").exec(function(err,found){
                        if (err){
                            res.send(500, { err: "DB Error" });
                        } else{
                            if(found){
                               
                                Boards.find({id: board}).populate('category').exec(function(err, board) {
                                    if(err) {
                                        res.send(500, { err: "DB Error" });
                                    } else {
                                        Boards.find({category: board[0].category.id}).exec(function(err, boardsList) {
                                            res.send({articlesList: found, board: board[0], boards: boardsList, boardCate: boardCate});
                                        });
                                        //res.send({articlesList: found, board: board[0]});
                                    }
                                });
                            }else{
                                console.log("not found");
                                res.send(500, { err: "找不到喔！" });
                            }
                        }
                    });
                }else{
                    console.log("not found");
                    res.send(500, { err: "找不到喔！" });
                }
            }
        });
    },

    searchArticleFront: function(req, res){
        var keyword = req.param("keyword");
        console.log("searchArticleFront: "+keyword);

        var tab=req.param("tab");
        var classification;
        switch (tab) {
            case "all":
              classification="";
              break;
            case "motion":
              classification="心情"
              break;
            case "share":
              classification="分享";
              break;
            case "problem":
              classification="問題";
              break;
            case "others":
              classification="其它";
              break;
        }

        var boardCate;
        BoardCategory.find().exec(function(err, boardCateList) {
            boardCate=boardCateList;
        });

        //Articles.find({ title: { 'contains': keyword }, classification: {'contains': classification}}).populate("author").populate('nicer').exec(function(err,found){
        Articles.find({classification: {'contains': classification}, deleted: "false"}).populate("author", {alias: {'contains': keyword }}).populate("nicer").exec(function(err,found){
            if (err){
                res.send(500, { err: "DB Error" });
            } else{
                if(found){
                    Articles.find({ title: { 'contains': keyword }, classification: {'contains': classification}, deleted: "false"}).populate("author").populate('nicer').populate("report").populate("board").exec(function(err,found){
                        if (err){
                            res.send(500, { err: "DB Error" });
                        } else{
                            if(found[0]!==undefined){
                                Boards.find({id: found[0].board.id}).populate('category').exec(function(err, board) {
                                    if(err) {
                                        res.send(500, { err: "DB Error" });
                                    } else {
                                        Boards.find({category: board[0].category.id}).exec(function(err, boardsList) {
                                            boards=boardsList;
                                            res.send({articlesList: found, board: board[0]});
                                        });
                                    }
                                });
                            }else{
                                res.send({articlesList: found, board: []});
                            }
                        }
                    });
                }else{
                    console.log("not found");
                    res.send(500, { err: "找不到喔！" });
                }
            }
        });
    },

    mailAritlce: function(req,res){
        var articleId = req.param("article_id");
        var url=req.param("url");
        url=url.replace(/article.+/,"");
        Articles.find({id: articleId}).populate("response").populate("author").exec(function(err, article) {
            if (err){
                res.send(500,{err:"找不到文章!"});
            }
            else{
                var regex = /href=\".+?\">/g;
                var author = "作者："+article[0].author.alias;
                var orginurl=url+"article/"+articleId;
                var link = "點這裡看原文:" + "<a href='"+orginurl+"''>"+orginurl+"</a>";
                var content=article[0].content.replace(/<img src=\"[a-zA-Z0-9_\/\.]+\">/g,"圖片連結");  
                var arr=content.match(regex);
                var counter=0;
                for (var img in arr){
                    counter=counter+1;
                    pic_addr=arr[img].replace(/href=\"..\//,url).replace(/\">/,"");
                    content=content+"圖片"+counter+" : "+"<a href='"+pic_addr+"''>"+pic_addr+"</a>"+"<br>";
                }
                content=content+"<br><br><hr>網友留言：<br>"
                var async = require('async');
                async.each(article[0].response, function(val, callback) {
                    //每次要做的
                    User.find({id: val.author}).exec(function(err,author){
                        if (err){
                            callback("error"); 
                        }
                        else{
                            name=author[0].alias;  
                            var regex = /href=\".+?\">/g;
                            var image_url=val.comment_image.match(regex);
                            var pic_addr="";
                            for (var img in image_url){
                                pic_addr=image_url[img].replace(/href=\"..\//,url).replace(/\">/,"");
                                
                            }
                            content=content+name+" : "+val.comment+"<br>";
                            if (pic_addr.length!=0){
                                content=content + "<blockquote>圖片 : " +"<a href='"+pic_addr+"''>"+pic_addr+"</a></blockquote>"+"<br>";
                            } 
                            
                            callback(); 
                        }    
                    });
                // show that no errors happened
                }, function(err) {
                    if(err) {
                        console.log("There was an error" + err);
                        res.send(500,{err:"找不到文章作者"});
                    } else {
                        
                        //結束以後
                        //引用 nodemailer  
                        var nodemailer = require('nodemailer');  
                        var transporter = nodemailer.createTransport({  
                            service: 'Gmail',  
                            auth: {  
                             user: 'ntu.cpcp@gmail.com',  
                             pass: 'lckung413'  
                            }  
                        });  
                        var options = {  
                            //寄件者  
                            from: "頭頸癌病友加油站 <ntu.cpcp@gmail.com>",  
                            //收件者  
                            to: req.param("mailaddress"),   
                            
                            //主旨  
                            subject: "[癌友加油站] "+article[0].title, // Subject line  
                            
                            //嵌入 html 的內文  
                            html: author+"<br>"+link+"<br><br>"+content,   
                               
                        };  
                        
                        // 發送信件方法  
                        transporter.sendMail(options, function(error, info){  
                            if(error){  
                                console.log(error);  
                            }else{  
                                console.log('訊息發送: ' + info.response);  
                            }  
                        });  
                        res.send("SEND");
                    }
                });    
            }

        });
    },
    changeFollow: function(req, res) {
        if(!req.session.authenticated) {
            res.send(404, {err: "請登入以使用此功能"});
        } else {
            var article_id=req.param("article_id");
            Articles.findOne({id: article_id}).exec(function(err, article) {
                if(err) {
                    res.send(500, "server error");
                } else {
                    if(article.follower.indexOf(req.session.user.id)==-1) {
                        var newFollower=article.follower;
                        newFollower.push(req.session.user.id);
                        Articles.update({id: article_id}, {follower: newFollower}).exec(function(err2, article2) {
                            if(err2) {
                                res.send(500, "server error");
                            } else {
                                res.send({isFollower: true});
                            }
                        });
                    } else {
                        var newFollower=article.follower;
                        newFollower.splice(article.follower.indexOf(req.session.user.id), 1);
                        Articles.update({id: article_id}, {follower: newFollower}).exec(function(err2, article2) {
                            if(err2) {
                                res.send(500, "server error");
                            } else {
                                res.send({isFollower: false});
                            }
                        });
                    }
                }
            })
        }
    },
    countForum: function(req, res) {
        if(!req.session.authenticated) {
            res.send({login: false});
        } else {
            User.findOne(req.session.user.id).exec(function(err1, user) {
                if(err1) {
                    console.log("錯誤訊息："+err1);
                    res.send(500, "server error");
                } else {
                    var lastForumTime=user.lastForumTime;
                    Articles.find({createdAt: {'>': lastForumTime}, deleted: false, board: {"<=": 19}}).exec(function(err2, articles) {
                        if(err2) {
                            console.log("錯誤訊息："+err2);
                            res.send(500, "server error");
                        } else {
                            res.send({login: true, num: articles.length});
                        }
                    });
                }
            });
        }
    },
    setMeta: function(req, res) {
        var id=req.param("id");
        console.log(id);
        if(id=='undefined') res.send(500, "server error");
        Articles.find(id).exec(function(err, articles) {
            if(err) {
                console.log("錯誤訊息："+err);
                res.send(500, "server error");
            } else {
                console.log(articles);
                if(articles.length==1) {
                    var metaTitle=articles[0].title;
                    var metaUrl="http://zohue.im.ntu.edu.tw/article/"+articles[0].id;
                    var metaDescription="ZOHUE作夥台灣頭頸癌病友加油站";
                    return res.view("article/index", {
                        metaTitle: metaTitle,
                        metaUrl: metaUrl,
                        metaDescription: metaDescription,
                        scripts: [
                            '/js/js_public/modalBox.js-master/modalBox-min.js',
                            '/js/js_public/alertify.js',
                            '/js/js_article/mainJS.js',
                            '/js/js_post/cropper.min.js',
                            '/js/js_article/crop-avatar.js'
                          ],
                        stylesheets: [
                            '/styles/css_article/style.css',
                            '/styles/css_post/crop-avatar.css',
                            '/styles/css_post/cropper.min.css',
                            '/styles/importer.css',
                            '/styles/css_public/themes/alertify.core.css',
                            '/styles/css_public/themes/alertify.default.css'
                          ],
                    });
                }   
            }
        });
    }
};

