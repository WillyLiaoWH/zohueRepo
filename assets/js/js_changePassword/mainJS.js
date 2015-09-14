function Submit(){
  var oldPassword = document.getElementById("old").value;
  var newPassword = document.getElementById("new").value;
  var reNewPassword = document.getElementById("reNew").value;
  
  if (newPassword!=reNewPassword) {
    showDialog("錯誤訊息","新密碼確認錯誤！");
  }
  else {
    var posting = $.post( "/changePassword", {oldPassword: oldPassword, newPassword: newPassword, reNewPassword: reNewPassword}, function(res){
      showDialog("一般訊息","更換密碼成功！",function(){
        location.replace("/home");
      });
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
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
          if(typeof cb == "function")
            cb();
        }
      }
    }
  });
}