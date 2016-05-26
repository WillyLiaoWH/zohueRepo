var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var loaded=false;
$(document).ready(function(){
  setPage();
  $.get('/updateLastForumTime',function(res){
  });
  // var dialog = $("#reportDialog").dialog({
  //   autoOpen: false,
  //   height: "auto",
  //   width: 300,
  //   modal: true,
  //   buttons: {   
  //       "檢舉": function() {   
  //           report();   
  //       },   
  //       "取消": function() {   
  //           $(this).dialog("close");   
  //       }   
  //   },   
  //   close: function() {   
  //     var form=document.getElementById('reportForm');
  //     for (var i=0; i<form.reason.length; i++) {
  //       if (form.reason[i].checked) {
  //         form.reason[i].checked=false;
  //         break;
  //       }
  //     }
  //     document.getElementById('reasonInput').value="";
  //     document.getElementById('reasonInput').style.display="none";
  //   }
  // });
  
  $('input[type=radio][name=reason]').change(function(){
    if(this.value=='others') {
      document.getElementById('reasonInput').style.display="inline";
    } else {
      document.getElementById('reasonInput').style.display="none";
    }
  });
$(document).on("click",".comment_edit",function(e){
    editRArticle(this.name);
  });
  $(document).on("click","#editRCancel",function(e){
    editRArticleCancel(this.name);
  });
  $(document).on("click","#editRSend",function(e){
    editRArticleSend(this.name);
  });
  $(document).one("click",".comment_del",function(e){
    delArticle_Comment(this.name);
  });

});

