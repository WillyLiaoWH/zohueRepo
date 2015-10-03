/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAnnouncement: function(req, res){
		Boards.find({title: "最新活動"}).sort('createdAt DESC').populate('articles',{deleted:'false'}).exec(function(err, Announcement) {
			if(err) {
                res.send(500,{err: "DB Error" });
            } else {
                res.send(Announcement[0].articles.slice(0,5));
            }
		});
	},
	getTopArticles: function(req, res){
		Articles.find({deleted: "false"}).populate('nicer').exec(function(err, articles) {
			if(err) {
                res.send(500,{err: "DB Error" });
            } else {
            	var nowTime = new Date();
            	var async = require('async');
            	var index = 0;
            	async.each(articles, function(art, callback) {
				  articles[index].topLevel = (articles[index].nicer.length + articles[index].clickNum);
				  console.log(new Date(articles[index].createdAt));
				  console.log(nowTime);
				  console.log((nowTime - new Date(articles[index].createdAt))/(24*3600*1000));
				  index++;

				  callback();
				}, function(err){
				    if( err ) {
				      console.log('A file failed to process');
				    } else {
				      	res.send(articles);
				    }
				});
            }
		});
	},
};