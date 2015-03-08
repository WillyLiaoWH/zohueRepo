var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var loaded=false;
$(document).ready(function(){
  setPage();
});

var nice;
function setPage() {
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var article_id = url.replace(regex,"$1");

  $.get("/checkAuth", function(auth){
    if(auth) {
      document.getElementById("content").style.width = "80%";
      document.getElementById("niceArticle").style.display="inline";
      document.getElementById("report").style.display="inline";
    }
  });

  $.get("/setArticlePage/"+article_id, function(res){
    articleList=res.articleList;
    articleTitle=articleList[0].title;
    articleContent=articleList[0].content;
    alert(JSON.stringify(articleList[0]));
    updateClickNum();

    response=res.responseList;

    regex=/(.*)T(.*)\..*/
    createdAt=new Date(articleList[0].createdAt).toLocaleString();
    postTime=createdAt.slice(0,createdAt.length-3);
    lastResponseTime=new Date(articleList[0].lastResponseTime).toLocaleString();
    updateTime=lastResponseTime.slice(0, lastResponseTime.length-3);
    
    if(articleList[0].author.type=="S") {
      document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:15px 20px 5px 25px;display: inline-block;height:70px;width:70px;' src='/images/img_forum/sw_icon.png' title='已認證社工師'>";
      document.getElementById("articleAvatar").innerHTML = "<img style='padding:15px 0px 5px 0px;display: inline-block;height:70px;width:70px;' src='"+articleList[0].author.img+"'>";
      articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+articleList[0].author.alias+"&nbsp社工師</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>發表時間："+postTime+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>更新時間："+updateTime+"</td>";
    } else if(articleList[0].author.type=="D") {
      document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:15px 20px 5px 25px;display: inline-block;height:70px;width:70px;' src='/images/img_forum/doctor_icon.png' title='已認證醫師'>";
      document.getElementById("articleAvatar").innerHTML = "<img style='padding:15px 0px 5px 0px;display: inline-block;height:70px;width:70px;' src='"+articleList[0].author.img+"'>";
      articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+articleList[0].author.alias+"&nbsp醫師</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>發表時間："+postTime+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>更新時間："+updateTime+"</td>";
    } else if(articleList[0].author.type=="P") {
      document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:15px 20px 5px 25px;display: inline-block;height:70px;width:70px;' src='/images/img_forum/user_icon.png' title='病友'>";
      document.getElementById("articleAvatar").innerHTML = "<img style='padding:15px 0px 5px 0px;display: inline-block;height:70px;width:70px;' src='"+articleList[0].author.img+"'>";
      articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+articleList[0].author.alias+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>發表時間："+postTime+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>更新時間："+updateTime+"</td>";
    } else if(articleList[0].author.type=="F") {
      document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:15px 20px 5px 25px;display: inline-block;height:70px;width:70px;' src='/images/img_forum/user_icon.png' title='家屬'>";
      document.getElementById("articleAvatar").innerHTML = "<img style='padding:15px 0px 5px 0px;display: inline-block;height:70px;width:70px;' src='"+articleList[0].author.img+"'>";
      articleData="<td valign='botnicetom' style='padding:0px 0px 7px 20px;'>發表人："+articleList[0].author.alias+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>發表時間："+postTime+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>更新時間："+updateTime+"</td>";
    } else {
      document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:15px 20px 5px 25px;display: inline-block;height:70px;width:70px;' src='/images/img_forum/user_icon.png' title='一般民眾'>";
      document.getElementById("articleAvatar").innerHTML = "<img style='padding:15px 0px 5px 0px;display: inline-block;height:70px;width:70px;' src='"+articleList[0].author.img+"'>";
      articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+articleList[0].author.alias+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>發表時間："+postTime+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;'>更新時間："+updateTime+"</td>";
    }


    document.getElementById("articleTitle").innerHTML = articleTitle;
    document.getElementById("articleData").innerHTML = articleData;
    document.getElementById("articleContent").innerHTML = articleContent;

    responseContext="";
    if(response.length!=0) {
      for(i=0; i<response.length; i++) {
        commentTime=new Date(response[i].createdAt).toLocaleString();

        switch(response[i].author.type){
          case "D":
            var type_avatar_img = "src='/images/img_forum/doctor_icon.png' title='已認證醫師'";
            var user_type = "醫師";
          break;
          case "S":
            var type_avatar_img = "src='/images/img_forum/sw_icon.png' title='已認證社工師'";
            var user_type = "社工師";
          break;
          case "P":
            var type_avatar_img = "src='/images/img_forum/user_icon.png' title='病友'";
            var user_type = "";
          break;
          case "F":
            var type_avatar_img = "src='/images/img_forum/user_icon.png' title='家屬'";
            var user_type = "";
          break;
          default:
            var type_avatar_img = "src='/images/img_forum/user_icon.png' title='一般民眾'";
            var user_type = "";
          break;
        }
        var type_avatar = "<td valign=top rowspan=4 style='padding:26px 5px 0px 0px;'><img "+type_avatar_img+" style='height:70px; width:70px;'></td>";

        responseContext += "<tr>"+type_avatar+"<td valign=top rowspan=4 style='padding:26px 5px 0px 0px;'><img src='"+response[i].author.img+"' style='height:70px; width:70px;'></td>";
        responseContext += "<tr><td style='padding:20px 0px 0px 10px;'><label style='color:rgba(102, 141, 60, 0.9);'>"+commentTime+"</label></td></tr>";
        responseContext += "<tr><td style='padding:0px 0px 5px 10px;'><label style='font-weight:bold; color:#000079;'>"+response[i].author.alias+" "+user_type+"&nbsp</label><label style='word-break: break-all;'>"+response[i].comment+"</label></td></tr>";
        if(res.login) {
          if(res.responseNice[i]) {
            responseContext += "<tr><td style='padding:3px 0px 0px 10px;'><div id='response"+response[i].id+"'><button style='margin-right:10px;' value='收回' class='n' onclick='notNiceResponse("+response[i].id+");'><img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>有&nbsp<label id=N_res_nice"+response[i].id+">"+res.responseNiceCount[i]+"</label>&nbsp人推薦</div></td></tr>";
          } else {
            responseContext += "<tr><td style='padding:3px 0px 0px 10px;'><div id='response"+response[i].id+"'><button style='margin-right:10px;' value='推薦' class='n' onclick='niceResponse("+response[i].id+");'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>有&nbsp<label  id=N_res_nice"+response[i].id+">"+res.responseNiceCount[i]+"</label>&nbsp人推薦</div></td></tr>";
          } 
        }else{
          responseContext += "<tr></tr>";
        }
      }
      document.getElementById("commentList").innerHTML = responseContext;
      document.getElementById("commentList").style.display = "block";
    }
    if(res.isAuthor) {
      document.getElementById("editArticle").style.display = "inline";
      document.getElementById("deleteArticle").style.display = "inline";
    }
    if(res.isNice) {
      document.getElementById("niceArticle").innerHTML = "<button value='收回' class='n' onclick='cancelNice();'><img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>";
      document.getElementById("niceCount").innerHTML = "有 "+res.lnicer+" 人推薦";
    } else {
      document.getElementById("niceArticle").innerHTML = "<button value='推薦' class='n' onclick='clickNice();'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>";
      document.getElementById("niceCount").innerHTML = "有 "+res.lnicer+" 人推薦";
    }
    if(res.isReport) {
      document.getElementById("report").innerHTML = "<button value='收回' class='n' onclick='cancelReport()'>&nbsp收回</button>";
      document.getElementById("reportCount").innerHTML = "有 "+res.reportCount+" 人檢舉";
    } else {
      document.getElementById("report").innerHTML = "<button value='檢舉' class='n' onclick='clickReport()'>&nbsp檢舉</button>";
      document.getElementById("reportCount").innerHTML = "有 "+res.reportCount+" 人檢舉";
    }

  }).error(function(err){
    alert(err);
  });

}

