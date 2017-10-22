var Result = cc.Layer.extend({
///////////////////////////////////////////
// 初期化                                                      //
///////////////////////////////////////////
	ctor:function () {
	    this._super();
	    var screenSize = cc.Director.getInstance().getWinSize();
	
	    //背景をセットする。
	    var bg = cc.Sprite.create(s_bg);
        var fr = cc.Sprite.create(s_fr);
	    bg.setPosition(cc.p(screenSize.width / 2, screenSize.height / 2));
        fr.setPosition(cc.p(screenSize.width / 2, screenSize.height / 2));
	    this.addChild(bg);
        this.addChild(fr, 10);
	
		// 当たりの白棒を表示する。
		var dx  = screenSize.width - 90;
		var dy = 60;
		var moveDown = cc.MoveBy.create(0.5,cc.p(0,-40));
		var easeIn = cc.EaseOut.create(moveDown,0.5);

		this.s_barW = cc.Sprite.create(s_barW);
        this.s_barW.setPosition(cc.p(dx, dy));
        this.addChild(this.s_barW, 5);		

        this.s_barW.runAction(easeIn);

        // サウンド出力
		var audioEngine = cc.AudioEngine.getInstance();
		audioEngine.playEffect(s_bingo);
		
        // メニュー表示
        this.openMenu();
        
        // データ登録
        this.createData();
        
	    this.setTouchEnabled(true);
	    return true;
	},

///////////////////////////////////////////
//  メニュー表示の処理　　                            //
///////////////////////////////////////////
	openMenu:function (touches, event) {
		var screenSize = cc.Director.getInstance().getWinSize();
		
	    //メニューの背景を設定する
        var bgMenu = cc.Sprite.create(s_bgMenu);
        bgMenu.setPosition(cc.p(screenSize.width / 2, screenSize.height / 2));
        bgMenu.setOpacity(0);
        this.addChild(bgMenu, 10);

		// アクションを設定する
		var delayTime = cc.DelayTime.create(1.5);
		var fadeIn = cc.FadeIn.create(0.5);
        bgMenu.runAction(cc.Sequence.create(delayTime, fadeIn));
        
        // メニューを作成する
        var button01 = cc.MenuItemImage.create(s_button01,null, this.menuTapped, this);		// ボタン1
        // var button02 = cc.MenuItemImage.create(s_button02,null, this.menuTapped, this);		// ボタン2
        var prize01 = cc.MenuItemImage.create(s_prize01,null, this.menuTapped, this);			// 商品
        button01.setPosition(cc.p(0, -120));
        // button02.setPosition(cc.p(0, -180));
        prize01.setPosition(cc.p(0, +50));
        button01.setTag(0);
        // button02.setTag(1);

        this.menu = cc.Menu.create(button01, prize01);
        this.menu.setOpacity(0);
        this.addChild(this.menu,30);
        
		// アクションを設定する
		delayTime = cc.DelayTime.create(1.5);
		fadeIn = cc.FadeIn.create(0.5);
        this.menu.runAction(cc.Sequence.create(delayTime, fadeIn));
	},
///////////////////////////////////////////
//  データ作成                                              //
///////////////////////////////////////////
    createData:function () {
    	var xhr = new XMLHttpRequest();
    	var game_id = "id=000001&p_type=1&p_value=1";
    	var url = "../api/prize_get.php";
    	xhr.open("POST" , url, true);
    	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    	xhr.onload = function(e) {
			if (this.status != 200) {
				console.log("err");
			}
		}
		xhr.send(game_id);
		xhr.onreadystatechange = function() {
	        if (xhr.readyState == 4) {
	            var res = xhr.responseText;
	            if(res){
	            	alert(res);
	            	// 初期画面へ戻る
		    	    //var transition = cc.TransitionFade.create(0, new ShinkansenScene());
		        	//cc.Director.getInstance().replaceScene(transition);
		        	cc.Director.getInstance().replaceScene(new ShinkansenScene());
		        	
	            }
	        }
		}
    },
///////////////////////////////////////////
//  画面タップ時の処理　　                            //
///////////////////////////////////////////
	onTouchesBegan:function (touches, event) {},
  	onTouchesMoved:function (touches, event) {},
  	onTouchesEnded:function (touches, event) {},
  	onTouchesCancelled:function (touches, event) {},
  	
///////////////////////////////////////////
//  メニュータップ時の処理　　                      //
///////////////////////////////////////////
  	menuTapped:function (sender) {
  		switch(sender.getTag()){
  		case 0:
  				// プレイ画面へ戻る
  				cc.Director.getInstance().replaceScene(new ShinkansenScene());
  				break;
  		case 1:
  				// 画面遷移する
				//   location.href="../result.php";
				window.open('about:blank','_self').close();
  				break;
  		}
  	},
});

var ResultScene = cc.Scene.extend({
  	onEnter:function () {
	    this._super();
	    var layer = new Result();
	    layer.init();
	    this.addChild(layer);
  	}
});