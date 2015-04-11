var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
$(document).ready(function(){
  $.get("/setFriendPage", function(res){
    if(res.err) {
      alert(res.err);
    } else {
      var allUser=res.allUser;
      var isFriend=res.isFriend;
      var html="";
      for(i=0; i<allUser.length; i++) {
        if(isFriend[i]!=-1) {
          html+=allUser[i].account+"<br>"
          if(isFriend[i]==0) {
            html+="加好友?<br>"
          } else {
            html+="已是好友<br>"
          }
        }
      }
      document.getElementById("friendsList").innerHTML=html;
    }
  });
});

