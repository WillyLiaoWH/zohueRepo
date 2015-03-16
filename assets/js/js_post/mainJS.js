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
  var postContent_image = $("#postContent_image").html();
  if(!postTitle||postTitle.trim()=="") {
    alert("文章標題不能空白喔");
    allowed=false;
  }

  postContent = postContent+"<div id='postContent_image'>"+postContent_image+"</div>";
  postContent = postContent.replace(/src=\"images/g, "src=\"..\/images");

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
    if(confirm("要幫您把文章分類為「其它」嗎？")) {
      form.classification[3].checked=true;
      postClass="其它";
    } else {
      allowed=false;
    }
  }

  if(allowed) {
    var regex = /&nbsp;/g;
    var temp = postContent.trim().replace(regex," ");
    if(temp.trim()=="") {
      allowed=false;
      alert("文章內容不能空白喔");
    }
  }

  if(allowed) {
    var posting = $.post( "/postArticle", { title: postTitle, content: postContent, classification: postClass, responseNum: responseNum, clickNum: clickNum}, function(res){
      alert("文章發表成功！");
      window.location.replace("/article/"+res[0].id+"?page=1");
    })
      .error(function(res){
        alert(res.responseJSON.err);
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
function save() {
  var postContent = $("#postContent").html();
  if(postContent.trim()!="") {
    saveContent=postContent;
    savedText=document.getElementById("savedText");
    savedText.style.display="inline";
    $("#savedText").fadeOut(1500);
  }
}
function load() {
  if(saveContent!=""&&confirm("會覆蓋現有文章，確定嗎?")) {
    document.getElementById("postContent").innerHTML=saveContent;
    document.getElementById("loadedText").style.display="inline";
    $("#loadedText").fadeOut(1500);
  } 
}