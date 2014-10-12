<?php
	require_once "db.php";

	$array=array();
	$account = $_GET['account'];
	$password = $_GET['password'];

	$sql="SELECT * FROM `user` WHERE account = '$account' and password = '$password'";
	$ret=mysql_query($sql,$db) or die(mysql_error());

	while($rows=mysql_fetch_assoc($ret)){
		$array[]=array('account'=>$rows['account'],'password'=>$rows['password']);
	}

	if($array[0][account]!=null){
		echo json_encode($array);
	}
?>