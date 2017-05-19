$(function(){
    $.post("/find_diary",{},
        function(ret){
        	var num=ret.length;
        	// alert(num);
            $("#recordTable").append("<tr><td>日期</td><td>體重</td><td>收縮壓</td><td>舒張壓</td><td>心情</td></tr>");
            for(var i=0 ; i<ret.length ; i++){
            	var datewithoutTime=ret[i].date.substring(0, 10);
            	var weight=ret[i].weight;
            	var squbloodPresure=ret[i].squbloodPresure;
            	var bloodPresure=ret[i].bloodPresure;
            	var memo=ret[i].memo;
             //    $("#recordTable").append("<tr><td>"+(datewithoutTime)+"</td>");
             //    $("#recordTable").append("<td>"+(weight)+"</td>");
             //    $("#recordTable").append("<td>"+(squbloodPresure)+"</td>");
             //    $("#recordTable").append("<td>"+(bloodPresure)+"</td>");
             //    $("#recordTable").append("<td>"+(memo)+"</td></tr>");
                $("#recordTable").append("<tr><td>"+(datewithoutTime)+"</td><td>"+(weight)+"</td><td>"+(squbloodPresure)+"</td><td>"+(bloodPresure)+"</td><td>"+(memo)+"</td></tr>");
            }
            $("#records").append("您目前有"+(num)+"筆健康記錄");   

	var parseDate = d3.time.format("%Y-%m-%d").parse;
	// alert(parseDate(ret[3].date.substring(0, 10)));

    var data = [];
    for(var i=0 ; i<num ; i++){
    	data.push({x:parseDate(ret[i].date.substring(0,10)),y:ret[i].weight})
    }
    data.sort(function(a, b){return a.x-b.x});
      
    var width = 360, height = 240;

	var scaleX = d3.time.scale()
                 .range([0,width])
                 .domain(d3.extent(data, function(d) { return d.x; })); //x資料的範圍
    var scaleY = d3.scale.linear()
                 .range([height,0])
                 // .domain([0,d3.max(data, function(d) { return d.y; }) ]); //Y的資料範圍
                 .domain([d3.min(data, function(d) { return d.y; })-20,d3.max(data, function(d) { return d.y; })+10 ]);

	var s = d3.select('#recordGraph'); //取得SVG的物件
    s.attr({'width': 450,'height': 300,}) //設定畫布範圍
	.style({'border':'1px dotted #aaa'});

	var line = d3.svg.line()
    .x(function(d) {return scaleX(d.x);})
    .y(function(d) {return scaleY(d.y);});

	var axisX = d3.svg.axis()
	    .scale(scaleX)
	    .ticks(5) //刻度大小
		.orient("bottom"); //X軸數字的位置
		// .tickFormat("");
	var axisY = d3.svg.axis()
	    .scale(scaleY)
	    .ticks(5) //刻度大小
		.orient("left"); //Y軸數字的位置


	s.append('path')
	    .attr({
	      'd': line(data),
	      'stroke': '#09c',
	      'fill': 'none',
	      'transform':'translate(35,20)' //偏移
	    });

	s.append('g')
		.call(axisX)
		.attr({
			'fill':'none', //空心，但是字要另外處理
		    'stroke':'#000',
		    'transform':'translate(35,' + (height+20) + ')' //偏移
		})
		.selectAll('text') //字也會套用空心，另外處理
		.attr({
	    	'fill':'#000',
	    	'stroke':'none',
		})
		.style({
	    	'font-size':'11px'
		});

	s.append('g')
		.call(axisY)
		.attr({
	    	'fill':'none',
	    	'stroke':'#000',
	    	'transform':'translate(35,20)'
		})
		.selectAll('text')
		.attr({
	    	'fill':'#000',
	    	'stroke':'none',
		})
		.style({
	    	'font-size':'11px'
		});



        }
    );

	$("#add_sub").click(function(){
		date = $("#add_date").val()
		weight = $("#add_weight").val()
		squbloodPresure = $("#add_squbloodPresure").val()
		bloodPresure = $("#add_bloodPresure").val()
		memo = $("#add_memo").val()
		var minus=squbloodPresure-bloodPresure;
		if(weight<=0){
			bootbox.alert({
				    message: "您填的體重小於零! 請重新填寫!",
				    title: "再次確認"
			});	
			add_weight.value="";
		}
		else if(squbloodPresure<=0){
			bootbox.alert({
				    message: "您填的收縮壓小於零! 請重新填寫!",
				    title: "再次確認"
			});	
			add_squbloodPresure.value="";
		}
		else if(squbloodPresure>300){
			bootbox.alert({
				    message: "您填的收縮壓大於三百! 請重新填寫!",
				    title: "再次確認"
			});	
			add_squbloodPresure.value="";
		}
		else if(bloodPresure<=0){
			bootbox.alert({
				    message: "您填的舒張壓小於零! 請重新填寫!",
				    title: "再次確認"
			});	
			add_bloodPresure.value="";
		}
		else if(bloodPresure>300){
			bootbox.alert({
				    message: "您填的舒張壓大於三百! 請重新填寫!",
				    title: "再次確認"
			});	
			add_bloodPresure.value="";
		}

		else if(minus<=0){
			bootbox.alert({
				    message: "您填的收縮壓小於舒張壓! 請重新填寫!",
				    title: "再次確認"
			});	
			add_bloodPresure.value="";
			add_squbloodPresure.value="";
		}
		else if(weight>200){
			bootbox.dialog({
				    message: "您填的體重大於兩百，您確定沒有錯誤嗎?",
				    title: "再次確認",
				    buttons: {
				      yes: {
				        label: "確認",
				        className: "btn-primary",
				        callback: function() {
				          	$.post("/add_diary",{adddate:date,addweight:weight,squ:squbloodPresure,addbloodPresure:bloodPresure,addmemo:memo},
								function(ret){
									bootbox.alert(ret);
								}
							)
				        }
				      },
				      no: {
				        label: "取消",
				        className: "btn-primary",
				        callback: function() {
				        	add_weight.value="";
				        }
				      }
				    }
				});	
		}
		else{
			$.post("/add_diary",{adddate:date,addweight:weight,squ:squbloodPresure,addbloodPresure:bloodPresure,addmemo:memo},
				function(ret){
					bootbox.alert(ret);
				}
			)		
		}
	});


	$("#edit_sub").click(function(){
		Edate = $("#date").val()
		Eweight = $("#weight").val()
		EsqubloodPresure = $("#squbloodPresure").val()
		EbloodPresure = $("#bloodPresure").val()
		Ememo = $("#memo").val()
		var minus=EsqubloodPresure-EbloodPresure;
		if(Eweight<=0){
			bootbox.alert({
				    message: "您填的體重小於零! 請重新填寫!",
				    title: "再次確認"
			});	
			weight.value="";
		}
		else if(EsqubloodPresure<=0){
			bootbox.alert({
				    message: "您填的收縮壓小於零! 請重新填寫!",
				    title: "再次確認"
			});	
			squbloodPresure.value="";
		}
		else if(EsqubloodPresure>300){
			bootbox.alert({
				    message: "您填的收縮壓大於三百! 請重新填寫!",
				    title: "再次確認"
			});	
			squbloodPresure.value="";
		}
		else if(EbloodPresure<=0){
			bootbox.alert({
				    message: "您填的舒張壓小於零! 請重新填寫!",
				    title: "再次確認"
			});	
			bloodPresure.value="";
		}
		else if(EbloodPresure>300){
			bootbox.alert({
				    message: "您填的舒張壓大於三百! 請重新填寫!",
				    title: "再次確認"
			});	
			bloodPresure.value="";
		}
		else if(minus<=0){
			bootbox.alert({
				    message: "您填的收縮壓小於舒張壓! 請重新填寫!",
				    title: "再次確認"
			});	
			bloodPresure.value="";
			squbloodPresure.value="";
		}
		else if(Eweight>200){
			bootbox.dialog({
				    message: "您填的體重大於兩百，您確定沒有錯誤嗎?",
				    title: "再次確認",
				    buttons: {
				      yes: {
				        label: "確認",
				        className: "btn-primary",
				        callback: function() {
				          	$.post("/edit_diary",{date:Edate,weight:Eweight,squbloodPresure:EsqubloodPresure,bloodPresure:EbloodPresure,memo:Ememo},
								function(ret){
									bootbox.alert(ret);
								}
							)
				        }
				      },
				      no: {
				        label: "取消",
				        className: "btn-primary",
				        callback: function() {
							weight.value="";
				        }
				      }
				    }
				});	
		}
		else{
			$.post("/edit_diary",{date:Edate,weight:Eweight,squbloodPresure:EsqubloodPresure,bloodPresure:EbloodPresure,memo:Ememo},
				function(rett){
					bootbox.alert(rett);
				}
			)			
		}


	});

	$("#delete_sub").click(function(){
		// console.log("there")
		//alert("hhh")
		Ddate = $("#del_date").val()
		$.post("/del_diary",{date:Ddate},
			function(ret){
				bootbox.alert(ret);
			}
		)
	});
	
	var chn={
        dayNames:["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
        dayNamesMin:["日","一","二","三","四","五","六"],
        monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        monthNamesShort:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        prevText:"上月",
        nextText:"次月",
        weekHeader:"週",
        showMonthAfterYear:true,
        dateFormat:"yy-mm-dd",
        onSelect:function(dateText,inst){
            add_date.value=dateText;
            date.value=dateText;
            del_date.value=dateText;
        }
    };
    $("#calender").datepicker(chn);

})