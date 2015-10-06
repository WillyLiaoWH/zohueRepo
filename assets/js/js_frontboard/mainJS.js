/* 2015/07/28
我是 Ian, 這天把原本 Hoho 寫的搜尋文章以及 Wayhome 寫的顯示預設畫面的兩個 function 整合成一個 (setSearchResult),
並把原本產生看板跳轉 option 的部分獨立成一個 function (setBoardCategory),
專業知識頁面應該也可以用同樣的方式改寫.
另外也把一些看起來用不到的部分註解掉了 */

//var allow_create;
//var searched;
//var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
//var loaded=false;
var page;
var keyword="";
var tab="";
var maxReport=3;
var board="";
var bdHtml = ""; 
var catHtml = "";
var categoryList=[];
var boardList=[];

$(document).ready(function(){
  $("#search").click(function(){ // 搜尋按鈕 listener
    var key=$("#searchWord").val().replace(/^\s+$/m,'');
    setPage(1, key, 0);
  });

$(document).ready(function(){
  $.ajax({
      url:   "/getBoardCategory" ,
      success: 
      function(boardCategory) {
        categoryList=boardCategory;
      },
      async:   false
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
});

  // if ($("#refresh").val() == 'yes') { location.reload(true); } else { $('#refresh').val('yes'); }
  // 根據網址判斷如何設定預設畫面
  var url = document.URL;
  if(url.search("search")!=-1) {
    regex=/.*frontboard+\/search\/+(.*)+\/+(.*)+\?tab=+(.*)/
    board=url.replace(regex, "$1");
    keyword=url.replace(regex, "$2");
    keyword = decodeURIComponent(keyword);
    page=url.replace(regex,"$3");
    tab=url.replace(regex, "$4")
    setPage(page, keyword, 0);
  } else {      
    var regex = /.*frontboard+\/+(.*)+\?tab=+(.*)/
    //board=url.replace(regex, "$1");
    page = url.replace(regex,"$1");
    tab=url.replace(regex, "$2");
    setPage(page, "", 0);
  }

  $.get("/checkAuth", function(auth){ // 註冊後把論壇 div 加寬 
    if(!auth) {
      document.getElementById("forumContent").className = "span10";
      //document.getElementById("forumContent").className = "span7";
    }
  });

  $("#searchWord").on("keyup mouseup", function(){
    try{
      if($("#searchWord").val().trim()!=""){
        $("#search").css("background-color", "rgba(232, 81, 0, 0.7)");
      }else{$("#search").css("background-color", "rgba(102, 141, 60, 0.4)");}
        
      if (!this.lastChild || this.lastChild.nodeName.toLowerCase() != "br") {
        this.appendChild(document.createChild("br"));
      }
    }catch(err){}
  });

  $("#tabs li a").click(function(){
    window.location.reload();
  });

  document.getElementById("board").onchange=function() {
    if($("#board").val()!=board)
      window.location.assign("/board-"+$("#board").val()+"/1?tab=all");
  };
});

function setPage(page, keyword, sort) {
  // 篩選頁籤
  switch (tab) {
    case "all":
      $("#all").addClass("active");
      break;
    case "motion":
      $("#motion").addClass("active");
      break;
    case "share":
      $("#share").addClass("active");
      break;
    case "problem":
      $("#problem").addClass("active");
      break;
    case "others":
      $("#others").addClass("active");
      break;
  }
  // 獲得文章
  if(keyword!="") {
    document.getElementById("searchWord").value = keyword;
    $.post( "/searchArticleFront/"+tab, {keyword: keyword}, function(res){
      document.getElementById('title').innerHTML="作夥病友論壇—總版";
      var res_search=res.articlesList;
      temp_result=res_search;
      if(res_search.length==0){
        $("#cancleSearch").css("background-color", "rgba(232, 81, 0, 0.7)");
        showDialog("錯誤訊息","查無資料！");
      }else{
        //setBoardCategory(res.boards, res.boardCate, res.board.category.id);
        setTimeout(function(){
          setSearchResult(res_search, page);
        }, 500);
      }
    }).error(function(res_search){
      showDialog("錯誤訊息","查無資料！");
    });
  } else {
    $.get("/setBoardFrontPage/"+tab, function(res){
      document.getElementById('title').innerHTML="作夥病友論壇—總版";
      var res_search=res.articlesList;
      //setBoardCategory(res.boards, res.boardCate, res.board.category.id);
      setTimeout(function(){
        setSearchResult(res_search, page);
      }, 300);
    });
  }  
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

// function postArticle() {
//   $.post("/post/",{board:board},function(res){
//     alert(res);
//   })
//   .error(function(res){
//     alert(res.responseJSON.err);
//   });
// }

function postArticle() {
  // $.get("/checkFull", function(full){
  //   if(!full) {
  //     alert("你尚未完整註冊，不能發表文章喔");
  //     // window.location.replace("/home");
  //   }
  //   else{
  //      window.location.assign("/post/"+board);
  //   }
  // });

  $.get("/checkAuth", function(auth){
    if(!auth) {
      showDialog("一般訊息","您尚未登入，不能發表文章喔！快登入加入大家的討論吧！",function(){
        window.location.replace("/home");
      });
    }else{
      $.get("/checkFull", function(full){
        if(!full) {
          showDialog("一般訊息","您尚未完整註冊，不能發表文章喔，快登入加入大家的討論吧！",function(){
            window.location.replace("/signup");
          });
        }
        else{
          if(auth.isAdmin==true && board=="17"){
            window.location.assign("/post/"+board);  
          }else if(auth.isAdmin==false && board=="17"){
            showDialog("一般訊息","您不是管理員，不能在最新消息看板中發表文章喔！");
          }else if(board!="17"){
            window.location.assign("/post/"+board);
          } 
          
        }
      });       
    }
  });
}

function cancleSearch(){
  document.getElementById("searchWord").value = "";
  window.location.assign("/board-"+board+"/1?tab="+tab);
}

// 產生預設/搜尋結果畫面
function setSearchResult(articleList, page){
    //排序文章
    articleList.sort(function(a, b) {
      return new Date(b.lastResponseTime)-new Date(a.lastResponseTime)+ b.responseNum-a.responseNum + b.nicer-a.nicer;
    });
    myTable="<tr style='background-color: #324232; color:white;'>"
    myTable+="<td style='width:11%; padding:10px 15px 10px 15px; text-align:center;'>類別</td>"
    myTable+="<td style='width:34%; padding:10px 15px 10px 15px;'>文章標題</td>"
    myTable+="<td style='width:22%; text-align:center;'>發表人/發表時間</td>";
    myTable+="<td style='width:12%; text-align:center;'>點閱/回覆</td>";
    myTable+="<td style='width:6%; text-align:center;'>推薦</td>";
    myTable+="<td style='text-align:center;'>最新回應時間</td></tr>";

    articleNum=20; 

    lastPageArticlesNum=articleList.length%articleNum;
    pageNum=(articleList.length-lastPageArticlesNum)/articleNum;
    if(lastPageArticlesNum!=0) {
      pageNum+=1;
    }

    if(articleList.length>0){
      pageContext="<tr><td>頁次：</td>";
      for(i=1; i<=pageNum; i++) {
        if(i!=page) {
          pageContext+="<td><a href='/frontboard/"+i+"?tab="+tab+"'>"+i+"</a></td>";
        } else {
          pageContext+="<td>"+i+"</td>";
        }
      }
      pageContext+="</tr>"
      document.getElementById("page").innerHTML = pageContext;
      document.getElementById("pageDown").innerHTML = pageContext;
    }else{
      document.getElementById("msg").innerHTML = "嗨～快來發表一些文章吧！";
    }

    if(articleList.length%20==0){
      pageNum=articleList.length/20+1;
    }
    if(page!=pageNum) {
      for(i=0; i<articleNum; i++) { //alert(i + "~" + articleList[i].board.category + "~" + categoryList[0]);
        clickNum=articleList[i+articleNum*(page-1)].clickNum;
        responseNum=articleList[i+articleNum*(page-1)].responseNum;
        niceNum=articleList[i+articleNum*(page-1)].nicer.length;

        updateTime=new Date(articleList[i+articleNum*(page-1)].lastResponseTime).toLocaleString();
        if(updateTime.indexOf("GMT")==-1) {
          lastResponseTime=updateTime.slice(0, updateTime.length-3);
        } else {
          lastResponseTime=updateTime.slice(0, updateTime.indexOf("GMT"))+updateTime.slice(updateTime.indexOf("GMT")+5, updateTime.length-3);
        }
        
        createdAt=new Date(articleList[i].createdAt).toLocaleString();
        if(createdAt.indexOf("GMT")==-1) {
          postTime=createdAt.slice(0, createdAt.length-3);
        } else {
          postTime=createdAt.slice(0, createdAt.indexOf("GMT"))+createdAt.slice(createdAt.indexOf("GMT")+5, createdAt.length-3);
        }

        /* 判斷發表人類別，決定稱謂與代表圖像 */
        authorType="";
        if(articleList[i].author.type=="D"){
          authorType="&nbsp醫師";
          authorIcon="<img src='/images/img_forum/doctor_icon.png' title='已認證醫師' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="S"){
          authorType="&nbsp社工師";
          authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證社工師' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="RN"){
          authorType="&nbsp護理師";
          authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證護理師' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="P"){
          authorIcon="<img src='/images/img_forum/user_icon.png' title='病友' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="F"){
          authorIcon="<img src='/images/img_forum/user_icon.png' title='家屬' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else{
          authorIcon="<img src='/images/img_forum/user_icon.png' title='一般民眾' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }

        if (articleList[i + articleNum * (page - 1)].report) {
          if (articleList[i + articleNum * (page - 1)].report.length >= maxReport) {
            var link = "onClick='readConfirm(" + articleList[i + articleNum * (page - 1)].id + ");'";
            var color = "color:grey;";
            var linkcolor = "color:grey;";
            var badPic = '<img src="/images/img_forum/bad3_icon.png" title="這篇文章被檢舉三次以上了喔!" style="margin-right:5px; height:30px; width:30px;">';
          } else {
            var link = "href=\"/article/" + articleList[i + articleNum * (page - 1)].id + "\"";
            var color = "";
             var linkcolor = "color:#000079;";
             var badPic = "";
           }
        } else {
          var link = "href=\"/article/" + articleList[i + articleNum * (page - 1)].id + "\"";
          var color = "";
          var linkcolor = "color:#000079;";
          var badPic = "";
        }

        if(i%2==0){
          myTable+="<tr class='success'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+badPic+articleList[i+articleNum*(page-1)].classification+"</td>"; 
          myTable+="<td style='width:35%; padding:10px 15px 10px 15px; cursor: pointer;'><a "+link+" style='text-decoration:none;"+linkcolor+"text-decoration:underline;'>"+"["+categoryList[articleList[i].board.category-1].title+"—"+articleList[i].board.title+"]<br>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
            
          myTable+="<td><table><tr><td rowspan=2 style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+authorIcon+"<img src='"+articleList[i+articleNum*(page-1)].author.img+"' style='float:left; margin-right:10px; height:50px; width:50px;'></td>";
          myTable+="<td>"+"<a href='/profile?"+articleList[i+articleNum*(page-1)].author.id+"'>"+articleList[i+articleNum*(page-1)].author.alias+"</a>"+authorType+"</td></tr>";
          myTable+="<tr><td>"+postTime+"</td></tr></table></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+clickNum+"/"+responseNum+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+niceNum+"&nbsp<img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/></td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+lastResponseTime+"</td></tr>"; 
           
        }else{
          myTable+="<tr class='warning'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+badPic+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='width:35%; padding:10px 15px 10px 15px; cursor: pointer;'><a "+link+" style='text-decoration:none;"+linkcolor+"text-decoration:underline;'>"+"["+categoryList[articleList[i].board.category-1].title+"—"+articleList[i].board.title+"]<br>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
          myTable+="<td><table><tr><td rowspan=2 style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+authorIcon+"<img src='"+articleList[i+articleNum*(page-1)].author.img+"' style='float:left; margin-right:10px; height:50px; width:50px;'></td>";
          myTable+="<td>"+"<a href='/profile?"+articleList[i+articleNum*(page-1)].author.id+"'>"+articleList[i+articleNum*(page-1)].author.alias+"</a>"+authorType+"</td></tr>";
          myTable+="<tr><td>"+postTime+"</td></tr></table></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+clickNum+"/"+responseNum+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+niceNum+"&nbsp<img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/></td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+lastResponseTime+"</td></tr>";
        }
      }
    }
    else {
      for(i=0; i<lastPageArticlesNum; i++) {
        clickNum=articleList[i+articleNum*(page-1)].clickNum;
        responseNum=articleList[i+articleNum*(page-1)].responseNum;
        niceNum=articleList[i+articleNum*(page-1)].nicer.length;

        updateTime=new Date(articleList[i+articleNum*(page-1)].lastResponseTime).toLocaleString();
        if(updateTime.indexOf("GMT")==-1) {
          lastResponseTime=updateTime.slice(0, updateTime.length-3);
        } else {
          lastResponseTime=updateTime.slice(0, updateTime.indexOf("GMT"))+updateTime.slice(updateTime.indexOf("GMT")+5, updateTime.length-3);
        }
        
        createdAt=new Date(articleList[i].createdAt).toLocaleString();
        if(createdAt.indexOf("GMT")==-1) {
          postTime=createdAt.slice(0, createdAt.length-3);
        } else {
          postTime=createdAt.slice(0, createdAt.indexOf("GMT"))+createdAt.slice(createdAt.indexOf("GMT")+5, createdAt.length-3);
        }

        /* 判斷發表人類別，決定稱謂與代表圖像 */
        authorType="";
        if(articleList[i].author.type=="D"){
          authorType="&nbsp醫師";
          authorIcon="<img src='/images/img_forum/doctor_icon.png' title='已認證醫師' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="S"){
          authorType="&nbsp社工師";
          authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證社工師' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="RN"){
          authorType="&nbsp護理師";
          authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證護理師' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="P"){
          authorIcon="<img src='/images/img_forum/user_icon.png' title='病友' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else if(articleList[i].author.type=="F"){
          authorIcon="<img src='/images/img_forum/user_icon.png' title='家屬' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }else{
          authorIcon="<img src='/images/img_forum/user_icon.png' title='一般民眾' style='float:left;margin-right:10px; height:50px; width:50px;'>";
        }

        if (articleList[i + articleNum * (page - 1)].report) {
          if (articleList[i + articleNum * (page - 1)].report.length >= maxReport) {
            var link = "onClick='readConfirm(" + articleList[i + articleNum * (page - 1)].id + ");'";
            var color = "color:grey;";
            var linkcolor = "color:grey;";
            var badPic = '<img src="/images/img_forum/bad3_icon.png" title="這篇文章被檢舉三次以上了喔!" style="margin-right:5px; height:30px; width:30px;">';
          } else {
            var link = "href=\"/article/" + articleList[i + articleNum * (page - 1)].id + "\"";
            var color = "";
            var linkcolor = "color:#000079;";
            var badPic = "";
          }
        } else {
          var link = "href=\"/article/" + articleList[i + articleNum * (page - 1)].id + "\"";
          var color = "";
          var linkcolor = "color:#000079;";
          var badPic = "";
        }

        if(i%2==0){
          myTable+="<tr class='success'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+badPic+articleList[i+articleNum*(page-1)].classification+"</td>"; 
          myTable+="<td style='width:35%; padding:10px 15px 10px 15px; cursor: pointer;'><a "+link+" style='text-decoration:none;"+linkcolor+"text-decoration:underline;'>"+"["+categoryList[articleList[i].board.category-1].title+"—"+articleList[i].board.title+"]<br>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
            
          myTable+="<td><table><tr><td rowspan=2 style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+authorIcon+"<img src='"+articleList[i+articleNum*(page-1)].author.img+"' style='float:left; margin-right:10px; height:50px; width:50px;'></td>";
          myTable+="<td>"+"<a href='/profile?"+articleList[i+articleNum*(page-1)].author.id+"'>"+articleList[i+articleNum*(page-1)].author.alias+"</a>"+authorType+"</td></tr>";
          myTable+="<tr><td>"+postTime+"</td></tr></table></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+clickNum+"/"+responseNum+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+niceNum+"&nbsp<img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/></td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+lastResponseTime+"</td></tr>"; 
        }else{
          myTable+="<tr class='warning'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+badPic+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='width:35%; padding:10px 15px 10px 15px; cursor: pointer;'><a "+link+" style='text-decoration:none;"+linkcolor+"text-decoration:underline;'>"+"["+categoryList[articleList[i].board.category-1].title+"—"+articleList[i].board.title+"]<br>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
          myTable+="<td><table><tr><td rowspan=2 style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+authorIcon+"<img src='"+articleList[i+articleNum*(page-1)].author.img+"' style='float:left; margin-right:10px; height:50px; width:50px;'></td>";
          myTable+="<td>"+"<a href='/profile?"+articleList[i+articleNum*(page-1)].author.id+"'>"+articleList[i+articleNum*(page-1)].author.alias+"</a>"+authorType+"</td></tr>";
          myTable+="<tr><td>"+postTime+"</td></tr></table></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+clickNum+"/"+responseNum+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+niceNum+"&nbsp<img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/></td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+lastResponseTime+"</td></tr>";
        }
      }
    } 
    document.getElementById("articleList").innerHTML = myTable;
    // 前往看板 bar
    setTimeout(function(){setBoardList();}, 100);
  }

 function setBoardList(){
  if($("#boardlist").html().trim()==""){
    boardList=[];
    for(i=1; i <= categoryList.length; i++){ 
      $.ajax({
        url:   "/getBoardsOfCategory/" + i ,
        success: 
        function(boards) { 
          bl = [];
          for(j=0; j<boards.length; j++){
            bl.push(boards[j].title); 
          }
          boardList[(i-1)]=bl;
        },
        async:   false
      });
    }
    var cc = 0;
    catHtml="";    for(i=1; i<=categoryList.length; i++){ 
      catHtml = catHtml + "<li><a id='drop"+i+"' href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>"+categoryList[i-1].title+"<span class='caret'></span></a>";
      catHtml = catHtml + "<ul id='menu1' class='dropdown-menu' aria-labelledby='drop"+i+"'>";
      for(j=0;j<boardList[i-1].length;j++){
        cc = cc + 1;
        catHtml = catHtml + "<li><a href='"+"/board-"+cc+"/1?tab=all"+"'>"+boardList[i-1][j]+"</a></li>";  
      }
      catHtml = catHtml + "</ul></li>";
    }
    $("#boardlist").html(catHtml);
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