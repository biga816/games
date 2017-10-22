<!DOCTYPE HTML>
<?php
require_once("games/api/db.php");

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
$prize_type = "1";
$status = "0";
$address = htmlspecialchars($_POST['form_address']);
$date = date("Y-m-d")." ".date("H:i:s");
$selSQL ="SELECT sum(prize_value) as sum FROM gameprize WHERE `user_id`='".$user_id."' AND `prize_type` = '".$prize_type."'AND `status` = '0' ";
$updSQL =
	"UPDATE gameprize 
	SET	update_date = '".$date."',
			status = '1',
			address = '".$address."'
	WHERE prize_type = '".$prize_type."'
	AND status = '0'
	AND user_id = '".$user_id."'";

// SQLの実行(データ取得)
$result = mysql_query($selSQL);

// 結果の取得
$row = mysql_fetch_assoc($result);
$prize_total = $row['sum'];

$req_flg = "0";
if($prize_total>0){
	$req_flg = "1";
	if(!empty($address)){
		// SQLの実行(データ更新)
		$result = mysql_query($updSQL);
		//$updSQL;
		$req_flg = "0";
		// メール送信
		mb_send_mail("big_a_816@yahoo.co.jp", "infomation from TNK", $user_id." get TNK.", "From: no-reply@tanaka.org");
		  
	}
}

?>

<html>
	<head>
		<title>Tanakacoin</title>
		<meta http-equiv="content-type" content="text/html; charset=utf-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<!--[if lte IE 8]><script src="css/ie/html5shiv.js"></script><![endif]-->
		<script src="js/jquery.min.js"></script>
		<script src="js/jquery.dropotron.min.js"></script>
		<script src="js/skel.min.js"></script>
		<script src="js/skel-layers.min.js"></script>
		<script src="js/init.js"></script>
		<script language="javascript" type="text/javascript">
		function CheckFormData(){
		  var address = document.getElementById("form_address"); 
		  var length = CountLength(address.value);
		  //  空白の削除
			if(address.value == ''){
							alert('アドレスを入力してください');
							address.style.border = 'thin solid red';
							address.focus();
							return false;
			}
			// 文字数を制限する
			if(length != '34'){
							alert('正しいアドレスを入力してください');
							address.style.border = 'thin solid red';
							address.focus();
							return false;
			}
		}
		// バイト数を数える
		function CountLength(str) {
		    var r = 0;
		    for (var i = 0; i < str.length; i++) {
		        var c = str.charCodeAt(i);
		        if ( (c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
		            r += 1;
		        } else {
		            r += 2;
		        }
		    }
		    return r;
		}
		</script>  
		<noscript>
			<link rel="stylesheet" href="css/skel.css" />
			<link rel="stylesheet" href="css/style.css" />
			<link rel="stylesheet" href="css/style-wide.css" />
			<link rel="stylesheet" href="css/style-noscript.css" />
		</noscript>
		<!--[if lte IE 8]><link rel="stylesheet" href="css/ie/v8.css" /><![endif]-->
		<!--[if lte IE 9]><link rel="stylesheet" href="css/ie/v9.css" /><![endif]-->
	</head>
	<body class="contact loading">
	
		<!-- Header -->
			<header id="header">
				<h1 id="logo"><a href="index.php">TNK</a></h1>
				<nav id="nav">
					<ul>
						<li class="current"><a href="index.php">Top</a></li>
						<li class="submenu">
							<a href="">MENU</a>
							<ul>
								<li><a href="index.php">Home</a></li>
								<li><a href="index.php#instagram">Instagram</a></li>
								<li><a href="index.php#twitter">Twitter</a></li>
								<li><a href="games/shinkansen">Tanakacoin</a></li>
								<li><a href="contact.html">Contact</a></li>
							</ul>
						</li>
						<li><a class="fb-like button special icon fa-facebook fit scrolly" href="http://www.facebook.com/plugins/like.php?href=https://www.facebook.com/tanakas.org" onclick="javascript:window.open('http://www.facebook.com/plugins/like.php?href=https://www.facebook.com/tanakas.org' ,null ,'width=650 ,height=450'); return false;" rel="nofollow"> いいね！</a></li>
						<li><a class="button special icon fa-twitter" href="http://twitter.com/share?count=horizontal&original_referer=https://tanakas.org&text=田中が変われば、日本が変わる。呼び起こせ、あなたの中の田中を。&url=https://tanakas.org" onclick="window.open(this.href, 'tweetwindow', 'width=550, height=450,personalbar=0,toolbar=0,scrollbars=1,resizable=1'); return false;">シェア</a></li>
					</ul>
				</nav>			</header>
		
		<!-- Main -->
			<article id="main">
				<?php if($req_flg == "1"){ ?>
				<header class="special container">
					<span class="icon fa-laptop"></span>
					<h2><strong>Tanakacoin</strong>をGETする</h2>
				</header>
					
				<!-- One -->
					<section class="wrapper style4 special container small">
					<header>
						<h2><span class="icon fa-lock"> 獲得数: <strong><?php echo $prize_total; ?></strong>TNK</h2>
					</header>

					
						<!-- Content -->
							<div class="content">
									<div class="row half no-collapse-1">
										<p><strong>手順1: <a href="https://www.coinprism.com/" target="_blank">coinprism</a></strong>でウォレットを作成してください</p>
										<p><strong>手順2: </strong>ウォレットのアドレスを入力し送信してください</p>
									</div>
								<form action="" name="SUBMITFORM" id="SUBMITFORM" method="post" onsubmit="return CheckFormData();" enctype="multipart/form-data"> 

									<div class="row half no-collapse-1">
										<div class="12u">
											<input id="form_address" type="text" name="form_address" placeholder="アドレス" value="<?php echo $_POST['form_address']; ?>">
										</div>
									</div>
									<div class="row">
										<div class="12u">
											<ul class="buttons">
												<input class="button special" type="submit" value="  送信  ">
											</ul>
										</div>
									</div>
									<div class="row half no-collapse-1">
										<p><strong>手順3:</strong>Tanakacoin送金までしばらくお待ちください</p>
									</div>
								</form>
							</div>
							
					</section>
				<? }else{ ?>
				<header class="special container">
					<span class="icon fa-laptop"></span>
					<h2>ありがとうございました。</h2>
				</header>
				<section class="wrapper style1 container special">
											<ul class="buttons">
												<li><a class="button special" href="games/shinkansen">戻る</a></li>
											</ul>				
				</section>
				<?php } ?>
				
				
			</article>

		<!-- Footer -->
			<footer id="footer">
			
				<ul class="icons">
					<li>
						<iframe src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Ftanakas.org&amp;width=50&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=false&amp;height=21&amp;appId=813296825366564" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:20px;" allowTransparency="true"></iframe>
					</li>
					<li>
						<a href="https://twitter.com/tanakastanaka" class="twitter-follow-button" data-show-count="true" data-lang="ja" data-show-screen-name="false">@tanakastanakaさんをフォロー</a>
<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
					</li>
				</ul>
				
				<span class="copyright">&copy; tanakas.org. All rights reserved.</span>
			
			</footer>


	</body>
</html>