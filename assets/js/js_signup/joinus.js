var obj_postal;

$(document).ready(function(){
  $.get("/user/showProfile", function(full){
    ooo = JSON.parse(full);
    var type=ooo.type;
    switch(type){
      case "P":
      case "F":
        document.getElementById("prim_dis").innerHTML = "主要疾病";
        document.getElementById("sec_dis").innerHTML = "次要疾病";
        break;
      case "S":
      case "N":
      case "RN":
        document.getElementById("p_type").style.visibility = "hidden";
        document.getElementById("p_selfIntroduction").style.display = "none";
        break;
      case "D":
        document.getElementById("prim_dis").innerHTML = "主治科目";
        document.getElementById("sec_dis").innerHTML = "其他專長";
        break;
    }
  });
  
  $("#addressCity").change(function() { // 用縣市篩選區
    ShowAllDistrict(document.getElementById("addressCity").value);
  });

  $("#birthday_M").change(function() { // 年月產生日數
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
          }else{document.getElementById("forgetQ-other").style.display="none";}
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
    var re = /^[a-zA-Z0-9]{4,20}([\-]\d{4})?$/;
    //var re = /^[0-9\-()+]{7,20}$/;
    return re.test(string);
}



/************************** 連接 PHP 相關 **************************/
function getXMLHttp(){
  var xmlHttp
  try{
    //Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  }
  catch(e){
    //Internet Explorer
    try{
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e){
      try{
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e){
        alert("Your browser does not support AJAX!");
        return false;
      }
    }
  }
  return xmlHttp;
}

function Submit(){
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var img = document.getElementById("avatar").src;
  var forgetQ = document.getElementById("forgetQ").options[document.getElementById("forgetQ").selectedIndex].value;
  if(forgetQ==999){forgetQ='[otherQ]'+document.getElementById("forgetQ-other").value;}
  var forgetA = document.getElementById("forgetA").value;
  var gender = document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
  var phone = document.getElementById("phone").value;
  var addressCity = document.getElementById("addressCity").options[document.getElementById("addressCity").selectedIndex].value;
  var addressDistrict = document.getElementById("addressDistrict").options[document.getElementById("addressDistrict").selectedIndex].value;
  var address = document.getElementById("address").value;
  var birthday_Y = parseInt(document.getElementById("birthday_Y").value)+1911;
  alert(birthday_Y);
  var birthday_M = document.getElementById("birthday_M").value;
  var birthday_D = document.getElementById("birthday_D").value;
  var birthday = new Date(birthday_Y+'-'+birthday_M+'-'+birthday_D);
  var primaryDisease = document.getElementById("type").options[document.getElementById("type").selectedIndex].value;
  var selfIntroduction = document.getElementById("selfIntroduction").value;
  var postalCode = document.getElementById("postalCode").value;

  var posting = $.post( "/fullSignup", { fname: fname, lname: lname, img: img, 
                                          forgetQ: forgetQ, forgetA: forgetA, 
                                          gender: gender, phone: phone, addressCity: addressCity,
                                          addressDistrict: addressDistrict, address: address, 
                                          birthday: birthday, selfIntroduction: selfIntroduction,
                                          postalCode: postalCode, primaryDisease: primaryDisease}, function(res){
    alert("完整註冊成功！");
    window.location = "/home";
  }).error(function(res){
    });
}

function ShowAllQ(){
  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_ShowAllQ(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "/RecoveryQuestion/getall", true);
  xmlHttp.send(null);
}
function HandleResponse_ShowAllQ(response){
  obj_Q = JSON.parse(response);
  for(var r in obj_Q){
    var question = obj_Q[r].question;
    var questionID = obj_Q[r].id;
    $("#forgetQ").append('<option value='+questionID+'>'+question+'</option>');
  }
  $("#forgetQ").append('<option value=999>其它</option>');
}



/************************** 郵遞區號相關 **************************/
function ShowAllCity(){
  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_ShowAllCity(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "/postallist/getall", true);
  xmlHttp.send(null);
}
function HandleResponse_ShowAllCity(response){
  obj_postal = JSON.parse(response);
  for(var r in obj_postal){
    var addressCity = obj_postal[r].addressCity;
    $("#addressCity").append('<option value='+addressCity+'>'+addressCity+'</option>');
  }
}
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

function ShowMonth(){
  $("#birthday_M").empty();
  $("#birthday_M").append('<option value="" disabled selected>月</option>');
  for(var i = 1, len = 13; i < len; i++){
    $("#birthday_M").append('<option value='+i+'>'+i+'</option>');
  }
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