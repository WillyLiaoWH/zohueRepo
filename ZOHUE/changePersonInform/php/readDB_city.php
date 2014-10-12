<?php
	require_once "db.php";

	$array=array();$array_s=array();$array1=array();$array2=array();$array3=array();$array4=array();
	$array5=array();$array6=array();$array7=array();$array8=array();$array9=array();$array10=array();
	$array11=array();$array12=array();$array13=array();$array14=array();$array15=array();$array16=array();
	$array17=array();$array18=array();$array19=array();$array20=array();$array21=array();$array22=array();
	$sql="SELECT * FROM `postallist`";
	$ret=mysql_query($sql,$db) or die(mysql_error());

	$next_city="";
	while($rows=mysql_fetch_assoc($ret)){
		$array_s=array('postalcode'=>$rows['postalcode'],'addressDistrict'=>$rows['addressDistrict']);
		switch ($rows['addressCity']) {
			case '臺北市':
				array_push($array1, $array_s);
				break;
			case '新北市':
				array_push($array2, $array_s);
				break;
			case '基隆市':
				array_push($array3, $array_s);
				break;
			case '桃園縣':
				array_push($array4, $array_s);
				break;
			case '新竹縣':
				array_push($array5, $array_s);
				break;
			case '新竹市':
				array_push($array6, $array_s);
				break;
			case '苗栗縣':
				array_push($array7, $array_s);
				break;
			case '臺中市':
				array_push($array8, $array_s);
				break;
			case '彰化縣':
				array_push($array9, $array_s);
				break;
			case '南投縣':
				array_push($array10, $array_s);
				break;
			case '雲林縣':
				array_push($array11, $array_s);
				break;
			case '嘉義縣':
				array_push($array12, $array_s);
				break;
			case '嘉義市':
				array_push($array13, $array_s);
				break;
			case '臺南市':
				array_push($array14, $array_s);
				break;
			case '高雄市':
				array_push($array15, $array_s);
				break;
			case '屏東縣':
				array_push($array16, $array_s);
				break;
			case '宜蘭縣':
				array_push($array17, $array_s);
				break;
			case '花蓮縣':
				array_push($array18, $array_s);
				break;
			case '臺東縣':
				array_push($array19, $array_s);
				break;
			case '澎湖縣':
				array_push($array20, $array_s);
				break;
			case '金門縣':
				array_push($array21, $array_s);
				break;
			case '連江縣':
				array_push($array22, $array_s);
				break;
			default:
				# code...
				break;
		}
		$array=array(
			array('addressCity'=>'臺北市','district'=>$array1),
			array('addressCity'=>'新北市','district'=>$array2),
			array('addressCity'=>'基隆市','district'=>$array3),
			array('addressCity'=>'桃園縣','district'=>$array4),
			array('addressCity'=>'新竹縣','district'=>$array5),
			array('addressCity'=>'新竹市','district'=>$array6),
			array('addressCity'=>'苗栗縣','district'=>$array7),
			array('addressCity'=>'臺中市','district'=>$array8),
			array('addressCity'=>'彰化縣','district'=>$array9),
			array('addressCity'=>'南投縣','district'=>$array10),
			array('addressCity'=>'雲林縣','district'=>$array11),
			array('addressCity'=>'嘉義縣','district'=>$array12),
			array('addressCity'=>'嘉義市','district'=>$array13),
			array('addressCity'=>'臺南市','district'=>$array14),
			array('addressCity'=>'高雄市','district'=>$array15),
			array('addressCity'=>'屏東縣','district'=>$array16),
			array('addressCity'=>'宜蘭縣','district'=>$array17),
			array('addressCity'=>'花蓮縣','district'=>$array18),
			array('addressCity'=>'台東縣','district'=>$array19),
			array('addressCity'=>'澎湖縣','district'=>$array20),
			array('addressCity'=>'金門縣','district'=>$array21),
			array('addressCity'=>'連江縣','district'=>$array22));
	}
	echo json_encode($array);
?>