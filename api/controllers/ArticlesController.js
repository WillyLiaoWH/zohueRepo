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
		Articles.find({classification: {'contains': classification}, board: board}).populate('author').populate('nicer').populate('report').exec(function(err, articlesList) {
			if (err) {
            	res.send(500, { err: "DB Error" });
        	} else {
                res.send(articlesList);
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
            Response.find({article: req.param('article_id')}).populate('author').exec(function(error, responseList) {
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
                    res.send(404, {err: "no this article"});
                } else {
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
                                responseNiceCount:responseNiceCount, isReport: isReport, reportCount: reportCount});
                        });
                    });
                }
            }
        });
    },
    
	postArticle: function(req, res){
        console.log(classification);
		var title=req.param("title");
        var classification=req.param("classification");
		var author=req.session.user.id;
		var content=req.param("content");
        var responseNum=req.param("responseNum");
        var clickNum=req.param("clickNum");
        var board=req.param("board");

		Articles.create({title: title, author: author, content: content, classification: classification, responseNum: responseNum, clickNum: clickNum, board: board}).exec(function(error, article) {
            if(error) {
                console.log(title);console.log(author);console.log(content);
                res.send(500,{err: "DB Error" });
                console.log(error);
            } else {
                console.log(article);
                Articles.update({id: article.id},{lastResponseTime: article.updatedAt}).exec(function(err, article) {
                    if(err) {
                        res.send(500,{err: "DB Error" });
                        console.log(err);
                    } else {
                        console.log(article);
                        res.send(article);
                    }
                });
            }
        });

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

    deleteArticle: function(req, res) {
        var articleId = req.param("id");
        
        Articles.destroy({id: articleId}).exec(function deleteCB(err){
            if(err) {
                console.log("aaaaa");
                console.log(error);
                res.send(500,{err: "DB Error" });

            } else {
                console.log('The record has been deleted');
                res.end();
            }
        });

    },

    clickNice: function(req, res) {
        var articleId = req.param("article_id");
        Articles.find({id: articleId}).populate("nicer").exec(function(error, article) {
            if(error) {
                res.send(500,{err: "DB Error" });
                console.log("error"+error);
            } else {
                var niceList=article[0].nicer;
                console.log(niceList);
                if(!niceList) {
                    niceList=[];
                }
                var newNiceList=[]
                for(i=0; i<niceList.length; i++) {
                    if(niceList[i]&&niceList[i].id!=req.session.user.id) {
                        newNiceList.push(niceList[i]);
                    }
                }
                newNiceList.push(req.session.user);

                Articles.update({id: articleId}, {nicer: newNiceList}).exec(function(error, updated) {
                    if(error) {
                        res.send(500,{err: "DB Error" });
                        console.log("error2"+error);
                    } else {
                        console.log("no error");
                        console.log(updated[0].nicer.length);
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
                console.log(niceList);
                var newNiceList=[];
                for(i=0; i<niceList.length; i++) {
                    if(niceList[i]&&niceList[i].id!=req.session.user.id) {
                        newNiceList.push(niceList[i]);
                    }
                }
                console.log(newNiceList);
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

        //Articles.find({ title: { 'contains': keyword }, classification: {'contains': classification}}).populate("author").populate('nicer').exec(function(err,found){
        Articles.find({classification: {'contains': classification}}).populate("author", {alias: {'contains': keyword }}).populate("nicer").exec(function(err,found){
            if (err){
                res.send(500, { err: "DB Error" });
            } else{
                if(found){
                    // 搜尋完alias後，一個一個串起來
                    var obj = [];
                    for(f in found){
                        if(found[f].author){
                            //console.log(found[f].author);
                            obj.push(found[f]);
                        }
                    }

                    Articles.find({ title: { 'contains': keyword }, classification: {'contains': classification}}).populate("author").populate('nicer').exec(function(err,found){
                        if (err){
                            res.send(500, { err: "DB Error" });
                        } else{
                            if(found){
                                for(o in obj){
                                    found.push(obj[o]);
                                }
                                //console.log(found);
                                console.log(found);
                                res.send(found);
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
    mailAritlce: function(req,res){
        var articleId = req.param("article_id");
        Articles.find({id: articleId}).populate("response").exec(function(err, article) {
            if (err){
                res.send(500,{err:"找不到文章!"});
            }
            else{
                
                var content=article[0].content.replace(/<img src=\"[a-zA-Z0-9_\/\.]+\">/g,"圖片連結");               
                var async = require('async');
                async.each(article[0].response, function(val, callback) {
                    //每次要做的
                    User.find({id: val.author}).exec(function(err,author){
                        if (err){
                            callback("error"); 
                        }
                        else{
                            name=author[0].alias;  
                            content=content+name+" : "+val.comment+"<br>"; 
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
                            from: 'ntu.cpcp@gmail.com',  
                            //收件者  
                            to: req.param("mailaddress"),   
                            
                            //主旨  
                            subject: article[0].title, // Subject line  
                            
                            //嵌入 html 的內文  
                            html: content,   
                               
                        };  
                        
                        //發送信件方法  
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
};

