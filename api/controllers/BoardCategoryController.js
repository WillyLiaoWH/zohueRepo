/**
 * BoardController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	// getBoardCategory: function(req, res) {
	// 	var category=req.param("category");
	// 	Boards.find({category: category}).exec(function(err, boards) {
	// 		if(err) {
	// 			console.log(err);
	// 			res.send(500, "DB error");
	// 		} else {
	// 			res.send(boards);
	// 		}
	// 	});
	// }

	getBoardCategory: function(req, res){
		BoardCategory.find().exec(function(err, boardCategory) {
            //articlesList.sort('date ASC');
			if (err) {
            	res.send(500, { err: "DB Error" });
        	} else {
                res.send(boardCategory);
            }
		});
	},
};

