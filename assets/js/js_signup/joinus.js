var obj_postal;

$(document).ready(function(){
  // 預設必填
  $(".feedback-input[must='t']").each(function( index ) {
    var id = ($(this).attr("id"));
    if( $(this).val()=="" || $(this).val()==null ){
      statusIMG(this,"M");
    }else{ // 使用FB註冊的會員會有一些基本資料已在必填欄位內
      statusIMG(this,"O");
    }
  });
  
  $("#addressCity").change(function() { // 用縣市篩選區
    ShowAllDistrict(document.getElementById("addressCity").value);
  });

  $("#birthday_M").change(function() { // 年月產生日數
    ShowDate(document.getElementById("birthday_M").value, document.getElementById("birthday_Y").value);
  });
  $("#birthday_Y").change(function() { // 年月產生日數
    ShowDate(document.getElementById("birthday_M").value, document.getElementById("birthday_Y").value);
  });

  //$(".feedback-input").bind("keyup change", function(e) { // 顯示 O、X
  $(".feedback-input[must='t']").bind("keyup change", function(e) { // 顯示 O、X
    var id = ($(this).attr("id"));
    if( $(this).val()=="" ){
      statusIMG(this,"X");
      var s = "需要填喔，不可以偷懶！";
      if(id=="email"){s="填了她吧，找回密碼比較方便喔！";}
      statusWarn(this,s);
    }
    else{
      statusIMG(this,"O");
      switch(id){
        case "account": // 檢查帳號是否已存在
          var result = validateAccount($(this).val());
          if(!result){
            statusIMG(this,"X");
            statusWarn(this,"帳號格式不對喔！");
          }else{isAccountExit($(this));}
          break;
        case "email":
          var result = validateEmail($(this).val());
          if(!result){
            statusIMG(this,"X");
            statusWarn(this,"信箱格式不對喔！");
          }
          break;
        case "password":
          var result = validateEngNum($(this).val());
          if(!result){
            statusIMG(this,"X");
            statusWarn(this,"哎呀，密碼格式不對喔！");
          }
          break;
        case "repassword": // 檢查密碼是否正確
          var password = document.getElementById("password").value;
          var repassword = $(this).val();
          if(password!=repassword){
            statusIMG(this,"X");
            statusWarn(this,"哎呀，密碼打錯啦！");
          }
          break;
        case "forgetQ":
          if($(this).val()==999){ // 其他
            document.getElementById("forgetQ-other").style.display="block";
            $("#forgetQ-other").attr("must","t");
          }else{document.getElementById("forgetQ-other-tooltip").style.display="none";document.getElementById("forgetQ-other").style.display="none";$("#forgetQ-other").attr("must","f");}
          break;
        case "type":
        case "gender":
        case "addressCity":
          if($(this).val()==null){
            statusIMG(this,"X");
            statusWarn(this,"需要填喔，不可以偷懶！");
          } else{/*document.getElementById("postalCode").value="";*/}
          break;
        case "addressDistrict":
          var dis = $(this).val();
          if(dis==null){
            statusIMG(this,"X");
            statusWarn(this,"需要填喔，不可以偷懶！");
          } else{
            var result = getPostCode();
            if(result==1){statusIMG("#postalCode","O");}
          }
          break;
        case "postalCode": // 用郵遞區號產生兩個下拉選單
          var result = getCity($(this).val());
          if(result==0){
            statusIMG(this,"X");
            statusWarn(this,"找不到這個郵遞區號啦～");
            statusIMG("#addressCity","X");
            statusIMG("#addressDistrict","X");
          }
          else{
            statusIMG("#addressCity","O");
            statusIMG("#addressDistrict","O");
          }
          break;
        case "birthday_Y":
          var taiwanY = $(this).val();
          if(taiwanY>-50 & taiwanY<100 & taiwanY%1===0){
            statusIMG("#birthday_Y","O");
          }else{
            statusIMG(this,"X");
            statusWarn(this,"日期格式錯誤，請輸入民國年！");
          }
          break;
      }
    }
  });
});



/************************** form 檢查相關 **************************/
function statusIMG(o, s){
  var original_back = ($(o).css("background-image"));
  var end = original_back.lastIndexOf(",");
  if(end != -1)
    original_back = original_back.substring(0,end);
  $(o).css("background-image",original_back+", url(../images/img_signup/"+s+".png)");
  if(s=="O"){
    var t = $(o).attr("id")+"-tooltip";
    document.getElementById(t).style.display="none";
  }
}
function statusWarn(o, s){
  var t = $(o).attr("id")+"-tooltip";
  var tin = $(o).attr("id")+"-inner";
  document.getElementById(tin).innerHTML=s;
  document.getElementById(t).style.display="block";
}
function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validateEngNum(string) {
    var re = /^[a-zA-Z0-9]{4,20}([\-]\d{4})?$/;
    return re.test(string);
}
function validateAccount(string) {
    var re = /^[A-Za-z0-9]+$/;
    //var re = /^[0-9\-()+]{7,20}$/;
    return re.test(string);
}



