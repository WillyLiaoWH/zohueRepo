/**
 * UserauthController
 *
 * @description :: Server-side logic for managing Userauths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    authGet:function(req,res){          //得到使用者的授權狀態
        id=req.session.user.id;
        Userauth.find({user:id}).exec(function(err,result){
            if(err){
                res.send(500,{err:"DB error"});
            }
            if(result.length==0){
                str='{"name":"all","city":"all","email":"all","gender":"all","phone":"all","bday":"all"}';
                res.send(JSON.parse(str));
            }
            else{
                res.send(result[0]);
            }
        })
    },


    authCheck: function (req,res){      //看這兩個人關係能看到什麼
        var authcheck = require("../services/authcheck.js")
        authcheck.authCheck(req,function(auth){
            res.send(auth);
        })
    },
	authSet : function (req,res){
		 function chechAtuh(id, cb){
            Userauth.find({user:id}).exec(function(err,result){
            	if (err){
            		res.send(500,{err:"DB error"});
            	}
            	else{
            		if (result.length>0){
            			cb(result[0]);
            		}
            		else{
            			cb(false);
            		}
            	}
            })
        }
        function set(inTable,id,item,status){
            if(inTable){
                var auth_status=inTable
                auth_status[item]=status;
                Userauth.update(
                    {user:id},
                    {name:auth_status["name"],
                    city:auth_status["city"],
                    gender:auth_status["gender"],
                    phone:auth_status["phone"],
                    bday:auth_status["bday"],
                    email:auth_status["email"]}).exec(function(err,result){
                	if (err){
                		res.send(500,"DB error");
                	}
                	var name;
                        if (status=="all")
                            name="全部人";
                        else if(status=="doctor")
                            name="醫生";
                        else if(status=="friend")
                            name="朋友";
                        else
                            name="自己";
                    var name2;
                    	if(item=="city")
                    		name2="居住地";
                    	else if (item=="email")
                    		name2="email";
                    	else if (item=="gender")
                    		name2="性別";
                    	else if (item=="bday")
                    		name2="生日";
                        else if (item=="phone")
                            name2="電話";
                	res.send(name2 + "現在能被 " +name+"看到");
                });
            }
            else{
                var str='{"name":"self","city":"self","email":"self","gender":"self","phone":"self","bday":"self"}';
                var auth_status=JSON.parse(str);
                auth_status[item]=status;
            	Userauth.create({
                    user:id,name:auth_status["name"],
                    city:auth_status["city"],
                    gender:auth_status["gender"],
                    phone:auth_status["phone"],
                    bday:auth_status["bday"]}).exec(function(err,ret){
            		if (err){
                		res.send(500,{err:"DB error"});
                	}
                	var name;
                        if (status=="all")
                            name="全部人";
                        else if(status=="doctor")
                            name="醫生";
                        else if(status=="friend")
                            name="朋友";
                        else
                            name="自己";
                    var name2;
                    	if(item=="city")
                    		name2="居住地";
                    	else if (item=="email")
                    		name2=email;
                    	else if (item=="gender")
                    		name2="性別";
                    	else if (item=="bday")
                    		name2="生日";
                	res.send(name2 + "現在能被 " +name2+"看到");
            	})
            }
        }
        var id =req.session.user.id;
        var item = req.param("item");
        var status = req.param("status");
        chechAtuh(id, function(inTable){
            set(inTable,id, item,status);
        });
	}
};

