var page;
var board=1;
var tab="all";
var userTable="";
var articleTable="";

function loadUserList(){
  document.getElementById("userManage").style.display="block";
  document.getElementById("forumManage").style.display="none";
  document.getElementById("enlManage").style.display="none";

  $.get("/getAllUsers", function(userList){

    //alert(JSON.stringify(userList[2]));
    //alert(JSON.stringify(userList[1].articlesPost[0].report.length));

    userTable="<tr><th>帳號</th><th>姓名</th><th>暱稱</th><th>性別</th><th>身分別</th><th>E-mail</th><th>註冊日期</th><th>正式會員</th><th>發文數</th><th>文章平均檢舉數</th><th>停權</th><tr>";

    for(i=0; i<userList.length; i++) {
      fullName=userList[i].lname+" "+userList[i].fname;
      createdAt=new Date(userList[i].createdAt).toLocaleString();
      postNum = userList[i].articlesPost.length;
      totalReport=0;
      for(j=0; j<userList[i].articlesPost.length; j++) {
        totalReport+=userList[i].articlesPost[j].report.length;
      }
      if(postNum==0){
        avgReportNum = 0
      }else{
        avgReportNum = totalReport/postNum;
      }
      
      userTable+="<tr><td>"+userList[i].account+"</td><td>"+fullName+"</td><td>"+userList[i].alias+"</td><td>"+userList[i].gender+"</td>";
      userTable+="</td><td>"+userList[i].type+"</td><td>"+userList[i].email+"</td><td>"+createdAt+"</td>";
      if (userList[i].isFullSignup==false){
        userTable+="<td><span class='glyphicon glyphicon-remove-circle' aria-hidden='true'></span></td>";
      }else{
        userTable+="<td><span class='glyphicon glyphicon-ok-circle' aria-hidden='true'></span></td>";
      }
      userTable+="<td>"+postNum+"</td>";
      if (avgReportNum>=3){
        userTable+="<td>"+avgReportNum+"<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true' title='文章平均檢舉數超過3'></span></td>";
      }else{
        userTable+="<td>"+avgReportNum+"</td>";
      }
      userTable+="<td><span class='glyphicon glyphicon-ban-circle' aria-hidden='true'></span></td></tr>";
    }
    

    document.getElementById("backend_userList").innerHTML = userTable;
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function loadForumList(){
  document.getElementById("forumManage").style.display="block";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";

  $.get("/setBoardPage/"+board+"/"+tab, function(res){

    res.articlesList.sort(function(a, b) {
      return b.report.length-a.report.length;
    });

    var articleList=res.articlesList;
    var boardName=res.board.title;
    var boardCate=res.board.category.title;

    articleTable="<tr><th style='width:110px;'>文章類別</th><th style='width:600px;'>文章標題</th><th style='width:200px;'>發表人</th><th style='width:200px;'>身分別</th><th style='width:200px;'>發表時間</th><th>檢舉次數</th><tr>";
    for(i=0; i<articleList.length; i++) {
      clickNum=articleList[i].clickNum;
      responseNum=articleList[i].responseNum;
      niceNum=articleList[i].nicer.length;
      lastTime=new Date(articleList[i].lastResponseTime).toLocaleString();
      lastResponseTime=lastTime.slice(0, lastTime.length-3);
      createdAt=new Date(articleList[i].createdAt).toLocaleString();
      postTime=createdAt.slice(0,createdAt.length-3);
      authorType=articleList[i].author.type;
      reportNum=articleList[i].report.length;

      articleTable+="<tr><td>"+articleList[i].classification+"</td><td>"+articleList[i].title+"</td><td>"+articleList[i].author.alias+"</td>";
      articleTable+="<td>"+authorType+"</td><td>"+postTime+"</td>";
      if(reportNum>=3){
        reportobj=articleList[i].report;
        articleTable+="<td>"+reportNum+"<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true' onClick='showReason(reportobj, "+i+")'></span>";
        articleTable+="<div id='reportReason_"+i+"' style='display:none;'></div></td><tr>";
      }else{
        articleTable+="<td>"+reportNum+"</td><tr>";
      }
    }
    document.getElementById("backend_articleList").innerHTML = articleTable;
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function loadEnlManage(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="block";
}



function showReason(reportobj, ulId){
  var reportReasonHtml="檢舉理由：";
    for(k=0; k<reportobj.length; k++){
      reportReasonHtml+="<ul><li>"+reportobj[k].reason+"</li></ul>";
    }
  document.getElementById("reportReason_"+ulId).innerHTML=reportReasonHtml;
  if(document.getElementById("reportReason_"+ulId).style.display=="none"){
    document.getElementById("reportReason_"+ulId).style.display="block";
  }else{
    document.getElementById("reportReason_"+ulId).style.display="none";
  }
  
}

function sendNewsLetter(){
  var mailSubject = document.getElementById("mailSubject").value;
  var mailContent = document.getElementById("mailContent").value;
  if (mailSubject=="" && mailContent==""){
    alert("尚未輸入主旨或內文!");
  }else{
    $.post("/sendNewsLetter",{mailSubject: mailSubject,mailContent: mailContent}, function(res){
      if (res == "SEND"){
        alert("電子報發送成功!"); 
      }else{
        alert("電子報發送失敗!");
      }
    });
  }
}

