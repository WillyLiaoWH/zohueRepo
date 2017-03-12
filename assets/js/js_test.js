$(function(){
	$("#add_sub").click(function(){
		
		date = $("#add_date").val()
		weight = $("#add_weight").val()
		bloodPresure = $("#add_bloodPresure").val()
		memo = $("#add_memo").val()

		$.post("/add_test",{adddate:date,addweight:weight,addbloodPresure:bloodPresure,addmemo:memo},
			function(ret){
				alert(ret);
			}
		)

	});


	$("#edit_sub").click(function(){
		// console.log("there")
		//alert("hhh")
		Edate = $("#date").val()
		Eweight = $("#weight").val()
		EbloodPresure = $("#bloodPresure").val()
		Ememo = $("#memo").val()
		
		$.post("/test",{date:Edate,weight:Eweight,bloodPresure:EbloodPresure,memo:Ememo},
			function(rett){
				alert(rett);
			}
		)

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
})

