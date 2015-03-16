/**
 * ProInfoController
 *
 * @description :: Server-side logic for managing proinfoes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
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

};

