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
    sendNewsLetter: function(req, res) {
        var mailSubject = req.param("mailSubject");
        var mailContent = req.param("mailContent");
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
                var options = {  
                    from: "ZOHUE-頭頸癌病友加油站 <ntu.cpcp@gmail.com>",  
                    bcc: receivers,    
                    subject: mailSubject,
                    text: mailContent, 
                };  
                //發送信件方法  
                transporter.sendMail(options, function(error, info){  
                    if(error){  
                        console.log(error);  
                    }else{  
                        console.log('訊息發送: ' + info.response);  
                        res.send("SEND"); 
                    }  
                }); 
            }
        });
    }
};

