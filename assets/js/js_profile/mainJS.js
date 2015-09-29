var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var diseaseList={
  '1':"鼻咽癌",
  '2':"鼻腔/副鼻竇癌",
  '3':"口腔癌",
  '4':"口咽癌",
  '5':"下咽癌",
  '6':"喉癌",
  '7':"唾液腺癌",
  '8':"甲狀腺癌",
  '999':"其它"
};
var source,activeSource;
$(document).ready(function(){
  placeholder()
  getPri(function(pri_account, pri_id, pri_avatar){
    setTimelinePage(pri_account, pri_id, pri_avatar);
    // if(pri_account===""){
    //   alert("請先登入才能查看個人頁面!");
    //   window.history.back();
    // }
    // else{
    //   setTimelinePage(pri_account, pri_id);
    // }
  });

  $(function(){

    $("#postTilmelineAuth .dropdown-menu li a").click(function(){
      $("#postTilmelineAuth button").html($(this).html());
   });

});
  
  $(document).on("click",".event_edit",function(e){
    editTimeline(this.name);
  });
  $(document).on("click","#editCancel",function(e){
    editTimelineCancel(this.name);
  });
  $(document).on("click","#editSend",function(e){
    editTimelineSend(this.name);
  });
  $(document).on("click",".event_del",function(e){
    delTimeline(this.name);
  });
  $(document).one("click","#TimelineNice",function(e){
    Timeline_nice(this.name);
  });
  $(document).one("click","#TimelineCancelNice",function(e){
    Timeline_cancel_nice(this.name);
  });
  $(document).on("click","#expandComment",function(e){
    expandComment(this.name);
  });

  $(document).one("click","#TimelineCommentSend",function(e){
    postTimeline_comment(this.name);
  });
  $(document).on("click",".comment_edit",function(e){
    editRTimeline(this.name);
  });
  $(document).on("click","#editRCancel",function(e){
    editRTimelineCancel(this.name);
  });
  $(document).on("click","#editRSend",function(e){
    editRTimelineSend(this.name);
  });
  $(document).one("click",".comment_del",function(e){
    delTimeline_comment(this.name);
  });
  $(document).one("click","#TimelineResponseNice",function(e){
    Timeline_r_nice(this.name);
  });
  $(document).one("click","#TimelineResponseCancelNice",function(e){
    Timeline_r_cancel_nice(this.name);
  });

  $(document).on("click",".auth_set_friend",function(e){
    auth_set(this.name,"friend");
  });

  $(document).on("click",".auth_set_doctor",function(e){
    auth_set(this.name,"doctor");
  });

  $(document).on("click",".auth_set_all",function(e){
    auth_set(this.name,"all");
  });

  $(document).on("click",".auth_set_self",function(e){
    auth_set(this.name,"self");
  });

  $(document).on("click",".profile_auth",function(e){
    profile_auth(this.name);
  });

  // 圖片跳窗，使用 modalBox.js
  $(document).on("click",".show-image a",function(event){
    event.preventDefault();
    if ($(window).width() < 768) {
      window.open($(this).attr("href"),'_blank');
    }else{
      //var ss = '<img src="'+$(this).attr("href")+'">';
      var ss = '<a href="'+$(this).attr("href")+'" target="_blank"><img src="'+$(this).attr("href")+'"></a>';
      $( ".modalBox" ).empty();
      $( ".modalBox" ).append(ss);
      $('.modalBox').modalBox('open');
    }
  });

  // 檢舉跳窗，使用 jquery UI
  $(document).on("click","li a[class*=cancelReport]",function(e){
    activeId=this.name;
    activeSource=$(this).attr("class");
    cancelReport();
  });
  $(document).on("click","li a[class*=report]",function(e){
    $("#reportDialog").dialog("open");
    activeId=this.name;
    activeSource=$(this).attr("class");
  });
  var dialog = $("#reportDialog").dialog({
    resizable: false,
    autoOpen: false,
    height: "auto",
    width: '50%',
    modal: true,
    buttons: {
        "檢舉": function() {
          report();
        },
        "取消": function() {
          $(this).dialog("close");
        }
    },
    close: function() {
      var form=document.getElementById('reportForm');
      for (var i=0; i<form.reason.length; i++) {
        if (form.reason[i].checked) {
          form.reason[i].checked=false;
          break;
        }
      }
      document.getElementById('reasonInput').value="";
      document.getElementById('reasonInput').style.display="none";
    }
  });
  $('input[type=radio][name=reason]').change(function(){
    if(this.value=='others') {
      document.getElementById('reasonInput').style.display="inline";
    } else {
      document.getElementById('reasonInput').style.display="none";
    }
  });
});


function placeholder(){
  $('div#timeline_post_content').on('activate', function() {
      $(this).empty();
      var range, sel;
      if ( (sel = document.selection) && document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(this);
          range.select();
      }
  });

  $('div#timeline_post_content').focus(function() {
      if (this.hasChildNodes() && document.createRange && window.getSelection) {
          $(this).empty();
          var range = document.createRange();
          range.selectNodeContents(this);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
      }
  });
}

function getPri(cb){
  pri_account="";
  pri_id="";
  pri_avatar="";
  $.get("/checkAuth", function(auth){
    if(auth) {
      pri_account=auth.account;
      pri_id=auth.id;
      pri_avatar=auth.img;
    }
    cb(pri_account, pri_id, pri_avatar);
  });
}

function removeBlack(parent, id) {
  $.post("/removeBlack", {id: id}, function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      var html="";
      html+="<button type='button' class='b' onclick='addFriend(this.parentNode, "+id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp";
      html+="<button type='button' class='b btnForbbiden' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>";
      parent.innerHTML=html;
    }
  })
}

