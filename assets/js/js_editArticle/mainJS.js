var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
$(document).ready(function(){
  setPage();

  $("#postContent") // 確保 contentEditable 的跳行不會包在 div 內
    // make sure br is always the lastChild of contenteditable
    .on("keyup mouseup", function(){
      try{
        if($("#postContent").html().trim()!=""){
          $("#save").css("background-color", "#FFCE54");
          $("#save").hover(function(){
            $("#save").css("background-color", "#FFCE54");
            },function(){
            $("#save").css("background-color", "#FFCE54");
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

function setPage() {
  $( ".show-image" ).append( "<input class=\"delete\" type=\"button\" value=\"X\" id=\"rmimg\">" ); // 圖片加入叉叉
}

function post() {
  if(document.getElementById("rmimg")){$(".delete").remove();} // 去除叉叉紐
  var allowed=true;
  var postTitle = $("#postTitle").val();
  var postContent = $("#postContent").html();
  var postContent_image = $("#postContent_image").html();
  if(!postTitle||postTitle.trim()=="") {
    showDialog("錯誤訊息","文章標題不能空白喔！",function(){
      allowed=false;
    });
  }
  if(!postContent||postContent=="") {
    allowed=false;
    showDialog("錯誤訊息","文章內容不能空白喔！");
  }

  postContent = postContent+"<div id='postContent_image'>\n"+postContent_image+"\n        </div>";
  postContent = postContent.replace(/src=\"images/g, "src=\"..\/images");
  postContent = postContent.replace(/dummy href=/g, "a href=");
  postContent = postContent.replace(/\/dummy/g, "\/a");

  var url = document.URL;
  var regex = /.*editArticle\/+(.*)/;
  var id = url.replace(regex,"$1");
  var newTitle = $("#postTitle").val();
  var newContent = postContent;

  if(allowed) {
    var posting = $.post( "/changeArticle", { id: id, newTitle: newTitle, newContent: newContent}, function(res){
      showDialog("一般訊息","文章編輯成功！",function(){
        window.location.replace("/article/"+id);
      });
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}

function abort() {
  var url = document.URL;
  var regex = /.*editArticle\/+(.*)/;
  var id = url.replace(regex,"$1");
  window.location.replace("/article/"+id);
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