var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
var source,activeSource;
$(document).ready(function(){

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


  
  $(document).on("click",".event_edit",function(e){
    editTimeline(this.name);
  });
  $(document).on("click","#editCancel",function(e){
    editTimelineCancel(this.name);
  });
  $(document).on("click","#editSend",function(e){
    editTimelineSend(this.name);
  });
  $(document).one("click",".event_del",function(e){
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


function getPri(cb){
  var pri_account="";
  var pri_id="";
  $.get("/checkAuth", function(auth){
    if(auth) {
      pri_account=auth.account;
      pri_id=auth.id;
      pri_avatar=auth.img;
    }
    cb(pri_account, pri_id, pri_avatar);
  });
}

function setTimelinePage(pri_account, pri_id, pri_avatar){
  //alert(window.location.toString().split('?')[1]);
  // var regex = /profile\?(*)/gi;
  // match = regex.exec(window.location);
  // alert(match[0]);
  
  var ori_author=window.location.toString().split('?')[1];
  if (pri_account!==ori_author){
    //$('.auth_btn').hide()
  }
  showProfile(ori_author);
  $.post( "/setTimelinePage/"+ori_author, {}, function(res){
    if(res.notfull) {
      alert("他還沒完整註冊所以沒有個人頁面喔");
      if(document.referrer.search("board")!=-1||document.referrer.search("friends")!=-1||document.referrer.search("article")!=-1)
        window.location.replace(document.referrer);
      else
        window.location.replace("/home");
    } else {
      var author_avater = res["avatar"];
      var author = res["alias"];
      var author_account = res["account"];
      var timeInMs = new Date().getTime();

      sortTimelineList(function(){
        displayTimelineList();
      });

      function sortTimelineList(cb){
        res["timelinesList"].sort(function(a, b) {
          return new Date(b.createdAt)-new Date(a.createdAt);
        });
        cb();
      }
      function displayTimelineList(){
        for(i in res["timelinesList"]){
          var content = res["timelinesList"][i].content;
          var contentImg = res["timelinesList"][i].contentImg;
          var dif = timeInMs-Date(updatedAt);
          var updatedAt = new Date(res["timelinesList"][i].updatedAt).toLocaleString();
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
            var comment_author_avater=element_res.img;
            var comment_author=element_res.alias;
            var comment_content=element_res.comment;
            var comment_contentImg=element_res.comment_image;
            var comment_ID = element_res.id;
            var comment_updatedAt = new Date(element_res.updatedAt).toLocaleString();
            var comment_nicer = element_res.rnicer;
            var comment_reporter = element_res.rreporter;
            var dif2 = (timeInMs-new Date(element_res.updatedAt).getTime())/1000;
            if(dif2 > 86400){var time=Math.round(dif2/86400)+"天前";
            }else if(dif2 > 3600){var time=Math.round(dif2/3600)+"小時前";
            }else if(dif2 > 60){var time=Math.round(dif2/60)+"分鐘前";
            }else{var time="剛剛";}

            // 預先處理 timeline event 中的圖片
            comment_contentImg = comment_contentImg.replace(/dummy href=/g, "a href=");
            comment_contentImg = comment_contentImg.replace(/\/dummy/g, "\/a");

            // 預先處理權限選單
            var comment_option = "";
            if(pri_account==comment_author_account){ // 原作者
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
              element = element+'<div id="container_timeline_res container-fluid">\
                          <div id="sidebar_timeline_res">\
                            <image src="'+comment_author_avater+'" height="50" width="50">\
                          </div>\
                          <div id="content_timeline_res">\
                            <div class="event_text_r"><a href="?'+comment_author_account+'">'+comment_author+'</a> '+comment_content+'</div>\
                            <div class="row-fluid event_img" style="display:'+display_img+';">'+comment_contentImg+'</div>\
                            <div class="container-fluid container_r_edit" id="container_r_edit'+comment_ID+'">\
                              <div class="row-fluid" id="div_r_edit_content'+comment_ID+'" contenteditable="true" style="'+css_r_content+'">'+comment_content+'</div>\
                              <div class="row-fluid div_r_edit_img" id="div_r_edit_img'+comment_ID+'" style="display:block;">'+comment_contentImg+'</div>\
                              <button value="編輯完成" id="editRSend" class="b" name="'+comment_ID+'"><img src="/images/img_forum/check_icon.png">編輯完成</button>\
                              <button value="插入圖片" id="editRImage" class="b" name="'+comment_ID+'"><img src="/images/img_forum/images_icon.png">插入圖片</button>\
                              <button value="取消編輯" id="editRCancel" class="b" name="'+comment_ID+'"><span class="glyphicon glyphicon-remove" style="color:black;top:4px;" aria-hidden="true"></span>取消編輯</button>\
                            </div>\
                            <div class="row-fluid event_option btn-group">\
                              <div style="min-height:30px;padding-top:10px;padding-right:10px;float:left;"><a target="_blank" title="'+comment_updatedAt+'">'+time+'</a></div>\
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

          // 預先處理權限選單
          var event_option = "";
          if(pri_account==ori_author || !ori_author){ // 原作者
            var event_edit_div = '<div class="container-fluid container_edit" id="container_edit'+timelinesID+'">\
                      <div class="row-fluid" id="div_edit_content'+timelinesID+'" contenteditable="true" style="'+css_content+'">'+content+'</div>\
                      <div class="row-fluid div_edit_img" id="div_edit_img'+timelinesID+'" style="display:block;">'+contentImg+'</div>\
                      <button value="編輯完成" id="editSend" class="b" name="'+timelinesID+'"><img src="/images/img_forum/check_icon.png">編輯完成</button>\
                      <button value="插入圖片" id="editImage" class="b" name="'+timelinesID+'"><img src="/images/img_forum/images_icon.png">插入圖片</button>\
                      <button value="取消編輯" id="editCancel" class="b" name="'+timelinesID+'"><span class="glyphicon glyphicon-remove" style="color:black;top:4px;" aria-hidden="true"></span>取消編輯</button>\
                    </div>';
            var event_option = '<li><a class="event_edit" name="'+timelinesID+'">編輯</a></li>\
                                  <li><a class="event_del" name="'+timelinesID+'">刪除</a></li>';
            var auth_option='<div class="btn-group" style="float:none;">\
                        <button type="button" class="n" data-toggle="dropdown">\
                          <img src="/images/img_timeline/'+auth+'.png" height="20px" width="20px">\
                          &nbsp;權限\
                        </button>\
                        <ul class="dropdown-menu" role="menu">\
                         <li><a class="auth_set_all" name="'+timelinesID+'"><img src="/images/img_timeline/all.png" height="20px">&nbsp;每個人</a></li>\
                              <li><a class="auth_set_friend" name="'+timelinesID+'"><img src="/images/img_timeline/friend.png" height="20px" width="20px">&nbsp;好友</a></li>\
                              <li><a class="auth_set_self" name="'+timelinesID+'"><img src="/images/img_timeline/self.png" height="20px">&nbsp;只有自己</a></li>\
                        </ul>\
                      </div>'
          }else{ // 非原作者
            var event_edit_div = "";
            //var event_option = '<li><div id="report_event" name="'+timelinesID+'"><a class="report_event" name="'+timelinesID+'">檢舉</a></div></li>';
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
                            <image src="'+author_avater+'" height="50" width="50">\
                          </td>\
                          <td><div id="event_author_name"><a href="?'+author_account+'">'+author+'</a></div></td>\
                        </tr>\
                        <tr>\
                          <td><div id="event_time">'+updatedAt+'</div></td>\
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
          $( "#timeline" ).append( append_element );
          $( ".div_edit_img > .show-image" ).append( "<input class=\"delete\" type=\"button\" value=\"X\" id=\"rmimg\">" ); // 加入叉叉
          $( ".div_r_edit_img > .show-image" ).append( "<input class=\"delete\" type=\"button\" value=\"X\" id=\"rmimg\">" ); // 加入叉叉

          if(pri_account==""){ // 沒登入
            $(".event_option").css("display", "none");
            $(".event_comment").css("display", "none");
          }
          if(res["timelinesList"][i].response.length<4){
            $(".readMore").css("display", "none");
          }
        }
      }
    }
  })
  .error(function(res){
    //alert(JSON.stringify(res));
    alert(res.responseJSON.err);
  });
}

function profile_auth(route){   //去改按過權限按鈕之後的內容，只有前台
  var item = route.split("/")[0];
  var target = route.split("/")[1];
  $('#'+item+'_pic').attr("src","/images/img_timeline/"+target+".png")
   if (target=="self"){
        $('#'+item+'_btn_text').text("自己");
      }
      else if(target=="friend"){
        $('#'+item+'_btn_text').text("朋友");
      }
      else if(target=="all"){
        $('#'+item+'_btn_text').text("全部");
      }
      else if(target=="doctor"){
        $('#'+item+'_btn_text').text("醫生");
      }
  $.get("/setProfileAuth/"+route,function(res){
    alert(res);
  })
  
}

function postTimeline(){
  if($("#timeline_post_image #rmimg")){$("#timeline_post_image .delete").remove();} // 去除叉叉紐
  if($("#timeline_post_image #comment_clear")){$("#timeline_post_image .clear").remove();} // 去除clear
  var timeline_post_content = $("#timeline_post_content").html();
  var timeline_post_image = $("#timeline_post_image").html().trim();

  if(timeline_post_content.trim()=="" & timeline_post_image.trim()==""){alert("發佈失敗！");}
  else{
    $.post( "/postTimeline", { timeline_post_content: timeline_post_content, timeline_post_image: timeline_post_image}, function(res){
      alert("發佈成功！");
      window.location.replace(document.URL);
    })
    .error(function(res){
      alert(res.responseJSON.err);
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
  //if($("#"+spec_div_img+" #comment_clear")){$("#"+spec_div_img+" .clear").remove();} // 去除clear

  var edit_content=$("#div_edit_content"+id).html();
  var edit_img=$("#div_edit_img"+id).html();

  if(edit_content.trim()=="" & edit_img.trim()==""){alert("發佈失敗！");}
  else{
    $.post( "/editTimeline", { edit_content: edit_content, edit_img: edit_img, id: id}, function(res){
      window.location.replace(document.URL);
    })
    .error(function(res){
      alert(res.responseJSON.err);
    });
  }
}
function delTimeline(id){
  var r = confirm("確定要刪除文章嗎？");
  if (r == true) {
    $.post( "/delTimeline", { id: id }, function(res){
      alert(res);
      window.location.replace(document.URL);
    })
    .error(function(res){
      alert(res.responseJSON.err);
    });
  }
}
function Timeline_nice(id){
  $.post( "/TimelineNice", { id: id }, function(res){
    document.getElementById("niceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("niceArticle"+id).innerHTML = '<button value="收回" class="n" name="'+id+'" id="TimelineCancelNice"><img style="width:24px; height:24px;" src="/images/img_forum/good2_icon.png"/>&nbsp收回</button>';
    $(document).one("click","#TimelineNice",function(e){ // 把 listener 加回去
      Timeline_nice(this.name);
    });
  })
  .error(function(res){
    alert(res.responseJSON.err);
  });
}
function Timeline_cancel_nice(id){
  $.post( "/TimelineCancelNice", { id: id }, function(res){
    document.getElementById("niceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("niceArticle"+id).innerHTML = '<button value="推薦" class="n" name="'+id+'" id="TimelineNice"><img src="/images/img_forum/good_icon.png">&nbsp;推薦</button>';
    $(document).one("click","#TimelineCancelNice",function(e){ // 把 listener 加回去
      Timeline_cancel_nice(this.name);
    });
  })
  .error(function(res){
    alert(res.responseJSON.err);
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
    break;
    case 'report_comment':
      var url='/TimelineResponseReport';
    break;
    default:
      alert('住手！');
      return;
    break;
  }

  if(!reason) {
    alert("請選擇原因");
  } else {
    $.post(url, {id: activeId, reason: reason}, function(res){
      $('[id="'+activeSource+'"][name="'+activeId+'"]').html('<a class="cancelReport_event" name="'+activeId+'">收回檢舉</a>');
      $('[id="'+activeSource+'"][name="'+activeId+'"]').attr("id", "cancelReport_event");
      alert(res.num);
      $("#reportDialog").dialog("close");
    }).error(function(res){
      alert(res.err);
    });
  }
}
function cancelReport() {
  if(confirm("確定要收回檢舉嗎")) {
    switch(activeSource){
      case 'cancelReport_event':
        var url='/TimelineCancelReport';
      break;
      case 'cancelReport_comment':
        var url='/TimelineResponseCancelReport';
      break;
      default:
        alert('住手！');
        return;
      break;
    }
    $.post(url, {id: activeId}, function(res){
      $('[id="'+activeSource+'"][name="'+activeId+'"]').html('<a class="report_event" name="'+activeId+'">檢舉</a>');
      $('[id="'+activeSource+'"][name="'+activeId+'"]').attr("id", "report_event");
      alert(res.num);
    }).error(function(res){
      alert(res.responseJSON.err);
    });
  }
}

function postTimeline_comment(id){
  var spec_div_content = "timeline_comment_content"+id;
  var spec_div_img = "timeline_comment_image"+id;

  if($("#"+spec_div_img+" #rmimg")){$("#"+spec_div_img+" .delete").remove();} // 去除叉叉紐
  if($("#"+spec_div_img+" #comment_clear")){$("#"+spec_div_img+" .clear").remove();} // 去除clear

  var timeline_comment_content = $("#"+spec_div_content).html();
  var timeline_comment_image = $("#"+spec_div_img).html().trim();

  if(timeline_comment_content.trim()=="" & timeline_comment_image.trim()==""){alert("發佈失敗！");}
  else{
    $.post( "/leaveCommentTimeline", { timeline_comment_content: timeline_comment_content, timeline_comment_image: timeline_comment_image, timeline_id: id}, function(res){
      //alert("發佈成功！");
      alert(res);
      window.location.replace(document.URL);
    })
    .error(function(res){
      alert(res.responseJSON.err);
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
  //if($("#"+spec_div_img+" #comment_clear")){$("#"+spec_div_img+" .clear").remove();} // 去除clear

  var edit_content=$("#div_r_edit_content"+id).html();
  var edit_img=$("#div_r_edit_img"+id).html();

  if(edit_content.trim()=="" & edit_img.trim()==""){alert("發佈失敗！");}
  else{
    $.post( "/editCommentTimeline", { edit_content: edit_content, edit_img: edit_img, id: id}, function(res){
      window.location.replace(document.URL);
    })
    .error(function(res){
      alert(res.responseJSON.err);
    });
  }
}
function delTimeline_comment(id){
  var r = confirm("確定要刪除留言嗎？");
  if (r == true) {
    $.post( "/delCommentTimeline", { id: id }, function(res){
      alert(res);
      window.location.replace(document.URL);
    })
    .error(function(res){
      alert(res.responseJSON.err);
    });
  }
}
function Timeline_r_nice(id){
  $.post( "/TimelineResponseNice", { id: id }, function(res){
    document.getElementById("RniceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("RniceArticle"+id).innerHTML = '<button class="n" name="'+id+'" id="TimelineResponseCancelNice"><img style="width:24px; height:24px;" src="/images/img_forum/good2_icon.png"/></button>';
    $(document).one("click","#TimelineResponseNice",function(e){ // 把 listener 加回去
      Timeline_r_nice(this.name);
    });
  })
  .error(function(res){
    alert(res.responseJSON.err);
  });
}
function Timeline_r_cancel_nice(id){
  $.post( "/TimelineResponseCancelNice", { id: id }, function(res){
    document.getElementById("RniceCount"+id).innerHTML = "有 "+res.num+" 人推薦";
    document.getElementById("RniceArticle"+id).innerHTML = '<button class="n" name="'+id+'" id="TimelineResponseNice"><img src="/images/img_forum/good_icon.png"></button>';
    $(document).one("click","#TimelineResponseCancelNice",function(e){ // 把 listener 加回去
      Timeline_r_cancel_nice(this.name);
    });
  })
  .error(function(res){
    alert(res.responseJSON.err);
  });
}

function auth_set(id,target){
  $.post("/auth_setTimeline",{id:id , target:target},function(res){
    alert(res);
  })
  .error(function(res){
    alert(res.responseJSON.err);
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
        alert("Your browser does not support AJAX!");
        return false;
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
  var b = new Date(birthday)
  var Y = b.getFullYear();
  var M = b.getMonth()+1;
  var D = b.getDate();

  var owner=window.location.toString().split('?')[1];

  $.get('/authCheck/'+owner,function(auth_status){
    console.log(auth_status)
    if (!auth_status["email"]){
      $('#email_row').hide();
    }
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

  $.get('/auth_data',function(auth_status){
    var index = ["email","gender","phone","bday","city"];
    for (var i in index){
      $('#'+index[i]+'_pic').attr("src","/images/img_timeline/"+auth_status[index[i]]+".png");
      if (auth_status[index[i]]=="self"){
        $('#'+index[i]+'_btn_text').text("自己");
      }
      else if(auth_status[index[i]]=="friend"){
        $('#'+index[i]+'_btn_text').text("朋友");
      }
      else if(auth_status[index[i]]=="all"){
        $('#'+index[i]+'_btn_text').text("全部");
      }
      else if(auth_status[index[i]]=="doctor"){
        $('#'+index[i]+'_btn_text').text("醫生");
      }
    }
  })

  $('#email').text(email);
  $('#name').text(fname+lname);
  $('#avatar').attr('src',img);
  if (gender=='M'){
    gender="男";
  }
  else{
    gender="女";
  }
  $('#gender').text(gender);
  $('#phone').text(phone);
  $("#bday").text("民國 "+(Y-1911).toString()+" 年 "+M.toString()+" 月 "+D.toString()+" 日");
  $('#city').text(addressCity);

}