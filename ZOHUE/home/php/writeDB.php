<?php
	require_once "db.php";

	$alias = $_GET['alias'];
	$account = $_GET['account'];
	$password = $_GET['password'];
	$email = $_GET['email'];

	$sql="REPLACE INTO `user` (`alias`,`account`,`password`,`email`) values ('$alias','$account','$password','$email')";
	$ret=mysql_query($sql,$db) or die(mysql_error());
?>