<?php
	require_once "db.php";

	$array=array();
	$account = $_GET['account'];

	$sql="SELECT * FROM `user` where `account` = '$account'";
	$ret=mysql_query($sql,$db) or die(mysql_error());

	while($rows=mysql_fetch_assoc($ret)){
		$array[]=array('userID'=>$rows['userID'],'lastName'=>$rows['lastName'],'firstName'=>$rows['firstName'],'alias'=>$rows['alias'],'account'=>$rows['account'],'password'=>$rows['password'],'type'=>$rows['type'],'forgetQ'=>$rows['forgetQ'],'forgetA'=>$rows['forgetA'],'gender'=>$rows['gender'],'phone'=>$rows['phone'],'postalCode'=>$rows['postalCode'],'address'=>$rows['address'],'birthday'=>$rows['birthday'],'image'=>$rows['image'],'selfIntroduction'=>$rows['selfIntroduction']);
	}
	echo json_encode($array);
?>