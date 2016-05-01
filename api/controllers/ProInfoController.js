/**
 * ProInfoController
 *
 * @description :: Server-side logic for managing proinfoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {
    setPage: function (req,res){


        function datesort(art1,art2){
          date1 = art1.date
          date2 = art2.date
          year1 = parseInt(date1.split("年")[0])
          month1 = parseInt(date1.split("年")[1].split("月")[0])
          year2 = parseInt(date2.split("年")[0])
          month2 = parseInt(date2.split("年")[1].split("月")[0])
          if (year1 == year2){
            return month2-month1
        }
        else{
            return year2-year1
        }
    }

    var page = req.param("page")
    ProInfo.find({sort: "id desc"}).exec(function(err, articlesList) {
        if (err) {
            console.log("DB error")
        } else {
            articlesList.sort(datesort)
            var MobileDetect = require('mobile-detect'),
            md = new MobileDetect(req.headers['user-agent']);
            var page="";
            var m;
            var css;
            if (md.mobile()==null){
                    //PC
                    page="proInfo/index1";
                    css="style";
                    m="layout";
                }
                else{
                    //mobile
                    page="proInfo/mindex1";
                    css="mStyle";
                    m="mlayout";
                }
                res.view(page, {
                    list:articlesList,
                    layout:m,
                    scripts: [
                    '/js/js_public/modalBox.js-master/modalBox-min.js',
                    '/js/js_ProInfo/mainJS.js',
                    ],
                    stylesheets: [
                    '/styles/css_ProInfo/'+css+'.css',
                    '/styles/importer.css'
                    ],
                });
            }
        });

},

    createProinfo: function(req, res) { // 將郵遞區號檔案轉換成local DB
        fs = require('fs');
        var content;
        var array;
        fs.readFile('proinfo.csv', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }

            array = data.split("\n");
            array.shift();
            array.forEach(function(line) {
                var split = line.split(",");
                
                var content = '<embed src="'+split[2]+'" height="100%" width="100%" internalinstanceid="9"><div id="postContent_image"><div class="clear" id="clear"></div></div>';
                var follower=45;
                Articles.create({ title: split[0], author: 45, content: content, classification: '分享', responseNum: 0, clickNum: 0, board: 21, follower: [follower], lastResponseTime: new Date() }).exec(function(error, proinfo) {
                    if(error) {
                        console.log(error);
                        res.send(500,{err: "DB Error" });
                    } else {
                        ProInfo.create({ title: split[0], author: split[1], link: split[2], classification: split[3],cancerType: split[4],note: split[5],date: split[6], articleURL: "../article/"+proinfo.id }).exec(function(error, proinfoArticle) {
                            if(error) {
                                console.log(error);
                                res.send(500,{err: "DB Error" });
                            } else {
                                console.log(proinfoArticle);
                            }
                        });
                    }
                });
            });
});
},
deletetProInfo:function(req,res){
    var isAdmin = req.session.user.isAdmin;
    if (isAdmin == true) {
        ProInfo.find({id:req.param("id")}).exec(function(err,proInfo){
            if (err){
                res.send(500,{err :"DB Error"})
            }
            else{
                Articles.destroy({id:proInfo[0].articleURL.substring(11)}).exec(function deleteCB(err){
                    if (err){
                        res.send(500,{err:"DB Error"})
                    }
                    else{

                        ProInfo.destroy({id:req.param("id")}).exec(function deleteCB(err){

                            res.send("OK");
                        })
                    }
                });
            }
        });
    }
},
destroyAll: function(req, res) {
    ProInfo.destroy({}).exec(function deleteCB(err){
        Articles.destroy({board:21}).exec(function deleteCB(err){
            console.log('紀錄已刪除');
            res.send("OK!");
        });
            // console.log('紀錄已刪除');
            // res.send("OK!");
        });
},

setProInfoPage: function(req, res){
  ProInfo.find({sort: "id desc"}).exec(function(err, articlesList) {
            //articlesList.sort('date ASC');
            if (err) {
            	res.send(500, { err: "DB Error" });
            } else {
                res.send(articlesList);
            }
        });
},

searchProInfo: function(req, res){
    var keyword = req.param("keyword");
    console.log(keyword);

    ProInfo.find({ title: { 'contains': keyword }, sort: "date desc"}).exec(function(err,found){
        if (err){
            res.send(500, { err: "DB Error" });
        } else{
            if(found){
                res.send(found);
            }else{
                res.send(500, { err: "找不到喔！" });
            }
        }
    });
},
recordProInfo: function(req, res){
    var link = req.param("link");
    Record.create({user:req.session.user,ip:req.ip,action:"INFO "+link}).exec(function(ret){
        console.log("專業知識")
    })
},
getProInfo: function(req,res){
    var id = req.param("id");
    ProInfo.find(id).exec(function(err,ret){
        if(err){
            res.send(500,{err:'DB Error'})
        }
        else{
            res.send(ret[0]);
        }
    })
},
changeProInfo:function(req,res){
    var type= req.param("type")
    var cancer= req.param("cancer")
    var date= req.param("date")
    var title= req.param("title")
    var author= req.param("author")
    var link= req.param("link")
    var note=req.param("note")
    var id = req.param("id")

    ProInfo.update(id,{title:title,author:author,link:link,classification:type,cancerType:cancer,note:note,date:date}).exec(function(err,ret){
        if (err){
            res.send(500,{err:'DB Error'})
        }
        else{
            res.send(ret)
        }
    })
},

};