/************************** 連接 PHP 相關 **************************/
function Submit(){
  var pass_signup = 1;
  var missingInfo = [];
  $(".feedback-input[must='t']").each(function( index ) {
    if( $(this).val()=="" || $(this).val()==null ){
      pass_signup = 0;
      missingInfo.push( $(this).attr("placeholder") ); // 將沒填的欄位一一放置於 array 中
    }else{}
  });
  var uniqueMissingInfo = [];
  $.each(missingInfo, function(i, el){ // 將沒填欄位之 array 去除重複
    if($.inArray(el, uniqueMissingInfo) === -1) uniqueMissingInfo.push(el);
  });

  if(pass_signup==1){
    var fname = document.getElementById("fname_reg").value;
    var lname = document.getElementById("lname_reg").value;
    var img_temp = document.getElementById("avatar").src;
    var img = img_temp.substring(img_temp.indexOf("/images/"));
    var forgetQ = document.getElementById("forgetQ").options[document.getElementById("forgetQ").selectedIndex].value;
    if(forgetQ==999){forgetQ='[otherQ]'+document.getElementById("forgetQ-other").value;}
    var forgetA = document.getElementById("forgetA").value;
    var gender = document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
    var phone = document.getElementById("phone").value;
    var addressCity = document.getElementById("addressCity").options[document.getElementById("addressCity").selectedIndex].value;
    var addressDistrict = document.getElementById("addressDistrict").options[document.getElementById("addressDistrict").selectedIndex].value;
    var address = document.getElementById("address").value;
    var birthday_Y = parseInt(document.getElementById("birthday_Y").value)+1911;
    var birthday_M = document.getElementById("birthday_M").value;
    var birthday_D = document.getElementById("birthday_D").value;
    var birthday = (new Date(birthday_Y, (birthday_M-1), birthday_D)).toString();
    //var birthday = (new Date(birthday_Y+'-'+birthday_M+'-'+birthday_D)).toString();
    if($("#type").length > 0){
      var primaryDisease = document.getElementById("type").options[document.getElementById("type").selectedIndex].value;
      var selfIntroduction = document.getElementById("selfIntroduction").value;
    }else{
      var primaryDisease = "";
      var selfIntroduction = "";
    }
    var postalCode = document.getElementById("postalCode").value;

    var posting = $.post( "/fullSignup", { fname: fname, lname: lname, img: img, 
                                          forgetQ: forgetQ, forgetA: forgetA, 
                                          gender: gender, phone: phone, addressCity: addressCity,
                                          addressDistrict: addressDistrict, address: address, 
                                          birthday: birthday, selfIntroduction: selfIntroduction,
                                          postalCode: postalCode, primaryDisease: primaryDisease}, function(res){
      showDialog("一般訊息","完整註冊成功！",function(){
        window.location = "/home";
      });
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }else{ // 若有欄位沒填將產生警告視窗，並顯示缺少哪些欄位
    if(uniqueMissingInfo.indexOf("民國年") != -1){uniqueMissingInfo[uniqueMissingInfo.indexOf("民國年")]="生日";}
    var missingInfoMessage = uniqueMissingInfo.shift();
    for(var i in uniqueMissingInfo){
      missingInfoMessage=missingInfoMessage+"、"+uniqueMissingInfo[i];
    }
    showDialog("你是不是少填了什麼呢！",missingInfoMessage);
  }
}



/************************** 郵遞區號相關 **************************/
function ShowAllDistrict(city){
  var lookup = {};
  for (var i = 0, len = obj_postal.length; i < len; i++) {
    if(city==obj_postal[i].addressCity){
      var district = obj_postal[i].district;
    }
  }
  $("#addressDistrict").empty();
  $("#addressDistrict").append('<option value="" disabled selected>居住區</option>');
  for(var r in district){
    var addressDistrict = district[r].addressDistrict;
    $("#addressDistrict").append('<option value='+addressDistrict+'>'+addressDistrict+'</option>');
  }
}
function ShowPostalCode(city,districts){
  var lookup = {};
  for (var i = 0, len = obj_postal.length; i < len; i++) {
    if(city==obj_postal[i].addressCity){
      var district = obj_postal[i].district;
    }
  }
  for(var r in district){
    var addressDistrict = district[r].addressDistrict;
    if(districts==addressDistrict){
      return district[r].postalcode;
    }
  }
}
function getCity(e){
  for(var city in obj_postal){
    var addressCity = obj_postal[city].addressCity;
    var district = obj_postal[city].district;
    for(var dis in district){
      if(e==district[dis].postalcode){
        $('#addressCity option:contains('+addressCity+')').prop({selected: true});
        ShowAllDistrict(obj_postal[city].addressCity);
        $('#addressDistrict option:contains('+district[dis].addressDistrict+')').prop({selected: true});
        return 1;
      }
    }
  }
  $('#addressCity option:first').prop({selected: true});
  ShowAllDistrict(obj_postal[city].addressCity);
  $('#addressDistrict option:first').prop({selected: true});
  return 0;
}
function getPostCode(){
  var C = $("#addressCity option:selected").text();
  var D = $("#addressDistrict option:selected").text();
  for(var city in obj_postal){
    var addressCity = obj_postal[city].addressCity;
    var district = obj_postal[city].district;
    if(C == addressCity){
      for(var dis in district){
        if(D==district[dis].addressDistrict){
          $("#postalCode").val(district[dis].postalcode);
          return 1;
        }
      }
    }
  }
  return 0;
}

function ShowDate(month, year){
  var days = daysInMonth(month, year);
  $("#birthday_D").empty();
  $("#birthday_D").append('<option value="" disabled selected>日</option>');
  for(var i = 1, len = days+1; i < len; i++){
    $("#birthday_D").append('<option value='+i+'>'+i+'</option>');
  }
}
function daysInMonth(month,year) { return new Date(year, month, 0).getDate(); }

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