var nice;
function setPage() {
//   var url = document.URL;
//   var regex = /.*article\/+(.*)/;
//   var article_id = url.replace(regex,"$1");

   $.get("/checkAuth", function(auth){
    if(auth) {
      //document.getElementById("content").style.width = "80%";
      document.getElementById("niceArticle").style.display="inline";
      document.getElementById("report").style.display="inline";
      document.getElementById("artContent").className = "span10";
      $("#follow").css("display", "inline");
    } else {
      $("#follow").css("display", "none");
    }
   });

//   $.get("/setArticlePage/"+article_id, function(res){
    
//     if(res.isFollower) {
//       $("#follow").html("取消追蹤");
//     } else {
//       $("#follow").html("追蹤文章");
//     }
//     articleList=res.articleList;
//     articleTitle=articleList[0].title;
//     var regex = /\bhttps:\/\/www\.youtube\.com\/watch\?v\=+(\w*)+\b/g;
//     articleContent=articleList[0].content.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');

//     board=articleList[0].board;
     updateClickNum();

//     response=res.responseList;

//     regex=/(.*)T(.*)\..*/
//     createdAt=new Date(articleList[0].createdAt).toLocaleString();
//     if(createdAt.indexOf("GMT")==-1) {
//       postTime=createdAt.slice(0, createdAt.length-3);
//     } else {
//       postTime=createdAt.slice(0, createdAt.indexOf("GMT"))+createdAt.slice(createdAt.indexOf("GMT")+5, createdAt.length-3);
//     }
//     lastResponseTime=new Date(articleList[0].lastResponseTime).toLocaleString();
//     if(lastResponseTime.indexOf("GMT")==-1) {
//       updateTime=lastResponseTime.slice(0, lastResponseTime.length-3);
//     } else {
//       updateTime=lastResponseTime.slice(0, lastResponseTime.indexOf("GMT"))+lastResponseTime.slice(lastResponseTime.indexOf("GMT")+5, lastResponseTime.length-3);
//     }

//     if ($(window).width() < 768) {
//       document.getElementById("adj_tr").innerHTML = "<td rowspan='2'><div id='articleAvatar_type' style='padding:0px'></div><div id='articleAvatar' style='padding:0px'></div><td id='articleTitle' colspan='2'></td></td><td></td> <td></td> <td ></td>";
//       var ava_height = "50px";
//       var adj_td="";
//       var adj_border="border-right:solid 1px rgba(102, 141, 60, 0.4)";
//     }else{
//       document.getElementById("adj_tr").innerHTML = "<td id='articleAvatar_type' rowspan='2' style='width:50px;'></td><td id='articleAvatar' rowspan='2' style='width:50px;'></td><td id='articleTitle' colspan='3'></td><td></td> <td></td> <td ></td>";
//       var ava_height = "70px";
//       var adj_td="<td valign='bottom' style='padding:0px 0px 7px 0px; border-right:solid 1px rgba(102, 141, 60, 0.4);'>更新時間："+updateTime+"</td>";
//       var adj_border="";
//     }


    // if(articleList[0].author.type=="S") {
    //   document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='/images/img_forum/sw_icon.png' title='已認證社工師'>";
    //   document.getElementById("articleAvatar").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='"+articleList[0].author.img+"'>";
    //   articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+"<a href='/profile/?"+articleList[0].author.id+"'>"+articleList[0].author.alias+"</a>"+"&nbsp社工師</td><td valign='bottom' style='padding:0px 0px 7px 0px;"+adj_border+"'>發表時間："+postTime+"</td>"+adj_td;
    // } else if(articleList[0].author.type=="D") {
    //   document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:5px 0px 0px 8px; display: inline-block;height:"+ava_height+";' src='/images/img_forum/doctor_icon.png' title='已認證醫師'>";
    //   document.getElementById("articleAvatar").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='"+articleList[0].author.img+"'>";
    //   articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+"<a href='/profile/?"+articleList[0].author.id+"'>"+articleList[0].author.alias+"</a>"+"&nbsp醫師</td><td valign='bottom' style='padding:0px 0px 7px 0px;"+adj_border+"'>發表時間："+postTime+"</td>"+adj_td;
    // } else if(articleList[0].author.type=="P") {
    //   document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='/images/img_forum/user_icon.png' title='病友'>";
    //   document.getElementById("articleAvatar").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='"+articleList[0].author.img+"'>";
    //   articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+"<a href='/profile/?"+articleList[0].author.id+"'>"+articleList[0].author.alias+"</a>"+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;"+adj_border+"'>發表時間："+postTime+"</td>"+adj_td;
    // } else if(articleList[0].author.type=="F") {
    //   document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='/images/img_forum/user_icon.png' title='家屬'>";
    //   document.getElementById("articleAvatar").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='"+articleList[0].author.img+"'>";
    //   articleData="<td valign='botnicetom' style='padding:0px 0px 7px 20px;'>發表人："+"<a href='/profile/?"+articleList[0].author.id+"'>"+articleList[0].author.alias+"</a>"+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;"+adj_border+"'>發表時間："+postTime+"</td>"+adj_td;
    // } else {
    //   document.getElementById("articleAvatar_type").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='/images/img_forum/user_icon.png' title='一般民眾'>";
    //   document.getElementById("articleAvatar").innerHTML = "<img style='padding:5px 0px 0px 8px;display: inline-block;height:"+ava_height+";' src='"+articleList[0].author.img+"'>";
    //   articleData="<td valign='bottom' style='padding:0px 0px 7px 20px;'>發表人："+"<a href='/profile/?"+articleList[0].author.id+"'>"+articleList[0].author.alias+"</a>"+"</td><td valign='bottom' style='padding:0px 0px 7px 0px;"+adj_border+"'>發表時間："+postTime+"</td>"+adj_td;
    // }


//     document.getElementById("articleTitle").innerHTML = articleTitle;
//     document.getElementById("articleData").innerHTML = articleData;
//     document.getElementById("articleContent").innerHTML = articleContent;

//     if(document.getElementById("postContent_image").innerHTML.indexOf("images")>-1)
//     {
//       // 插入 HR
//       var orinode = document.getElementById("articleContent"); // 找到插入圖片的DIV
//       var range = document.createRange(); // 設定插入圖片時的range function
//       range.setStart(orinode, 0); // 設定range起始點
//       var node = range.createContextualFragment("<hr id='hr'>"); // 欲插入之element
//       orinode.insertBefore(node, document.getElementById("postContent_image"));
//     }
    

//     responseContext="";
//     if(response.length!=0) {
//       for(i=0; i<response.length; i++) {
//         commentTime=new Date(response[i].createdAt).toLocaleString();
//         if(commentTime.indexOf("GMT")==-1) {
//         commentTime=commentTime.slice(0, commentTime.length-3);
//       } else {
//         commentTime=commentTime.slice(0, commentTime.indexOf("GMT"))+commentTime.slice(commentTime.indexOf("GMT")+5, commentTime.length-3);
//       }
//         switch(response[i].author.type){
//           case "D":
//             var type_avatar_img = "src='/images/img_forum/doctor_icon.png' title='已認證醫師'";
//             var user_type = "醫師";
//           break;
//           case "S":
//             var type_avatar_img = "src='/images/img_forum/sw_icon.png' title='已認證社工師'";
//             var user_type = "社工師";
//           break;
//           case "P":
//             var type_avatar_img = "src='/images/img_forum/user_icon.png' title='病友'";
//             var user_type = "";
//           break;
//           case "F":
//             var type_avatar_img = "src='/images/img_forum/user_icon.png' title='家屬'";
//             var user_type = "";
//           break;
//           default:
//             var type_avatar_img = "src='/images/img_forum/user_icon.png' title='一般民眾'";
//             var user_type = "";
//           break;
//         }

//         //var type_avatar = "<td valign=top rowspan=4 style='padding:26px 5px 0px 0px;'><img "+type_avatar_img+" style='height:70px;'></td>";

//         // 預先處理comment中的圖片
//         var pre_comment_image = response[i].comment_image;
//         pre_comment_image = pre_comment_image.replace(/dummy href=/g, "a href=");
//         pre_comment_image = pre_comment_image.replace(/\/dummy/g, "\/a");


//         if ($(window).width() < 768) {
//           var type_avatar = "<tr><td valign=top rowspan='4'><div style='padding:5px; margin-top:20px;'><img "+type_avatar_img+" style='height:40px;'></div>";
//           responseContext += type_avatar+"<div style='padding:5px;'><img src='"+response[i].author.img+"' style='height:40px; width:40px;'></div></td></tr>";
//         }else{
//           var type_avatar = "<td valign=top rowspan=4 style='padding:26px 5px 0px 0px;'><img "+type_avatar_img+" style='height:70px;'></td>";
//           responseContext += "<tr>"+type_avatar+"<td valign=top rowspan=4 style='padding:26px 5px 0px 0px;'><img src='"+response[i].author.img+"' style='height:70px; width:70px;'></td>";
//         }
//         var regex = /\bhttps:\/\/www\.youtube\.com\/watch\?v\=+(\w*)+\b/g;
//         //responseContext += "<tr>"+type_avatar+"<td valign=top rowspan=4 style='padding:26px 5px 0px 0px;'><img src='"+response[i].author.img+"' style='height:70px; width:70px;'></td>";
//         responseContext += "<tr><td style='padding:20px 0px 0px 10px;width: 100%;'><label style='color:rgba(102, 141, 60, 0.9);'>"+commentTime+"</label></td></tr>";
//         if(response[i].comment.trim()==""){ // 沒有文字 => 只有圖片
//           responseContext += "<tr><td style='padding:0px 0px 5px 10px;'><label style='font-weight:bold; color:#000079;'>"+"<a href='/profile/?"+response[i].author.id+"'>"+response[i].author.alias+"</a>"+" "+user_type+"&nbsp</label><label style='word-break: break-all;width: 100%;word-wrap: break-word;'>"+pre_comment_image+"</label></td></tr>";
//         }else if(pre_comment_image.indexOf("images")==-1){ // 沒有圖片 => 只有文字
//           responseContext += "<tr><td style='padding:0px 0px 5px 10px;'><label style='font-weight:bold; color:#000079;'>"+"<a href='/profile/?"+response[i].author.id+"'>"+response[i].author.alias+"</a>"+" "+user_type+"&nbsp</label><label style='word-break: break-all;width: 100%;word-wrap: break-word;'>"+response[i].comment.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>')+"</label></td></tr>";
//         }else{ // 有文字、圖片
//           responseContext += "<tr><td style='padding:0px 0px 5px 10px;'><label style='font-weight:bold; color:#000079;'>"+"<a href='/profile/?"+response[i].author.id+"'>"+response[i].author.alias+"</a>"+" "+user_type+"&nbsp</label><label style='word-break: break-all;width: 100%;word-wrap: break-word;'>"+response[i].comment.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>')+"<br><hr id='hr'>"+pre_comment_image+"</label></td></tr>";
//         }
//         if(res.login) {
//           if(res.responseNice[i]) {
//             responseContext += "<tr><td style='padding:3px 0px 0px 10px;'><div id='response"+response[i].id+"'><button style='margin-right:10px;' value='收回' class='n' onclick='notNiceResponse("+response[i].id+");'><img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>有&nbsp<label id=N_res_nice"+response[i].id+">"+res.responseNiceCount[i]+"</label>&nbsp人推薦</div></td></tr>";
//           } else {
//             responseContext += "<tr><td style='padding:3px 0px 0px 10px;'><div id='response"+response[i].id+"'><button style='margin-right:10px;' value='推薦' class='n' onclick='niceResponse("+response[i].id+");'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>有&nbsp<label  id=N_res_nice"+response[i].id+">"+res.responseNiceCount[i]+"</label>&nbsp人推薦</div></td></tr>";
//           } 
//         }else{
//           responseContext += "<tr></tr>";
//         }
//       }
//       document.getElementById("commentList").innerHTML = responseContext;
//       document.getElementById("commentList").style.display = "block";
//     }

//     // 圖片跳窗，使用 modalBox.js
//     $('.show-image a').click(function(event){
//       event.preventDefault();
//       if ($(window).width() < 768) {
//         window.open($(this).attr("href"),'_blank');
//       }else{
//         //var ss = '<img src="'+$(this).attr("href")+'">';
//         var ss = '<a href="'+$(this).attr("href")+'" target="_blank"><img src="'+$(this).attr("href")+'"></a>';
//         $( ".modalBox" ).empty();
//         $( ".modalBox" ).append(ss);
//         $('.modalBox').modalBox('open');
//       }
//     });

//     if(res.isAuthor) {
//       document.getElementById("editArticle").style.display = "inline";
//       document.getElementById("deleteArticle").style.display = "inline";
//       document.getElementById("mobile_editArticle").style.display = "inline";
//       document.getElementById("mobile_deleteArticle").style.display = "inline";
//     }
//     if(res.isNice) {
//       document.getElementById("niceArticle").innerHTML = "<button value='收回' class='n' onclick='cancelNice();'><img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>";
//       document.getElementById("niceCount").innerHTML = "有 "+res.lnicer+" 人推薦";
//     } else {
//       document.getElementById("niceArticle").innerHTML = "<button value='推薦' class='n' onclick='clickNice();'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>";
//       document.getElementById("niceCount").innerHTML = "有 "+res.lnicer+" 人推薦";
//     }
//     if(res.isReport) {
//       document.getElementById("report").innerHTML = "<button value='收回' class='n' onclick='cancelReport()'><img style='width:24px; height:24px;' src='/images/img_forum/bad2_icon.png'/>&nbsp收回</button>";
//       document.getElementById("reportCount").innerHTML = "有 "+res.reportCount+" 人檢舉";
//     } else {
//       document.getElementById("report").innerHTML = "<button value='檢舉' class='n' onclick='clickReport()'><img style='width:24px; height:24px;' src='/images/img_forum/bad_icon.png'/>&nbsp檢舉</button>";
//       document.getElementById("reportCount").innerHTML = "有 "+res.reportCount+" 人檢舉";
//     }

//   }).error(function(err){
//     console.log(typeof(err.responseText));
//     bootbox.dialog({
//       message: err.responseText,
//       title: "錯誤訊息",
//       buttons: {
//         main: {
//           label: "確認",
//           className: "btn-primary",
//           callback: function() {
//             window.location.replace("/home");
//           }
//         }
//       }
//     });
//   });

}

