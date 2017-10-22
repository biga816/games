<?php 
// require_once("../../auction/wp-load.php"); 
// require_once("../../auction/wp-blog-header.php");
require_once("db.php"); 
$err_msg = 'エラーが発生しました。時間を空けてもう一度実行してください。';

// クッキーのセット
$tanaka_id= $_COOKIE["tanaka_id"];
if(!isset($tanaka_id)){
	// IPアドレス取得
	$host = $_SERVER["HTTP_HOST"];
	if($host == "localhost:8888"){
		$ipAddress = "255.255.0.0";
	}else{
		$ipAddress = $_SERVER["REMOTE_ADDR"];
	}
	$tanaka_id = ip2long($ipAddress);	
}

// パラメータ設定
$game_id = htmlspecialchars($_POST['id']);
$user_id = $tanaka_id;
$prize_type = htmlspecialchars($_POST['p_type']);
$prize_value = htmlspecialchars($_POST['p_value']);
$status = "0";
$create_date = date("Y-m-d")." ".date("H:i:s");
$selSQL ="SELECT MAX(id) as id FROM gameresult WHERE `user_id`='".$user_id."' AND `game_status` = '2' AND `game_id` ='".$game_id."' AND cast(create_date as date) = current_date" ;

// SQLの実行
$result = mysql_query($selSQL);

if (!$result) {
    die($err_msg);
}else{
	
	$count = 0;
	// SQL実行結果の取得
	while ($row = mysql_fetch_assoc($result)) {
	    $gameresult_id = $row['id'];
	    $count ++;
	}
	
	if ($count==1){
		$SQL =
			"INSERT INTO gameprize
			  ( `gameresult_id`, `user_id`, `prize_type`, `prize_value`, `status`, `create_date`)
			VALUES 
			 ('".$gameresult_id."', '".$user_id."', '".$prize_type."', '".$prize_value."', '".$status."', '".$create_date."')";

		// SQL実行
		//echo $SQL;
		$result =  mysql_query($SQL);
		if (!$result) {
		    die($err_msg);
		}
	}else{
		die($err_msg);
	}
}
?>