function accountSubmit(){
	var account = $("#account").val()
	$.get('/getQ/'+account,function(ret){
		if(ret.typ=="err"){
			alert(ret.msg);
			location.reload();
		}
		else if(ret.typ=="email"){

		}
		else{
			var message;
			$("#getQuestion").hide();
			switch(ret.msg){
				case 1 : message="您父親出生的城市"; break;
				case 2 : message="您第一個寵物的名字"; break;
				case 3 : message="您最喜歡的一本書"; break;
				case 4 : message="您最欣賞的藝人"; break;
				case 5 : message="您的結婚紀念日"; break;
				default : message=ret.msg.slice(8);
			}
			$('#question').text(message);
			$("#getAnswer").show();
		}
	});	
}

function ansSubmit(){
	var answer = $("#answer").val();
	var account = $("#account").val();
	var password1 = $("#password1").val();
	var password2 = $("#password2").val();
	if (password1 === password2){
		$.post('/forgetAnswer',{account:account,ans:answer,password:password1},function(ret){
			if (ret==="OK"){
				alert("新密碼設定完成");
				location.replace("/")
			}
			else{
				alert("輸入的答案錯誤");
			}
		});
	}
	else{
		alert("輸入的密碼不同");
	}

}
