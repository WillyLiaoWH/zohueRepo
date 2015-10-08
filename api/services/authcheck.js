module.exports = {
authCheck: function (req,cb){      //看這兩個人關係能看到什麼

    // var id=req.session.user.id;
    var searchId=req.param("id");
    var doctor=false;
    var friend=false;
    var self=false;
    if(typeof req.session.user === 'undefined'){
           var viewer = "NoLoginUser";
           var viewerId= "0";
    }else{
        var viewer = req.session.user.account;
        var viewerId=req.session.user.id;
        User.find({id:viewerId}).populate('friends').exec(function(err,user){
            if(err){

            }
            if (user[0].type=="D"){
                doctor=true;
            }
            for (var i=0 ; i<user[0].friends.length;i=i+1){
                if (user[0].friends[i].id==searchId)
                    friend=true;
            }
        });
        if (viewerId==searchId){
            self=true;
            friend=true;
            doctor=true;
        }
    }
    


    str = '{"name":false,"city":false,"email":false,"gender":false,"phone":false,"bday":false}';
    var index = JSON.parse('{"0":"city","1":"email","2":"gender","3":"phone","4":"bday","5":"name"}');
    var ret_status=JSON.parse(str);
    User.find({id:searchId}).exec(function(err,user){
    	if(user.length < 1){
    		cb(JSON.parse('{"err":"找不到使用者"}'));
    		return 0;
    	}
        var id=user[0].id;

        Userauth.find({user:id}).exec(function(err,auth){
            if (err){
                //res.send(500,"DB error");
            }
            else if (auth.length==0){
            	cb(JSON.parse('{"name":"true","city":true,"email":true,"gender":true,"phone":true,"bday":true}'));
            }
            else{
                var auth_set = auth[0]
                for (var i =0;i<=5;i++){
                    var ind = index[i];
                    if (auth_set[ind]==="self" && self){
                        ret_status[ind]=true;
                    }
                    else if (auth_set[ind]==="friend" && friend){
                        ret_status[ind]=true;
                    }
                    else if (auth_set[ind]==="doctor"&& doctor){
                        ret_status[ind]=true;
                    }
                    else if (auth_set[ind]==="all"){
                        ret_status[ind]=true;
                    }
                }
            }
            //console.log("asdfsadf"+JSON.stringify(ret_status))
            cb(ret_status);
        })
        
    });
}
}