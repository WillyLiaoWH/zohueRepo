/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt-nodejs');
var passwordHash = require('password-hash');
module.exports = {
    setFullSignupPage: function(req,res){
        RecoveryQuestion.find().exec(function(err, questions){
            dataProvider.getPostalData(req, function(postalData){
                res.view("signup/index", {
                    profileData: req.session.user,
                    postalData: postalData,
                    recoveryQuestions: questions,
                    scripts: [
                        'js/js_post/cropper.min.js',
                        'js/js_signup/crop-avatar.js',
                        'js/js_signup/joinus.js'
                    ],
                    stylesheets: [
                        'styles/css_post/crop-avatar.css',
                        'styles/css_post/cropper.min.css',
                        'styles/css_signup/style_signup.css'
                    ]
                });
            });
        });
    },

    getPassword: function(req,res){
        var account = req.param("account");
        var password = req.param("password");
        var random = req.param("random");
        User.findByAccount(account).exec(function(err,usr){
            if (err){
                res.send(500,"DB Error1");
            }
            else{
                if (usr.length==0){
                    res.send("NO");
                }
                else if (usr[0].random == random){
                    var uuid = require('node-uuid');
                    var buffer = new Array(32);
                    uuid.v4(null,buffer);
                    var new_random=uuid.unparse(buffer)

                    User.update({account:account},{password:passwordHash.generate(password),random:new_random}).exec(function(err,user){
                        if (err){
                            res.send(500,"DB Error2");
                        }
                        else{
                            req.session.user = user[0];
                            req.session.authenticated=true;
                            res.send("OK");
                        }
                    });
                }
                else{
                    res.send("dif");
                }
            }
        });
    },

    forgetA: function(req,res){
        var answer = req.param("ans");
        var account = req.param("account");
        var password = req.param("password")
        User.findByAccount(account).exec(function(err,usr){
            if(err){
                res.send(500,"DB Error");
            }
            else{
                if (answer === usr[0].forgetA){
                    User.update({account:account},{password:passwordHash.generate(password)},function(err,user){
                        if (err){
                            res.send(500,"DB error");
                        }
                        else{
                            req.session.user = user[0];
                            req.session.authenticated=true;
                            res.send("OK");
                        }
                    });
                }
                else{
                    res.send("NO");
                }
            }
        });
    },

    getQ: function(req,res){
        var account=req.param("account");
        var url = req.param("url");
        var url=url.replace("forget","");
        if (account.length>=0){
            User.findByAccount(account).exec(function(err,usr){
                if(err){
                    res.send(500,{err:"DB Error"});
                }
                else if (usr.length==0){
                    res.send({typ:"err",msg:"沒有這個使用者"});
                }
                else if(!usr[0].isFullSignup){
                    res.send({typ:"err",msg:"沒有完整註冊，無法找回密碼"})
                }
                else if (usr[0].email.length!==0){
                    //產生一個random number,然後存入User內，接著發信
                    var uuid = require('node-uuid');
                    var buffer = new Array(32);
                    uuid.v4(null,buffer);
                    var random = uuid.unparse(buffer)

                    User.update({account:account},{random:random},function(err,user){
                        //開始寫信
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
                            to: user[0].email,   
                            
                            //主旨  
                            subject: "[癌友加油站] 忘記密碼更新", // Subject line  
                            
                            //嵌入 html 的內文  
                            html: "您好，請點擊以下連結更新密碼。如果您並沒有使用ZOHUE平台或是沒有使用忘記密碼功能請直接忽略此信，感謝<br><a href=" +url+ "getPassword/" +random+ ">請點擊這裡</a><br><br>      癌友加油站 工作團隊",   
                               
                        };  
                        
                        //發送信件方法  
                        transporter.sendMail(options, function(error, info){  
                            if(error){  
                                console.log(error);  
                            }else{  
                                console.log('訊息發送: ' + info.response);  
                            }  
                        });  
                    });


                    res.send({typ:"email",email:usr[0].email});
                }
                else{
                    res.send({typ:"ok",msg:usr[0].forgetQ});
                }
            });
        }
    },

    signupAccountCheck: function(req, res) {
        var account=req.param("account");
        if(account!=null && account.length>0){
            User.findByAccount(account).exec(function(err, usr) {
                if(err){
                    res.send(500,{err: "DB Error" });
                } else if(usr.length!=0) {
                    res.send(400,{err:"帳號已有人使用"});
                }else{
                    res.send(200,{msg:"帳號可使用"});
                }
            }); 
        }
    },

    signup: function(req, res) {
        var account=req.param("account");
        var password=req.param("password");
        var alias=req.param("alias");
        var email=req.param("email");
        var FB_id=req.param("FB_id");
        var gender=req.param("gender");
        var type=req.param("type");
        var lname=req.param("lname");
        var fname=req.param("fname");
        var isFullSignup=req.param("isFullSignup");
        var hashedPassword = passwordHash.generate(password);
        var img="../images/img_avatar/upload/default.png";

        if (gender=="male"){
            gender="M";
        }
        else if (gender=="female"){
            gender="F";
        }
        if (FB_id.length>2){
            img="http://graph.facebook.com/"+account+"/picture";

        }
        
        User.findByAccount(account).exec(function(err, usr) {
            if(err){
                res.send(500,{err: "DB Error" });
            } else if(usr.length!=0) {
                res.send(400,{err:"帳號已有人使用"});
            } else {
                User.create({
                    account: account, 
                    password: hashedPassword, 
                    alias: alias, 
                    email: email, 
                    type: type, 
                    isFullSignup: isFullSignup, 
                    img: img,
                    FB_id:FB_id,
                    gender:gender,
                    fname:fname,
                    lname:lname,
                    friends: [45]
                    }).exec(function(error, user) {
                    if(error) {
                        res.send(500,{err: "DB Error" });
                        console.log(error);
                    } else {
                        User.update({id: user.id}, {lastForumTime: user.createdAt}).exec(function(error2, user2) {
                            if(error2) {
                                res.send(500,{err: "DB Error" });
                                console.log(error);
                            } else {
                                res.send(user2);
                            }
                        })
                    }
                });
            }
        });
    },

    fullSignup: function(req, res){
        var account = req.session.user.account;
        var fname=req.param("fname");
        var lname=req.param("lname");
        var img=req.param("img");
        var forgetQ=req.param("forgetQ");
        var forgetA=req.param("forgetA");
        var gender=req.param("gender");
        var phone=req.param("phone");
        var postalCode=req.param("postalCode");
        var addressCity=req.param("addressCity");
        var addressDistrict=req.param("addressDistrict");
        var address=req.param("address");
        var birthday=req.param("birthday");
        var primaryDisease=req.param("primaryDisease");
        var selfIntroduction=req.param("selfIntroduction");
        if(typeof req.session.user == 'undefined'){
            res.send(500,{err: "您沒有權限" });
        }else{
            User.findOne({account: account}).populate('Userauth').exec(function (err, user) {
                user.isFullSignup = true;
                user.fname = fname;
                user.lname = lname;
                user.img = img;
                user.forgetQ = forgetQ;
                user.forgetA = forgetA;
                user.gender = gender;
                user.phone = phone;
                user.postalCode = postalCode;
                user.addressCity = addressCity;
                user.addressDistrict = addressDistrict;
                user.address = address;
                user.birthday = birthday;
                user.primaryDisease = primaryDisease;
                user.selfIntroduction = selfIntroduction;

                user.save(function (err) {
                    Userauth.create({
                        user:user.id,
                        name:"friend",
                        city:"friend",
                        gender:"all",
                        email:"friend",
                        phone:"friend",
                        bday:"all"}).exec(function(err,ret){
                        if (err){
                            res.send(500,{err:"DB error"});
                        }else{
                            req.session.user = user;
                            req.session.authenticated=true;
                            res.send(user);
                        }
                    });
                });
            });
        }
    },

    change: function(req, res){
        var account = req.session.user.account;
        var email=req.param("email");
        var alias=req.param("alias");
        var fname=req.param("fname");
        var lname=req.param("lname");
        var img=req.param("img");
        var forgetQ=req.param("forgetQ");
        var forgetA=req.param("forgetA");
        var gender=req.param("gender");
        var phone=req.param("phone");
        var postalCode=req.param("postalCode");
        var addressCity=req.param("addressCity");
        var addressDistrict=req.param("addressDistrict");
        var address=req.param("address");
        var birthday=req.param("birthday");
        var primaryDisease=req.param("primaryDisease");
        var selfIntroduction=req.param("selfIntroduction");

        User.update({account: account}, {isFullSignup: true, 
            email: email, alias: alias, fname: fname, lname: lname, img: img,
            forgetQ: forgetQ, forgetA: forgetA, gender: gender, phone: phone, postalCode: postalCode,
            addressCity: addressCity, addressDistrict: addressDistrict, address: address,
            birthday: birthday, primaryDisease: primaryDisease, selfIntroduction: selfIntroduction
        }).exec(function(error, user) {
            //console.log(req.param());
            if(error) {
                res.send(500,{err: "DB Error" });
            } else {
                req.session.user = user[0];
                req.session.authenticated=true;
                //console.log(user[0]);
                res.send(user[0]);
            }
        });
    },

    ez_change: function(req, res){
        var account = req.session.user.account;
        var email=req.param("email");
        var alias=req.param("alias");

        User.update({account: account}, {email: email, alias: alias
        }).exec(function(error, user) {
            if(error) {
                res.send(500,{err: "DB Error" });
            } else {
                req.session.user = user[0];
                req.session.authenticated=true;
                //console.log(user[0]);
                res.send(user[0]);
            }
        });
    },

	login: function (req, res) {
        var account = req.param("account");
        var password = req.param("password");
        User.findByAccount(account).exec(function(err, usr) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                if (usr.length!=0) {
                    if(usr[0].suspended==true){ //處理帳號被停權時的後續動作: 送出停權訊息與停權原因。
                        SuspendReason.find({account: account}, {select: ['reason']}).exec(function(err,reason){
                            if (err) {
                                res.send(500, { err: "DB Error" });
                            } else {
                                res.send({suspended: true, reason:reason[reason.length-1].reason}); 
                            }
                        });
                    }else{
                        if (passwordHash.verify(password, usr[0].password)) {
                            req.session.user = usr[0];
                            req.session.authenticated=true;
                            res.send({suspended: false, isFullSignup:usr[0].isFullSignup, alias:usr[0].alias});
                            Record.create({user:usr[0],ip:req.ip,action:"Login"}).exec(function(err,ret){
                                console.log("使用者登入");
                            })
                        } else {
                            res.send(400, { err: "密碼錯誤" });
                        }
                    } 
                } else {
                    res.send(404, { err: "查無此帳號" });
                }
            }
        });
	},

    logout: function (req, res) {
        Record.create({user:req.session.user,ip:req.ip,action:"Logout"}).exec(function(err,ret){
            console.log("使用者登出")
            req.session.destroy()
            res.redirect('/home')
        })
        //req.session.save()
        //req.logout()
    },

    checkFull:function(req, res, next){
        if(req.session.user) {
            if(req.session.user.isFullSignup){
                res.send(true);
            } else {
                res.send(false);
            }
        } else {
            res.send(false);
        }
    },

    changePassword: function(req, res) {
        var oldPassword = req.param("oldPassword");
        var newPassword = req.param("newPassword");
        var reNewPassword = req.param("reNewPassword");
        theUser=req.session.user
        
        if(!passwordHash.verify(oldPassword,theUser.password)) {
            res.send(400, {err: "密碼錯誤"})
        } else {
            if (newPassword != reNewPassword){
                res.send(400,{err:"兩次密碼設定的內容不同，請重新輸入！"})
            }
            theUser.password=passwordHash.generate(newPassword);
            User.update({account: theUser.account}, {password: theUser.password}).exec(function(err, updated) {
                if(err) {
                    res.send("DB error");
                } else {
                    res.send("密碼更新");
                }
            });
        }
    },

    create: function(req, res, next){
        //似乎是沒用了但先不要刪掉好了 by Po
    
        if(!req.param('email') || !req.param('password')) {
            console.log(req.param("不可以空白"));
        }
        User.findOneByEmail(req.param('email'), function foundUser(err, user){
            if (err) return next(err);
            if(!user){
                var noAccountError=[{name: 'noAccount', message: 'error'}]
                req.session.flash={
                    err: noAccountError
                }
                res.redirect('/session/new');
                return;
            }
            var hash = bcrypt.hashSync(user.password);
            bcrypt.compare(req.param('password'), hash, function(err,valid){
                if (err) return next(err);
                if(!valid){
                    var usernamePasswordMismatchError=[{name: 'usernamePasswordMismatchError', message:"not match"}]
                    req.session.flash={
                        err:usernamePasswordMismatchError
                    }
                    res.redirect('/session/user/');
                    return;
                }
                req.session.authenticated=true;
                req.session.User=user;
                res.redirect('/user/show');
                return;
            });
        });
    },

    showProfile: function(req, res) {
        //console.log(req.session.user);
        res.send(req.session.user);
    },
    getProfile: function(req, res){
        //gets only the photo, alias, name, birthday, city,email,gender,phone
        //only the first two are required
        if(typeof req.session.user === 'undefined'){
            pri_id = "0"; //假設沒登入者id為0
            console.log("No login user looking at profile..."); 
        }else{
            pri_id = req.session.user.id;
        }
        
        var id=req.param("id");
        
        if (pri_id === id){
            res.send(JSON.stringify(req.session.user))
        }
        else{
            User.findById (id).exec(function(err, usr) {
                if (err) {
                    res.send(500, { err: "DB Error" });
                } else {
                    if (usr.length!=0) {
                        var ret= new Object();
                        ret.alias = usr[0].alias; console.log(usr[0].alias);
                        ret.img = usr[0].img;
                        ret.type = usr[0].type;
                        ret.primaryDisease = usr[0].primaryDisease;
                        var authcheck=require("../services/authcheck.js");
                        authcheck.authCheck(req,function(auth){
                            //console.log(auth)
                            if (auth.name===true){
                                ret.lname = usr[0].lname;
                                ret.fname = usr[0].fname 
                            }
                            if (auth.bday===true){
                                ret.birthday = usr[0].birthday;
                            }
                            if (auth.city === true){
                                ret.addressCity = usr[0].addressCity;
                            }
                            if (auth.email === true){
                                ret.email = usr[0].email
                            }
                            if (auth.gender === true){
                                ret.gender = usr[0].gender
                            }
                            if (auth.phone === true){
                                ret.phone = usr[0].phone
                            }
                            if (auth.type === true){
                                ret.type = usr[0].type
                            }
                            if (auth.primaryDisease === true){
                                ret.primaryDisease = usr[0].primaryDisease
                            }  
                            res.send(ret);
                        });
                    } else {
                        res.send(404, { err: "查無此帳號" });
                    }
                }
            });
        }
    },

    upload: function(req, res){
        console.log(req.param("avatar_data"));
        console.log(req.param("avatar_src"));

        var data = req.param("avatar_data");
        var data2;
        if(data){
            data2 = JSON.parse(data);
        }

        if(req.method === 'GET')
            return res.json({'status':'GET not allowed'});                      //  Call to /upload via GET is error

        function upload(cb){
            var uploadFile = req.file('avatar_file');
            uploadFile.upload({ dirname: '../../assets/images/img_signup'}, function onUploadComplete (err, files) {              //  Files will be uploaded to .tmp/uploads
                if (err) return res.serverError(err);                               //  IF ERROR Return and send 500 error with error
                var regex = /.*assets\\+(.*)/;
                var match = files[0].fd.match(regex);
                var result = match[1].replace(/\\/g, "\/");
                //console.log(result);

                //http://stackoverflow.com/questions/26130914/not-able-to-resize-image-using-imagemagick-node-js
                //var gm = require('gm').subClass({ imageMagick : true });
                var time = new Date().getTime();
                var recall_url = 'images/img_signup/upload/'+time+'.jpg';

                var easyimg = require('easyimage');
                easyimg.crop({
                    src:files[0].fd, dst:'assets/'+recall_url,
                    // width:200, height:200,
                    cropwidth:data2.width, cropheight:data2.height,
                    // width:data2.width, height:data2.height,
                    // cropwidth:200, cropheight:200,
                    gravity:'NorthWest',
                    x:data2.x, y:data2.y
                }).then(
                function(image) {
                    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                },
                function (err) {
                    console.log(err);
                });
                cb(recall_url);
            });
        }

        upload(function(a) {
            setTimeout(function(){
                res.ok(JSON.stringify({state:200,message:null,result:a}));
            }, 2000);
            
        });
    },
    getEmail: function(req, res) {
        var account = req.session.user.account;
        User.findByAccount(account).exec(function(err, usr) {
            if (err) {
                res.send(500, { err: "DB Error" });
            } else {
                if (usr.length!=0) {
                    res.send(usr[0].email);
                } else {
                    res.send(404, { err: "查無此帳號" });
                }
            }
        });

    },
    checkFB :function(req,res){
        var FB_id=req.param("FB_id");
        User.findByFB_id(FB_id).exec(function(err,usr){
            if (err){
                res.send(500,{err:"DB Error"});
            } else{
               // console.log(JSON.stringify(usr))
                //console.log(usr.length);
                if (usr.length>0){
                    req.session.user = usr[0];
                    req.session.authenticated=true;
                    res.send(true);
                }else{
                    res.send(false);
                }
            }
        });
    },

    removeBlack: function(req, res) {
        if(!req.session.user) {
            res.send({err: "尚未登入"});
        } else {
            User.find({id: req.session.user.id}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var blackList=user[0].blackList;
                    blackList.splice(blackList.indexOf(parseInt(req.param("id")), 1));
                    User.update({id: req.session.user.id}, {blackList: blackList}).exec(function(err, user) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        }
                    });
                }
            });
            User.find({id: req.param("id")}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var blackerList=user[0].blackerList;
                    blackerList.splice(blackerList.indexOf(req.session.user.id, 1));
                    User.update({id: req.param("id")}, {blackerList: blackerList}).exec(function(err, user) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        } else {
                            res.send({user: user});
                        }
                    });
                }
            });
        }
    },

    addFriend: function(req, res) {
        if(!req.session.user) {
            res.send({err: "haven't login"});
        } else {
            User.find({id: req.session.user.id}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var sentAddFriendsList=user[0].sentAddFriends;
                    sentAddFriendsList.push(parseInt(req.param("id")));
                    User.update({id: req.session.user.id}, {sentAddFriends: sentAddFriendsList}).exec(function(err, user) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        } else {
                            User.find({id: req.param("id")}).exec(function(err, user) {
                            if(err) {
                                console.log(err);
                                res.send({err: "DB error"});
                            } else {
                                var unconfirmedFriendsList=user[0].unconfirmedFriends;
                                unconfirmedFriendsList.push(req.session.user.id);
                                User.update({id: req.param("id")}, {unconfirmedFriends: unconfirmedFriendsList}).exec(function(err, user) {
                                    if(err) {
                                        console.log(err);
                                        res.send({err:"DB error"});
                                    } else {
                                        Notification.create({user: req.param("id"), notType: "7", from: req.session.user.id, alreadyRead: false, alreadySeen: false}).exec(function(err, not) {
                                            if(err) {
                                                console.log(err);
                                                res.send({err:"DB error"});
                                            }
                                        });
                                        Record.create({user:req.session.user,ip:req.ip,action:"FRIEND ADDD "+req.param("id")}).exec(function(err,ret){
                                            console.log("加好友")
                                            res.send({user: user});
                                        })
                                        
                                    }
                                });
                            }
                        });
                        }
                    });
                }
            });
        }
    },

    addBlack: function(req, res) {
        if(!req.session.user) {
            res.send({err: "尚未登入"});
        } else {
            User.find({id: req.session.user.id}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var blackList=user[0].blackList;
                    blackList.push(parseInt(req.param("id")));
                    var friendsList=user[0].friends;
                    if(friendsList.indexOf(parseInt(req.param("id"))!=-1)) {
                        friendsList.splice(friendsList.indexOf(parseInt(req.param("id"))), 1);
                    }
                    var sentAddFriendsList=user[0].sentAddFriends;
                    if(sentAddFriendsList.indexOf(parseInt(req.param("id"))!=-1)) {
                        sentAddFriendsList.splice(sentAddFriendsList.indexOf(parseInt(req.param("id"))), 1);
                    }

                    User.update({id: req.session.user.id}, {blackList: blackList, friends: friendsList, sentAddFriends: sentAddFriendsList}).exec(function(err, user) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        } else {
                            User.find({id: req.param("id")}).exec(function(err, user) {
                                if(err) {
                                    console.log(err);
                                    res.send({err: "DB error"});
                                } else {
                                    var unconfirmedFriendsList=user[0].unconfirmedFriends;
                                    if(unconfirmedFriendsList.indexOf(req.session.user.id)!=-1) {
                                        unconfirmedFriendsList.splice(unconfirmedFriendsList.indexOf(req.session.user.id), 1);
                                    }
                                    var friendsList=user[0].friends;
                                    if(friendsList.indexOf(req.session.user.id)!=-1) {
                                        friendsList.splice(friendsList.indexOf(req.session.user.id), 1);
                                    }
                                    var blackerList=user[0].blackerList;
                                    if(blackerList.indexOf(req.session.user.id)==-1) {
                                        blackerList.push(req.session.user.id);
                                    }
                                    User.update({id: req.param("id")}, {unconfirmedFriends: unconfirmedFriendsList, friends: friendsList, blackerList: blackerList}).exec(function(err, user) {
                                        if(err) {
                                            console.log(err);
                                            res.send({err:"DB error"});
                                        } else {
                                            Record.create({user:req.session.user,ip:req.ip,action:"FRIEND BLOC "+req.param("id")}).exec(function(err,ret){
                                                console.log("黑名單")
                                                res.send({user: user});
                                            })
                                            
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    confirmFriend: function(req, res) {
        if(!req.session.user) {
            res.send({err: "尚未登入"});
        } else {
            User.find({id: req.session.user.id}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var unconfirmedFriendsList=user[0].unconfirmedFriends;
                    unconfirmedFriendsList.splice(unconfirmedFriendsList.indexOf(parseInt(req.param("id"))), 1);
                    var friendsList=user[0].friends;
                    friendsList.push(parseInt(req.param("id")));
                    User.update({id: req.session.user.id}, {unconfirmedFriends: unconfirmedFriendsList, friends: friendsList}).exec(function(err, user) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        } else {
                            User.find({id: req.param("id")}).exec(function(err, user1) {
                                if(err) {
                                    console.log(err);
                                    res.send({err: "DB error"});
                                } else {
                                    var sentAddFriendsList=user1[0].sentAddFriends;
                                    sentAddFriendsList.splice(sentAddFriendsList.indexOf(req.session.user.id), 1);
                                    var friendsList=user1[0].friends;
                                    friendsList.push(req.session.user.id);

                                    User.update({id: req.param("id")}, {sentAddFriends: sentAddFriendsList, friends: friendsList}).exec(function(err, user) {
                                        if(err) {
                                            console.log(err);
                                            res.send({err:"DB error"});
                                        } else {
                                            Notification.create({user: req.param("id"), notType: "8", from: req.session.user.id, alreadyRead: false, alreadySeen: false, link: "/profile?"+req.session.user.id}).exec(function(err, not) {
                                                if(err) {
                                                    console.log(err);
                                                    res.send({err:"DB error"});
                                                }
                                            });
                                            Notification.create({user: req.session.user.id, notType: "8", from: req.param("id"), alreadyRead: false, alreadySeen: false, link: "/profile?"+user[0].id}).exec(function(err, not) {
                                                if(err) {
                                                    console.log(err);
                                                    res.send({err:"DB error"});
                                                }
                                            });
                                            Notification.destroy({user: req.session.user.id, notType: "7", from: req.param("id")}).exec(function(err, not) {
                                                if(err) {
                                                    console.log(err);
                                                    res.send({err:"DB error"});
                                                }
                                            });
                                            Record.create({user:req.session.user,ip:req.ip,action:"FRIEND CONF "+req.param("id")}).exec(function(err,ret){
                                                console.log("確認好友")
                                                res.send({user: user});
                                            })
                                            
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    removeFriend: function(req, res) {
        if(!req.session.user) {
            res.send({err: "尚未登入"});
        } else {
            User.find({id: req.session.user.id}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var friendsList=user[0].friends;
                    friendsList.splice(friendsList.indexOf(parseInt(req.param("id"))), 1);
                    User.update({id: req.session.user.id}, {friends: friendsList}).exec(function(err, user) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        } else {
                            User.find({id: req.param("id")}).exec(function(err, user) {
                                if(err) {
                                    console.log(err);
                                    res.send({err: "DB error"});
                                } else {
                                    var friendsList=user[0].friends;
                                    friendsList.splice(friendsList.indexOf(req.session.user.id), 1);
                                    User.update({id: req.param("id")}, {friends: friendsList}).exec(function(err, user) {
                                        if(err) {
                                            console.log(err);
                                            res.send({err:"DB error"});
                                        } else {
                                            Record.create({user:req.session.user,ip:req.ip,action:"FRIEND REMO "+req.param("id")}).exec(function(err,ret){
                                            console.log("刪除好友")
                                            res.send({user: user});
                                        })
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    removeAddFriend: function(req, res) {
        if(!req.session.user) {
            res.send({err: "尚未登入"});
        } else {
            User.find({id: req.session.user.id}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var sentAddFriendsList=user[0].sentAddFriends;
                    sentAddFriendsList.splice(sentAddFriendsList.indexOf(parseInt(req.param("id"))), 1);
                    User.update({id: req.session.user.id}, {sentAddFriends: sentAddFriendsList}).exec(function(err, user) {
                        if(err) {
                            console.log(err);
                            res.send({err:"DB error"});
                        } else {
                            User.find({id: req.param("id")}).exec(function(err, user) {
                                if(err) {
                                    console.log(err);
                                    res.send({err: "DB error"});
                                } else {
                                    var unconfirmedFriendsList=user[0].unconfirmedFriends;
                                    unconfirmedFriendsList.splice(unconfirmedFriendsList.indexOf(req.session.user.id), 1);
                                    User.update({id: req.param("id")}, {unconfirmedFriends: unconfirmedFriendsList}).exec(function(err, user) {
                                        if(err) {
                                            console.log(err);
                                            res.send({err:"DB error"});
                                        } else {
                                            Record.create({user:req.session.user,ip:req.ip,action:"FRIEND TAKE "+req.param("id")}).exec(function(err,ret){
                                            console.log("收回好友邀請")
                                            res.send({user: user});
                                            })
                                        }
                                        
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    searchFriends: function(req, res) {
        function sendback(allUser) {
            var unit=10;
            var place=req.param("place")==undefined?"":req.param("place");
            User.find({account: req.session.user.account}).exec(function(err, user) {
                if(err) {
                    console.log(err);
                    res.send({err: "DB error"});
                } else {
                    var ageList=[];
                    var users=[];
                    for(i=0; i<allUser.length; i++) {
                        var push=false;
                        if(allUser[i].id!=req.session.user.id) {
                            if(user[0].blackerList.indexOf(allUser[i].id)!=-1) {
                                // isFriend.push(-2);
                            } else if(user[0].friends.indexOf(allUser[i].id)!=-1) {
                                allUser[i].isFriend=3;
                                users.push(allUser[i]);
                                push=true;
                            } else if(user[0].sentAddFriends.indexOf(allUser[i].id)!=-1) {
                                allUser[i].isFriend=2;
                                users.push(allUser[i]);
                                push=true;
                            } else if(user[0].blackList.indexOf(allUser[i].id)!=-1) {
                                allUser[i].isFriend=-1;
                                users.push(allUser[i]);
                                push=true;
                            } else if(user[0].unconfirmedFriends.indexOf(allUser[i].id)!=-1) {
                                allUser[i].isFriend=1;
                                users.push(allUser[i]);
                                push=true;
                            } else {
                                allUser[i].isFriend=0;
                                users.push(allUser[i]);
                                push=true;
                            }
                        } else {
                            // isFriend.push(-2);
                        }
                        if(users.length>0) {
                            users[users.length-1].FBmail=undefined;
                            users[users.length-1].account=undefined;
                            users[users.length-1].email=undefined;
                            users[users.length-1].fname=undefined;
                            users[users.length-1].forgetQ=undefined;
                            users[users.length-1].forgetA=undefined;
                            users[users.length-1].lname=undefined;
                            users[users.length-1].password=undefined;
                            users[users.length-1].phone=undefined;
                            users[users.length-1].postalCode=undefined;
                            users[users.length-1].selfIntroduction=undefined;
                        }
                        if(push) {
                            var defaultAuth="friend";
                            var ageAuth;
                            var cityAuth;
                            if(allUser[i].Userauth.length==0) {
                                ageAuth=defaultAuth;
                                cityAuth=defaultAuth;
                            } else {
                                ageAuth=allUser[i].Userauth[0].bday;
                                cityAuth=allUser[i].Userauth[0].city;
                            }
                            if(allUser[i].birthday&&allUser[i].birthday!="") {
                                var now=new Date();
                                var birth=allUser[i].birthday.split(" ");
                                var y=parseInt(birth[3]);
                                var m=monthMap[birth[1]];
                                var d=parseInt(birth[2]);
                                var birthday=new Date(y, m, d);
                                var age=now.getFullYear()*10000+now.getMonth()*100+now.getDate()-birthday.getFullYear()*10000+birthday.getMonth()*100+birthday.getDate();
                                age=Math.floor(age/10000);
                                switch(ageAuth) {
                                    case "all":
                                        users[users.length-1].age=age;
                                        break;
                                    case "friend":
                                        if(users[users.length-1].isFriend==3) {
                                            users[users.length-1].age=age;
                                        } else {
                                            users[users.length-1].age=-1;
                                        }
                                        break;
                                    case "self":
                                        users[users.length-1].age=-1;
                                        break;
                                }
                            } else {
                                users[users.length-1].age=-1;
                            }

                            switch(cityAuth) {
                                case "all":
                                    break;
                                case "friend":
                                    if(users[users.length-1].isFriend!=3) {
                                        if(place!=""&&users[users.length-1].addressCity.indexOf(place)!=-1) {
                                            users.pop();
                                        } else {
                                            users[users.length-1].addressCity="";
                                        }
                                    }
                                    break;
                                case "self":
                                    if(place!=""&&users[users.length-1].addressCity.indexOf(place)!=-1) {
                                        users.pop();
                                    } else {
                                        users[users.length-1].addressCity="";
                                    }
                                    break;
                            }
                            var picSize = 100;
                            var type = allUser[i].type;
                            var diseaseList={
                                  '1':"鼻咽癌",
                                  '2':"鼻腔/副鼻竇癌",
                                  '3':"口腔癌",
                                  '4':"口咽癌",
                                  '5':"下咽癌",
                                  '6':"喉癌",
                                  '7':"唾液腺癌",
                                  '8':"甲狀腺癌",
                                  '999':"其它"
                            };
                            switch(type){
                                case "D":
                                    users[users.length-1].authorIcon="<img class='imgAuthorType' src='/images/img_forum/doctor_icon.png' title='已認證醫師' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
                                    users[users.length-1].authorType="醫師";
                                    users[users.length-1].diseaseDesc="主治"+diseaseList[allUser[i].primaryDisease];
                                    break;
                                case "S":
                                    users[users.length-1].authorIcon="<img class='imgAuthorType' src='/images/img_forum/sw_icon.png' title='已認證社工師' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
                                    users[users.length-1].authorType="社工師";
                                    users[users.length-1].diseaseDesc="主治"+diseaseList[allUser[i].primaryDisease];
                                    break;
                                case "RN":
                                    users[users.length-1].authorIcon="<img class='imgAuthorType' src='/images/img_forum/sw_icon.png' title='已認證護理師' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
                                    users[users.length-1].authorType="護理師";
                                    users[users.length-1].diseaseDesc="主治"+diseaseList[allUser[i].primaryDisease];
                                    break;
                                case "P":
                                    users[users.length-1].authorIcon="<img class='imgAuthorType' src='/images/img_forum/user_icon.png' title='病友' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
                                    users[users.length-1].authorType="";
                                    users[users.length-1].diseaseDesc="患有"+diseaseList[allUser[i].primaryDisease];
                                    break;
                                case "F":
                                    users[users.length-1].authorIcon="<img class='imgAuthorType' src='/images/img_forum/user_icon.png' title='家屬' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
                                    users[users.length-1].authorType="";
                                    users[users.length-1].diseaseDesc="照顧"+diseaseList[allUser[i].primaryDisease]+"患者";
                                    break;
                                default:
                                    users[users.length-1].authorIcon="<img class='imgAuthorType' src='/images/img_forum/user_icon.png' title='一般民眾' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
                                    users[users.length-1].authorType="";
                                    users[users.length-1].diseaseDesc="";
                                    break;
                            }
                        }
                    }
                    function forSort(a) {
                        if(a.isFriend==3) {
                            return 0;
                        } else if(a.type=="D") {
                            return 1;
                        } else if(a.type=="RN") {
                            return 2;
                        } else if(a.type=="S") {
                            return 3;
                        } else if(a.type=="P") {
                            return 4;
                        } else if(a.type=="F") {
                            return 5;
                        } else if(a.type=="N") {
                            return 6;
                        } else {
                            return 7;
                        }
                    }
                    users.sort(function(a, b) {
                        return forSort(a)-forSort(b);
                    });
                    //var hasNext;
                    if(users.length<=(page+1)*unit) {
                        hasNext=false;
                        return res.view("friends/index", {
                            users: users,
                            hasNext: hasNext,
                            page: page+1,
                            diseaseList: diseaseList,
                            scripts: [
                                '/js/js_public/modalBox.js-master/modalBox-min.js',
                                '/js/js_public/alertify.js',
                                '/js/js_friends/mainJS.js'
                              ],
                            stylesheets: [
                                '/styles/importer.css',
                                '/styles/css_public/themes/alertify.core.css',
                                '/styles/css_public/themes/alertify.default.css',
                                '/styles/css_friends/style.css'
                              ]
                        });
                        //res.send({users: users.slice(page*unit), hasNext: hasNext});
                    } else {
                        hasNext=true;
                            return res.view("friends/index", {
                                users: users.slice(0, page*unit+unit),
                                hasNext: hasNext,
                                page: page+1,
                                diseaseList: diseaseList,
                                scripts: [
                                    '/js/js_public/modalBox.js-master/modalBox-min.js',
                                    '/js/js_public/alertify.js',
                                    '/js/js_friends/mainJS.js'
                                ],
                                stylesheets: [
                                    '/styles/importer.css',
                                    '/styles/css_public/themes/alertify.core.css',
                                    '/styles/css_public/themes/alertify.default.css',
                                    '/styles/css_friends/style.css'
                                ]
                            });
                        //res.send({users: users.slice(page*unit, page*unit+unit), hasNext: hasNext});
                    }
                }
            });
        }
        var alias=req.param("alias")==undefined?"":req.param("alias");
        var disease=req.param("disease")==undefined?"":req.param("disease");
        var place=req.param("place")==undefined?"":req.param("place");
        var userType=req.param("userType")==undefined?"":req.param("userType");
        var monthMap={
            "Jan": 1,
            "Feb": 2,
            "Mar": 3,
            "Apr": 4,
            "May": 5,
            "Jun": 6,
            "Jul": 7,
            "Aug": 8,
            "Sep": 9,
            "Oct": 10, 
            "Nov": 11,
            "Dec": 12
        };
        var page=req.param("thisPage")==undefined?0:parseInt(req.param("thisPage"));
        //console.log("FRIEND FIND "+alias+" "+userType+" "+disease+" "+place+" "+page);
        if(!req.session.user) {
            User.find({alias: {'contains': alias}}).exec(function(err, users) {
                if(err) {
                    console.log(err);
                    res.send(500, {err: "DB Error"});
                } else {
                    res.send(404, {err: "你尚未登入喔"});
                }
            });
        } else {
            Record.create({user:req.session.user,ip:req.ip,action:"FRIEND FIND "+alias+" "+userType+" "+disease+" "+place+" "}).exec(function(err,ret){
                console.log("搜尋好友")

                if(disease!=""||place!="") {
                    User.find({where: {alias: {'contains': alias}, primaryDisease: {'contains': disease}, addressCity: {'contains': place}, type: {'contains': userType}, suspended: { '!': true }}}).populate("Userauth").exec(function(err, allUser){
                        if(err) {
                            res.send(500, {err: "DB Error"});
                        } else {
                            sendback(allUser);
                        }
                    });
                } 
                else {
                    User.find({where: {alias: {'contains': alias}, type: {'contains': userType}, suspended: { '!': true }}}).exec(function(err, allUser){
                        if(err){
                            res.send(500, {err: "DB Error"});
                        }else{ 
                            sendback(allUser);
                        }
                    });
                }
            });    
        }
    },
    friendStatus : function (req,res){
        if(req.session.user) {
            var my_id = req.session.user.id;
            var target_id = req.param("target_id");
            
            User.findById(my_id).exec(function(err,usr){
                if (err){
                    console.log(err);
                    res.send(500)
                }
                friendlist = usr[0].friends;
                unconfirmedFriends = usr[0].unconfirmedFriends;
                sentAddFriends= usr[0].sentAddFriends;
                
                if (friendlist.indexOf(parseInt(target_id))!=-1){
                    //是好友
                    
                    res.send("friend");
                }
                else if (unconfirmedFriends.indexOf(parseInt(target_id))!=-1){
                    
                    res.send("unconfirmed");
                }
                else if (sentAddFriends.indexOf(parseInt(target_id))!=-1){
                    res.send("sent");
                }
                else{
                    res.send("no");
                }

            });
        }
    },
    updateLastForumTime: function(req, res) {
        if(req.session.user) {
            User.update({id: req.session.user.id}, {lastForumTime: new Date().toISOString()}).exec(function(err, user) {
                if(err) {
                    console.log("錯誤訊息："+err);
                }
            })
        }
    }
    



	// beforeCreate: function (attrs, next) {
	// 	alert("beforeCreate");
 //    	var bcrypt = require('bcrypt');

 //    	bcrypt.genSalt(10, function(err, salt) {
 //      		if (err) return next(err);

 //      		bcrypt.hash(attrs.password, salt, function(err, hash) {
 //        		if (err) return next(err);

 //        		attrs.password = hash;
 //        		next();
 //      		});
 //    	});
 //  	},



 //  	login: function (req, res) {
 //    var bcrypt = require('bcrypt');

 //    User.findOneByEmail(req.body.email).done(function (err, user) {
 //      if (err) res.json({ error: 'DB error' }, 500);

 //      if (user) {
 //        bcrypt.compare(req.body.password, user.password, function (err, match) {
 //          if (err) res.json({ error: 'Server error' }, 500);

 //          if (match) {
 //            // password match
 //            req.session.user = user.id;
 //            res.json(user);
 //          } else {
 //            // invalid password
 //            if (req.session.user) req.session.user = null;
 //            res.json({ error: 'Invalid password' }, 400);
 //          }
 //        });
 //      } else {
 //        res.json({ error: 'User not found' }, 404);
 //      }
 //    });
 //  }
};

