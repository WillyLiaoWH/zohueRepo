var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var loaded=false;
var board="";
$(document).ready(function(){
  checkLogin();
});

function checkLogin() {
  $.get("/checkAuth", function(auth){
    if(!auth) {
      alert("需先登入才能查看通知");
      document.location.replace("/home");
    } else {
      setPage();
    }
  });
}

var notMessage=[
  "在你追蹤的文章留言",
  "覺得你追蹤的文章很讚",
  "在你的動態留言",
  "覺得你的動態很讚",
  "覺得你的回應很讚",
  "覺得你的留言很讚",
  "邀請你成為他的好友",
  "已經和你成為好友了",
]
function setPage() {
  $.get('/nots',function(res){
    if(res){
      var table="";
      for(var i=0; i<res.length; i++) {
        table+="<div class='not'>";

        table+="<div class='image'>";
        var picSize="80";
        var authorIcon="", authorType="";
        switch(res[i].from.type) {
          case "D":
            authorIcon="<img src='/images/img_forum/doctor_icon.png' title='已認證醫師' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
            authorType="醫師";
            break;
          case "S":
            authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證社工師' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
            authorType="社工師";
            break;
          case "RN":
            authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證護理師' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
            authorType="護理師";
            break;
          case "P":
            authorIcon="<img src='/images/img_forum/user_icon.png' title='病友' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
            break;
          case "F":
            authorIcon="<img src='/images/img_forum/user_icon.png' title='家屬' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
            break;
          default:
            authorIcon="<img src='/images/img_forum/user_icon.png' title='一般民眾' style='margin-right:10px; height:"+picSize+"px; width:"+picSize+"px;'>";
        }
        table+=authorIcon;
        table+="<img src='"+res[i].from.img+"' onclick='toProfile(\""+res[i].from.account+"\")' style='margin-right:10px; cursor: pointer; height:"+picSize+"px; width:"+picSize+"px;'>";
        table+="</div>";

        table+="<div class='message'>";
        
        table+="<a href='/profile/?"+res[i].from.account+"'>"+res[i].from.alias+"</a>"+authorType+"&nbsp"
        table+=notMessage[parseInt(res[i].notType)-1];
        if(res[i].content) {
          table+="&nbsp"+res[i].content;
        }
        table+="</div>";
        
        switch(res[i].notType) {
          case "1":
          case "2":
          case "5":
            table+="<div class='go'>";
            table+='<button value="查看文章" class="button" onclick="go(\''+res[i].link+'\');">&nbsp查看文章</button>'
            table+="</div>";
            break;
          case "3":
          case "4":
          case "6":
            table+="<div class='go'>";
            table+='<button value="查看動態時報" class="button" onclick="go(\''+res[i].link+'\');">&nbsp查看動態時報</button>'
            table+="</div>";
            break;
          case "7":
            table+="<div class='go'>";
            table+='<button value="確認好友" class="button" onclick="confirmFriend('+res[i].from.id+');">&nbsp確認好友</button>'
            table+="</div>";
            break;
          case "8":
            break;
        }
        

        table+="</div>";
      }
      document.getElementById("content").innerHTML=table;
    }
  });
}

function toProfile(account) {
  window.location.assign("/profile/?"+account);
}
function go(link) {
  window.location.assign(link);
}
function confirmFriend(id) {
  $.post("/confirmFriend", {id: id}, function(res){
    if(res.err) {
      alert(res.err);
    } else {
      // var html="";
      // html+="<button type='button' onclick='removeFriend("+id+")'>解除好友?</button><br>";
      // html+="<button type='button' onclick='addBlack("+id+")'>封鎖?</button><br>";
      // document.getElementById(id).innerHTML=html;
      location.reload();
    }
  })
}