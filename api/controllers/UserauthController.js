/**
 * UserauthController
 *
 * @description :: Server-side logic for managing Userauths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	authSet : function (req,res){
		 function chechAtuh(id, cb){
            Userauth.find({user:id}).exec(function(err,result){
            	if (err){
            		res.send(500,{err:"DB error"});
            	}
            	else{
            		if (result.length>0){
            			cb(true);
            		}
            		else{
            			cb(false);
            		}
            	}
            })
        }
        function set(inTable,id,item,status){
        	var str='{"city":"self","email":"self","gender":"self","phone":"self","bday":"self"}';
        	var auth_status=JSON.parse(str);
        	auth_status[item]=status;
            if(inTable){
                Userauth.update({user:id},{city:auth_status["city"],gender:auth_status["gender"],phone:auth_status["phone"],bday:auth_status["bday"]}).exec(function(err,result){
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
                    		name2=email;
                    	else if (item=="gender")
                    		name2="性別";
                    	else if (item=="bday")
                    		name2="生日";
                	res.send(name2 + "現在能被 " +name+"看到");
                });
            }
            else{
            	Userauth.create({user:id,city:auth_status["city"],gender:auth_status["gender"],phone:auth_status["phone"],bday:auth_status["bday"]}).exec(function(err,ret){
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

