/**
 * BoardController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getBoardCategory: function(req, res){
		BoardCategory.find({ id: { '!': 5 }}).exec(function(err, boardCategory) {
            //articlesList.sort('date ASC');
			if (err) {
            	res.send(500, { err: "DB Error" });
        	} else {
                res.send(boardCategory);
            }
		});
	},
};