function backToList() {
  var url=document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var page = url.replace(regex,"$2");
  window.location.assign("/forum/"+page);
}

function editArticle() {
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var article_id = url.replace(regex,"$1");
  location.assign("/editArticle/"+article_id);
}

function deleteArticle() {
  var r = confirm("確定要刪除文章嗎？");
  if (r == true) {
    var url = document.URL;
    var regex = /.*article\/+(.*)\?page=+(.*)/;
    var id = url.replace(regex,"$1");
    $.post( "/deleteArticle", { id: id}, function(res){
     alert("文章刪除成功！");
      window.location.replace("/forum/1");
    })
    .error(function(res){
    alert(res.responseJSON.err);
  });} 
  else {}
}

function leaveComment(){
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var article_id = url.replace(regex,"$1");
  var comment = $("#comment").val();
  $.post( "/leaveComment", { comment: comment, article_id: article_id}, function(res){
    window.location.replace(url);
  })
    .error(function(res){
      alert(res.responseJSON.err);
    });

}

function updateResponseNum(){
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var id = url.replace(regex,"$1");
  var responseNum = parseInt(response.length)+1;
  $.post( "/updateResponseNum", { id: id, responseNum: responseNum}, function(res){
    window.location.reload(true);
  })
    .error(function(res){
      alert(res.responseJSON.err);
  });
}

