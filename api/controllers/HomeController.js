/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getHomepagePic: function(req, res){

            HomepagePic.find({}).exec(function(err, homepagePics) {
                if (homepagePics.length==0) {
                    res.send("查無結果！");
                } else {
                    if (err) {
                        res.send(500, { err: "DB Error" });
                    } else {
                        res.send(homepagePics);
                    }
                }
            });


	},
	deleteHomepagePic: function(req, res){
		var homepagePicId = req.param("id");
        var isAdmin = req.session.user.isAdmin;
        if (isAdmin == true) {
            HomepagePic.destroy({id: homepagePicId}).exec(function(err){
                if(err) {
                    res.send(500,{err: "DB Error" });
                } else {
                    res.send('照片已刪除');
                }
            });
        }else{
            res.send("你不是管理員喔！");
        }
    

	},
	addHomepagePic: function(req, res){
		var title = req.param("title");
		var pic = req.param("pic");
		pic="../images/img_home/upload/"+pic;

        var isAdmin = req.session.user.isAdmin;
        if (isAdmin == true) {


            HomepagePic.create({title:title, pic:pic}).exec(function(err){
                if(err) {
                    res.send(500,{err: "title跟pic不得為空白" });
                } else {
                    res.send('照片已新增');
                }
            });
        }else{
            res.send("你不是管理員喔！");
        }
    

	},
	upload_homepagePic: function (req, res) {
		console.log("in upload");
    // e.g.
    // 0 => infinite
    // 240000 => 4 minutes (240,000 miliseconds)
    // etc.
    //
    // Node defaults to 2 minutes.
	    res.setTimeout(0);
	    var time = new Date().getTime();
	    var pic="../images/img_home/upload/"+time+".jpg";
		// var title=req.param("title");
		

		if(typeof req.param("title")=='undefined'){
			var title=time;
		}else var title=req.param("title");

		if(typeof req.file("avatar")=='undefined'){
			res.redirect("/backendbackend");
		}

		console.log(title);
        var isAdmin = req.session.user.isAdmin;
        if (isAdmin == true) {

            HomepagePic.create({title:title, pic:pic}).exec(function(err){
                if(err) {
                    res.send(500,{err: "DB Error" });
                } 
                // else {
                //     res.send('照片已新增');
                // }
            });
        }else{
            res.send("你不是管理員喔！");
        }


	    req.file('avatar')
	    .upload({
	      dirname: '../../assets/images/img_home/upload',
	      saveAs:time+".jpg",
	      // You can apply a file upload limit (in bytes)
	      maxBytes: 1000000
	      
	    }, function whenDone(err, uploadedFiles) {
	      if (err) return res.serverError(err);
	      else res.redirect("/backendbackend");
	    });
	 },






	setTopArticleFormula: function(req, res){
		if(!/^\+?(0|[1-9]\d*)$/.test(req.param("nicerNumWeight")) || !/^\+?(0|[1-9]\d*)$/.test(req.param("responseNumWeight")) || !/^\+?(0|[1-9]\d*)$/.test(req.param("clickNumWeight"))){
			res.send(500,{err: "格式錯誤！" });
		}else{
			var param = {
				nicerNumWeight: req.param("nicerNumWeight"), 
				responseNumWeight: req.param("responseNumWeight"),
				clickNumWeight: req.param("clickNumWeight")
			};

			fs.writeFile('config/formula.json', JSON.stringify(param), function (err) {
				if (err) return console.log(err);
				res.send("success");
			});
		}
	},
	getAnnouncement: function(req, res){
		Boards.find({title: "最新活動"}).populate('articles',{deleted:'false', select: ['title', 'id', 'createdAt'], sort: 'createdAt DESC'}).exec(function(err, Announcement) {
			if(err) {
                res.send(500,{err: "DB Error" });
            } else {
                res.send(Announcement[0].articles);
            }
		});
	},
	getTopArticles: function(req, res){
		function compare(a,b) {
			if (a.topLevel < b.topLevel)
		    	return 1;
		  	if (a.topLevel > b.topLevel)
		    	return -1;
		  	return 0;
		}

		fs = require('fs');
		fs.readFile('config/formula.json', 'utf8', function (err,data) {
  			if (err) {
    			return console.log(err);
  			}
  			var param = JSON.parse(data);
  			var nicerNumWeight = param.nicerNumWeight;
			var responseNumWeight = param.responseNumWeight;
			var clickNumWeight = param.clickNumWeight;

			Articles.find({ deleted: "false", board: {'!': 20} }).populate('nicer').populate('response').exec(function(err, articles) {
				if(err) {
	                res.send(500,{err: "DB Error" });
	            } else {
	            	var resultArticles = [];
	            	var nowTime = new Date();
	            	var async = require('async');
	            	var index = 0;
	            	async.each(articles, function(art, callback) {
					  	var weeks = Math.floor((nowTime - new Date(articles[index].createdAt))/(24*3600*1000)/7) + 1;
					  	resultArticles.push({
					  		topLevel: (articles[index].response.length*responseNumWeight + articles[index].nicer.length*nicerNumWeight + articles[index].clickNum*clickNumWeight)/weeks,
					  		title: articles[index].title,
					  		href: './article/' + articles[index].id,
					  		createdAt: articles[index].createdAt
					  	});
					  	index++;
					  	callback();
					}, function(err){
					    if( err ) {
					      console.log('Error');
					    } else {
							resultArticles.sort(compare);
					      	res.send(resultArticles.slice(0,5));
					    }
					});
	            }
			});
		});
	},
};