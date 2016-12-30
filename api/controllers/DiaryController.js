/**
 * DiaryController
 *
 * @description :: Server-side logic for managing diaries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

//李易修拿來測試用的，可以砍掉
/*createDiary: function(req, res)
{
	var year = req.param("year");
	var month = req.param("month");
	var day = req.param("day");
	var weight = req.param("weight");
	var memo = req.param("memo");
	var bloodPresure = req.param("bloodPresure");
	var author=req.session.user.id;
	//var author = req.param("author");

	var date = new Date(parseDate(year, month, day));

	Diary.create({date: date, weight: weight, memo: memo, bloodPresure: bloodPresure, author: author}).exec(function(err, ret)
	{
		if(err)
		{
			console.log(err);
			res.send(500, {err: "DB Error"});
		}
		else
		{
			console.log("create_success");
			res.send("健康紀錄新增成功!");
		}
	});
},*/

deleteDiary: function(req, res)
{
	var year = req.param("year");
	var month = req.param("month");
	var day = req.param("day");
	var author=req.session.user.id;
    //var author = req.param("author");

	var date = new Date(parseDate(year, month, day));

	Diary.destroy({date: date.toISOString(), author: author}).exec(function(err, ret)
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


