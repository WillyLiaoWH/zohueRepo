<?php
	require_once "db.php";

	$array=array();

	$sql="SELECT * FROM `recoveryquestion`";
	$ret=mysql_query($sql,$db) or die(mysql_error());

	while($rows=mysql_fetch_assoc($ret)){
		$array[]=array('question'=>$rows['question'],'questionID'=>$rows['questionID']);
	}
	echo json_encode($array);
?>