//var allow_create;
var searched;
//var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
//var loaded=false;


$(document).ready(function(){
  var url = document.URL;
  var regex = /.*proInfo\/+(.*)/;
  var page = url.replace(regex,"$1");
  //setPage(page);

  $.get("/checkAuth", function(auth){
    if(auth) {
      //document.getElementById("content").style.width = "80%";
      document.getElementById("infoContent").className = "span10";
      //document.getElementById("articleList").style.width = "100%";
    }else{
      document.getElementById("infoContent").className = "span10";
    }
  });

  // $("#searchWord").on("keyup mouseup", function(){
  //   try{
  //     if($("#searchWord").val().trim()!=""){
  //       $("#search").css("background-color", "rgba(232, 81, 0, 0.7)");
  //     }else{$("#search").css("background-color", "rgba(102, 141, 60, 0.4)");}

  //     if (!this.lastChild || this.lastChild.nodeName.toLowerCase() != "br") {
  //       this.appendChild(document.createChild("br"));
  //     }
  //   }catch(err){}
  // });
});

function datesort(art1,art2){
  date1 = art1.date
  date2 = art2.date
  year1 = parseInt(date1.split("年")[0])
  month1 = parseInt(date1.split("年")[1].split("月")[0])
  year2 = parseInt(date2.split("年")[0])
  month2 = parseInt(date2.split("年")[1].split("月")[0])
  if (year1 == year2){
    return month2-month1
  }
  else{
    return year2-year1
  }


}



function searchArticle() {
  var searchWord = document.getElementById('searchWord');
  var search = document.getElementById('search');
  var keyword = searchWord.value.replace(/^s*|s*$/g, '');
  
  searched = 1;

  if($("#searchWord").val().replace(/^\s+$/m,'') == ""){
    showDialog("錯誤訊息","搜尋欄位不能空白喔！");
  }
  else{
    $.post( "/searchProInfo", { keyword: keyword}, function(res){
      if(res.length==0){
        showDialog("錯誤訊息","查無資料！");
      }else{
        setSearchResult(res);
        $("#cancleSearch").css("background-color", "rgba(232, 81, 0, 0.7)");
      }
    }).error(function(res){
      showDialog("錯誤訊息","查無資料！");
    });
  }
}

function cancleSearch(){
  document.getElementById("searchWord").value = "";
  window.location.assign("/proInfo/1");
}

function setSearchResult(articleList){
  myTable="<tr style='background-color: #3765A3; color:white;'>";
  myTable+="<td style='width:12%; padding:10px 15px 10px 15px; text-align:center;'>類別</td>";
  myTable+="<td style='width:10%; padding:10px 15px 10px 15px; text-align:center;'>癌症別</td>";
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
        myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [51,102,153,0.1].join(',') + ")'; onMouseOut=this.style.backgroundColor='#F8F8F8'; style='background-color: #F8F8F8;'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
        myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

        myTable+="<td style='width:30%; padding:10px 15px 10px 15px; cursor: pointer;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#336699;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

        myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
        myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
        myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
        myTable+="<td style='text-align:center;'><a href='"+articleList[i+articleNum*(page-1)].articleURL+"'>前往討論</a></td></tr>";
      }else{
        myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [51,102,153,0.1].join(',') + ")'; onMouseOut=this.style.backgroundColor='#F8F8F8'; style='background-color: #F8F8F8;'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
        myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          //myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
          myTable+="<td style='width:30%; padding:10px 15px 10px 15px; cursor: pointer;'><a target='_blank' class='show-info' title="+articleList[i+articleNum*(page-1)].link+">"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a href='"+articleList[i+articleNum*(page-1)].articleURL+"'>前往討論</a></td></tr>";
        }
      }
    }
    else {

      for(i=0; i<lastPageArticlesNum; i++) {

        if(i%2==0){
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [51,102,153,0.1].join(',') + ")'; onMouseOut=this.style.backgroundColor='#F8F8F8'; style='background-color: #F8F8F8;'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          //myTable+="<td style='width:30%; padding:10px 15px 10px 15px;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#000079;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
          myTable+="<td style='width:30%; padding:10px 15px 10px 15px; cursor: pointer;'><a target='_blank' class='show-info' title="+articleList[i+articleNum*(page-1)].link+">"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a href='"+articleList[i+articleNum*(page-1)].articleURL+"'>前往討論</a></td></tr>";

        }else{
          myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [51,102,153,0.1].join(',') + ")'; onMouseOut=this.style.backgroundColor='#F8F8F8'; style='background-color: #F8F8F8;'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+articleList[i+articleNum*(page-1)].classification+"</td>";
          myTable+="<td style='text-align:center;'>"+articleList[i+articleNum*(page-1)].cancerType+"</td>";

          myTable+="<td style='width:30%; padding:10px 15px 10px 15px; cursor: pointer;'><a href=\""+articleList[i+articleNum*(page-1)].link+"\" target='_blank' style='text-decoration:none; color:#336699;text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";

          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].author+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].date+"</td>";
          myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+articleList[i+articleNum*(page-1)].note+"</td>";
          myTable+="<td style='text-align:center;'><a href='"+articleList[i+articleNum*(page-1)].articleURL+"'>前往討論</a></td></tr>";
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

  $(document).on("click","a.show-info",function(event){
//$(".show-info").on("click",function(event){
  //event.preventDefault();
  $.post("/recordProInfo",{link:$(this).attr("title")})
  if ($(window).width() < 768 && $(this).attr("title").substr($(this).attr("title").length-3).indexOf("pdf")>-1) {
    var ss = "<button id='btn_backProInfo' class='button'><span class='glyphicon glyphicon-chevron-left'>返回專業文章</span></button><iframe id='ifm_article' src='https://docs.google.com/gview?url="+$(this).attr("title")+"&embedded=true'></iframe>";
    $("#layout").css("opacity", "0.4");
    $(".mobile_modalBox").empty();
    $(".mobile_modalBox").append(ss);
    $(".mobile_modalBox").width($(window).width());
    $("#ifm_article").height($(window).height());
    $(".mobile_modalBox").css("opacity", "0");
    $("body").css("overflow", "hidden");
    $("html").css("overflow", "hidden");
    $(".mobile_modalBox").css("display", "block");
    setTimeout(function(){
      $(".mobile_modalBox").css("opacity", "1");
    }, 2000);
    $(".mobile_modalBox").css("top", "0px");
    $(".mobile_modalBox").css("left", "0px");
  }else{
    window.open($(this).attr("title"));
    // //$(".modalBox").css("display", "block");
    // //var ss = '<img src="'+$(this).attr("href")+'">';
    // var ss = "<embed src="+$(this).attr("title")+" height='100%' width='100%'></embed>";
    // //var ss =$(this).attr("href")
    // $( ".modalBox" ).empty();
    // $( ".modalBox" ).append(ss);
    // //$( ".modalBox" ).modalBox('open');
    // $(".modalBox").modalBox({
    //   width:"90%",
    //   height:"90%",
    //   top:"5%",
    //   left:"5%",
    //   iconImg:'/images/img_forum/cancelBlack_icon.png',
    //   iconClose:true,
    // });
  }
});

$(document).on("click","#btn_backProInfo",function(event){
  $(".mobile_modalBox").css("display", "none");
  $(".mobile_modalBox").css("opacity", "1");
  $("#layout").css("opacity", "1");
  $("body").css("overflow", "scroll");
  $("html").css("overflow", "scroll");
});

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