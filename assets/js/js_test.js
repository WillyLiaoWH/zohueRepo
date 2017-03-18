$(function(){
	$("#add_sub").click(function(){
		
		date = $("#add_date").val()
		weight = $("#add_weight").val()
		squbloodPresure = $("#add_squbloodPresure").val()
		bloodPresure = $("#add_bloodPresure").val()
		memo = $("#add_memo").val()
		if(weight>200 || weight<0){
			alert("體重可能有誤喔~")
		}
		else if(squbloodPresure>300 || squbloodPresure<0){
			alert("收縮血壓可能有誤喔~")
		}
		else if(bloodPresure>300 || bloodPresure<0){
			alert("舒張血壓可能有誤喔~")
		}
		else if(bloodPresure>=squbloodPresure){
			alert("舒張壓跟收縮壓可能寫反了喔")
		}
		else{
				$.post("/add_test",{adddate:date,addweight:weight,squ:squbloodPresure,addbloodPresure:bloodPresure,addmemo:memo},
					function(ret){
						alert(ret);
					}
				)			
		}


	});


	$("#edit_sub").click(function(){
		// console.log("there")
		//alert("aaa")
		Edate = $("#date").val()
		Eweight = $("#weight").val()
		EsqubloodPresure = $("#squbloodPresure").val()
		EbloodPresure = $("#bloodPresure").val()
		Ememo = $("#memo").val()
		if(Eweight>200 || Eweight<0){
			alert("體重可能有誤喔~")
		}
		else if(EsqubloodPresure>300 || EsqubloodPresure<0){
			alert("收縮血壓可能有誤喔~")
		}
		else if(EbloodPresure>300 || EbloodPresure<0){
			alert("舒張血壓可能有誤喔~")
		}
		else if(EbloodPresure>=EsqubloodPresure){
			alert("舒張壓跟收縮壓可能寫反了喔")
		}
		else{
			$.post("/test",{date:Edate,weight:Eweight,squbloodPresure:EsqubloodPresure,bloodPresure:EbloodPresure,memo:Ememo},
				function(rett){
					alert(rett);
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
				alert(ret);
			}
		)

	});
	var selected_date=$("#calender").datepicker("getdate");
    $("#calender").onSelect(function(){
        alert('selected_date');

    });
})