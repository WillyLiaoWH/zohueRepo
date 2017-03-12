/**
 * DiaryController
 *
 * @description :: Server-side logic for managing diaries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	addDiary: function(req,res){
		var Aauthor=req.session.user.id;
 	    var Adate = req.param("adddate");
 	    var Aweight = req.param("addweight");
 	    var Amemo = req.param("addmemo");
	    var AbloodPresure= req.param("addbloodPresure");
	  	Diary.create({author:Aauthor,date:Adate,weight:Aweight,memo:Amemo,bloodPresure:AbloodPresure}).exec(
	  			function(err,ret){
	  				if(err){
	  					console.log(err);
	  					res.send({err:"DB error"});
	  				}
	  				else{
	  					res.send("OK");
	  					console.log("success");
	  				}
	  			}
	  	);
	},
	//request是進入 res是出去
	editDiary: function (request,ress){
		var Ndate = request.param("date")
		var Nweight = request.param("weight")
		var Nmemo = request.param("memo")
		var NbloodPresure = request.param("bloodPresure")
		//Nauthor = request.param("author")
		var Nauthor = request.session.user.id;
		var nndate = new Date(Ndate);
		// console.log(nndate.toISOString());
		// console.log(err);
		Diary.update({author:Nauthor, date:nndate.toISOString() },{weight:Nweight,memo:Nmemo,bloodPresure:NbloodPresure}).exec(
			//ret是執行結果
			function(errr,rett){
				if(errr){
					console.log(errr);
					ress.send("error!");
				} 
				else {			
					if(rett.length==0)
						ress.send("data not found");
					else
						ress.send("success");
				}				

			}
		)
	},

	deleteDiary: function(req, res){
		var Ddate = req.param("date")
		var author=req.session.user.id;
		var DDdate = new Date(Ddate);

		Diary.destroy({date: DDdate.toISOString(), author: author}).exec(function(err, ret)
		{
			if(err)
			{
				console.log(err);
				res.send(500, {err: "DB Error"});
			} 
			else 
			{			
				if(ret.length==0)
					res.send("找不到此紀錄！");
				else
					res.send("健康紀錄刪除成功！");
			}
		});
	},


	// deleteDiary: function(req, res)
	// {
	// 	var year = req.param("year");
	// 	var month = req.param("month");
	// 	var day = req.param("day");
	// 	var author=req.session.user.id;
	//     //var author = req.param("author");

	// 	var date = new Date(parseDate(year, month, day));

	// 	Diary.destroy({date: date.toISOString(), author: author}).exec(function(err, ret)
	// 	{
	// 		if(err)
	// 		{
	// 			console.log(err);
	// 			res.send(500, {err: "DB Error"});
	// 		} 
	// 		else 
	// 		{			
	// 			if(ret.length==0)
	// 				res.send("找不到此紀錄！");
	// 			else
	// 				res.send("健康紀錄刪除成功！");
	// 		}
	// 	});
	// },

	
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
