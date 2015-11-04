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
	}
};

