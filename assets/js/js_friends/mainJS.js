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
          html+=allUser[i].account+"<br>";
          html+="<div id='friend-"+allUser[i].id+"'>";
          switch(isFriend[i]) {
            case -1:
              html+="<button type='button' onclick='removeBlack("+allUser[i].id+")'>解除封鎖?</button><br>";
              break;
            case 0:
              html+="<button type='button' onclick='addFriend("+allUser[i].id+")'>加好友?</button><br>";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖?</button><br>";
              break;
            case 1:
              html+="<button type='button' onclick='confirmFriend("+allUser[i].id+")'>確認好友?</button><br>";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖?</button><br>";
              break;
            case 2:
              html+="<button type='button' onclick='removeAddFriend("+allUser[i].id+")'>收回好友邀請?</button><br>";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖?</button><br>";
              break;
            case 3:
              html+="<button type='button' onclick='removeFriend("+allUser[i].id+")'>解除好友?</button><br>";
              html+="<button type='button' onclick='addBlack("+allUser[i].id+")'>封鎖?</button><br>";
              break;
          }
          html+="</div>";
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
