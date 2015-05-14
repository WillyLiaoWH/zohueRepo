var page;
var board=1;
var tab="all";
var myTable="";

function loadUserList(){
  document.getElementById("userManage").style.display="block";
  document.getElementById("forumManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
}

function loadForumList(){
  document.getElementById("forumManage").style.display="block";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
}

function loadEnlManage(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="block";
}

$.get("/setBoardPage/"+board+"/"+tab, function(res){
      var articleList=res.articlesList;
      var boardName=res.board.title;
      var boardCate=res.board.category.title;

      myTable="<tr><th style='width:110px;'>文章類別</th><th style='width:600px;'>文章標題</th><th style='width:200px;'>發表人</th><th style='width:200px;'>身分別</th><th style='width:200px;'>發表時間</th><th>檢舉次數</th><tr>";
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

        myTable+="<tr><td>"+articleList[i].classification+"</td><td>"+articleList[i].title+"</td><td>"+articleList[i].author.alias+"</td>";
        myTable+="<td>"+authorType+"</td><td>"+postTime+"</td>";
        if(reportNum>=3){
          reportobj=articleList[i].report;

          myTable+="<td>"+reportNum+"<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true' onClick='showReason(reportobj, "+i+")'></span>";
          myTable+="<div id='reportReason_"+i+"' style='display:none;'></div></td><tr>";
        }else{
          myTable+="<td>"+reportNum+"</td><tr>";
        }
      }
      document.getElementById("backend_articleList").innerHTML = myTable;
    }).error(function(res){
      alert(res.responseJSON.err);
});

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

