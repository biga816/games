<?php
date_default_timezone_set('Asia/Tokyo');
require 'config.php';
// 環境情報
Config::set_config_directory(__DIR__ . '/config');
$server = Config::get('app.server');
$username = Config::get('app.username');
$password = Config::get('app.password');
$db_name = Config::get('app.db_name');


$link = mysql_connect($server, $username, $password);
if (!$link) {
    die('接続失敗です。'.mysql_error());
}
// dbを指定する
$db_selected = mysql_select_db($db_name, $link);
if (!$db_selected) {
    die('接続失敗です。'.mysql_error());
}

?>
