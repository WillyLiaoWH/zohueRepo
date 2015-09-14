function passwordSubmit(){
	var url = document.URL;
	var regex = /.*getPassword\/+(.*)/;
	var random = url.replace(regex,"$1");
	var password1 = $("#password1").val();
	var password2 = $("#password2").val();
	var account=$("#account").val()

	if (password1===password2 && account.length!=0 && password1.length!=0){
		$.post('/getPassword',{account:account,password:password1,random:random},function(ret){
			if (ret==="OK"){
				showDialog("一般訊息", "新密碼更改成功！", function(){
					location.replace("/");
				});
			}else{
				showDialog("錯誤訊息", "帳號輸入錯誤，請檢查！", function(){
					location.reload();
				});
			}
		});
	}else{
		showDialog("錯誤訊息", "您輸入的密碼不同喔！", function(){
			$("password1").val()="";
			$("password2").val()="";
		});
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
        	cb();
        }
      }
    }
  });
}