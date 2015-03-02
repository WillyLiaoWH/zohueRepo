var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
$(document).ready(function(){
  setPage();
});

// function checkAuth() {
//   $.get("/checkAuth", function(auth){
//     if(auth) {
//       var setUp=document.getElementById("setUp");
//       setUp.style.display="true";

//       var login=document.getElementById("loginSection");
//       login.style.display="none";

//       var simpleS=document.getElementById("signup");
//       if(simpleS){
//         simpleS.style.display="none";
//       }
//       var profile=document.getElementById("profile");
//       profile.style.display="block";
//       document.getElementById("userAlias").innerHTML = "Hello, "+auth.alias;


//       $.get("/checkFull", function(full){
//         var fullSignup=document.getElementById("fullSignup");
//         if(!full){
//           fullSignup.style.display="block";
//         }else{
//           fullSignup.style.display="none";
//         }
//       });
//     }else{
//       abort();
//     }
//   });
// }

function setPage() {
  var url = document.URL;
  var regex = /.*editArticle\/+(.*)/;
  var article_id = url.replace(regex,"$1");
  $.get("/setArticlePage/"+article_id, function(res){
    articleList=res.articleList;
    // alert(JSON.stringify(articleList));
    articleTitle=articleList[0].title;
    //articleData=articleList[match-1].author;
    articleContent=articleList[0].content;

    document.getElementById("postTitle").value = articleTitle;
    document.getElementById("postContent").innerHTML = articleContent;

  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function post() {
  var url = document.URL;
  var regex = /.*editArticle\/+(.*)/;
  var id = url.replace(regex,"$1");
  var newTitle = $("#postTitle").val();
  var newContent = $("#postContent").val();
  var posting = $.post( "/changeArticle", { id: id, newTitle: newTitle, newContent: newContent}, function(res){
    alert(JSON.stringify(res));
    alert("文章編輯成功！！ ✧*｡٩(ˊᗜˋ*)و✧*｡ ");
    window.location.replace("/forum");
  })
    .error(function(res){
      // alert(JSON.stringify(res));
      alert(res.responseJSON.err);
    });
}

function abort() {
  location.replace("/forum");
}

function Login(){
  var account=$("#LoginAccount").val();
  var password=$("#LoginPwd").val();
  if(account == ""|| password == ""){
    alert("帳號密碼都要輸入唷！");
  } else {
    var posting = $.post( "/login", { account: account, password: password}, function(res){
    // alert(JSON.stringify(res));
    alert("登入成功！！ ✧*｡٩(ˊᗜˋ*)و✧*｡ ");
    location.reload();
  })
    .error(function(res){
      // alert(JSON.stringify(res));
      alert(res.responseJSON.err);
    });
  }
}

function editProfile(){
  content.style.display="none";
}

