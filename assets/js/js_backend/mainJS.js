var page;
var board=1;
var tab="all";
var userTable="";
var articleTable="";
var articleList="";

function loadUserList(){
  document.getElementById("userManage").style.display="block";
  document.getElementById("forumManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="none";

  $.get("/getAllUsers", function(userList){

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

function getart(callback){
  $.get("/setBoardPage/"+board+"/"+tab, function(res){
    
    articleList=res.articlesList;
    var boardName=res.board.title;
    var boardCate=res.board.category.title;

    callback(articleList);
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function loadForumList(articleList){
  document.getElementById("forumManage").style.display="block";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="none";

  articleTable="<tr><th>文章類別</th><th style='width:400px;'>文章標題</th><th style='width:200px;'>發表人</th><th>身分別</th>";
  articleTable+="<th>發表時間</th><th>最新回應時間</th><th>點閱數／回覆數</th><th>推薦數</th><th onclick='sortArticles()' style='width:200px;'>檢舉數</th><tr>";
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
      articleTable+="<td>"+authorType+"</td><td>"+postTime+"</td><td>"+lastResponseTime+"</td><td>"+clickNum+"／"+responseNum+"</td><td>"+niceNum+"</td>";
      
      reportobj=articleList[i].report;
      var reasonHtml = reasonHtmlCreate(reportobj);

      if(reportNum>0 && reportNum<3){
        articleTable+="<td class='reasonTd' onClick='showReason("+i+")'>"+reportNum;
        articleTable+="<div id='reportReason_"+i+"' style='display:none;'>"+reasonHtml+"</div></td></tr>";
      }else if(reportNum>=3){
        articleTable+="<td class='reasonTd' onClick='showReason("+i+")'>"+reportNum+"<span class='glyphicon glyphicon-exclamation-sign aria-hidden='true' title='該篇文章檢舉次數超過3'></span>";
        articleTable+="<div id='reportReason_"+i+"' style='display:none;'>"+reasonHtml+"</div></td></tr>";
      }else{
        articleTable+="<td>"+reportNum+"</td></tr>";
      }
    }
  document.getElementById("backend_articleList").innerHTML = articleTable;
}

function loadEnlManage(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="block";
  document.getElementById("subscriberManage").style.display="none";
}

function loadsubscriberList(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="block";

  $.get("/getAllSubscribers", function(res){
    
    subscribers=res;

    subscriberTable="<tr><th>編號</th><th>電子郵件地址</th><th>訂閱日期</th><th>刪除</th><tr>";

    for(i=0; i<subscribers.length; i++){
      createdAt=new Date(subscribers[i].createdAt).toLocaleString();
      subscriberId=subscribers[i].id;
      subscriberTable+="<tr><td>"+(i+1)+"</td><td>"+subscribers[i].email+"</td><td>"+createdAt+"</td>";
      subscriberTable+="<td><span class='glyphicon glyphicon-trash delSub' aria-hidden='true' onclick='deleteSubscriber("+subscriberId+");'></span></td></tr>";
    }

    document.getElementById("backend_subscriberList").innerHTML = subscriberTable;
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}


function sortArticles(){
  
  articleList=articleList.sort(function(a, b) {
      return b.report.length-a.report.length;
  });
  //alert("sort"+JSON.stringify(articleList));
  loadForumList(articleList);
}


function reasonHtmlCreate(reportobj){
  var reportReasonHtml="檢舉理由：";
  for(k=0; k<reportobj.length; k++){
    reportReasonHtml+="<ul><li>"+reportobj[k].reason+"</li></ul>";
  }
  return(reportReasonHtml);
}

function showReason(ulId){
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
    document.getElementById("mailSpinner").style.display="block";
    document.getElementById("mailEdit").style.display="none";
    $.post("/sendNewsLetter",{mailSubject: mailSubject,mailContent: mailContent}, function(res){
      if (res == "SEND"){
        alert("電子報發送成功!");
        document.getElementById("mailSubject").value="";
        document.getElementById("mailContent").value="";
        document.getElementById("mailEdit").style.display="block"; 
        document.getElementById("mailSpinner").style.display="none";
      }else{
        alert("電子報發送失敗!");
        document.getElementById("mailSubject").value="";
        document.getElementById("mailContent").value="";
        document.getElementById("mailEdit").style.display="block"; 
        document.getElementById("mailSpinner").style.display="none";
      }
    });
  }
}

function deleteSubscriber(id) {
  var r = confirm("確定要刪除該訂閱者嗎？");
  if (r == true) {
    $.post( "/deleteSubscriber", { id: id}, function(res){
     alert("刪除成功！");
     loadsubscriberList();
    })
    .error(function(res){
      alert(res.responseJSON.err);
  });} 
}