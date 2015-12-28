/* 2015/07/28
我是 Ian, 這天把原本 Hoho 寫的搜尋文章以及 Wayhome 寫的顯示預設畫面的兩個 function 整合成一個 (setSearchResult),
並把原本產生看板跳轉 option 的部分獨立成一個 function (setBoardCategory),
專業知識頁面應該也可以用同樣的方式改寫.
另外也把一些看起來用不到的部分註解掉了 */

var page;
var keyword="";
var sort="";
var tab="";
var order="";
var maxReport=3;
var board="";
var boardList=[];
var url ="";


$(document).ready(function(){
  if($( window ).width() < 768){
    $("html, body").animate({ scrollTop: "440px"} , 170, "swing");
  }

  $("#search").click(function(){ // 搜尋按鈕 listener
    keyword=$("#searchWord").val().replace(/^\s+$/m,'');
    window.location.assign("/board-"+board+"?tab="+tab+"&sort="+sort+"&order="+order+"&page=1&search="+keyword);
  });

  // 根據網址取得各項資訊
  var url = document.URL;
  regex=/.*board-(.*)\?tab=(.*)&sort=(.*)&order=(.*)&page=(.*)&search=(.*)/;
  board=url.replace(regex, "$1");
  keyword=url.replace(regex, "$6");
  keyword = decodeURIComponent(keyword);
  page=url.replace(regex,"$5");
  tab=url.replace(regex, "$2");
  sort=url.replace(regex, "$3");
  sort=sort!=null&&sort.length>0?sort:"lastResponseTime";
  order=url.replace(regex, "$4");
  order=order!=null&&order.length>0?order:"DESC";

  $.get("/checkAuth", function(auth){ // 註冊後把論壇 div 加寬 
    if(!auth) {
      document.getElementById("forumContent").className = "span10";
      //document.getElementById("forumContent").className = "span7";
    }
  });

  $("#searchWord").on("keyup mouseup", function(){
    try{
      // if($("#searchWord").val().trim()!=""){
      //   $("#search").css("background-color", "#FFCE54");
      // }else{$("#search").css("background-color", "#FFCE54");}
        
      if (!this.lastChild || this.lastChild.nodeName.toLowerCase() != "br") {
        this.appendChild(document.createChild("br"));
      }
    }catch(err){}
  });

});

function tabClick(tabc){
  window.location.assign("/board-"+board+"?tab="+tabc+"&sort="+sort+"&order="+order+"&page=1&search="+keyword);
}

function pageClick(page){
  window.location.assign("/board-"+board+"?tab="+tab+"&sort="+sort+"&order="+order+"&page="+page+"&search="+keyword);
}

function readConfirm(articleid){
  bootbox.dialog({
    message: "這篇文章已經被檢舉超過三次以上囉！確定要觀看嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          window.location = "/article/"+articleid;
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

function postArticle() {
  $.get("/checkAuth", function(auth){
    if(!auth) {
      showDialog("一般訊息","您尚未登入，不能發表文章喔！快登入加入大家的討論吧！",function(){
        //window.location.reload();
      });
    }else{
      $.get("/checkFull", function(full){
        if(!full) {
          showDialog("一般訊息","您尚未完整註冊，不能發表文章喔，快登入加入大家的討論吧！",function(){
            window.location.replace("/signup");
          });
        }
        else{
          if(auth.isAdmin==true && (board=="17" || board=="18")){
            window.location.assign("/post/"+board);  
          }else if(auth.isAdmin==false && (board=="17" || board=="18") ){
            showDialog("一般訊息","您不是管理員，不能在社團公告中發表文章喔！");
          }else if(board!="17" && board!="18"){
            window.location.assign("/post/"+board);
          } 
          
        }
      });       
    }
  });
}

function cancleSearch(){
  document.getElementById("searchWord").value = "";
  window.location.assign("/board-"+board+"?tab="+tab+"&sort="+sort+"&order="+order+"&page=1&search=");
}

function changeSort(attr) {
  if(attr!=sort)
    window.location.assign("/board-"+board+"?tab="+tab+"&sort="+attr+"&order="+order+"&page=1&search=")
  else {
    if(order=="DESC") {
      order="ASC";
      window.location.assign("/board-"+board+"?tab="+tab+"&sort="+sort+"&order="+order+"&page=1&search=");
    } else if(order=="ASC") {
      order="DESC";
      window.location.assign("/board-"+board+"?tab="+tab+"&sort="+sort+"&order="+order+"&page=1&search=");
    }
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

function setTableRowStripCss(){
  setTimeout(function(){ 
    $( "#articleList tbody > tr:even" ).removeClass().addClass("warning");
    $( "#articleList tbody > tr:odd" ).removeClass().addClass("success");}, 30);
}