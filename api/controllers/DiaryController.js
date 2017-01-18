/**
 * DiaryController
 *
 * @description :: Server-side logic for managing diaries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	addDiary: function(req,res){
		var author=req.session.user.id;
 	    var date = req.param("date");
 	    var weight = req.param("weight");
 	    var memo = req.param("memo");
	    var bloodPresure= req.param("bloodPresure");
	  	Diary.create({author:author,date:date,weight:weight,memo:memo}).exec(
	  			function(err,ret){
	  				res.send({msg:'Created.',author:author,date:date,weight:weight,memo:memo});
	  				if(err){
	  					console.log(err);
	  					res.send({err:"DB error"});
	  				}
	  			}
	  	);
	},
	//request是進入 res是出去
	editDiary: function (request,res){
		//var Ndate = request.param("date")
		var year = request.param("year");
		var month = request.param("month");
		var day = request.param("day");

		var Nweight = request.param("weight")
		var Nmemo = request.param("memo")
		var NbloodPresure = request.param("bloodPresure")

		//Nauthor = request.param("author")
		var Nauthor = request.session.user.id;

		var date = new Date(parseDate(year, month, day));

		Diary.update({author:Nauthor, date:date.toISOString() },{weight:Nweight,memo:Nmemo,bloodPresure:NbloodPresure}).exec(
			//ret是執行結果
			function(err,ret){
				if(err){
					console.log(err)
					res.send("There's some problem");
				}
				else{
					res.send("success");
				}
			}
		)
	}

};

function parseDate(year, month, day)
{
	//如果是民國年，轉換成西元年
	var year_int = parseInt(year);
	if(year_int<1000)
	{
		year_int=year_int+1911;
		year=year_int.toString();
	}

	var month_int = parseInt(month);
	if(month_int<10)
		month="0"+month_int.toString();

	var day_int = parseInt(day);
	if(day_int<10)
		day="0"+day_int.toString();

	return (year+"-"+month+"-"+day);
}
