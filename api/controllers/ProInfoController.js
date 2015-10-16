/**
 * ProInfoController
 *
 * @description :: Server-side logic for managing proinfoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
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
                ProInfo.create({ title: split[0], author: split[1], link: split[2], classification: split[3],cancerType: split[4],note: split[5],date: split[6] }).exec(function(error, proinfo) {
                    if(error) {
                        console.log(error);
                        res.send(500,{err: "DB Error" });
                    } else {
                        console.log(proinfo);
                    }
                });
                var content = '<embed src="'+split[2]+'" height="100%" width="100%" internalinstanceid="9"><div id="postContent_image"><div class="clear" id="clear"></div></div>';
                var follower=45;
                Articles.create({ title: split[0], author: 45, content: content, classification: '分享', responseNum: 0, clickNum: 0, board: 21, follower: [follower], lastResponseTime: new Date() }).exec(function(error, proinfo) {
                    if(error) {
                        console.log(error);
                        res.send(500,{err: "DB Error" });
                    } else {
                        console.log(proinfo);
                    }
                });
            });
        });
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
		ProInfo.find({sort: "date desc"}).exec(function(err, articlesList) {
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
    }

};

