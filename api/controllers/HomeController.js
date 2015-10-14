/**
 * HomeController
 *
 * @description :: Server-side logic for managing Homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
				  		topLevel: (articles[index].response.length*10 + articles[index].nicer.length*5 + articles[index].clickNum)/weeks,
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
	},
};