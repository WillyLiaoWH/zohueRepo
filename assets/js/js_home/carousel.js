


function homepagePic(){

  $.get("/getHomepagePic", function(homepagePics){
    if(typeof(homepagePics)=="string"){
      showDialog("一般訊息",homepagePics);
    }else{
      // homepagePicContent="<tr class='tableHead'><th>#</th><th style='width:20%'>圖片</th><th>標題</th><th>新增日期</th><th>刪除照片</th><tr>";
      for(i=0; i<homepagePics.length; i++){
        homepagePicContent="<div id='myCarousel' class='carousel slide col-md-11 col-md-offset-1 hidden-phone' data-ride='carousel' align='center'><ol class='carousel-indicators'>";
        homepagePicId=homepagePics[i].id;
        if(i==0){
          homepagePicContent+="<li data-target='#myCarousel2' data-slide-to='"+(i+1)+"' class='active'></li>";  
        }else{
        homepagePicContent+="<li data-target='#myCarousel2' data-slide-to='"+(i+1)+"'</li>";
        }
        homepagePicContent+="</ol>";
      }
      for(i=0; i<homepagePics.length; i++){
        homepagePicContent+="<div class='carousel-inner' role='listbox'>";
        homepagePicId=homepagePics[i].id;
        if(i==0){
          homepagePicContent+="<div class='item active'><img src='"+homepagePics[i].pic+"'></div>";  
        }else{
        homepagePicContent+="<div class='item'><img src='"+homepagePics[i].pic+"'></div>";
        }
        homepagePicContent+="</div><a class='left carousel-control' href='#myCarousel' role='button' data-slide='prev'>
      <span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span>
      <span class='sr-only'>Previous</span></a><a class='right carousel-control' href='#myCarousel' role='button' data-slide='next'>
      <span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span>
      <span class='sr-only'>Next</span></a></div>";
      }
      document.getElementById("homepagePic").innerHTML = homepagePicContent;
    }
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });

}