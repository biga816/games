<?php 
// require_once("../../auction/wp-load.php"); 
// require_once("../../auction/wp-blog-header.php");
require_once("db.php"); 
$err_msg = 'ただいま混雑しております。時間を空けてもう一度実行してください。';

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
	setcookie( "tanaka_id", $tanaka_id, time() + 2592000, "/");
}

// パラメータ設定
$game_id = htmlspecialchars($_POST['id']);
$user_id = $tanaka_id;
$game_status = "0";
$create_date = date("Y-m-d")." ".date("H:i:s");
$selSQL ="SELECT COUNT(*) as cnt FROM gameresult WHERE `user_id`='".$user_id."' AND `game_status` = '".$game_status."'";

// SQLの実行
$result = mysql_query($selSQL);

if (!$result) {
    die($err_msg);
}else{
	// SQL実行結果の取得
	while ($row = mysql_fetch_assoc($result)) {
	    $count = $row['cnt'];
	}
	
	if ($count==0){
		$SQL =
			"INSERT INTO gameresult 
			  ( `game_id`, `user_id`, `game_status`, `create_date`)
			VALUES 
			 ('".$game_id."', '".$user_id."', '".$game_status."', '".$create_date."')";
	}else{
		$SQL =
			"UPDATE gameresult 
			SET	create_date = '".$create_date."'
			WHERE game_id = '".$game_id."'
			AND user_id = '".$user_id."'";
	}
	// SQL実行
	//echo $SQL;
	$result =  mysql_query($SQL);
	if (!$result) {
	    //die('Invalid query: ' . mysql_error());
	    die($err_msg);
	}
}
?>