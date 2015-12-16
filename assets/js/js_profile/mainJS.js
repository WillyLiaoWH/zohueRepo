//var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
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
var regex = /\bhttps:\/\/www\.youtube\.com\/watch\?v\=+(\w*)+\b/g;
var source,activeSource;
$(document).ready(function(){
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
    auth_set(this.name,"friend","只有好友看得到");
  });
  $(document).on("click",".auth_set_doctor",function(e){
    auth_set(this.name,"doctor","只有醫生看得到");
  });
  $(document).on("click",".auth_set_all",function(e){
    auth_set(this.name,"all","每個人都看得到");
  });
  $(document).on("click",".auth_set_self",function(e){
    auth_set(this.name,"self","只有自己看得到");
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
      // 這裡把 PO 文 ajax 到頁面上指定位置
      $( "#timeline_factory" ).after( res );
      $("#no_post_message").hide();
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err,function(){
        window.location.replace("/home");
      });
    });
  }
}
function editTimeline(id){
  // 暫存編輯內容
  eval( "tempTimelineContent" + id + '=$("#div_edit_content"+id).html()' );
  eval( "tempTimelineImg" + id + "=" + '$("#div_edit_img"+id).html()' );

  $("#container_edit"+id).css("display", "block");
  $("#container_edit"+id).parent().children( ".event_text" ).css("display", "none");
  $("#container_edit"+id).parent().children( ".event_img" ).css("display", "none");
}
function editTimelineCancel(id){
  // 還原暫存的編輯內容
  $("#div_edit_content"+id).html(eval("tempTimelineContent" + id));
  $("#div_edit_img"+id).html(eval("tempTimelineImg" + id));

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
      $("#container_edit"+id).parent().children( ".event_text" ).html(edit_content.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'));
      $("#container_edit"+id).parent().children( ".event_img" ).html(finish_edit_img);
      editTimelineCancel(id);
    }).error(function(res){
      showDialog("錯誤訊息",res.responseJSON.err);
    });
  }
}
function delTimeline(id){
  bootbox.dialog({
    message: "確定要刪除留言嗎？",
    title: "再次確認",
    buttons: {
      yes: {
        label: "確認",
        className: "btn-primary",
        callback: function() {
          $.post( "/delTimeline", { id: id }, function(res){
            
            if(res.timelineLength=='0'){
                 $("#no_post_message").show();
              }
            $("#container_edit"+id).parent().remove();
          }).error(function(res){
            showDialog("錯誤訊息",res.responseJSON.err);
          });
        }
      }, no: {
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
  // 暫存編輯內容
  eval( "tempTimelineRContent" + id + '=$("#div_r_edit_content"+id).html()' );
  eval( "tempTimelineRImg" + id + "=" + '$("#div_r_edit_img"+id).html()' );

  $("#container_r_edit"+id).css("display", "block");
  $("#container_r_edit"+id).parent().children( ".event_text_r" ).css("display", "none");
  $("#container_r_edit"+id).parent().children( ".event_img" ).css("display", "none");
}
function editRTimelineCancel(id){
  // 還原暫存的編輯內容
  $("#div_r_edit_content"+id).html(eval("tempTimelineRContent" + id));
  $("#div_r_edit_img"+id).html(eval("tempTimelineRImg" + id));

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
      $("#container_r_edit"+id).parent().children( ".event_text_r" ).html("<a class='name' href='?"+id+"'>"+name+"</a>"+edit_content.replace(regex, '<iframe width="560" height="315" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'));
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

function auth_set(id,target,text){
  $.post("/auth_setTimeline",{id:id , target:target},function(res){
    $("#btn_timeline_auth"+id).html('<img src="/images/img_timeline/'+target+'.png" height="20px" width="20px">&nbsp;'+text);
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
  if (!ori_author){
    $.get("/showProfile",function(res){
      HandleResponse2(res);
    });
  }
  else{
    var addr="/getProfile/"+ori_author;
    $.get(addr,function(res){
      HandleResponse2(res);
    });
    $('.auth_btn').hide();
  }
}
function HandleResponse2(response){
  obj=response;

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
      // console.log(owner)
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