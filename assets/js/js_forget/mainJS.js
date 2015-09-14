function accountSubmit(){
	var account = $("#account").val()
	$.post('/getQ/',{account:account,url:window.location.toString()},function(ret){
		console.log(ret)
		if(ret.typ=="err"){
			showDialog("錯誤訊息", ret.msg, function(){
				location.reload();
			});
		}else if(ret.typ=="email"){
			showDialog("一般訊息", "確認信已發至"+ret.email+"，請依照信中指示更改密碼");
		}else{
			var message;
			$("#getQuestion").hide();
			switch(ret.msg){
				case "1" : message="您父親出生的城市"; break;
				case "2" : message="您第一個寵物的名字"; break;
				case "3" : message="您最喜歡的一本書"; break;
				case "4" : message="您最欣賞的藝人"; break;
				case "5" : message="您的結婚紀念日"; break;
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
				showDialog("一般訊息", "新密碼設定完成！", function(){
					location.replace("/");
				});
			}else{
				showDialog("錯誤訊息", "您輸入的答案錯誤喔！");
			}
		});
	}else{
		showDialog("錯誤訊息", "您輸入的密碼不同喔！");
	}
}

function showDialog(title, message, cb){
  bootbox.dialog({
    message: message,
    title: title,
    buttons: {
      main: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
        	if(typeof cb == "function")
        		cb();
        }
      }
    }
  });
}