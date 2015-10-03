var allow_create;
var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

function editProfile(){
  content.style.display="none";
}



var app = angular.module('homeApp', []);
app.controller('announcementCtrl', function($scope, $http) {
	$http.get("http://localhost/getAnnouncement").success(function(response) {
    	$scope.announcement = response;
    });
    $http.get("http://localhost/getTopArticles").success(function(response) {
    	$scope.topArticles = response;
    });
});