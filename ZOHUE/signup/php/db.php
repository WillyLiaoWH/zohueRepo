<?php
	$hostname_db = "127.0.0.1";
	$database_db = "zohue";
	$username_db = "root";
	$password_db = "";
	$db = mysql_pconnect($hostname_db, $username_db, $password_db) or trigger_error(mysql_error(),E_USER_ERROR);
	mysql_select_db($database_db, $db);
	mysql_query("SET NAMES 'utf8'");
?>