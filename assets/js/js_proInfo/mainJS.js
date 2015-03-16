var allow_create;
var searched;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var loaded=false;
$(document).ready(function(){
  var url = document.URL;
  var regex = /.*proInfo\/+(.*)/;
  var page = url.replace(regex,"$1");
  setPage(page);


  $.get("/checkAuth", function(auth){
    if(auth) {
      //document.getElementById("content").style.width = "80%";
      document.getElementById("infoContent").className = "span10";
      //document.getElementById("articleList").style.width = "100%";
    }
  });

  $("#searchWord")
  .on("keyup mouseup", function(){
    try{
      if($("#searchWord").val().trim()!=""){
        $("#search").css("background-color", "rgba(232, 81, 0, 0.7)");
      }else{$("#search").css("background-color", "rgba(102, 141, 60, 0.4)");}
        
      if (!this.lastChild || this.lastChild.nodeName.toLowerCase() != "br") {
        this.appendChild(document.createChild("br"));
      }
    }catch(err){}
  });
});

function setPage(page) {

  $.get("/setProInfoPage", function(articleList){
    test="";
    for(i=0; i<articleList.length; i++) {
      test+=articleList[i].title;
      test+=articleList[i].updatedAt;
    }

    myTable="<tr style='background-color: #1D3521; color:white;'>";
    myTable+="<td style='width:11%; padding:10px 15px 10px 15px; text-align:center;'>文章類別</td>";
    myTable+="<td style='width:9%; padding:10px 15px 10px 15px; text-align:center;'>癌症別</td>";
    myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'>文章標題</td>";
    myTable+="<td style='text-align:center;'>作者</td>";
    myTable+="<td style='text-align:center;'>發表時間</td>";
    myTable+="<td style='text-align:center;'>出處</td>";
    myTable+="<td style='width:11%; text-align:center;'>相關討論</td></tr>";

    articleNum=20;

    lastPageArticlesNum=articleList.length%articleNum;
    pageNum=(articleList.length-lastPageArticlesNum)/articleNum;
    if(lastPageArticlesNum!=0) {
      pageNum+=1;
    }
    pageContext="<tr><td>頁次：</td>"
    for(i=1; i<=pageNum; i++) {
      if(i!=page) {
        pageContext+="<td><label><a href='/forum/"+i+"'>"+i+"</a></label></td>"
      } else {
        pageContext+="<td>"+i+"</td>"
      }
    }
    pageContext+="</tr>"
    document.getElementById("page").innerHTML = pageContext;
    document.getElementById("pageDown").innerHTML = pageContext;

    if(articleList.length%20==0){
      pageNum=articleList.length/20+1;
    }

    if(page!=pageNum) {
      for(i=0; i<articleNum; i++) {
        if(i%2==0){
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.5].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.5);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>"; 
         
        }else{
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.3].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.3);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>"; 
        }
      }
    }
    else {

      for(i=0; i<lastPageArticlesNum; i++) {
        if(i%2==0){
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.5].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.5);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>";
         
        }else{
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.3].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.3);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>";
        }
      }
    } 
    document.getElementById("articleList").innerHTML = myTable;
  }).error(function(res){
    alert(res.responseJSON.err);
  });
}

function check(){
  allow_create = 1;
  if($("#UserAlias").val() == ""){
    $("label[id = checkAlias]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkAlias]").text("");}

  if($("#UserAccount").val() == ""){
    $("label[id = checkAccount]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkAccount]").text("");}

  if($("#UserPwd").val() == ""){
    $("label[id = checkPwd]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkPwd]").text("");}

  if($("#UserPwdConfirm").val() == ""){
    $("label[id = checkPwdConfirm]").text("  *這裡也要填喔！");allow_create = 0;
  }else{$("label[id = checkPwdConfirm]").text("");}

  if(allow_create==1 && $("#UserEmail").val() != "") {
    checkEmail();
  }
  if(allow_create==1) {
    checkPwd();
  }

  if(allow_create==1){
    Submit();
  }
}

function searchArticle() {
  var searchWord = document.getElementById('searchWord');
  var search = document.getElementById('search');
  var keyword = searchWord.value.replace(/^s*|s*$/g, '');
  
  searched = 1;

  if($("#searchWord").val().replace(/^\s+$/m,'') == ""){
    alert("搜尋不能搜空白唷！");
  }
  else{
    $.post( "/searchProInfo", { keyword: keyword}, function(res){

      if(res.length==0){
        alert("查無資料！");
      }else{
        setSearchResult(res);
        $("#cancleSearch").css("background-color", "rgba(232, 81, 0, 0.7)");
      }
    }).error(function(res){
      alert("not found");
    });
  }
}

function cancleSearch(){
  
  document.getElementById("searchWord").value = "";
  window.location.assign("/proInfo/1");
  
}

function setSearchResult(articleList){

    myTable="<tr style='background-color: #1D3521; color:white;'>";
    myTable+="<td style='width:11%; padding:10px 15px 10px 15px; text-align:center;'>文章類別</td>";
    myTable+="<td style='width:9%; padding:10px 15px 10px 15px; text-align:center;'>癌症別</td>";
    myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'>文章標題</td>";
    myTable+="<td style='text-align:center;'>作者</td>";
    myTable+="<td style='text-align:center;'>發表時間</td>";
    myTable+="<td style='text-align:center;'>出處</td>";
    myTable+="<td style='width:11%; text-align:center;'>相關討論</td></tr>";

    articleNum=20;

    lastPageArticlesNum=articleList.length%articleNum;
    pageNum=(articleList.length-lastPageArticlesNum)/articleNum;
    if(lastPageArticlesNum!=0) {
      pageNum+=1;
    }
    pageContext="<tr><td>頁次：</td>"
    for(i=1; i<=pageNum; i++) {
      if(i!=page) {
        pageContext+="<td><label><a href='/forum/"+i+"'>"+i+"</a></label></td>"
      } else {
        pageContext+="<td>"+i+"</td>"
      }
    }
    pageContext+="</tr>"
    document.getElementById("page").innerHTML = pageContext;
    document.getElementById("pageDown").innerHTML = pageContext;

    if(articleList.length%20==0){
      pageNum=articleList.length/20+1;
    }


    if(page!=pageNum) {
      for(i=0; i<articleNum; i++) {

        if(i%2==0){
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.5].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.5);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>";
        }else{
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.3].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.3);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
                    myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>";
        }
      }
    }
    else {

      for(i=0; i<lastPageArticlesNum; i++) {

        if(i%2==0){
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.5].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.5);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>";
         
        }else{
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.3].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.3);'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a>前往討論</a></td></tr>";
        }
      }
    } 

    document.getElementById("articleList").innerHTML = myTable;
}

function enterSearch(e) {
  var keynum;
  if(window.event) {
    keynum = e.keyCode;
  } else if(e.which) {
    keynum = e.which;
  }
  if(keynum=="13") {
    searchArticle();
  }
}