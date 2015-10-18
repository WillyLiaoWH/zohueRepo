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
                    res.send(500,{err: "DB Error" });
                } else {
                    res.send('照片已新增');
                }
            });
        }else{
            res.send("你不是管理員喔！");
        }
    

	},
	// upload: function(req, res){   /*上傳還沒寫完 by Chien*/
 //        console.log(req.param("avatar_data"));
 //        console.log(req.param("avatar_src"));

 //        var data = req.param("avatar_data");
 //        var data2;
 //        if(data){
 //            data2 = JSON.parse(data);
 //        }

 //        if(req.method === 'GET')
 //            return res.json({'status':'GET not allowed'});                      //  Call to /upload via GET is error

 //        function upload(cb){
 //            var uploadFile = req.file('avatar_file');
 //            uploadFile.upload({ dirname: '../../assets/images/img_signup'}, function onUploadComplete (err, files) {              //  Files will be uploaded to .tmp/uploads
 //                if (err) return res.serverError(err);                               //  IF ERROR Return and send 500 error with error
 //                var regex = /.*assets\\+(.*)/;
 //                var match = files[0].fd.match(regex);
 //                var result = match[1].replace(/\\/g, "\/");
 //                //console.log(result);

 //                //http://stackoverflow.com/questions/26130914/not-able-to-resize-image-using-imagemagick-node-js
 //                //var gm = require('gm').subClass({ imageMagick : true });
 //                var time = new Date().getTime();
 //                var recall_url = 'images/img_signup/upload/'+time+'.jpg';

 //                var easyimg = require('easyimage');
 //                easyimg.crop({
 //                    src:files[0].fd, dst:'assets/'+recall_url,
 //                    // width:200, height:200,
 //                    cropwidth:data2.width, cropheight:data2.height,
 //                    // width:data2.width, height:data2.height,
 //                    // cropwidth:200, cropheight:200,
 //                    gravity:'NorthWest',
 //                    x:data2.x, y:data2.y
 //                }).then(
 //                function(image) {
 //                    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
 //                },
 //                function (err) {
 //                    console.log(err);
 //                });
 //                cb(recall_url);
 //            });
 //        }

 //        upload(function(a) {
 //            setTimeout(function(){
 //                res.ok(JSON.stringify({state:200,message:null,result:a}));
 //            }, 2000);
            
 //        });
 //    },
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

		// var globalConfig = sails.config.globals;
		// var nicerNumWeight = globalConfig.nicerNumWeight;
		// var responseNumWeight = globalConfig.responseNumWeight;
		// var clickNumWeight = globalConfig.clickNumWeight;

		fs = require('fs');
		fs.readFile('config/formula.json', 'utf8', function (err,data) {
  			if (err) {
    			return console.log(err);
  			}
  			var param = JSON.parse(data);
  			var nicerNumWeight = param.nicerNumWeight;
			var responseNumWeight = param.responseNumWeight;
			var clickNumWeight = param.clickNumWeight;

			// param.clickNumWeight = 55555;
  	// 		fs.writeFile('config/formula.json', JSON.stringify(param), function (err) {
			// 	if (err) return console.log(err);
			//   	console.log('Hello World > helloworld.txt');
			// });
		//});

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