function addBlack(parent, id) {
  $.post("/addBlack", {id: id}, function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      var html="";
      html+="已封鎖&nbsp&nbsp<button type='button' class='b' onclick='removeBlack(this.parentNode, "+id+")'>解除封鎖</button><br>";
      parent.innerHTML=html;
    }
  })
}

function addFriend(parent, id) {
  $.post("/addFriend", {id: id}, function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      var html="";
      html+="&nbsp<button type='button' class='b' onclick='removeAddFriend(this.parentNode, "+id+")'>收回邀請</button>&nbsp&nbsp&nbsp&nbsp";
      html+="<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>";
      parent.innerHTML=html;
    }
  })
}
function confirmFriend(parent, id) {
  $.post("/confirmFriend", {id: id}, function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      var html="";
      html+="&nbsp<button type='button' class='b' onclick='removeFriend(this.parentNode, "+id+")'>解除好友</button>&nbsp&nbsp&nbsp&nbsp";
      html+="<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>";
      parent.innerHTML=html;
    }
  })
}
function removeFriend(parent, id) {
  $.post("/removeFriend", {id: id}, function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      var html="";
      html+="<button type='button' class='b' onclick='addFriend(this.parentNode, "+id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp";
      html+="<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>";
      parent.innerHTML=html;
    }
  })
}
function removeAddFriend(parent, id) {
  $.post("/removeAddFriend", {id: id}, function(res){
    if(res.err) {
      showDialog("錯誤訊息",res.err);
    } else {
      var html="";
      html+="<button type='button' class='b' onclick='addFriend(this.parentNode, "+id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp";
      html+="<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>";
      parent.innerHTML=html;
    }
  });
}

