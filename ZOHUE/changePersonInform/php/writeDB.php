<?php
	require_once "db.php";
	$userID = $_GET['userID'];
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

	$sql="UPDATE user SET firstName='$fname', lastName='$lname', alias='$alias', image='$img', forgetQ='$forgetQ', forgetA='$forgetA', type='$type', gender='$gender', phone='$phone', postalCode='$postalCode',
							address='$address', birthday='$birthday', selfIntroduction='$selfIntroduction'
					WHERE userID='$userID'";

	$ret=mysql_query($sql,$db) or die(mysql_error());
?>