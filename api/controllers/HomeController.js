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
            	var async = require('async');


            	res.send(articles[0]);
                //res.send(Announcement[0].articles.slice(0,5));
            }
		});
	},
};