


var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
$(document).ready(function(){
  setPage();

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

function setPage() {
  var url = document.URL;
  var regex = /.*editArticle\/+(.*)/;
  var article_id = url.replace(regex,"$1");
  $.get("/setArticlePage/"+article_id, function(res){
    articleList=res.articleList;
    articleTitle=articleList[0].title;
    articleContent=articleList[0].content;

    content1 = articleContent.substring(0,articleContent.indexOf("<div id='postContent_image'>\n"));
    content2 = articleContent.substring(articleContent.indexOf("<div id='postContent_image'>\n")+"<div id='postContent_image'>\n".length, articleContent.indexOf("\n        </div>"));
    content2 = content2.replace(/<a/g, "<dummy");
    if(content2.indexOf("img") == -1){ // div 內無圖片
      $("#postContent_image").css("display", "none");
    }

    document.getElementById("postContent_image").innerHTML = content2;
    document.getElementById("postTitle").value = articleTitle;
    document.getElementById("postContent").innerHTML = content1;

    $( ".show-image" ).append( "<input class=\"delete\" type=\"button\" value=\"X\" id=\"rmimg\">" ); // 加入叉叉
  }).error(function(res){
    alert(res.responseJSON.err);
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
  if(!postContent||postContent=="") {
    allowed=false;
    alert("文章內容不能空白喔");
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
      alert("文章編輯成功！");
      //window.location.replace("/forum/1");
      window.location.replace("/article/"+id+"?page=1");
    })
      .error(function(res){
        alert(res.responseJSON.err);
      });
  }
}

function abort() {
  window.location.replace("/forum/1#all");
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
  if(saveContent!=""&&confirm("會覆蓋現有文章，確定嗎?")) {
    document.getElementById("postContent").innerHTML=saveContent;
    document.getElementById("postContent_image").innerHTML=saveContent_image;

    if(saveContent_image.indexOf("img") != -1){ // div 內有圖片
      $("#postContent_image").css("display", "block");
    }
  } 
}