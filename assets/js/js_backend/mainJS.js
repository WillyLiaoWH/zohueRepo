var userTable="";
var articleTable="";
var articleList="";
var searchUser="";
var attachmentList=[];
var attachmentNameList=[];
var categoryList={};
var formNum;
var delArtId=[];
var unDelArtId=[];

$(document).ready(function(){
  checkAuth();

  $(document).on("click","#adminLogout",function(e){
    var posting = $.post( "/adminLogout", {}, function(res){
      if(res=="success"){
        window.location.assign("/home");
      }      
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  });

  function checkAuth() {
    $.get("/checkAdmin", function(res){
      if(res=="true") {
        $("#backendContent").css("display","block");
        $("#backendMenu").css("display","block");

        // 初始化論壇管理的selector內容
        $.get("/getBoardCategory", function(boardCategory){
          for(c=0; c<boardCategory.length; c++) {
            categoryList[boardCategory[c].id]=boardCategory[c].title;      
            $("#boardCategory").append("<option value='"+boardCategory[c].id+"''>"+boardCategory[c].title+"</option>");
          }
          $("#boardCategory").append("<option value='allCategory'>選擇全部</option>")
        }).error(function(res){
          showDialog("錯誤訊息",res.responseJSON.err);
        });

        $("#boardCategory").change(function(){
          var category = $("#boardCategory").val();
          var board = $("#board").val();

          if(category=="allCategory"){
            $("#board").empty();
            $("#board").append("<option>選擇全部</option>")
            getart(loadForumList, 2);
          }else{
            $("#board").empty();
            $.get("/getBoardsOfCategory/"+category, function(boards) {
              $("#board").append("<option selected='selected'>請選擇</option>")
              for(b=0; b<boards.length; b++) {
                $("#board").append("<option value='"+boards[b].id+"''>"+boards[b].title+"</option>");
              }
              $("#board").append("<option value='allBoards'>選擇全部</option>")
            });
          }
        });

        $("#board").change(function(){
          if($(this).val()=="allBoards"){
            getart(loadForumList, 1);
          }else{
            board=$(this).val();
            getart(loadForumList, 0);
          }   
        });

      }else{
        $("#adminLoginArea").css("display", "block");
        showDialog("錯誤訊息","你不是管理員喔！",function(){
          window.location.assign("/home");
        });
      }
    });
  }

  // 帳號管理時，點選某一使用者record，會收起已經打開的其他record。
  $(document).on("click","#backend_userList .userRecord",function(e){
     $("#backend_userList .userInfo").removeClass("in");
  });

  // 論壇管理排序文章
  $(document).on("click",".sortByChar",function(e){
    sortByChar($(this).attr("value"));
  });
  $(document).on("click",".sortByLength",function(e){
    sortByLength($(this).attr("value"));
  });
  $(document).on("click",".sortByCreatedAt",function(e){
    sortByCreatedAt();
  });
  $(document).on("click",".sortByUpdatedAt",function(e){
    sortByUpdatedAt();
  });

  // 發送電子報的上傳檔案功能
  $("input[name='uploadFile']").change(function(){
    var fullPath = $(this).val();
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
    }
    $("form#uploadForm").submit();
    attachmentNameList.push(filename);
    $("#attachmentEdit label").css("display", "block");
    $("#attachmentList").append("<tr><td>"+filename+"</td><td class='text-right'><span class='glyphicon glyphicon-remove removeFile' value='"+filename+"' aria-hidden='true'></span></td></tr>");
  });
  $("form#uploadForm").submit(function(){
    var formData = new FormData($(this)[0]);
    $("[name=uploadFile]").val("");

    $.ajax({
        url: '/fileUpload',
        type: 'POST',
        data: formData,
        async: false,
        success: function (data) {
            console.log(data);
            attachmentList.push(data);
        },
        cache: false,
        contentType: false,
        processData: false
    });
    return false;
  });

  // 寄送電子報
  $(document).on("click","#sendNewsLetter",function(e){
    var mailSubject = document.getElementById("mailSubject").value;
    var mailContent = document.getElementById("mailContent").value;
    if (mailSubject=="" && mailContent==""){
      showDialog("錯誤訊息","尚未輸入主旨或內文！");
    }else{
      bootbox.dialog({
        message: "確定要發送電子報嗎？",
        title: "再次確認",
        buttons: {
          yes: {
            label: "確認",
            className: "btn-primary",
            callback: function() {
              document.getElementById("mailSpinner").style.display="block";
              document.getElementById("mailEdit").style.display="none";
              document.getElementById("attachmentEdit").style.display="none";
              document.getElementById("emailButtonGroups").style.display="none";

              $.post("/sendNewsLetter",{mailSubject: mailSubject,mailContent: mailContent, attachmentList: attachmentList.toString(), attachmentNameList: attachmentNameList.toString()}, function(res){
                if (res == "SEND"){
                  attachmentList=[];
                  attachmentNameList=[];
                  showDialog("一般訊息","電子報發送成功！",function(){
                    document.getElementById("mailSubject").value="";
                    document.getElementById("mailContent").value="";
                    document.getElementById("mailEdit").style.display="block"; 
                    document.getElementById("mailSpinner").style.display="none";
                    document.getElementById("attachmentEdit").style.display="block";
                    document.getElementById("emailButtonGroups").style.display="block";
                    $("#attachmentEdit label").css("display", "none");
                    $("#attachmentList").html("");
                    loadsubscriberList();
                  });
                }else{
                  attachmentList=[];
                  attachmentNameList=[];
                  showDialog("一般訊息",res,function(){
                    document.getElementById("mailSubject").value="";
                    document.getElementById("mailContent").value="";
                    document.getElementById("mailEdit").style.display="block"; 
                    document.getElementById("mailSpinner").style.display="none";
                    document.getElementById("attachmentEdit").style.display="block";
                    document.getElementById("emailButtonGroups").style.display="block";
                    $("#attachmentEdit label").css("display", "none");
                    $("#attachmentList").html("");
                  });
                }
              });
            }
          },
          no: {
            label: "取消",
            className: "btn-primary",
            callback: function() {
            }
          }
        }
      });
    }
  });

  // "停權"使用者
  $(document).on("click",".unDelUser",function(e){
    // var userID = $(this).parent().parent().attr("value");
    // $.post( "/suspendUser", { id: userID}, function(res){
    //   $("#backend_userList tr[value="+userID+"] span").last().switchClass("glyphicon-ban-circle","glyphicon-repeat");
    //   $("#backend_userList tr[value="+userID+"] span").last().switchClass("unDelUser","delUser");
    //   showDialog("一般訊息",res);
    // });
    var userID = $(this).attr("value");
    var promptOptions = {
      title: "停權原因（必填）",
      buttons: {
        confirm: {
          label: "確認送出"
        },
        cancel: {
          label: "取消"
        }
      },
      callback: function(result) {  
        if(result != "" && result !== null){                                           
          console.log("Hi "+result);
          $.post( "/suspendUser", { id: userID, reason: result}, function(res){
            $("#backend_userList tr span[value="+userID+"]").switchClass("glyphicon-ban-circle","glyphicon-repeat");
            $("#backend_userList tr span[value="+userID+"]").switchClass("unDelUser","delUser");
            showDialog("一般訊息",res);
          });   

          $.get("/getSuspendReason", function(res){
            console.log(JSON.stringify(res));
          });

        }              
      }
    };

    bootbox.prompt(promptOptions);
  });

  // "回復"被停權的使用者
  $(document).on("click",".delUser",function(e){
    // var userID = $(this).parent().parent().attr("value");
    // $.post( "/recoverUser", { id: userID}, function(res){
    //   $("#backend_userList tr[value="+userID+"] span").last().switchClass("glyphicon-repeat","glyphicon-ban-circle");
    //   $("#backend_userList tr[value="+userID+"] span").last().switchClass("delUser","unDelUser");
    //   showDialog("一般訊息",res);
    // }); 
    var userID = $(this).attr("value");
    $.post( "/recoverUser", { id: userID}, function(res){
      $("#backend_userList tr span[value="+userID+"]").switchClass("glyphicon-repeat","glyphicon-ban-circle");
      $("#backend_userList tr span[value="+userID+"]").switchClass("delUser","unDelUser");
      showDialog("一般訊息",res);
    }); 
  });

  // "刪除"文章
  $(document).on("click",".unDelArticle",function(e){
    var articleID = $(this).parent().parent().attr("value");
    $.post( "/deleteArticle", { id: articleID}, function(res){
      $("#backend_articleList tr[value="+articleID+"]").css("display","none");
      $("#backend_articleList tr[value="+articleID+"] span").last().switchClass("glyphicon-trash","glyphicon-repeat");
      $("#backend_articleList tr[value="+articleID+"] span").last().switchClass("unDelArticle","delArticle");
      delArtId.push(articleID);
      unDelArtId.splice(unDelArtId.indexOf(parseInt(articleID)), 1);
    }); 
  });

  // "回復"刪除的文章
  $(document).on("click",".delArticle",function(e){
    var articleID = $(this).parent().parent().attr("value");
    $.post( "/recoverArticle", { id: articleID}, function(res){
      $("#backend_articleList tr[value="+articleID+"]").css("display","none");
      $("#backend_articleList tr[value="+articleID+"] span").last().switchClass("glyphicon-repeat","glyphicon-trash");
      $("#backend_articleList tr[value="+articleID+"] span").last().switchClass("delArticle","unDelArticle");
      delArtId.splice(delArtId.indexOf(parseInt(articleID)), 1);
      unDelArtId.push(articleID);
    }); 
  });

  // 處理文章顯示selector
  $("#artShowStatus").change(function(){
    if($(this).val()=="unDeletedArt"){
      $("#backend_articleList th").last().text("刪除");
      for(i=0; i<delArtId.length; i++){ $("#backend_articleList tr[value="+delArtId[i]+"]").css("display","none"); }
      for(j=0; j<unDelArtId.length; j++){ $("#backend_articleList tr[value="+unDelArtId[j]+"]").css("display",""); }
    }else if($(this).val()=="deletedArt"){
      $("#backend_articleList th").last().text("回復");
      for(i=0; i<delArtId.length; i++){ $("#backend_articleList tr[value="+delArtId[i]+"]").css("display",""); }
      for(j=0; j<unDelArtId.length; j++){ $("#backend_articleList tr[value="+unDelArtId[j]+"]").css("display","none"); }
    }else{
      $("#backend_articleList th").last().text("刪除/回復");
      for(i=0; i<delArtId.length; i++){ $("#backend_articleList tr[value="+delArtId[i]+"]").css("display",""); }
      for(j=0; j<unDelArtId.length; j++){ $("#backend_articleList tr[value="+unDelArtId[j]+"]").css("display",""); }
    }
  });

});

function loadUserList(){
  document.getElementById("userManage").style.display="block";
  document.getElementById("forumManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="none";

  searchUser=document.getElementById("searchUser").value;

  $.get("/getAllUsers"+"?searchUser="+searchUser, function(userList){
    if(typeof(userList)=="string"){
      showDialog("一般訊息",userList);
    }else{
      userTable="<tr class='tableHead'><th>#</th><th width='200px'>帳號</th><th>姓名</th><th>暱稱</th><th>性別</th><th>身分別</th><th>註冊日期</th><th>正式會員</th><tr>";

      for(i=0; i<userList.length; i++) {
        userID=userList[i].id;
        fullName=userList[i].lname+" "+userList[i].fname;
        createdAt=new Date(userList[i].createdAt).toLocaleString();
        postNum = userList[i].articlesPost.length;
        totalReport=0;
        userType=getType(userList[i].type);
        disease=getPrimaryDisease(userList[i].primaryDisease);
        birthday=getBirthday(userList[i].birthday);
        address=userList[i].postalCode+userList[i].addressCity+userList[i].addressDistrict+userList[i].address;

        if(userList[i].gender=="M"){
          gender="男性";
        }else{
          gender="女性";
        }

        for(j=0; j<userList[i].articlesPost.length; j++) {
          totalReport+=userList[i].articlesPost[j].report.length;
        }
        if(postNum==0){
          avgReportNum = 0
        }else{
          avgReportNum = formatFloat(totalReport/postNum);
        }
        
        userTable+="<tr class='userRecord' value="+userID+" data-toggle='collapse' href='#profile"+userID+"' aria-expanded='false'><td>"+(i+1)+"</td><td>"+userList[i].account+"</td>";
        userTable+="<td>"+fullName+"</td><td>"+userList[i].alias+"</td><td>"+gender+"</td></td><td>"+userType+"</td><td>"+createdAt+"</td>";
        
        if (userList[i].isFullSignup==false){
          userTable+="<td><span class='glyphicon glyphicon-remove-circle' aria-hidden='true'></span></td><tr>";
        }else{
          userTable+="<td><span class='glyphicon glyphicon-ok-circle' aria-hidden='true'></span></td></tr>";
        }
        // userTable+="<td>"+postNum+"</td>";
        // if (avgReportNum>=3){
        //   userTable+="<td>"+avgReportNum+"<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true' title='文章平均檢舉數超過3'></span></td>";
        // }else{
        //   userTable+="<td>"+avgReportNum+"</td>";
        // }
        // if (userList[i].suspended==true){
        //   userTable+="<td><span class='glyphicon glyphicon-repeat delUser' aria-hidden='true' title='回復使用權限'></span></td></tr>";
        // }else{
        //   userTable+="<td><span class='glyphicon glyphicon-ban-circle unDelUser' aria-hidden='true' title='停止使用權限'></span></td></tr>";
        // }

        userTable+="<tr class='collapse userInfo' id='profile"+userID+"'><td></td><td class='text-right'><img src='"+userList[i].img+"' height='80px' width='80px'></td>";
        userTable+="<td colspan='2'>帳號："+userList[i].account+"<br>姓名："+fullName+"<br>暱稱："+userList[i].alias+"<br>";
        userTable+="性別："+gender+"<br>身分："+userType+"<br>主要/主治疾病："+disease+"<br>生日："+birthday+"<br>";
        userTable+="Email："+userList[i].email+"<br>電話："+userList[i].phone+"<br>地址："+address+"<br>";
        userTable+="自我介紹："+userList[i].selfIntroduction+"<br>註冊日期："+createdAt+"</td>";
        userTable+="<td colspan='7'>正式會員：";

        if (userList[i].isFullSignup==false){
          userTable+="否<br>";
        }else{
          userTable+="是<br>";
        }

        userTable+="發文數："+postNum+"<br>文章平均檢舉數："+avgReportNum+"<br>停權狀態：";

        if (userList[i].suspended==true){
          userTable+="<span value='"+userID+"' class='glyphicon glyphicon-repeat delUser' aria-hidden='true' title='回復使用權限'></span></td></tr>";
        }else{
          userTable+="<span value='"+userID+"' class='glyphicon glyphicon-ban-circle unDelUser' aria-hidden='true' title='停止使用權限'></span></td></tr>";
        }
        

      }
      document.getElementById("backend_userList").innerHTML = userTable;
    }    
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function getart(callback, action){
  var category = $("#boardCategory").val();
  var board = $("#board").val();
  var categoryName = $("#boardCategory").val();

  switch(action) {
    case 0: // 根據board及category撈文章。
      $.get("/getArticles/"+board, function(res){ 
        articleList=res.articlesList;
        callback(articleList);
      }).error(function(res){
        showDialog("錯誤訊息",res.responseJSON.err);
      });  
      break;
    case 1: // 根據category撈文章。
      $.get("/getArticlesByCategory/"+category, function(res){
        articleList=res.articlesList;
        callback(articleList);
      }).error(function(res){
        showDialog("錯誤訊息",res.responseJSON.err);
      });
      break;
    case 2: // 根據board撈文章。
      $.get("/getArticlesByBoards", function(res){
        articleList=res.articlesList;
        callback(articleList);
      }).error(function(res){
        showDialog("錯誤訊息",res.responseJSON.err);
      });
      break;
  }
}

function loadForumList(articleList){
  document.getElementById("forumManage").style.display="block";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  document.getElementById("subscriberManage").style.display="none";
  
  if(typeof(articleList)!="undefined"){
    articleTable="<tr class='tableHead'><th>看板位置</th><th class='sortable sortByChar' value='classification'>類別</th><th class='sortable sortByChar' value='title' style='width:350px;'>文章標題</th><th>發表人</th><th>身分</th>";
    articleTable+="<th class='sortable sortByCreatedAt'>發表時間</th><th class='sortable sortByUpdatedAt'>最新回應時間</th><th>點閱／回覆</th><th class='sortable sortByLength' value='nicer'>推薦</th><th class='sortable sortByLength' value='report' style='width:200px;'>檢舉</th>";
    articleTable+="<th>刪除</th></tr>";

      for(i=articleList.length-1; i>=0; i--) {
        articleID=articleList[i].id;
        clickNum=articleList[i].clickNum;
        responseNum=articleList[i].responseNum;
        niceNum=articleList[i].nicer.length;
        lastTime=new Date(articleList[i].lastResponseTime).toLocaleString();
        lastResponseTime=lastTime.slice(0, lastTime.length-3);
        createdAt=new Date(articleList[i].createdAt).toLocaleString();
        postTime=createdAt.slice(0,createdAt.length-3);
        authorType=articleList[i].author.type;
        reportNum=articleList[i].report.length;
        var boardName=articleList[i].board.title;
        var deleted=articleList[i].deleted;
        var link = "href=\"/article/" + articleID + "\"";
        
        var status=$("#artShowStatus").val();

        if(status=="unDeletedArt"){
          if(deleted=="false"){
            articleTable+="<tr value='"+articleID+"'><td>"+categoryList[articleList[i].board.category]+"："+boardName+"</td>";
          }else{
            articleTable+="<tr style='display:none;' value='"+articleID+"'><td>"+categoryList[articleList[i].board.category]+"："+boardName+"</td>";
          }
        }else if(status=="deletedArt"){
          if(deleted=="false"){
            articleTable+="<tr style='display:none;' value='"+articleID+"'><td>"+categoryList[articleList[i].board.category]+"："+boardName+"</td>";
          }else{
            articleTable+="<tr value='"+articleID+"'><td>"+categoryList[articleList[i].board.category]+"："+boardName+"</td>";
          }
        }else{
          articleTable+="<tr value='"+articleID+"'><td>"+categoryList[articleList[i].board.category]+"："+boardName+"</td>";
        }

        if(deleted=="false"){
          unDelArtId.push(articleID);
        }else{
          delArtId.push(articleID);
        }
        
        articleTable+="<td>"+articleList[i].classification+"</td><td><a "+link+" target='_blank'>"+articleList[i].title+"</a></td><td>"+articleList[i].author.alias+"</td>";
        articleTable+="<td>"+authorType+"</td><td>"+postTime+"</td><td>"+lastResponseTime+"</td><td>"+clickNum+"／"+responseNum+"</td><td>"+niceNum+"</td>";
        
        reportobj=articleList[i].report;
        var reasonHtml = reasonHtmlCreate(reportobj);

        if(reportNum>0 && reportNum<3){
          articleTable+="<td class='reasonTd' onClick='showReason("+i+")'>"+reportNum;
          articleTable+="<div id='reportReason_"+i+"' style='display:none;'>"+reasonHtml+"</div></td>";
        }else if(reportNum>=3){
          articleTable+="<td class='reasonTd' onClick='showReason("+i+")'>"+reportNum+"<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true' title='該篇文章檢舉次數超過3'></span>";
          articleTable+="<div id='reportReason_"+i+"' style='display:none;'>"+reasonHtml+"</div></td>";
        }else{
          articleTable+="<td>"+reportNum+"</td>";
        }

        if(deleted=="false"){
          articleTable+="<td><span class='glyphicon glyphicon-trash unDelArticle' aria-hidden='true' title='刪除文章'></span></td></tr>";
        }else{
          articleTable+="<td><span class='glyphicon glyphicon-repeat delArticle' aria-hidden='true' title='回復文章'></span></td></tr>";
        }   
      }
    document.getElementById("backend_articleList").innerHTML = articleTable;
  }
}

function loadEnlManage(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  $("#record").hide()
  document.getElementById("enlManage").style.display="block";
  document.getElementById("subscriberManage").style.display="none";
}

function loadsubscriberList(){
  document.getElementById("forumManage").style.display="none";
  document.getElementById("userManage").style.display="none";
  document.getElementById("enlManage").style.display="none";
  $("#record").hide();
  document.getElementById("subscriberManage").style.display="block";
  searchEmail=document.getElementById("searchEmail").value;

  $.get("/getAllSubscribers"+"?searchEmail="+searchEmail, function(subscribers){
    if(typeof(subscribers)=="string"){
      showDialog("一般訊息",subscribers);
    }else{
      subscriberTable="<tr class='tableHead'><th>#</th><th>電子郵件地址</th><th>訂閱日期</th><th>刪除訂閱者</th><tr>";
      for(i=0; i<subscribers.length; i++){
        createdAt=new Date(subscribers[i].createdAt).toLocaleString();
        subscriberId=subscribers[i].id;
        subscriberTable+="<tr><td>"+(i+1)+"</td><td>"+subscribers[i].email+"</td><td>"+createdAt+"</td>";
        subscriberTable+="<td><span class='glyphicon glyphicon-trash delSub' aria-hidden='true' onclick='deleteSubscriber("+subscriberId+");'></span></td></tr>";
      }
      document.getElementById("backend_subscriberList").innerHTML = subscriberTable;
    }
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function loadRecord(){
  $("#forumManage").hide();
  $("#userManage").hide();
  $("#enlManage").hide();
  $("#subscriberManage").hide();
  $("#record").show();
  var recordTable = "<tr class='tableHead'>,<th>帳號</th><th>IP</th><th>時間</th><th>動作</th></tr>"
  $.get("/getRecord",function(records){
    console.log(records.length)
    for (i=0;i<records.length;i++){
      time=new Date(records[i].createdAt).toLocaleString();
      recordTable+="<tr><td>"+records[i].user.account+"</td><td>"+records[i].ip +"</td><td>"+time+"</td><td>"+records[i].action+"</td></tr>"
    }
    $("#record_table").html(recordTable)
  })
  
}

function sortByChar(sortby){
  articleList=articleList.sort(function(a, b) {
      return a[sortby].localeCompare(b[sortby])
  });
  loadForumList(articleList);
}
function sortByLength(sortby){
  articleList=articleList.sort(function(a, b) {
      return b[sortby].length-a[sortby].length;
  });
  loadForumList(articleList);
}

function sortByCreatedAt(){
  articleList=articleList.sort(function(a, b) {
    return new Date(b.createdAt)-new Date(a.createdAt);
  });
  loadForumList(articleList);
}

function sortByUpdatedAt(){
  articleList=articleList.sort(function(a, b) {
    return new Date(b.updatedAt)-new Date(a.updatedAt);
   });
  loadForumList(articleList);
}

function reasonHtmlCreate(reportobj){
  var reportReasonHtml="";
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

function deleteSubscriber(id) {
  bootbox.dialog({
    message: "確定要刪除該訂閱者嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          $.post( "/deleteSubscriber", { id: id}, function(res){
            showDialog("一般訊息","刪除成功！",function(){
              loadsubscriberList();
            });
          }).error(function(res){
            showDialog("錯誤訊息",res.responseJSON.err);
          });
        }
      },
      no: {
        label: "取消",
        className: "btn-primary",
        callback: function() {
        }
      }
    }
  });
}

function cancelUserSearch(){
  document.getElementById("searchUser").value="";
  loadUserList();
}

function cancelEmailSearch(){
  document.getElementById("searchEmail").value="";
  loadsubscriberList();
}

// 輸入input之後，按enter可以直接送出
// function adminLogin(e) {
//   var keynum;
//   if(window.event) {
//     keynum = e.keyCode;
//   } else if(e.which) {
//     keynum = e.which;
//   }
//   if(keynum=="13") {
//     $("#adminLogin").click();
//   } else {
//     return true;
//   }
// }

function userSearch(e) {
  var keynum;
  if(window.event) {
    keynum = e.keyCode;
  } else if(e.which) {
    keynum = e.which;
  }
  if(keynum=="13") {
    loadUserList();
  } else {
    return true;
  }
}

function emailSearch(e) {
  var keynum;
  if(window.event) {
    keynum = e.keyCode;
  } else if(e.which) {
    keynum = e.which;
  }
  if(keynum=="13") {
    loadsubscriberList();
  } else {
    return true;
  }
}

function formatFloat(num){ // 小數點第2位四捨五入
  return Math.round(num * 100) / 100;
}

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

function getType(type){
  var userType="";
  if(type=="P"){
    userType="病友";
  }else if(type=="N"){
    userType="民眾";
  }else if(type=="D"){
    userType="醫師";
  }else if(type=="S"){
    userType="社工師";
  }else if(type=="F"){
    userType="家屬";
  }else if(type=="RN"){
    userType="護理師";
  }else{
    userType="N/A";
  }
  return userType;
}

function getPrimaryDisease(disease){
  var primaryDisease="";
  if(disease=="1"){
    primaryDisease="鼻咽癌";
  }else if(disease=="2"){
    primaryDisease="鼻腔/副鼻竇癌";
  }else if(disease=="3"){
    primaryDisease="口腔癌";
  }else if(disease=="4"){
    primaryDisease="口腔癌";
  }else if(disease=="5"){
    primaryDisease="下咽癌";
  }else if(disease=="6"){
    primaryDisease="喉癌";
  }else if(disease=="7"){
    primaryDisease="唾液腺癌";
  }else if(disease=="8"){
    primaryDisease="甲狀腺癌";
  }else if(disease=="999"){
    primaryDisease="其它";
  }else{
    primaryDisease="N/A";
  }
  return primaryDisease;
}

function getBirthday(date){
  var b = new Date(date)
  var Y = b.getFullYear().toString() == "NaN" ? "" : b.getFullYear()-1911;
  var M = b.getMonth()+1;
  var D = b.getDate();
  var birthday="民國"+Y+"年"+M+"月"+D+"日";
  return birthday;
}