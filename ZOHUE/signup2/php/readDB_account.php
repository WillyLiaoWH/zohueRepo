<?php
	require_once "db.php";

	$account = $_GET['account'];
	$sql="SELECT count(*) FROM `user` WHERE account = '$account'";
	$ret=mysql_query($sql,$db) or die(mysql_error());

	while($rows=mysql_fetch_assoc($ret)){
		echo $rows['count(*)'];
		break;
	}
?>