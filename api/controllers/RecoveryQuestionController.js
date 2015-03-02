/**
 * RecoveryQuestionController
 *
 * @description :: Server-side logic for managing Recoveryquestions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getall: function(req, res) {
		var array=[];
		RecoveryQuestion.find({}).exec(function findCB(err,found){
 			while (found.length){
 				var obj = found.pop();
 				var question = obj.question;
 				var id = obj.id;
 				array_s = {'question':question,'id':id};
 				array.push(array_s);
 			}
 			var str = JSON.stringify(array);
        	res.end(str);
 		});
	},
};

