/**
 * SubscribeEmailController
 *
 * @description :: Server-side logic for managing subscribeemails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	subscribe: function(req, res) {
        var email="";
        var login=0;

        function getEmail(cb){
            if(typeof req.session.user == 'undefined'){
                email=req.param("email");
                login = 0;
                cb();
            }else{
                email = req.session.user.email;
                login = 1;
                cb();
            }
        }
		function checkSpec(cb){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
			if(re.test(email)){
				cb();
			}else{
				res.send('格式錯誤！');
			}
		}
		function checkExist(cb){
            SubscribeEmail.find({email: email}).exec(function(error, response) {
            	if(error) {
            	    res.send(500,{err: "DB Error" });
            	    console.log(error);
            	} else {
            		if(response.length > 0){
                        if(login==0){
                            res.send('已經訂閱過囉！');
                        }
                        else{
                            SubscribeEmail.destroy({email: email}).exec(function(err){
                                if(err) {
                                    res.send(500,{err: "DB Error" });
                                } else {
                                    res.send('您已取消訂閱電子報，再按一次即可恢復訂閱！');
                                }
                            });
                        }
            		}else{
            			cb();
            		}
            	}
        	});
        }
        function subs(){
            SubscribeEmail.create({email: email}).exec(function(error, response) {
            	if(error){
            		res.send(500,{err: "DB Error" });
            		console.log(error);
            	}else{
            		res.send('訂閱成功！');
            	}
        	});   
        }
        getEmail(function(){
            checkSpec(function(){
                checkExist(function(){
                    subs();
                });
            });
        });
	},

    upload: function(req, res){ //上傳附加檔案
        var adminAccount=req.session.admin;
        Admins.find({account: adminAccount}).exec(function(error, admin){
            if(error){
                console.log(error);
            }else{
                if (admin.length!=0) {
                    if(req.method === 'GET')
                        return res.json({'status':'GET not allowed'});
                    var uploadFile = req.file('uploadFile');
                    var originalFileName = uploadFile["_files"][0].stream.filename;
                    var fileType = originalFileName.substring(originalFileName.lastIndexOf("."), originalFileName.length);
                    var milliseconds = new Date().getTime();
                    var newFileName = milliseconds+originalFileName;

                    uploadFile.upload({ dirname: '../../assets/images/img_email', saveAs: newFileName},function onUploadComplete (err, files) {
                        if (err) return res.serverError(err);
                        res.send(newFileName);
                    });
                }else{
                    res.send("false");
                }
            }
        });
    },

    sendNewsLetter: function(req, res) {
        var mailSubject = req.param("mailSubject");
        var mailContent = req.param("mailContent");
        var attachmentObj  = req.param("attachmentList").split(',');
        var attachmentNameObj = req.param("attachmentNameList").split(',');

        var attachmentList = [];
        for(i=0; i<attachmentObj.length; i++){
            attachmentList.push({
                filename: attachmentNameObj[i],
                path: "C:/Users/User/zohueRepo/assets/images/img_email/"+attachmentObj[i]
                //path: "C:/github/zohueRepo/assets/images/img_email/"+attachmentObj[i]
            });
        }

        var adminAccount=req.session.admin;
        Admins.find({account: adminAccount}).exec(function(error, admin){
            if(error){
                console.log(error);
            }else{
                if (admin.length!=0) {
                    SubscribeEmail.find().exec(function(err, mailList) {
                        if (err) {
                            res.send(500, { err: "DB Error" });
                        } else {
                            var receivers = "";
                            for(i=0; i<mailList.length; i++){
                                receivers += mailList[i].email;
                                receivers +=",";
                            }
                            var nodemailer = require('nodemailer');  
                            var transporter = nodemailer.createTransport({  
                                service: 'Gmail',  
                                auth: {  
                                    user: 'ntu.cpcp@gmail.com',  
                                    pass: 'lckung413'  
                                }  
                            });
                            if(req.param("attachmentList").length==0){
                                var options = {  
                                    from: "ZOHUE-頭頸癌病友加油站 <ntu.cpcp@gmail.com>",  
                                    bcc: receivers,    
                                    subject: mailSubject,
                                    text: mailContent
                                }
                            }else{
                                var options = {  
                                    from: "ZOHUE-頭頸癌病友加油站 <ntu.cpcp@gmail.com>",  
                                    bcc: receivers,    
                                    subject: mailSubject,
                                    text: mailContent, 
                                    attachments: attachmentList
                                };  
                            }

                            //發送信件方法  
                            transporter.sendMail(options, function(error, info){  
                                if(error){  
                                    console.log(error);  
                                    res.send("電子報發送失敗！");
                                }else{  
                                    console.log('訊息發送: ' + info.response);
                                    res.send("SEND"); 
                                    if(req.param("attachmentList")!=0){ //送出郵件後要刪除附加檔案
                                        for(k=0;k<attachmentObj.length;k++){ 
                                            var fs = require('fs');
                                            var path = "C:/github/zohueRepo/assets/images/img_email/"+attachmentObj[k];
                                            fs.unlink(path, function (err) {
                                                if (err){
                                                    throw err;
                                                    console.log(err);
                                                }else{
                                                    console.log("File deleted."); 
                                                }
                                            });
                                        }
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

    deleteFile: function(req, res) { //刪除檔案
        var fileName = req.param("fileName");
        var fs = require('fs');
        var path = "C:/github/zohueRepo/assets/images/img_email/"+fileName;
        //var path = "C:/Users/User/zohueRepo/assets/images/img_email/"+fileName;
        fs.unlink(path, function (err) {
            if (err){
                throw err;
                console.log(err);
            }else{
                res.send("SEND"); 
            }
        });
    },

    getAllSubscribers: function(req, res){
        var searchEmail = req.param("searchEmail");
        var adminAccount=req.session.admin;
        Admins.find({account: adminAccount}).exec(function(error, admin){
            if(error){
                console.log(error);
            }else{
                if (admin.length!=0) {
                    SubscribeEmail.find({or:[{email : {'contains' : searchEmail}}]}).exec(function(err, subscribers) {
                        if (subscribers.length==0) {
                            res.send("查無結果！");
                            //res.view('backend/index', {layout: null});
                        } else {
                            if (err) {
                                res.send(500, { err: "DB Error" });
                            } else {
                                res.send(subscribers);
                            }
                        }
                    });
                }else{
                    res.send("你不是管理員喔！");
                }
            }
        });
    },

    deleteSubscriber: function(req, res){
        var subscriberId = req.param("id");
        SubscribeEmail.destroy({id: subscriberId}).exec(function(err){
            if(err) {
                res.send(500,{err: "DB Error" });
            } else {
                res.send('紀錄已刪除');
            }
        });
    }

};

