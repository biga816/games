<?php 
require_once("../../auction/wp-load.php"); 
/*require_once("../../auction/wp-blog-header.php");*/

global $PPT, $PPTDesign, $ThemeDesign, $userdata, $wpdb;

// パラメータ設定
$game_id = htmlspecialchars($_POST['id']);
$user_id = $userdata->ID;
$game_status = "0";
$create_date = date("Y-m-d")." ".date("h:i:s");
$selSQL ="SELECT COUNT(*) as cnt FROM gameresult WHERE `user_id`='".$user_id."' AND `game_status` = '".$game_status."'";

// SQLの実行
$result = mysql_query($selSQL, $wpdb->dbh);

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
} else {
	$SQL =
		"UPDATE gameresult 
		SET	create_date = '".$create_date."'
		WHERE game_id = '".$game_id."'
		AND user_id = '".$user_id."'";
}
// SQL実行
echo $SQL;
mysql_query($SQL, $wpdb->dbh);

?>