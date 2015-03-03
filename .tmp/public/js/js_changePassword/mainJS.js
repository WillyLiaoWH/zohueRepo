var obj;

// $(document).ready(function(){

// });



/************************** form 檢查相關 **************************/


function Submit(){
  
  var oldPassword = document.getElementById("old").value;
  var newPassword = document.getElementById("new").value;
  var reNewPassword = document.getElementById("reNew").value;
  
  if (newPassword!=reNewPassword) {
    alert("新密碼確認錯誤");
  }
  else {
    var posting = $.post( "/changePassword", {oldPassword: oldPassword, newPassword: newPassword, reNewPassword: reNewPassword}, function(res){
    alert("更換密碼成功！");
    location.replace("/home");
  })
    .error(function(res){
      alert(res.responseJSON.err);
    });
  }
}
