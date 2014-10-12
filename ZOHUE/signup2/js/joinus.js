var obj;

$(document).ready(function(){
  $("#addressCity").change(function() { // 用縣市篩選區
    ShowAllDistrict(document.getElementById("addressCity").value);
  });

  $(".feedback-input").focusout(function(e){ // 顯示 O、X
    var id = ($(this).attr("id"));
    if( $(this).val()=="" ){
      statusIMG(this,"X");
      var s = "少填囉，不可以偷懶！";
      if(id=="email"){s="填了她吧，找回密碼比較方便喔！";}
      statusWarn(this,s);
    }
    else{
      statusIMG(this,"O");
      switch(id){
        case "account": // 檢查帳號是否已存在
          isAccountExit($(this));
          break;
        case "email":
          var result = validateEmail($(this).val());
          if(!result){
            statusIMG(this,"X");
            statusWarn(this,"信箱格式不對喔！");
          }
          break;
        case "password":
          var password = $(this).val();
          if(password.length<4){
            statusIMG(this,"X");
            statusWarn(this,"哎呀，密碼太短啦！");
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
        case "type":
        case "gender":
        case "addressCity":
          if($(this).val()==null){
            statusIMG(this,"X");
            statusWarn(this,"少填囉，不可以偷懶！");
          }
          break;
        case "addressDistrict":
          var dis = $(this).val();
          if(dis==null){
            statusIMG(this,"X");
            statusWarn(this,"少填囉，不可以偷懶！");
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

function statusIMG(o, s){
  var original_back = ($(o).css("background-image"));
  var end = original_back.lastIndexOf(",");
  if(end != -1)
    original_back = original_back.substring(0,end);
  $(o).css("background-image",original_back+", url(./img/"+s+".png)");
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

function Login(){
  var account = document.getElementById("login_a").value;
  var password = document.getElementById("login_p").value;

  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_Login(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "php/readDB_login.php?account="+account+"&password="+password, true);
  xmlHttp.send(null);
}
function HandleResponse_Login(response){
  try{
    if(!response){
      alert("忘記密碼了嗎？底下可以找回密碼哦 (๑´ㅂ`๑) ");
    }
    else{
      obj_login = JSON.parse(response);
      var account = document.getElementById("login_a").value;
      alert("登入成功！！ ✧*｡٩(ˊᗜˋ*)و✧*｡ ");
      //var redirect = 'http://www.website.com/page?id=23231';
      //$.redirectPost(redirect, {x: 'example', y: 'abc'});
      window.location.href="../change?account="+account;
    }
  }
  catch (e) {
    alert("你是不是輸入了什麼怪怪的符號阿 ٩(ŏ﹏ŏ、)۶ ");
  }
}

function isAccountExit(e){
  var account = document.getElementById("account").value;
  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      var accountN = xmlHttp.responseText;
      if(accountN!=0){
        statusIMG(e,"X");
        statusWarn(e,"此帳號已存在！");
      }
      else{
        statusIMG(e,"O");
      }
    }
  }
  xmlHttp.open("GET", "php/readDB_account.php?account="+account, true);
  xmlHttp.send(null);
}
function HandleResponse_isAccountExit(response){
}

function Submit(){
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var alias = document.getElementById("alias").value;
  var img = document.getElementById("avatar").src;
  var account = document.getElementById("account").value;
  var password = document.getElementById("password").value;
  var repassword = document.getElementById("repassword").value;
  var forgetQ = document.getElementById("forgetQ").options[document.getElementById("forgetQ").selectedIndex].value;
  var forgetA = document.getElementById("forgetA").value;
  var type = document.getElementById("type").options[document.getElementById("type").selectedIndex].value;
  var gender = document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
  var phone = document.getElementById("phone").value;
  var addressCity = document.getElementById("addressCity").options[document.getElementById("addressCity").selectedIndex].value;
  var addressDistrict = document.getElementById("addressDistrict").options[document.getElementById("addressDistrict").selectedIndex].value;
  var address = document.getElementById("address").value;
  var birthday = document.getElementById("birthday").value;
  var selfIntroduction = document.getElementById("selfIntroduction").value;
  var postalCode = ShowPostalCode(addressCity,addressDistrict);

  if(password!=repassword){
    alert("密碼不正確，請確認。");
    return;
  }

  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_detail(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "php/writeDB.php?fname="+fname+"&lname="+lname+"&alias="+alias+"&img="+img+"&account="+account+"&password="+password+"&forgetQ="+forgetQ+"&forgetA="+forgetA+"&type="+type+"&gender="+gender+"&phone="+phone+"&postalCode="+postalCode+"&address="+address+"&birthday="+birthday+"&selfIntroduction="+selfIntroduction, true);
  xmlHttp.send(null);
}
function HandleResponse_detail(response){
  if(!response){
    alert("註冊成功！！ ✧*｡٩(ˊᗜˋ*)و✧*｡ ");
  }
  else{
    alert("你是不是輸入了什麼怪怪的符號阿 ٩(ŏ﹏ŏ、)۶ ");
  }
}

function ShowAllQ(){
  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_ShowAllQ(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "php/readDB_Q.php", true);
  xmlHttp.send(null);
}
function HandleResponse_ShowAllQ(response){
  obj = JSON.parse(response);
  for(var r in obj){
    var question = obj[r].question;
    var questionID = obj[r].questionID;
    $("#forgetQ").append('<option value='+questionID+'>'+question+'</option>');
  }
}

/** 郵遞區號相關 **/
function ShowAllCity(){
  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_ShowAllCity(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "php/readDB_city.php", true);
  xmlHttp.send(null);
}
function HandleResponse_ShowAllCity(response){
  obj = JSON.parse(response);
  for(var r in obj){
    var addressCity = obj[r].addressCity;
    $("#addressCity").append('<option value='+addressCity+'>'+addressCity+'</option>');
  }
}
function ShowAllDistrict(city){
  var lookup = {};
  for (var i = 0, len = obj.length; i < len; i++) {
    if(city==obj[i].addressCity){
      var district = obj[i].district;
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
  for (var i = 0, len = obj.length; i < len; i++) {
    if(city==obj[i].addressCity){
      var district = obj[i].district;
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
  for(var city in obj){
    var addressCity = obj[city].addressCity;
    var district = obj[city].district;
    for(var dis in district){
      if(e==district[dis].postalcode){
        $('#addressCity option:contains('+addressCity+')').prop({selected: true});
        ShowAllDistrict(obj[city].addressCity);
        $('#addressDistrict option:contains('+district[dis].addressDistrict+')').prop({selected: true});
        return 1;
      }
    }
  }
  $('#addressCity option:first').prop({selected: true});
  ShowAllDistrict(obj[city].addressCity);
  $('#addressDistrict option:first').prop({selected: true});
  return 0;
}
function getPostCode(){
  var C = $("#addressCity option:selected").text();
  var D = $("#addressDistrict option:selected").text();
  for(var city in obj){
    var addressCity = obj[city].addressCity;
    var district = obj[city].district;
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
