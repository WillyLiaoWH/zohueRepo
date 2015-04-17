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
        if(isFriend[i]!=-2) {
          html+="<div style='margin: 30px;'><div>";
          switch(allUser[i].type) {
            case "D":
              authorIcon="<img src='/images/img_forum/doctor_icon.png' title='已認證醫師' style='margin-right:10px; height:50px; width:50px;'>";
              break;
            case "S":
              authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證社工師' style='margin-right:10px; height:50px; width:50px;'>";
              break;
            case "RN":
              authorIcon="<img src='/images/img_forum/sw_icon.png' title='已認證護理師' style='margin-right:10px; height:50px; width:50px;'>";
              break;
            case "P":
              authorIcon="<img src='/images/img_forum/user_icon.png' title='病友' style='margin-right:10px; height:50px; width:50px;'>";
              break;
            case "F":
              authorIcon="<img src='/images/img_forum/user_icon.png' title='家屬' style='margin-right:10px; height:50px; width:50px;'>";
              break;
            default:
              authorIcon="<img src='/images/img_forum/user_icon.png' title='一般民眾' style='margin-right:10px; height:50px; width:50px;'>";
          }
          html+=authorIcon;
          html+="<img src='"+allUser[i].img+"' style='margin-right:10px; height:50px; width:50px;'>";
          html+=allUser[i].alias+"&nbsp&nbsp&nbsp&nbsp";
          switch(isFriend[i]) {
            case -1:
              html+="已封鎖"+"</div><div><button type='button' onclick='removeBlack("+allUser[i].id+")'>解除封鎖</button><br>";
              break;
            case 0:
              html+="</div><div><button type='button' onclick='addFriend("+allUser[i].id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖</button><br>";
              break;
            case 1:
              html+="要求加入好友"+"</div><div><button type='button' onclick='confirmFriend("+allUser[i].id+")'>確認好友</button>&nbsp&nbsp&nbsp&nbsp";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖</button><br>";
              break;
            case 2:
              html+="已送出好友邀請"+"</div><div><button type='button' onclick='removeAddFriend("+allUser[i].id+")'>收回好友邀請?</button>&nbsp&nbsp&nbsp&nbsp";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖</button><br>";
              break;
            case 3:
              html+="好友"+"</div><div><button type='button' onclick='removeFriend("+allUser[i].id+")'>解除好友</button>&nbsp&nbsp&nbsp&nbsp";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖</button><br>";
              break;
          }
          html+="</div></div>";
        }
      }
      document.getElementById("friendsList").innerHTML=html;
    }
  });
});

function removeBlack(id) {
  $.post("/removeBlack", {id: id}, function(res){
    if(res.err) {
      alert(res.err);
    } else {
      // var html="";
      // html+="<button type='button' onclick='addFriend("+id+")'>加好友?</button><br>";
      // html+="<button type='button' onclick='addBlack("+id+")'>封鎖?</button><br>";
      // document.getElementById(id).innerHTML=html;
      location.reload();
    }
  })
}
function addFriend(id) {
  $.post("/addFriend", {id: id}, function(res){
    if(res.err) {
      alert(res.err);
    } else {
      // var html="";
      // html+="<button type='button' onclick='removeAddFriend("+id+")'>收回好友邀請?</button><br>";
      // html+="<button type='button' onclick='addBlack("+id+")'>封鎖?</button><br>";
      // document.getElementById("friend-"+toString(id)).innerHTML=html;
      location.reload();
    }
  })
}
function addBlack(id) {
  $.post("/addBlack", {id: id}, function(res){
    if(res.err) {
      alert(res.err);
    } else {
      // var html="";
      // html+="<button type='button' onclick='removeBlack("+id+")'>解除封鎖?</button><br>";
      // document.getElementById(id).innerHTML=html;
      location.reload();
    }
  })
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
function removeFriend(id) {
  $.post("/removeFriend", {id: id}, function(res){
    if(res.err) {
      alert(res.err);
    } else {
      // var html="";
      // html+="<button type='button' onclick='addFriend("+id+")'>加好友?</button><br>";
      // html+="<button type='button' onclick='addBlack("+id+")'>封鎖?</button><br>";
      // document.getElementById(id).innerHTML=html;
      location.reload();
    }
  })
}
function removeAddFriend(id) {
  $.post("/removeAddFriend", {id: id}, function(res){
    if(res.err) {
      alert(res.err);
    } else {
      // var html="";
      // html+="<button type='button' onclick='addFriend("+id+")'>加好友?</button><br>";
      // html+="<button type='button' onclick='addBlack("+id+")'>封鎖?</button><br>";
      // document.getElementById(id).innerHTML=html;
      location.reload();
    }
  })
}