function setTimelinePage(pri_account, pri_id, pri_avatar){
  var ori_author=window.location.toString().split('?')[1];
  if (typeof ori_author != 'undefined'){
    var id = ori_author
    $("div#timeline_post_content").html("<em>想對他說什麼呢？</em>")
    $.get( "/friendStatus/"+ori_author,function(res){
      console.log(res)
      if (res == "friend"){
        $("#status").html("好友");
        $("#m_status").html("好友");
        $("#friend").html("<button type='button' class='b' onclick='removeFriend(this.parentNode, "+id+")'>解除好友</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>");
        $("#m_friend").html("<button type='button' class='b' onclick='removeFriend(this.parentNode, "+id+")'>解除好友</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>");
      }
      else if (res == "unconfirmed"){
        $("#status").html("尚未確認好友邀請");
        $("#m_status").html("尚未確認好友邀請");
        $("#friend").html("&nbsp&nbsp<br><button type='button' class='b' onclick='confirmFriend(this.parentNode, "+id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>")
        $("#m_friend").html("&nbsp&nbsp<br><button type='button' class='b' onclick='confirmFriend(this.parentNode, "+id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>")
      }
      else if (res == "sent"){
        $("#status").html("已送出好友邀請");
        $("#m_status").html("已送出好友邀請");
        $("#friend").html("&nbsp&nbsp<br><button type='button' class='b' onclick='removeAddFriend(this.parentNode, "+id+")'>收回好友邀請</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>");
        $("#m_friend").html("&nbsp&nbsp<br><button type='button' class='b' onclick='removeAddFriend(this.parentNode, "+id+")'>收回好友邀請</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>");
     }
      else {
        $("#friend").html("<button type='button' class='b' onclick='addFriend(this.parentNode, "+id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>&nbsp&nbsp&nbsp&nbsp");
        $("#m_friend").html("<button type='button' class='b' onclick='addFriend(this.parentNode, "+id+")'>加好友</button>&nbsp&nbsp&nbsp&nbsp<button type='button' class='b' onclick='addBlack(this.parentNode, "+id+")'>封鎖</button><br>&nbsp&nbsp&nbsp&nbsp");
     }
    });
  }
  else{
    $("div#timeline_post_content").html("<em>在想什麼呢？</em>")
  }
  $.post( "/setTimelinePage/"+ori_author, {}, function(res){
    if(res.notfull) {
      showDialog("一般訊息","此用戶還沒完整註冊，所以沒有個人頁面喔！",function(){
        if(document.referrer.search("board")!=-1||document.referrer.search("friends")!=-1||document.referrer.search("article")!=-1)
          window.location.replace(document.referrer);
        else
          window.location.replace("/home");
      });
    }else if(res.notfull==false){
      showDialog("一般訊息","此用戶目前尚未有任何文章！",function(){
        showProfile(ori_author);
      });
    } else {
      showProfile(ori_author);
      sortTimelineList(function(){
        displayTimelineList(res, pri_account, pri_id, pri_avatar, 0);
      });

      function sortTimelineList(cb){
        res["timelinesList"].sort(function(a, b) {
          return new Date(b.createdAt)-new Date(a.createdAt);
        });
        cb();
      }
    }
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err,function(){
      window.location.replace("/home");
    });
  });
}

function displayTimelineList(res, pri_account, pri_id, pri_avatar, status){ // 輸入 object, 登入者 account, 登入者 id, 登入者 avatar, append 方式
  var ori_author=window.location.toString().split('?')[1]; // 取得該 timeline 頁面之作者
  var author_avater = res["avatar"];
  var author = res["alias"];
  var author_account = res["account"];
  var author_id=res["id"];
  var timeInMs = new Date().getTime();

  for(i in res["timelinesList"]){
    var content = res["timelinesList"][i].content;
    var contentImg = res["timelinesList"][i].contentImg;
    var dif = timeInMs-Date(updatedTime);
    var temp = new Date(res["timelinesList"][i].updatedTime).toLocaleString();
    var updatedTime;
    if(temp.indexOf("GMT")==-1) {
      updatedTime=temp.slice(0, temp.length-3);
    } else {
      updatedTime=temp.slice(0, temp.indexOf("GMT"))+temp.slice(temp.indexOf("GMT")+5, temp.length-3);
    }
    var timelinesID = res["timelinesList"][i].id;
    // var responseNum = res["timelinesList"][i].responseNum;
    // var clickNum = res["timelinesList"][i].clickNum;
    var reporter = res["timelinesList"][i].report;
    var nicer = res["timelinesList"][i].nicer;
    var auth = res["timelinesList"][i].auth;
    if(!auth){
      auth="all";
    }

    // 預先處理每個 timeline event comment
    var append_element_comment = "";
    var append_default_element_comment = "";
    var counter = 0;
    for(element_res of res["timelinesList"][i].response){
      counter++;
      var comment_author_account=element_res.account;
      var comment_author_id=element_res.author;
      var comment_author_avater=element_res.img;
      var comment_author=element_res.alias;
      //console.log(element_res);
      var comment_content=element_res.comment;
      var comment_contentImg=element_res.comment_image;
      var comment_ID = element_res.id;
      //console.log(element_res);
      var comment_updatedTime = new Date(element_res.updatedTime).toLocaleString();
      var comment_nicer = element_res.rnicer;
      var comment_reporter = element_res.rreporter;
      var dif2 = (timeInMs-new Date(element_res.updatedTime).getTime())/1000;
      if(dif2 > 86400){var time=Math.round(dif2/86400)+"天前";
      }else if(dif2 > 3600){var time=Math.round(dif2/3600)+"小時前";
      }else if(dif2 > 60){var time=Math.round(dif2/60)+"分鐘前";
      }else{var time="剛剛";}

      // 預先處理 timeline event 中的圖片
      comment_contentImg = comment_contentImg.replace(/dummy href=/g, "a href=");
      comment_contentImg = comment_contentImg.replace(/\/dummy/g, "\/a");

      // 預先處理權限選單
      var comment_option = "";
      if(pri_id==comment_author_id){ // 原作者
        var comment_option = '<li><a class="comment_edit" name="'+comment_ID+'">編輯</a></li>\
                              <li><a class="comment_del" name="'+comment_ID+'">刪除</a></li>';
      }else{ // 非原作者
        //var comment_option = '<li><a class="report_comment" name="'+comment_ID+'">檢舉</a></li>';
        // 判斷是否為 reporter
        var result_comment_reporter = $.grep(comment_reporter, function(e){ return e.reporter == pri_id; });
        if(result_comment_reporter.length>0){ // 目前這個人是 reporter 之一
          var comment_option = '<li id="cancelReport_comment" name="'+comment_ID+'"><a class="cancelReport_comment" name="'+comment_ID+'">收回檢舉</a></li>';
        }else{ // 不是 reporter
          var comment_option = '<li id="report_comment" name="'+comment_ID+'"><a class="report_comment" name="'+comment_ID+'">檢舉</a></li>';
        }
      }

      // 判斷是否為 nicer
      var innicer = $.grep(comment_nicer, function(e){ return e.id == pri_id; });
      if(innicer.length>0){ // 目前這個人是 nicer 之一
        var display_r_nice='<button class="n" name="'+comment_ID+'" id="TimelineResponseCancelNice"><img style="width:24px; height:24px;" src="/images/img_forum/good2_icon.png"/></button>';
      }else{ // 不是 nicer
        var display_r_nice='<button class="n" name="'+comment_ID+'" id="TimelineResponseNice"><img src="/images/img_forum/good_icon.png"></button>';
      } 

      // 判斷留言是否有圖
      if(comment_contentImg){
        var display_img='block';
        var css_r_content='border-bottom-left-radius: 0px;border-bottom-right-radius: 0px;';
      }else{
        var display_img='none';
        var css_r_content="";
      }
      function combine(element){
        element = element+'<div id="container_timeline_res container-fluid" style="/*overflow:hidden;*/">\
                    <div id="sidebar_timeline_res">\
                      <image src="'+comment_author_avater+'" height="50" width="50">\
                    </div>\
                    <div id="content_timeline_res">\
                      <div class="event_text_r"><a class="name" href="?'+comment_author_id+'">'+comment_author+'</a> '+comment_content+'</div>\
                      <div class="row-fluid event_img" style="display:'+display_img+';">'+comment_contentImg+'</div>\
                      <div class="container-fluid container_r_edit" id="container_r_edit'+comment_ID+'">\
                        <div class="row-fluid" id="div_r_edit_content'+comment_ID+'" contenteditable="true" style="'+css_r_content+'">'+comment_content+'</div>\
                        <div class="row-fluid div_r_edit_img" id="div_r_edit_img'+comment_ID+'" style="display:block;">'+comment_contentImg+'</div>\
                        <button value="編輯完成" id="editRSend" class="b" name="'+comment_ID+'"><img src="/images/img_forum/check_icon.png">編輯完成</button>\
                        <button value="插入圖片" id="editRImage" class="b" name="'+comment_ID+'"><img src="/images/img_forum/images_icon.png">插入圖片</button>\
                        <button value="取消編輯" id="editRCancel" class="b" name="'+comment_ID+'"><span class="glyphicon glyphicon-remove" style="color:black;top:4px;" aria-hidden="true"></span>取消編輯</button>\
                      </div>\
                      <div class="row-fluid event_option btn-group">\
                        <div style="min-height:30px;padding-top:10px;padding-right:10px;float:left;"><a target="_blank" title="'+comment_updatedTime+'">'+time+'</a></div>\
                        <div class="btn-group" id="RniceArticle'+comment_ID+'" style="float:none;">'+display_r_nice+'</div>\
                        <div class="btn-group" style="float:none;">\
                          <button type="button" class="n" data-toggle="dropdown">\
                            <span class="glyphicon glyphicon-menu-down" style="color:black;top:4px;" aria-hidden="true"></span>\
                          </button>\
                          <ul class="dropdown-menu" role="menu">\
                            '+comment_option+'\
                          </ul>\
                        </div>\
                        <div class="btn-group" style="float:none;min-height:30px;padding-top:10px;padding-right:10px;" id="RniceCount'+comment_ID+'">\
                          有 '+comment_nicer.length+' 人推薦\
                        </div>\
                      </div>\
                    </div>\
                  </div>';
        return element;
      }
      if(counter > 3){
        append_element_comment=combine(append_element_comment);
      }else{
        append_default_element_comment=combine(append_default_element_comment);
      }
    }

    // 判斷本文是否有圖
    if(contentImg){
      var display_img='block';
      var css_content='border-bottom-left-radius: 0px;border-bottom-right-radius: 0px;';
    }else{
      var display_img='none';
      var css_content='';
    }

    // 預先處理權限選單, 預先處理是否是別人在本塗鴉牆上之文章
    var owner = res["timelinesList"][i].owner;
    var owner_div = "";
    
    // 有 owner 則更換顯示圖像
    var event_avatar = author_avater;
    if(owner){
      owner_div = '<div id="event_owner_name" style="float:left;"><a href="?'+owner.id+'" style="font-weight: bold;">'+owner.alias+'</a> <span class="glyphicon glyphicon-play" style="color:black;top:4px;" aria-hidden="true"></span>&nbsp;</div>';
      event_avatar = owner.img;
    }

    var event_option = "";
    if((owner && pri_id==owner.id) || (!owner && (pri_account==ori_author || !ori_author))){ // 有全部權限
      var event_edit_div = '<div class="container-fluid container_edit" id="container_edit'+timelinesID+'">\
                <div class="row-fluid" id="div_edit_content'+timelinesID+'" contenteditable="true" style="'+css_content+'">'+content+'</div>\
                <div class="row-fluid div_edit_img" id="div_edit_img'+timelinesID+'" style="display:block;">'+contentImg+'</div>\
                <button value="編輯完成" id="editSend" class="b" name="'+timelinesID+'"><img src="/images/img_forum/check_icon.png">編輯完成</button>\
                <button value="插入圖片" id="editImage" class="b" name="'+timelinesID+'"><img src="/images/img_forum/images_icon.png">插入圖片</button>\
                <button value="取消編輯" id="editCancel" class="b" name="'+timelinesID+'"><span class="glyphicon glyphicon-remove" style="color:black;top:4px;" aria-hidden="true"></span>取消編輯</button>\
              </div>';
      var event_option = '<li><a class="event_edit" name="'+timelinesID+'">編輯</a></li>\
                          <li><a class="event_del" name="'+timelinesID+'">刪除</a></li>';
      var auth_name = {"self":"只有自己看得到","friend":"只有好友看得到","all":"每個人都看得到"};
      var auth_option='<div class="btn-group" style="float:none;">\
                  <button type="button" class="n" data-toggle="dropdown">\
                    <img src="/images/img_timeline/'+auth+'.png" height="20px" width="20px">\
                    &nbsp;'+auth_name[auth]+'\
                  </button>\
                  <ul class="dropdown-menu" role="menu">\
                    <li><a class="auth_set_all" name="'+timelinesID+'"><img src="/images/img_timeline/all.png" height="20px">&nbsp;每個人都看得到</a></li>\
                    <li><a class="auth_set_friend" name="'+timelinesID+'"><img src="/images/img_timeline/friend.png" height="20px" width="20px">&nbsp;只有好友看得到</a></li>\
                    <li><a class="auth_set_self" name="'+timelinesID+'"><img src="/images/img_timeline/self.png" height="20px">&nbsp;只有自己看得到</a></li>\
                  </ul>\
                </div>'
    }else if(owner && pri_id!=owner.id && (pri_account==ori_author || !ori_author)){ // 原作者
      var event_edit_div = '<div class="container-fluid container_edit" id="container_edit'+timelinesID+'">\
                <div class="row-fluid" id="div_edit_content'+timelinesID+'" contenteditable="true" style="'+css_content+'">'+content+'</div>\
                <div class="row-fluid div_edit_img" id="div_edit_img'+timelinesID+'" style="display:block;">'+contentImg+'</div>\
                <button value="編輯完成" id="editSend" class="b" name="'+timelinesID+'"><img src="/images/img_forum/check_icon.png">編輯完成</button>\
                <button value="插入圖片" id="editImage" class="b" name="'+timelinesID+'"><img src="/images/img_forum/images_icon.png">插入圖片</button>\
                <button value="取消編輯" id="editCancel" class="b" name="'+timelinesID+'"><span class="glyphicon glyphicon-remove" style="color:black;top:4px;" aria-hidden="true"></span>取消編輯</button>\
              </div>';
      var event_option = '<li><a class="event_del" name="'+timelinesID+'">刪除</a></li>';
      var auth_option='<div class="btn-group" style="float:none;">\
                  <button type="button" class="n" data-toggle="dropdown">\
                    <img src="/images/img_timeline/'+auth+'.png" height="20px" width="20px">\
                    &nbsp;權限\
                  </button>\
                  <ul class="dropdown-menu" role="menu">\
                    <li><a class="auth_set_all" name="'+timelinesID+'"><img src="/images/img_timeline/all.png" height="20px">&nbsp;每個人都看得到</a></li>\
                    <li><a class="auth_set_friend" name="'+timelinesID+'"><img src="/images/img_timeline/friend.png" height="20px" width="20px">&nbsp;只有好友看得到</a></li>\
                    <li><a class="auth_set_self" name="'+timelinesID+'"><img src="/images/img_timeline/self.png" height="20px">&nbsp;只有自己看得到</a></li>\
                  </ul>\
                </div>'
    }else{ // 非原作者
      var event_edit_div = "";
      var auth_option="";
      // 判斷是否為 reporter
      var result_reporter = $.grep(reporter, function(e){ return e.reporter == pri_id; });
      if(result_reporter.length>0){ // 目前這個人是 reporter 之一
        var event_option = '<li id="cancelReport_event" name="'+timelinesID+'"><a class="cancelReport_event" name="'+timelinesID+'">收回檢舉</a></li>';
      }else{ // 不是 reporter
        var event_option = '<li id="report_event" name="'+timelinesID+'"><a class="report_event" name="'+timelinesID+'">檢舉</a></li>';
      }
    }

    // 預先處理 timeline event 中的圖片
    contentImg = contentImg.replace(/dummy href=/g, "a href=");
    contentImg = contentImg.replace(/\/dummy/g, "\/a");

    // 判斷是否為 nicer
    var result_nicer = $.grep(nicer, function(e){ return e.id == pri_id; });
    if(result_nicer.length>0){ // 目前這個人是 nicer 之一
      var display_nice='<button value="收回" class="n" name="'+timelinesID+'" id="TimelineCancelNice"><img style="width:24px; height:24px;" src="/images/img_forum/good2_icon.png"/>&nbsp收回</button>';
    }else{ // 不是 nicer
      var display_nice='<button value="推薦" class="n" name="'+timelinesID+'" id="TimelineNice"><img src="/images/img_forum/good_icon.png">&nbsp;推薦</button>';
    }

    // 判斷是否為 reporter
    var result_reporter = $.grep(reporter, function(e){ return e.reporter == pri_id; });
    if(result_reporter.length>0){ // 目前這個人是 reporter 之一
      var display_report='<button value="收回" class="n" name="'+timelinesID+'" id="TimelineCancelNice"><img style="width:24px; height:24px;" src="/images/img_forum/good2_icon.png"/>&nbsp收回</button>';
    }else{ // 不是 reporter
      var display_report='<button value="推薦" class="n" name="'+timelinesID+'" id="TimelineNice"><img src="/images/img_forum/good_icon.png">&nbsp;推薦</button>';
    }

    var append_element ='<div class="container-fluid timeline_event" style="margin-top:30px;">\
              <div class="row-fluid event_info">\
                <table style="width:100%;">\
                  <tr>\
                    <td rowspan="2" style="width:50px;padding-right:15px;">\
                      <image src="'+event_avatar+'" height="50" width="50">\
                    </td>\
                    <td>'+owner_div+'<div id="event_author_name" style="float:left;"><a href="?'+author_id+'">'+author+'</a></div></td>\
                  </tr>\
                  <tr>\
                    <td><div id="event_time">'+updatedTime+'</div></td>\
                  </tr>\
                </table>\
              </div>\
              '+event_edit_div+'\
              <div class="row-fluid event_text">'+content+'</div>\
              <div class="row-fluid event_img" style="display:'+display_img+';">'+contentImg+'</div>\
              <div class="row-fluid event_option btn-group">\
                <div class="btn-group" id="niceArticle'+timelinesID+'" style="float:none;">'+display_nice+'</div>\
                '+auth_option+'\
                <div class="btn-group" style="float:none;">\
                  <button type="button" class="n" data-toggle="dropdown">\
                    <span class="glyphicon glyphicon-menu-down" style="color:black;top:4px;" aria-hidden="true"></span>\
                    &nbsp;其他\
                  </button>\
                  <ul class="dropdown-menu" role="menu">\
                    '+event_option+'\
                  </ul>\
                </div>\
              </div>\
              <div class="row-fluid" id="niceCount'+timelinesID+'">\
                有 '+nicer.length+' 人推薦\
              </div>\
              <div class="row-fluid default_event_commentlist" id="default_event_commentlist'+timelinesID+'">\
                '+append_default_element_comment+'\
              </div>\
              <div class="row-fluid event_commentlist" id="event_commentlist'+timelinesID+'">\
                '+append_element_comment+'\
              </div>\
              <div class="row-fluid readMore" id="readMore'+timelinesID+'" style="margin:15px">\
                <button class="n" id="expandComment" name="'+timelinesID+'"><span class="glyphicon glyphicon-comment" style="color:black;top:4px;" aria-hidden="true"></span>&nbsp;展開留言</button>\
              </div>\
              <div class="row-fluid event_comment">\
                <table style="width:100%;">\
                  <tr>\
                    <td style="width:50px;">\
                      <image src="'+pri_avatar+'" height="50" width="50">\
                    </td>\
                    <td style="padding:5px">\
                      <div id="timeline_comment_content'+timelinesID+'" contentEditable="true" class="edit_content"></div>\
                    </td>\
                  </tr>\
                  <tr>\
                    <td></td>\
                    <td>\
                      <button value="送出留言" name="'+timelinesID+'" id="TimelineCommentSend" class="b"><img src="/images/img_forum/check_icon.png"/>送出留言</button>\
                      <button value="插入圖片" name="'+timelinesID+'" id="TimelineImage" class="b"><img src="/images/img_forum/images_icon.png"/>插入圖片</button>\
                    </td>\
                  </tr>\
                </table>\
                <div contentEditable="false" class="edit_content" id="timeline_comment_image'+timelinesID+'">\
                  <div class="clear" id="comment_clear"></div>\
                </div>\
              </div>\
            </div>';
    switch(status){
      case 0:
        $( "#timeline" ).append( append_element );
      break;
      case 1:
        $( append_element ).insertAfter( "#timeline > .row-fluid" );
      break;
    }
    $( ".div_edit_img > .show-image" ).append( "<input class=\"delete\" type=\"button\" value=\"X\" id=\"rmimg\">" ); // 加入叉叉
    $( ".div_r_edit_img > .show-image" ).append( "<input class=\"delete\" type=\"button\" value=\"X\" id=\"rmimg\">" ); // 加入叉叉

    if(pri_account==""){ // 沒登入
      $(".event_option").css("display", "none");
      $(".event_comment").css("display", "none");
    }
    if(res["timelinesList"][i].response.length<4){
      $("#readMore"+timelinesID).css("display", "none");
    }
  }
}

function profile_auth(route){   //去改按過權限按鈕之後的內容，只有前台
  var item = route.split("/")[0];
  var target = route.split("/")[1];
  $('#'+item+'_pic').attr("src","/images/img_timeline/"+target+".png")
   if (target=="self"){
        $('#'+item+'_btn_text').text("自己才看得到");
      }
      else if(target=="friend"){
        $('#'+item+'_btn_text').text("朋友才看得到");
      }
      else if(target=="all"){
        $('#'+item+'_btn_text').text("人人都看得到");
      }
      else if(target=="doctor"){
        $('#'+item+'_btn_text').text("醫生");
      }
  $.get("/setProfileAuth/"+route,function(res){
      showDialog("一般訊息",res);
  });
}

function postTimeline(){
  if($("#timeline_post_image #rmimg")){$("#timeline_post_image .delete").remove();} // 去除叉叉紐
  if($("#timeline_post_image #comment_clear")){$("#timeline_post_image .clear").remove();} // 去除clear
  var timeline_post_content = $("#timeline_post_content").html();
  var timeline_post_image = $("#timeline_post_image").html().trim();
  var timeline_post_auth = $("#postTilmelineAuth button img").attr("value");

  if(timeline_post_content.trim()=="" & timeline_post_image.trim()==""){showDialog("錯誤訊息","發佈失敗！");}
  else{
    $.post( "/postTimeline", { timeline_post_content: timeline_post_content, timeline_post_image: timeline_post_image, timeline_post_auth: timeline_post_auth}, function(res){
      $("#timeline_post_content").empty();
      $("#timeline_post_image").empty();
      $("#timeline_post_image").css("display", "none");
      res["timelinesList"][0]["response"] = [];
      res["timelinesList"][0]["nicer"] = [];
      res["timelinesList"][0]["report"] = [];
      getPri(function(pri_account, pri_id, pri_avatar){
        displayTimelineList(res, pri_account, pri_id, pri_avatar, 1);
      });
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err,function(){
        window.location.replace("/home");
      });
    });
  }
}
function editTimeline(id){
  $("#container_edit"+id).css("display", "block");
  $("#container_edit"+id).parent().children( ".event_text" ).css("display", "none");
  $("#container_edit"+id).parent().children( ".event_img" ).css("display", "none");
}
function editTimelineCancel(id){
  $("#container_edit"+id).css("display", "none");
  $("#container_edit"+id).parent().children( ".event_text" ).css("display", "block");
  $("#container_edit"+id).parent().children( ".event_img" ).css("display", "block");
  if($("#container_edit"+id).parent().children( ".event_img" ).html().trim()==""){
    $("#container_edit"+id).parent().children( ".event_img" ).css("display", "none");
  }
}
function editTimelineSend(id){
  if($("#div_edit_img"+id)){$("#div_edit_img"+id+" .delete").remove();} // 去除叉叉紐

  var edit_content=$("#div_edit_content"+id).html();
  var edit_img=$("#div_edit_img"+id).html();
  var finish_edit_img = edit_img.replace(/dummy href=/g, "a href=");
  finish_edit_img = finish_edit_img.replace(/\/dummy/g, "\/a");

  if(edit_content.trim()=="" & edit_img.trim()==""){showDialog("錯誤訊息","發佈失敗！");}
  else{
    $.post( "/editTimeline", { edit_content: edit_content, edit_img: edit_img, id: id}, function(res){
      $("#container_edit"+id).parent().children( ".event_text" ).html(edit_content);
      $("#container_edit"+id).parent().children( ".event_img" ).html(finish_edit_img);
      editTimelineCancel(id);
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}
function delTimeline(id){
  bootbox.dialog({
    message: "確定要刪除文章嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          $.post( "/delTimeline", { id: id }, function(res){
            $("#container_edit"+id).parent().remove();
          }).error(function(res){
            showDialog("錯誤訊息",res.responseJSON.err);
          });
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
function Timeline_nice(id){
  $.post( "/TimelineNice", { id: id }, function(res){
    document.getElementById("niceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("niceArticle"+id).innerHTML = '<button value="收回" class="n" name="'+id+'" id="TimelineCancelNice"><img style="width:24px; height:24px;" src="/images/img_forum/good2_icon.png"/>&nbsp收回</button>';
    $(document).one("click","#TimelineNice",function(e){ // 把 listener 加回去
      Timeline_nice(this.name);
    });
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}
function Timeline_cancel_nice(id){
  $.post( "/TimelineCancelNice", { id: id }, function(res){
    document.getElementById("niceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("niceArticle"+id).innerHTML = '<button value="推薦" class="n" name="'+id+'" id="TimelineNice"><img src="/images/img_forum/good_icon.png">&nbsp;推薦</button>';
    $(document).one("click","#TimelineCancelNice",function(e){ // 把 listener 加回去
      Timeline_cancel_nice(this.name);
    });
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}
function expandComment(id){
  var status = $("#event_commentlist"+id).css("display");
  if(status=="block"){
    $("#event_commentlist"+id).css("display", "none");
    $('[id="expandComment"][name="'+id+'"]').html('<span class="glyphicon glyphicon-comment" style="color:black;top:4px;" aria-hidden="true"></span>&nbsp;展開留言');
  }else{
    $("#event_commentlist"+id).css("display", "block");
    $('[id="expandComment"][name="'+id+'"]').html('<span class="glyphicon glyphicon-comment" style="color:black;top:4px;" aria-hidden="true"></span>&nbsp;收起留言');
  }
}
function report() {
  var form=document.getElementById('reportForm');
  for (var i=0; i<form.reason.length; i++) {
    if (form.reason[i].checked) {
      var choose = form.reason[i].value;
      break;
    }
  }

  if(choose=='others') {
    var reason=document.getElementById('reasonInput').value.trim();
  } else {
    var reason=choose;
  }

  switch(activeSource){
    case 'report_event':
      var url='/TimelineReport';
      var className = 'cancelReport_event';
    break;
    case 'report_comment':
      var url='/TimelineResponseReport';
      var className = 'cancelReport_comment';
    break;
    default:
      showDialog("錯誤訊息","住手！",function(){
        return;
      });
    break;
  }

  if(!reason) {
    showDialog("一般訊息","請選擇原因。");
  } else {
    $.post(url, {id: activeId, reason: reason}, function(res){

      $('[id="'+activeSource+'"][name="'+activeId+'"]').html('<a class="'+className+'" name="'+activeId+'">收回檢舉</a>');
      $('[id="'+activeSource+'"][name="'+activeId+'"]').attr("id", className);
      showDialog("一般訊息","謝謝您的回饋，我們會盡快處理。");
      $("#reportDialog").dialog("close");
    }).error(function(res){
      showDialog("錯誤訊息",res.err);
    });
  }
}
function cancelReport() {
  bootbox.dialog({
    message: "確定要收回檢舉嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          switch(activeSource){
            case 'cancelReport_event':
              var url='/TimelineCancelReport';
              var className = 'report_event';
            break;
            case 'cancelReport_comment':
              var url='/TimelineResponseCancelReport';
              var className = 'report_comment';
            break;
            default:
              showDialog("錯誤訊息","住手！",function(){
                return;
              });
            break;
          }
          $.post(url, {id: activeId}, function(res){
            $('[id="'+activeSource+'"][name="'+activeId+'"]').html('<a class="'+className+'" name="'+activeId+'">檢舉</a>');
            $('[id="'+activeSource+'"][name="'+activeId+'"]').attr("id", className);
            showDialog("一般訊息","已收回此檢舉！");
          }).error(function(res){
            showDialog("錯誤訊息",res.responseJSON.err);
          });
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

function postTimeline_comment(id){
  var spec_div_content = "timeline_comment_content"+id;
  var spec_div_img = "timeline_comment_image"+id;

  if($("#"+spec_div_img+" #rmimg")){$("#"+spec_div_img+" .delete").remove();} // 去除叉叉紐
  if($("#"+spec_div_img+" #comment_clear")){$("#"+spec_div_img+" .clear").remove();} // 去除clear

  var timeline_comment_content = $("#"+spec_div_content).html();
  var timeline_comment_image = $("#"+spec_div_img).html().trim();

  if(timeline_comment_content.trim()=="" & timeline_comment_image.trim()==""){showDialog("錯誤訊息","發佈失敗！");}
  else{
    $.post( "/leaveCommentTimeline", { timeline_comment_content: timeline_comment_content, timeline_comment_image: timeline_comment_image, timeline_id: id}, function(res){
      window.location.replace(document.URL);
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}
function editRTimeline(id){
  $("#container_r_edit"+id).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".event_text_r" ).css("display", "none");
  $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "none");
}
function editRTimelineCancel(id){
  $("#container_r_edit"+id).css("display", "none");
  $("#container_r_edit"+id).parent().children( ".event_text_r" ).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "block");
  if($("#container_r_edit"+id).parent().children( ".event_img" ).html().trim()==""){
    $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "none");
  }
}
function editRTimelineSend(id){
  if($("#div_r_edit_img"+id)){$("#div_r_edit_img"+id+" .delete").remove();} // 去除叉叉紐
  var name = $("#container_r_edit"+id).parent().children(".event_text_r").children("a.name").html()
  var edit_content=$("#div_r_edit_content"+id).html();
  var edit_img=$("#div_r_edit_img"+id).html();
  var finish_edit_img = edit_img.replace(/dummy href=/g, "a href=");
  finish_edit_img = finish_edit_img.replace(/\/dummy/g, "\/a");

  if(edit_content.trim()=="" & edit_img.trim()==""){showDialog("錯誤訊息","發佈失敗！");}
  else{
    $.post( "/editCommentTimeline", {edit_content: edit_content, edit_img: edit_img, id: id}, function(res){
      $("#container_r_edit"+id).parent().children( ".event_text_r" ).html("<a class='name' href='?"+id+"'>"+name+"</a>"+edit_content);
      $("#container_r_edit"+id).parent().children( ".event_img" ).html(finish_edit_img);

      editRTimelineCancel(id);
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}
function delTimeline_comment(id){
  bootbox.dialog({
    message: "確定要刪除留言嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          $.post( "/delCommentTimeline", { id: id }, function(res){
            $("#container_r_edit"+id).parent().parent().remove();
          }).error(function(res){
            showDialog("錯誤訊息",res.responseJSON.err);
          });
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
function Timeline_r_nice(id){
  $.post( "/TimelineResponseNice", { id: id }, function(res){
    document.getElementById("RniceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("RniceArticle"+id).innerHTML = '<button class="n" name="'+id+'" id="TimelineResponseCancelNice"><img style="width:24px; height:24px;" src="/images/img_forum/good2_icon.png"/></button>';
    $(document).one("click","#TimelineResponseNice",function(e){ // 把 listener 加回去
      Timeline_r_nice(this.name);
    });
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}
function Timeline_r_cancel_nice(id){
  $.post( "/TimelineResponseCancelNice", { id: id }, function(res){
    document.getElementById("RniceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("RniceArticle"+id).innerHTML = '<button class="n" name="'+id+'" id="TimelineResponseNice"><img src="/images/img_forum/good_icon.png"></button>';
    $(document).one("click","#TimelineResponseCancelNice",function(e){ // 把 listener 加回去
      Timeline_r_cancel_nice(this.name);
    });
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}

function auth_set(id,target){
  $.post("/auth_setTimeline",{id:id , target:target},function(res){
    showDialog("一般訊息",res);
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });
}


//=====  LINK 
function getXMLHttp(){
  var xmlHttp
  try{
    //Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  }
  catch(e){
    //Internet Explorer
    try{
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e){
      try{
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e){
        showDialog("錯誤訊息","您的瀏覽器不支援本網站之此功能！請更換瀏覽器後再試試看～",function(){
          return false;
        });
      }
    }
  }
  return xmlHttp;
}

// ==== Profile 相關
function showProfile(ori_author){
  var xmlHttp = getXMLHttp();
  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4){
      HandleResponse_showProfile(xmlHttp.responseText);
    }
  }
  if (!ori_author){
    xmlHttp.open("GET", "/showProfile",true);
  }
  else{
    var addr="/getProfile/"+ori_author;
    xmlHttp.open("GET", addr, true);
    $('.auth_btn').hide();
  }
  
  xmlHttp.send(null);
}
function HandleResponse_showProfile(response){
  obj = JSON.parse(response);
  var email=obj.email;
  var alias=obj.alias;
  var fname=obj.fname;
  var lname=obj.lname;
  var img=obj.img;
  var gender=obj.gender;
  var phone=obj.phone;
  var postalCode=obj.postalCode;
  var addressCity=obj.addressCity;
  var addressDistrict=obj.addressDistrict;
  var address=obj.address;
  var birthday = obj.birthday;
  var now = new Date()
  var b = new Date(birthday)
  var age = now.getTime() - b.getTime()
  var Y = (b.getFullYear().toString() == "NaN") ? "  " : b.getFullYear()-1911;
  var M = (b.getMonth().toString() == "NaN") ? "  " : b.getMonth()+1;
  var D = (b.getDate().toString() == "NaN") ? "  " : b.getDate();
  var type=obj.type;
  var primaryDisease=obj.primaryDisease;
  var primaryDiseaseHtml;
  var owner=window.location.toString().split('?')[1];
  if (typeof owner != "undefined"){

    //檢查兩個人的關係
    $.get('/authCheck/'+owner,function(auth_status){
      if(!auth_status["name"]){
        $('#name_row').hide();
      }
      if (!auth_status["email"]){
        $('#email_row').hide();
      }
      // if (!auth_status["type"]){
      //   $('#type_row').hide();
      // }
      if (!auth_status["gender"]){
        $('#gender_row').hide();
      }
      if (!auth_status["phone"]){
        $('#phone_row').hide();
      }
      if (!auth_status["bday"]){
        $('#bday_row').hide();
      }
      if (!auth_status["city"]){
        $('#city_row').hide();
      }
    })
  }
  //檢查拿得到什麼
  $.get('/auth_data',function(auth_status){
    var index = ["name","email","gender","phone","bday","city","type"];
    for (var i in index){
      //console.log(i + " - " + index[i] +  " - " + auth_status[index[i]]);
      $('#'+index[i]+'_pic').attr("src","/images/img_timeline/"+auth_status[index[i]]+".png");
      if (auth_status[index[i]]=="self"){
        $('#'+index[i]+'_btn_text').text("自己才看得到");
      }
      else if(auth_status[index[i]]=="friend"){
        $('#'+index[i]+'_btn_text').text("朋友才看得到");
      }
      else if(auth_status[index[i]]=="all"){
        $('#'+index[i]+'_btn_text').text("人人都看得到");
      }
      else if(auth_status[index[i]]=="doctor"){
        $('#'+index[i]+'_btn_text').text("醫生");
      }
    }
  })

  if (type=='S'){
    if(primaryDisease!=""){
      primaryDiseaseHtml="主治"+diseaseList[primaryDisease];
    }
    type="社工師";

  }else if(type=='P'){

    type="";
  }else if(type=='F'){
    type="";
  }else if(type=='D'){
    if(primaryDisease!=""){
      primaryDiseaseHtml="主治"+diseaseList[primaryDisease];
    }
    type="醫生";
  }else if(type=='RN'){
    if(primaryDisease!=""){
      primaryDiseaseHtml="主治"+diseaseList[primaryDisease];
    }
    type="護理師";
  }else if(type=='N'){
    type="";
  }

  $('#primaryDisease').text(primaryDiseaseHtml);
  $('#type').text(type);
  $('#email').text(email);
  $('#name').text(fname+lname);
  $('#alias').text(alias);
  $('#avatar').attr('src',img);

  $('#m_primaryDisease').text(primaryDiseaseHtml);
  $('#m_type').text(type);
  $('#m_alias').text(alias);
  $('#m_avatar').attr('src',img);

  if (gender=='M'){
    gender="男性";
  }else if(gender=='F'){
    gender="女性";
  }else{
    gender="其他";
  }
  $('#gender').text(gender);
  $('#phone').text(phone);
  
  $("#bday").text(Math.floor(age/(86400000*365)).toString()+" 歲");
  //$("#bday").text("民國 "+Y.toString()+" 年 "+M.toString()+" 月 "+D.toString()+" 日");
  $('#city').text(addressCity);
}

function mobile_friend_setting(){
  $('#m_friend').css('display','block');
  $('#m_friend').html($('#m_friend').html().replace(/&nbsp;/g, ''));
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