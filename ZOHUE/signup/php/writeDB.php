<?php
	require_once "db.php";

	$fname = $_GET['fname'];
	$lname = $_GET['lname'];
	$alias = $_GET['alias'];
	$img = $_GET['img'];
	$account = $_GET['account'];
	$password = $_GET['password'];
	$forgetQ = $_GET['forgetQ'];
	$forgetA = $_GET['forgetA'];
	$type = $_GET['type'];
	$gender = $_GET['gender'];
	$phone = $_GET['phone'];
	$postalCode = $_GET['postalCode'];
	$address = $_GET['address'];
	$birthday = $_GET['birthday'];
	$selfIntroduction = $_GET['selfIntroduction'];

	$sql="REPLACE INTO `user` (`firstName`,`lastName`,`alias`,`image`,`account`,`password`,`forgetQ`,`forgetA`,`type`,`gender`,`phone`,`postalCode`,`address`,`birthday`,`selfIntroduction`) values ('$fname','$lname','$alias','$img','$account','$password','$forgetQ','$forgetA','$type','$gender','$phone','$postalCode','$address','$birthday','$selfIntroduction')";
	$ret=mysql_query($sql,$db) or die(mysql_error());
?>