function updateClickNum(){
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var id = url.replace(regex,"$1");
  var clickNum=parseInt(articleList[0].clickNum)+1;
  $.post( "/updateClickNum", { id: id, clickNum: clickNum}, function(res){
  })
    .error(function(res){
      alert(res.err);
    });
}

function clickNice() {
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var id = url.replace(regex,"$1");
  document.getElementById("niceArticle").innerHTML = "<button value='收回' class='n' onclick='cancelNice();'><img style='width:24px; height:24px;'src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>";
  $.post("/clickNice", {article_id: id}, function(res){
    document.getElementById("niceCount").innerHTML = "有 "+res.num+" 人推薦";
  }).error(function(res){
    alert(res.err);
  });
}

function cancelNice() {
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var id = url.replace(regex,"$1");
  document.getElementById("niceArticle").innerHTML = "<button value='推薦' class='n' onclick='clickNice()'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>";  
  $.post("/cancelNice", {article_id: id}, function(res){
    document.getElementById("niceCount").innerHTML = "有 "+res.num+" 人推薦";
  }).error(function(res){
    document.getElementById("niceArticle").innerHTML = "<button value='收回' class='n' onclick='cancelNice();'><img style='width:24px; height:24px;'src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>"; 
    alert(res.responseJSON.err);
  });
}

function niceResponse(response_id) {
  $.post("/niceResponse", {response_id: response_id}, function(res){
    var N_res = "N_res_nice"+response_id;
    var N_res_nicer = document.getElementById(N_res).innerHTML;
    N_res_nicer = parseInt(N_res_nicer)+1;

    document.getElementById("response"+response_id).innerHTML = "<button style='margin-right:10px;' value='收回' class='n' onclick='notNiceResponse("+response_id+");'><img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>有&nbsp<label id=N_res_nice"+response_id+">"+N_res_nicer+"</label>&nbsp人推薦";
  }).error(function(res){
      alert(res.responseJSON.err);
  });
}

function notNiceResponse(response_id) {
  $.post("/notNiceResponse", {response_id: response_id}, function(res){
    var N_res = "N_res_nice"+response_id;
    var N_res_nicer = document.getElementById(N_res).innerHTML;
    N_res_nicer = parseInt(N_res_nicer)-1;
    document.getElementById("response"+response_id).innerHTML = "<button style='margin-right:10px;' value='推薦' class='n' onclick='niceResponse("+response_id+");'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>有&nbsp<label id=N_res_nice"+response_id+">"+N_res_nicer+"</label>&nbsp人推薦";
  }).error(function(res){
      alert(res.responseJSON.err);
  });
}

function clickReport() {
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var id = url.replace(regex,"$1");
  document.getElementById("report").innerHTML = "<button value='收回' class='n' onclick='cancelReport();'>&nbsp收回</button>";
  $.post("/clickReport", {article_id: id}, function(res){
    document.getElementById("reportCount").innerHTML = "有 "+res.num+" 人檢舉";
  }).error(function(res){
    alert(res.err);
  });
}

function cancelReport() {
  var url = document.URL;
  var regex = /.*article\/+(.*)\?page=+(.*)/;
  var id = url.replace(regex,"$1");
  document.getElementById("report").innerHTML = "<button value='推薦' class='n' onclick='clickReport()'>&nbsp檢舉</button>";  
  $.post("/cancelReport", {article_id: id}, function(res){
    document.getElementById("reportCount").innerHTML = "有 "+res.num+" 人檢舉";
  }).error(function(res){
    document.getElementById("report").innerHTML = "<button value='收回' class='n' onclick='cancelReport();'>&nbsp收回</button>"; 
    alert(res.responseJSON.err);
  });
}

function editProfile(){
  content.style.display="none";
}

function sendEmail(){

  var mailaddress=""
  $.get("/checkAuth", function(auth){
    if(auth) {
      $.get("/getEmail",function(res){
        mailaddress=res;
        if(!confirm("是否要把這篇寄給"+mailaddress)){
          mailaddress=prompt('把這封email送到：') ;
        }
      });
    }
    else{
      mailaddress=prompt('把這封email送到：') ;
    }

    if (mailaddress.length>0){
      var url = document.URL;
      var regex = /.*article\/+(.*)\?page=+(.*)/;
      var article_id = url.replace(regex,"$1");
      $.post("/sendEmail",{article_id: article_id,mailaddress: mailaddress},function(res){
        if (res == "SEND"){
          alert("已經送出信件至"+mailaddress); 
        }
      });
    }
  });

}