function backToBoard () {
    window.location.assign("/proInfo/1");
}

function backToList(board) {
  // var url=document.URL;
  // var regex = /.*article\/+(.*)\?board=+(.*)&page=+(.*)/;
  // var board=url.replace(regex,"$2");
  // var page = url.replace(regex,"$3");
  // window.location.assign("/board-"+board+"/"+page+"#all");
  if(document.referrer.search("board")!=-1)
     // window.location.assign("/board-"+board+"?tab=all&sort=lastResponseTime&order=DESC&page=1&search=")

    // window.location.assign("/frontboard?tab=all&sort=lastResponseTime&order=DESC&page=1&search=")
    window.location.assign(document.referrer);
  else
    window.location.assign("/frontboard?tab=all&sort=lastResponseTime&order=DESC&page=1&search=")
    
    // window.location.assign("/board-"+board+"?tab=all&sort=lastResponseTime&order=DESC&page=1&search=")

}



function editArticle() {
  var url = document.URL;
  var regex = /.*article\/+(.*)/;
  var article_id = url.replace(regex,"$1");
  location.assign("/editArticle/"+article_id);
}

function deleteArticle(board) {
  bootbox.dialog({
    message: "確定要刪除文章嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          var url = document.URL;
          var regex = /.*article\/+(.*)/;
          var id = url.replace(regex,"$1");
          $.post( "/deleteArticle", { id: id}, function(res){
            showDialog("一般訊息","文章刪除成功！",function(){
              if(document.referrer.search("board")!=-1)
                window.location.assign(document.referrer);
              else
                window.location.assign("/board-"+board+"?tab=all&sort=lastResponseTime&order=DESC&page=1&search=");
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

function leaveComment(){
  if(document.getElementById("rmimg")){$(".delete").remove();} // 去除叉叉紐
  if(document.getElementById("comment_clear")){$(".clear").remove();} // 去除clear
  var url = document.URL;
  var regex = /.*article\/+(.*)/;
  var article_id = url.replace(regex,"$1");
  var comment = $("#comment").html();
  var comment_image = $("#comment_image").html();
  

  if(comment.trim()=="" & comment_image.trim()==""){showDialog("錯誤訊息","留言失敗！");}
  else{
    $.post( "/leaveComment", { comment: comment, comment_image: comment_image, article_id: article_id}, function(res){
      window.location.replace(url);
    })
    .error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}


function editRArticle(id){
  // 暫存編輯內容
  eval( "tempTimelineRContent" + id + '=$("#div_r_edit_content"+id).html()' );
  eval( "tempTimelineRImg" + id + "=" + '$("#div_r_edit_img"+id).html()' );

  $("#container_r_edit"+id).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".comment_origin_content" ).css("display", "none");
  $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "none");
}
function editRArticleCancel(id){
  // 還原暫存的編輯內容
  $("#div_r_edit_content"+id).html(eval("tempTimelineRContent" + id));
  $("#div_r_edit_img"+id).html(eval("tempTimelineRImg" + id));

  $("#container_r_edit"+id).css("display", "none");
  $("#container_r_edit"+id).parent().children( ".event_text_r" ).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".comment_origin_content" ).css("display", "block");
  if($("#container_r_edit"+id).parent().children( ".event_img" ).html().trim()==""){
    $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "none");
  }
}
function editRArticleSend(id){
  if($("#div_r_edit_img"+id)){$("#div_r_edit_img"+id+" .delete").remove();} // 去除叉叉紐
  var name = $("#container_r_edit"+id).parent().children(".event_text_r").children("a.name").html()
  var edit_content=$("#div_r_edit_content"+id).html();
  var edit_img=$("#div_r_edit_img"+id).html();
  var finish_edit_img = edit_img.replace(/dummy href=/g, "a href=");
  finish_edit_img = finish_edit_img.replace(/\/dummy/g, "\/a");

  //if(edit_content.trim()=="" & edit_img.trim()==""){showDialog("錯誤訊息","發佈失敗！");}
  //else{
    $.post( "/editCommentArticle", {edit_content: edit_content, edit_img: edit_img, id: id}, function(res){

      $("#container_r_edit"+id).parent().children( ".comment_origin_content" ).html("<label class='comment_content event_text_r'>"+edit_content+"</label>");
      $("#container_r_edit"+id).css("display", "none");
      $("#container_r_edit"+id).parent().children( ".comment_origin_content" ).css("display", "block");

      $("#container_r_edit"+id).parent().children( ".event_img" ).html(finish_edit_img);
        //editRArticleCancel(id);

  

    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  //}
}

function delArticle_Comment (id) {
  bootbox.dialog({
    message: "確定要刪除留言嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          $.post( "/delCommentArticle", { id: id }, function(res){
            $("#responseID"+id).remove();
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


function editRTimeline(id){
  // 暫存編輯內容
  eval( "tempTimelineRContent" + id + '=$("#div_r_edit_content"+id).html()' );
  eval( "tempTimelineRImg" + id + "=" + '$("#div_r_edit_img"+id).html()' );

  $("#container_r_edit"+id).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".event_text_r" ).css("display", "none");
  $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "none");
}
function editRTimelineCancel(id){
  // 還原暫存的編輯內容
  $("#div_r_edit_content"+id).html(eval("tempTimelineRContent" + id));
  $("#div_r_edit_img"+id).html(eval("tempTimelineRImg" + id));

  $("#container_r_edit"+id).css("display", "none");
  $("#container_r_edit"+id).parent().children( ".event_text_r" ).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "block");
  if($("#container_r_edit"+id).parent().children( ".event_img" ).html().trim()==""){
    $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "none");
  }
}
function editRTimelineSend(id){
  if($("#div_r_edit_img"+id)){$("#div_r_edit_img"+id+" .delete").remove();} // 去除叉叉紐
  var name = $("#container_r_edit"+id).parent().children(".event_text_r").children("a.name").html()
  var edit_content=$("#div_r_edit_content"+id).html();
  var edit_img=$("#div_r_edit_img"+id).html();
  var finish_edit_img = edit_img.replace(/dummy href=/g, "a href=");
  finish_edit_img = finish_edit_img.replace(/\/dummy/g, "\/a");

  if(edit_content.trim()=="" & edit_img.trim()==""){showDialog("錯誤訊息","發佈失敗！");}
  else{
    $.post( "/editCommentTimeline", {edit_content: edit_content, edit_img: edit_img, id: id}, function(res){
      $("#container_r_edit"+id).parent().children( ".event_text_r" ).html("<a class='name' href='?"+id+"'>"+name+"</a>"+edit_content.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'));
      $("#container_r_edit"+id).parent().children( ".event_img" ).html(finish_edit_img);

      editRTimelineCancel(id);
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}


function updateClickNum(){
  var url = document.URL;
  var regex = /.*article\/+(.*)/;
  var id = url.replace(regex,"$1");
  $.post( "/updateClickNum", {id: id}, function(res){
  }).error(function(res){
    showDialog("錯誤訊息",res.err);
  });
}

function clickNice() {
  var url = document.URL;
  var regex = /.*article\/+(.*)/;
  var id = url.replace(regex,"$1");
  document.getElementById("niceArticle").innerHTML = "<button value='收回' class='n' onclick='cancelNice();'><img style='width:24px; height:24px;'src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>";
  $.post("/clickNice", {article_id: id}, function(res){
    document.getElementById("niceCount").innerHTML = "有 "+res.num+" 人推薦";
  }).error(function(res){
    showDialog("錯誤訊息",res.err);
  });
}

function cancelNice() {
  var url = document.URL;
  var regex = /.*article\/+(.*)/;
  var id = url.replace(regex,"$1");
  document.getElementById("niceArticle").innerHTML = "<button value='推薦' class='n' onclick='clickNice()'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>";  
  $.post("/cancelNice", {article_id: id}, function(res){
    document.getElementById("niceCount").innerHTML = "有 "+res.num+" 人推薦";
  }).error(function(res){
    document.getElementById("niceArticle").innerHTML = "<button value='收回' class='n' onclick='cancelNice();'><img style='width:24px; height:24px;'src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>"; 
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function niceResponse(response_id) {
  $.post("/niceResponse", {response_id: response_id}, function(res){
    var N_res = "N_res_nice"+response_id;
    var N_res_nicer = document.getElementById(N_res).innerHTML;
    N_res_nicer = parseInt(N_res_nicer)+1;

    document.getElementById("response"+response_id).innerHTML = "<button style='margin-right:10px;margin-left: -10px' value='收回' class='n' onclick='notNiceResponse("+response_id+");'><img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/>&nbsp收回</button>有&nbsp<label id=N_res_nice"+response_id+">"+N_res_nicer+"</label>&nbsp人推薦";
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function notNiceResponse(response_id) {
  $.post("/notNiceResponse", {response_id: response_id}, function(res){
    var N_res = "N_res_nice"+response_id;
    var N_res_nicer = document.getElementById(N_res).innerHTML;
    N_res_nicer = parseInt(N_res_nicer)-1;
    document.getElementById("response"+response_id).innerHTML = "<button style='margin-right:10px;margin-left: -10px' value='推薦' class='n' onclick='niceResponse("+response_id+");'><img src='/images/img_forum/good_icon.png'/>&nbsp推薦</button>有&nbsp<label id=N_res_nice"+response_id+">"+N_res_nicer+"</label>&nbsp人推薦";
   // document.getElementById("responseNice"+response_id).innerHTML ="<有&nbsp<label id=N_res_nice"+response_id+">"+N_res_nicer+"</label>&nbsp人推薦";
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function clickReport() {
  var reportFormContent = '<form id="reportForm"><label><input type="radio" name="reason" value="boring"> 這令人討厭或很無聊</label><br><label><input type="radio" name="reason" value="shouldn\'t exist"> 我認為這不應該出現在論壇</label><br><label><input type="radio" name="reason" value="garbage"> 這是垃圾訊息</label><br><label><input type="radio" name="reason" value="others"> 其它</label><br><textarea type="text" id="reasonInput"/></form> ';
  showDialog("協助我們了解發生的狀況", reportFormContent, function(){
      report();
  });
}

function report() {
  var form=document.getElementById('reportForm');
  for (var i=0; i<form.reason.length; i++) {
    if (form.reason[i].checked) {
      var choose = form.reason[i].value;
      break;
    }
  }
  if(choose=='others') {
    var reason=document.getElementById('reasonInput').value.trim();
  } else {
    var reason=choose;
  }
  if(!reason) {
    showDialog("一般訊息","請選擇或填寫原因");
  } else {
    var url = document.URL;
    var regex = /.*article\/+(.*)/;
    var id = url.replace(regex,"$1");
    document.getElementById("report").innerHTML = "<button value='收回' class='n' onclick='cancelReport();'><img style='width:24px; height:24px;' src='/images/img_forum/bad2_icon.png'/>&nbsp收回</button>";
    $.post("/clickReport", {article_id: id, reason: reason}, function(res){
      document.getElementById("reportCount").innerHTML = "有 "+res.num+" 人檢舉";
      $("#reportDialog").dialog("close");
    }).error(function(res){
      showDialog("錯誤訊息",res.err);
    });
  }
}

function cancelReport() {
  bootbox.dialog({
    message: "確定要取消檢舉嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          var url = document.URL;
          var regex = /.*article\/+(.*)/;
          var id = url.replace(regex,"$1");
          document.getElementById("report").innerHTML = "<button value='推薦' class='n' onclick='clickReport()'><img style='width:24px; height:24px;' src='/images/img_forum/bad_icon.png'/>&nbsp檢舉</button>";  
          $.post("/cancelReport", {article_id: id}, function(res){
            document.getElementById("reportCount").innerHTML = "有 "+res.num+" 人檢舉";
          }).error(function(res){
            document.getElementById("report").innerHTML = "<button value='收回' class='n' onclick='cancelReport();'><img style='width:24px; height:24px;' src='/images/img_forum/bad2_icon.png'/>&nbsp收回</button>"; 
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

function editProfile(){
  content.style.display="none";
}

function sendEmail(){
  var mailaddress="";
  $.get("/checkAuth", function(auth){
    if(auth) {
      $.get("/getEmail",function(res){
        mailaddress=res;

          bootbox.confirm("是否要把這篇寄給"+mailaddress,function(e){
          if (!e){
            
            bootbox.prompt('把這封email送到：',function(mailaddress){
              if (mailaddress!=null){
                
                var url = document.URL;
                var regex = /.*article\/+(.*)/;
                var article_id = url.replace(regex,"$1");
                $.post("/sendEmail",{article_id: article_id,mailaddress: mailaddress,url: url},function(res){
                  if (res == "SEND"){
                    alertify.set({ labels : { ok: "ok", cancel: "cancel" } });
                    alertify.alert("已經送出信件至"+mailaddress); 
                 }
                });
              }
            });
            
          }
          else{
            if (mailaddress.length>0){
              var url = document.URL;
              var regex = /.*article\/+(.*)/;
              var article_id = url.replace(regex,"$1");
              $.post("/sendEmail",{article_id: article_id,mailaddress: mailaddress,url: url},function(res){
                if (res == "SEND"){
                  
                  bootbox.alert("已經送出信件至"+mailaddress); 
               }
              });
            }  
          }
        });
      });
    }
    else{
      bootbox.prompt('把這封email送到：',function(mailaddress){
        if (mailaddress.length>0){
          var url = document.URL;
          var regex = /.*article\/+(.*)/;
          var article_id = url.replace(regex,"$1");
          $.post("/sendEmail",{article_id: article_id,mailaddress: mailaddress,url: url},function(res){
            if (res == "SEND"){
              showDialog("一般訊息","已經送出信件至"+mailaddress);
            }
          });
        }
      }) ;
    }
  });

}

function shareFB(){
  u=location.href;
  t=document.title;
  window.open('http://www.facebook.com/sharer/sharer.php?u='+u,'sharer','toolbar=0,status=0,width=626,height=436');
  return false;
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
function follow() {
  var url = document.URL;
  var regex = /.*article\/+(.*)/;
  var article_id = url.replace(regex,"$1");
  $.post("/changeFollow",{article_id: article_id},function(res){
    if(res.err){
      showDialog("錯誤訊息", res.err);
    } else {
      if(res.isFollower){
        $("#follow").html("<img src='/images/img_forum/follow.png' style='width:18%'> 取消追蹤");
      } else {
        $("#follow").html("<img src='/images/img_forum/follow.png' style='width:18%'> 追蹤文章");
      }
    }
  });
}
