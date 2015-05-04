var page;
var board=1;
var tab="all";
var myTable="";



// $(document).ready(function(){
//     $("#ruki").load("");
// });
function loadUserList(){
  document.getElementById("userManage").style.display="block";
  document.getElementById("forumManage").style.display="none";
}


function loadForumList(){
  document.getElementById("forumManage").style.display="block";
  document.getElementById("userManage").style.display="none";
}

$.get("/setBoardPage/"+board+"/"+tab, function(res){

      var articleList=res.articlesList;
      var boardName=res.board.title;
      var boardCate=res.board.category.title;
      //document.getElementById('title').innerHTML=boardCate+"-"+boardName;

      myTable="<tr><th>文章類別</th><th>文章標題</th><th>發表人</th><th>身分別</th><th>發表時間</th><th>檢舉次數</th><tr>";
      for(i=0; i<articleList.length; i++) {
        clickNum=articleList[i].clickNum;
        responseNum=articleList[i].responseNum;
        niceNum=articleList[i].nicer.length;
        lastTime=new Date(articleList[i].lastResponseTime).toLocaleString();
        lastResponseTime=lastTime.slice(0, lastTime.length-3);
        createdAt=new Date(articleList[i].createdAt).toLocaleString();
        postTime=createdAt.slice(0,createdAt.length-3);
        authorType=articleList[i].author.type;
        reportNum=articleList[i].report.length;

        myTable+="<tr><td>"+articleList[i].classification+"</td><td>"+articleList[i].title+"</td><td>"+articleList[i].author.alias+"</td>";
        myTable+="<td>"+authorType+"</td><td>"+postTime+"</td><td>"+reportNum+"</td><tr>";

          // if(i%2==0){
          //   myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.5].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.5);"+color+"'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+badPic+articleList[i+articleNum*(page-1)].classification+"</td>";
          //   myTable+="<td style='width:35%; padding:10px 15px 10px 15px;'><a "+link+" style='text-decoration:none;"+linkcolor+"text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
            
          //   myTable+="<td><table><tr><td rowspan=2 style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+authorIcon+"<label style='display: inline-block;height:50px;width:50px;background-image:url("+articleList[i+articleNum*(page-1)].author.img+");background-size: 50px 50px;'></label></td>";
          //   myTable+="<td>"+articleList[i+articleNum*(page-1)].author.alias+authorType+"</td></tr>";
          //   myTable+="<tr><td>"+postTime+"</td></tr></table></td>";

          //   myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+clickNum+"/"+responseNum+"</td>";
          //   myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+niceNum+"&nbsp<img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/></td>";
          //   myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+lastResponseTime+"</td></tr>"; 
           
          // }else{
          //   myTable+="<tr onMouseOver=this.style.backgroundColor='rgba(" + [102,141,60,0.2].join(',') + ")'; onMouseOut=this.style.backgroundColor='rgba(" + [102,141,60,0.3].join(',') + ")'; style='background-color: rgba(102, 141, 60, 0.3);"+color+"'><td style='width:10%; padding:10px 0px 10px 0px; text-align:center;'>"+badPic+articleList[i+articleNum*(page-1)].classification+"</td>";
          //   myTable+="<td style='width:35%; padding:10px 15px 10px 15px;'><a "+link+" style='text-decoration:none;"+linkcolor+"text-decoration:underline;'>"+articleList[i+articleNum*(page-1)].title+"</a></td>";
          //   myTable+="<td><table><tr><td rowspan=2 style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+authorIcon+"<label style='display: inline-block;height:50px;width:50px;background-image:url("+articleList[i+articleNum*(page-1)].author.img+");background-size: 50px 50px;'></label></td>";
          //   myTable+="<td>"+articleList[i+articleNum*(page-1)].author.alias+authorType+"</td></tr>";
          //   myTable+="<tr><td>"+postTime+"</td></tr></table></td>";

          //   myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+clickNum+"/"+responseNum+"</td>";
          //   myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+niceNum+"&nbsp<img style='width:24px; height:24px;' src='/images/img_forum/good2_icon.png'/></td>";
          //   myTable+="<td style='width:0%; padding:10px 15px 10px 15px; text-align:center;'>"+lastResponseTime+"</td></tr>";
          // }
      }
      document.getElementById("backend_articleList").innerHTML = myTable;
    }).error(function(res){
      alert(res.responseJSON.err);
    });