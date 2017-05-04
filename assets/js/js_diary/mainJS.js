$(function(){
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
				          	$.post("/add_test",{adddate:date,addweight:weight,squ:squbloodPresure,addbloodPresure:bloodPresure,addmemo:memo},
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
			$.post("/add_test",{adddate:date,addweight:weight,squ:squbloodPresure,addbloodPresure:bloodPresure,addmemo:memo},
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
				          	$.post("/test",{date:Edate,weight:Eweight,squbloodPresure:EsqubloodPresure,bloodPresure:EbloodPresure,memo:Ememo},
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
			$.post("/test",{date:Edate,weight:Eweight,squbloodPresure:EsqubloodPresure,bloodPresure:EbloodPresure,memo:Ememo},
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
		$.post("/del_test",{date:Ddate},
			function(ret){
				bootbox.alert(ret);
			}
		)

	});
	
	
})