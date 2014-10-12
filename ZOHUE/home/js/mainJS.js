var allow_create = 0;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

function check(){
  if($("#UserAlias").val() == ""){
    $("label[id = alias]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = alias]").text("");allow_create = 1;}

  if($("#UserAccount").val() == ""){
    $("label[id = account]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = account]").text("");allow_create = 1;}

  if($("#UserPassword").val() == ""){
    $("label[id = password]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = password]").text("");allow_create = 1;}

  if($("#UserPasswordConfirm").val() == ""){
    $("label[id = pwdconfirm]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = pwdconfirm]").text("");allow_create = 1;}

  if($("#UserEmail").val() == ""){
    $("label[id = email]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = email]").text("");allow_create = 1;}
  checkEmail();checkPwd();


  if(allow_create==1){Submit();}

}

function checkEmail(){
  if($("#UserEmail").val() == ""){allow_create = 0;}
  else if($("#UserEmail").val().search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/)== -1){
    $("label[id = email]").text("  *E-mail格式錯誤！");allow_create = 0;}
  else{
    allow_create = 1;
  }
}

function checkPwd(){
  if(UserPasswordConfirm.value!=null && UserPassword.value!=null){}
  else if(UserPassword.value != UserPasswordConfirm.value){
    $("label[id = pwdconfirm]").text("  *確認密碼和原設密碼不相同！");allow_create = 0;
  }
  else{
    allow_create = 1;
  }
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

function Submit(){
  var alias = $("#UserAlias").val();
  var account = $("#UserAccount").val();
  var password = $("#UserPassword").val();
  var email = $("#UserEmail").val();

  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_detail(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "php/writeDB.php?alias="+alias+"&account="+account+"&password="+password+"&email="+email, true);
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

function Login(){
  if($("#inputLoginAc").val() == ""|| $("#inputLoginPw").val() == ""){
    $("label[id = loginAc]").text("  *登入無效！");
  }else{$("label[id = loginAc]").text("");}

}

