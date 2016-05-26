/**
 * BoardController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getBoardsOfCategory: function(req, res) {
		var category=req.param("category");
		// console.log(category)
		Boards.find({category: category}).exec(function(err, boards) {
			if(err) {
				console.log(err);
				res.send(500, "DB error");
			} else {
				
				res.send(boards);
			}
		});
	},
	getCategoryOfBoard: function(req, res) {
		var board=req.param("board");
		// console.log(board);
		Boards.findOne({id: board}).populate('category').exec(function(err, board) {
			if(err) {
				console.log(err);
				res.send(500, "DB error");
			} else {
				// console.log(board.category);
				res.send(board);

			}
		});
	},
	setForum:function(req,res){
		var MobileDetect = require('mobile-detect'),
		md = new MobileDetect(req.headers['user-agent']);
		var css;
		var page;
		var m;
		if (md.mobile()==null){
            //PC
            css="style";
            page = "forum/index";
            m="layout";
            
        }
        else{
            //mobile
            page="forum/mindex";
            m="mlayout";
            css="mStyle";
        }

	    return res.view(page, {
			layout:m,
			scripts: [
			
			],
			stylesheets: [
			'/styles/importer.css'
			]
		});
	}
};

