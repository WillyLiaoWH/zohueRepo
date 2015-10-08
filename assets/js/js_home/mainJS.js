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