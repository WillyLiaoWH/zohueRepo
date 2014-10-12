<?php
	require_once "db.php";

	$newPassword = $_GET['newPassword'];
	$userID = $_GET['userID'];

	// $sql="REPLACE INTO user (userID,password) values ('$userID','$newPassword')";
	$sql="UPDATE user SET password='$newPassword' WHERE userID='$userID'";
	$ret=mysql_query($sql,$db) or die(mysql_error());
?>