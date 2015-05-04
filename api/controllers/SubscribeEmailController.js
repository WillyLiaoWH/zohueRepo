/**
 * SubscribeEmailController
 *
 * @description :: Server-side logic for managing subscribeemails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	subscribe: function(req, res) {
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
            			res.send('已經訂閱過囉！');
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


        var email=req.param("email");
        // 用 call back 先檢查 session 是否有刪除 timeline 之權限
        checkSpec(function(){
        	checkExist(function(){
            	subs();
        	});
        });
	}
};

