var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
$(document).ready(function(){
  checkAuth2();

  $("#postContent") // 確保 contentEditable 的跳行不會包在 div 內
    // make sure br is always the lastChild of contenteditable
    .on("keyup mouseup", function(){
      try{
        if($("#postContent").html().trim()!=""){
          $("#save").css("background-color", "rgba(232, 81, 0, 0.7)");
          $("#save").hover(function(){
            $("#save").css("background-color", "rgba(102, 141, 60, 0.4)");
            },function(){
            $("#save").css("background-color", "rgba(232, 81, 0, 0.7)");
          });
        }else{
          $("#save").css("background-color", "#ADADAD");
          $("#save").hover(function(){
            $("#save").css("background-color", "#ADADAD");
            },function(){
            $("#save").css("background-color", "#ADADAD");
          });
        }
        
        if (!this.lastChild || this.lastChild.nodeName.toLowerCase() != "br") {
          this.appendChild(document.createChild("br"));
        }
      }catch(err){}
    })

    // use br instead of div div
    .on("keypress", function(e){
      if (e.which == 13) {
        if (window.getSelection) {
          var selection = window.getSelection(),
              range = selection.getRangeAt(0),
              br = document.createElement("br");
          range.deleteContents();
          range.insertNode(br);
          range.setStartAfter(br);
          range.setEndAfter(br);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          return false;
        }
      }
    });
});

function checkAuth2() {
  $.get("/checkAuth", function(auth){
    if(!auth) {
      abort();
    }
  });
}

function post() {
  if(document.getElementById("rmimg")){$(".delete").remove();} // 去除叉叉紐
  var allowed=true;
  var postTitle = $("#postTitle").val();
  var postContent = $("#postContent").html();
  var timelineContent = $("#postContent").html();
  var postContent_image = $("#postContent_image").html();
  if(!postTitle||postTitle.trim()=="") {
    showDialog("錯誤訊息","文章標題不能空白喔！",function(){
      allowed=false;
    });
  }
  postContent = postContent+"<div id='postContent_image'>"+postContent_image+"</div>";
  postContent = postContent.replace(/src=\"images/g, "src=\"..\/images");
  postContent = postContent.replace(/dummy href=/g, "a href=");
  postContent = postContent.replace(/\/dummy/g, "\/a");

  var responseNum = "0";
  var clickNum = "0";
  var form = document.getElementById("articleClass");
  for (var i=0; i<form.classification.length; i++){
    if (form.classification[i].checked){
      var postClass = form.classification[i].value;
      break;
    }
  }
  if(allowed && !postClass) {
    allowed=false;
    bootbox.dialog({
      message: "要幫您把文章分類為「其它」嗎？",
      title: "再次確認",
      buttons: {
        yes: {
          label: "確認",
          className: "btn-primary",
          callback: function() {
            form.classification[3].checked=true;
            postClass="其它";
            post();
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

  if(allowed) {
    var regex = /&nbsp;/g;
    var temp = postContent.trim().replace(regex," ");
    if(temp.trim()=="") {
      allowed=false;
      showDialog("錯誤訊息","文章內容不能空白喔！");
    }
  }

  if(allowed) {
    var url = document.URL;
    var regex = /.*post+\/+(.*)/;
    var board=url.replace(regex, "$1");

    var posting = $.post( "/postArticle", { title: postTitle, content: postContent, classification: postClass, responseNum: responseNum, clickNum: clickNum, board: board}, function(res){
      showDialog("一般訊息","文章發表成功！",function(){
        window.location.replace("/article/"+res[0].id);
      });
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });

    $.post( "/syncArticleToTimeline", { timeline_post_content: timelineContent, timeline_post_image: postContent_image, timeline_post_auth: "all", timeline_post_board: board}, function(res){
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });

  }
}

function abort() {
  window.location.replace("/forum/1");
}

function editProfile(){
  content.style.display="none";
}

var saveContent="";
var saveContent_image="";
function save() {
  var postContent = $("#postContent").html();
  var postContent_image = $("#postContent_image").html();
  if(postContent.trim()!="") {
    saveContent=postContent;
    saveContent_image=postContent_image;
    savedText=document.getElementById("savedText");
    savedText.style.display="inline";
    $("#savedText").fadeOut(1500);
  }
}
function load() {
  if(saveContent!="") {
    bootbox.dialog({
      message: "會覆蓋現有文章，確定嗎？",
      title: "再次確認",
      buttons: {
        yes: {
          label: "確認",
          className: "btn-primary",
          callback: function() {
            document.getElementById("postContent").innerHTML=saveContent;
            document.getElementById("postContent_image").innerHTML=saveContent_image;
            document.getElementById("loadedText").style.display="inline";
            $("#loadedText").fadeOut(1500);

            if(saveContent_image.indexOf("img") != -1){ // div 內有圖片
              $("#postContent_image").css("display", "block");
            }
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