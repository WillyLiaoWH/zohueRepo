var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;


function editProfile(){
  content.style.display="none";
}



function compare(a,b) {
	if (a.createdAt < b.createdAt)
		return 1;
	if (a.createdAt > b.createdAt)
    	return -1;
  	return 0;
}

var app = angular.module('homeApp', []);
app.controller('announcementCtrl', function($scope, $http) {
	$http.get("./getAnnouncement").success(function(response) {
    	$scope.announcement = response.sort(compare).slice(0,5);
    });
    $http.get("./getTopArticles").success(function(response) {
    	$scope.topArticles = response;
    });
});



function homepagePic(){
  console.log("in homepic");
    $.get("/getHomepagePic", function(homepagePics){
    if(typeof(homepagePics)=="string"){
      showDialog("一般訊息",homepagePics);
    }else{
      homepagePicTable="<div id='myCarousel' class='carousel slide col-md-11 col-md-offset-1 hidden-phone' data-ride='carousel' align='center' style='width:540px; height:340px;'><ol class='carousel-indicators'>";
      for(i=0; i<homepagePics.length; i++){
        if(i=="0"){
          homepagePicTable+="<li data-target='#myCarousel' data-slide-to='"+(i+1)+"' class='active'></li>";
          
        }else{

        homepagePicTable+="<li data-target='#myCarousel' data-slide-to='"+(i+1)+"'></li>";
        }
     }
      homepagePicTable+="</ol>";
      homepagePicTable+="<div class='carousel-inner' role='listbox'>";
      for(i=0; i<homepagePics.length; i++){
        homepagePicId=homepagePics[i].id;
        if(i=="0"){
          homepagePicTable+="<div class='item active'><img id='img_"+i+"'' src='"+homepagePics[i].pic+"' class='img-responsive' style='min-height: 330px; max-height:340px; max-width:540px;' align='middle'></img></div>";
        }else{
          homepagePicTable+="<div class='item'><img id='img_"+i+"'' src='"+homepagePics[i].pic+"' class='img-responsive'  style='min-height: 330px; max-height:340px; max-width:540px;' align='middle'></img></div>";
        }
      }
      homepagePicTable+="</div><a class='left carousel-control' href='#myCarousel' role='button' data-slide='prev'><span class='glyphicon glyphicon-chevron-left' aria-hidden='true'></span><span class='sr-only'>Previous</span></a><a class='right carousel-control' href='#myCarousel' role='button' data-slide='next'><span class='glyphicon glyphicon-chevron-right' aria-hidden='true'></span><span class='sr-only'>Next</span></a></div>";

      document.getElementById("homepagePicList").innerHTML = homepagePicTable;
    }
  }).error(function(res){
    showDialog("錯誤訊息",res.responseJSON.err);
  });

}

homepagePic();
