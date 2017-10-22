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
$game_status = htmlspecialchars($_POST['status']);
$update_date = date("Y-m-d")." ".date("H:i:s");
$selSQL ="SELECT COUNT(*) as cnt FROM gameresult WHERE `user_id`='".$user_id."' AND `game_status` = '0' ";

// SQLの実行
$result = mysql_query($selSQL);

if (!$result) {
    die($err_msg);
}else{
	// SQL実行結果の取得
	while ($row = mysql_fetch_assoc($result)) {
	    $count = $row['cnt'];
	}
	
	if ($count==1){
		$SQL =
			"UPDATE gameresult 
			SET	update_date = '".$update_date."',
					game_status = '".$game_status."'
			WHERE game_id = '".$game_id."'
			AND game_status = '0'
			AND user_id = '".$user_id."'";

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