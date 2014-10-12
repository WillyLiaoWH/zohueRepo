var obj;
var account;
var userID;

$(document).ready(function(){
  var url = location.search; //获取url中？符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
      theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
    }
  }
  account = theRequest["account"];
  //alert(account);

  ShowAll();
});

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
        alert("Your browser does not support AJAX!")
        return false;
      }
    }
  }
  return xmlHttp;
}

function ShowAll(){
  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_ShowAll(xmlHttp.responseText);
    }
  }
  xmlHttp.open("GET", "php/readDB.php?account="+account, true);
  xmlHttp.send(null);
}
function HandleResponse_ShowAll(response){

  obj = JSON.parse(response);
  for(var r in obj){
    userID = obj[r].userID;

    var lastName = obj[r].lastName;
    var firstName = obj[r].firstName;
    var alias = obj[r].alias;
    var account = obj[r].account;
    var password = obj[r].password;
    var type = obj[r].type;
    var forgetQ = obj[r].forgetQ;
    var forgetA = obj[r].forgetA;
    var gender = obj[r].gender;
    var phone = obj[r].phone;
    var postalCode = obj[r].postalCode;
    var address = obj[r].address;
    var birthday = obj[r].birthday;
    var image = obj[r].image;
    var selfIntroduction = obj[r].selfIntroduction;
    //alert(selfIntroduction);
  }
  document.getElementById("fname").value = firstName;
  document.getElementById("lname").value = lastName;
  document.getElementById("alias").value = alias;
  // document.getElementById("image").src = image;
  document.getElementById("forgetQ").value = forgetQ;
  // document.getElementById("forgetQ").options.[document.getElementById("forgetQ").selectedIndex].value = forgetQ;
  document.getElementById("forgetA").value = forgetA;
  document.getElementById("type").value = type;
  document.getElementById("gender").value = gender;
  document.getElementById("phone").value = phone;
  document.getElementById("address").value = address;
  document.getElementById("birthday").value = birthday;
  document.getElementById("selfIntroduction").value = selfIntroduction;
}

function Logout(){
  window.location.href="../signup";
}

function Submit(){
  var fname = document.getElementById("fname").value;
  var lname = document.getElementById("lname").value;
  var alias = document.getElementById("alias").value;
  var img = document.getElementById("avatar").src;
  var forgetQ = document.getElementById("forgetQ").value;
  var forgetA = document.getElementById("forgetA").value;
  var type = document.getElementById("type").value;
  var gender = document.getElementById("gender").value;
  var phone = document.getElementById("phone").value;
  var addressCity = document.getElementById("addressCity").value;
  var addressDistrict = document.getElementById("addressDistrict").value;
  var address = document.getElementById("address").value;
  var birthday = document.getElementById("birthday").value;
  var selfIntroduction = document.getElementById("selfIntroduction").value;
  var postalCode = ShowPostalCode(addressCity,addressDistrict);

  alert(account);

  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_detail(xmlHttp.responseText);
    }
  }
  alert("php/writeDB.php?fname="+fname+"&lname="+lname+"&alias="+alias+"&img="+img+"&forgetQ="+forgetQ+"&forgetA="+forgetA+"&type="+type+
                      "&gender="+gender+"&phone="+phone+"&postalCode="+postalCode+"&address="+address+"&birthday="+birthday+"&selfIntroduction="+selfIntroduction);
  xmlHttp.open("GET", "php/writeDB.php?fname="+fname+"&lname="+lname+"&alias="+alias+"&img="+img+"&forgetQ="+forgetQ+"&forgetA="+forgetA+"&type="+type+
                      "&gender="+gender+"&phone="+phone+"&postalCode="+postalCode+"&address="+address+"&birthday="+birthday+"&selfIntroduction="+selfIntroduction, true);
  xmlHttp.send(null);
}
function HandleResponse_detail(response){
  alert("return "+response);
  try{
    if(!response){
      alert("資料更改成功。");
    }
  }
  catch (e) {
    alert("return "+response);
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