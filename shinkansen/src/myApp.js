/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.
 ****************************************************************************/
var TAG_SPRITE_MANAGER = 1;
var ROTATION_MAX_L;
var ROTATION_MAX_R;
var ROTATION_DEFAULT;
var PTM_RATIO = 300;

var Shinkansen = cc.Layer.extend({
    world:null,
    //GLESDebugDraw *m_debugDraw;

///////////////////////////////////////////
// 初期化                                                      //
///////////////////////////////////////////
    ctor:function () {
        this._super();
        this.circleBody = [];
        this.blockBody = [];

        this.setTouchEnabled(true);
        //setAccelerometerEnabled( true );

        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2ChainShape = Box2D.Collision.Shapes.b2ChainShape
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            ,b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
		
		// 背景をセットする。
        var screenSize = cc.Director.getInstance().getWinSize();
        var bg = cc.Sprite.create(s_bg);
        var fr = cc.Sprite.create(s_fr);

        bg.setPosition(cc.p(screenSize.width / 2, screenSize.height / 2));
        fr.setPosition(cc.p(screenSize.width / 2, screenSize.height / 2));

        this.addChild(bg, 0);
        this.addChild(fr, 5);
        
		// レバーを作成する。
		this.leverL = cc.Sprite.create(s_leverL);
        this.leverL.setPosition(cc.p(screenSize.width / 2, screenSize.height / 3));
        this.addChild(this.leverL, 10);
		this.leverL.setVisible(false);
		
		// 矢印を作成する。
		var dx  = screenSize.width - 125;
		var dy = screenSize.height - 80;
        var moveDown = cc.MoveBy.create(0.3,cc.p(0,-15));
        var moveUp = cc.MoveBy.create(0.3,cc.p(0,15));
        var move = cc.Sequence.create(moveDown, moveUp);

		this.arrowR = cc.Sprite.create(s_arrowR);
        this.arrowR.setPosition(cc.p(dx, dy));
        this.addChild(this.arrowR, 20);		

        this.arrowR.runAction(cc.RepeatForever.create(move));

        // Construct a world object, which will hold and simulate the rigid bodies.
        this.world = new b2World(new b2Vec2(0, -10), true); //重力の向きと強さ
        this.world.SetContinuousPhysics(true);

		// Debug
		//this.setBox2dDebug();

        // Define the ground body.
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;						//密度
        fixDef.friction = 0.5;						//摩擦係数
        fixDef.restitution = 0.2;				//反発係数

        var bodyDef = new b2BodyDef;

        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.linearDamping = 0.5;		// 減衰率
        fixDef.shape = new b2PolygonShape;

        fixDef.shape.SetAsBox(0.03, screenSize.height / (2 * PTM_RATIO));
        // left
        bodyDef.position.Set(-24/PTM_RATIO, screenSize.height / (2 * PTM_RATIO));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // right
        bodyDef.position.Set((screenSize.width+24) / PTM_RATIO, screenSize.height / (2 * PTM_RATIO));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        
		// 障害物の作成①棒状
		var bPosS = [];
		var bPosE = [];
		var bOption = [];
		var bGap = [];

		bPosS[0] = new b2Vec2(318, 628); bPosE[0] = new b2Vec2(375, 670); bOption[0] = "S0100"; bGap[0] = 20;
		bPosS[1] = new b2Vec2(0, 650);     bPosE[1] = new b2Vec2(148, 658); bOption[1] = "C0010"; bGap[1] = 20;
		bPosS[2] = new b2Vec2(35, 606);   bPosE[2] = new b2Vec2(410, 632); bOption[2] = "C0100"; bGap[2] = 20;
		bPosS[3] = new b2Vec2(0, 553);     bPosE[3] = new b2Vec2(176, 576); bOption[3] = "C0001"; bGap[3] = 20;
		bPosS[4] = new b2Vec2(170, 562); bPosE[4] = new b2Vec2(413, 519); bOption[4] = "C0010"; bGap[4] = 20;
		bPosS[5] = new b2Vec2(305, 575); bPosE[5] = new b2Vec2(402, 588); bOption[5] = "S0100"; bGap[5] = 10;
		bPosS[6] = new b2Vec2(438, 627); bPosE[6] = new b2Vec2(440, 596); bOption[6] = "S0000"; bGap[6] = 20;
		bPosS[7] = new b2Vec2(361, 481); bPosE[7] = new b2Vec2(450, 467); bOption[7] = "S0000"; bGap[7] = 20;
		bPosS[8] = new b2Vec2(216, 501); bPosE[8] = new b2Vec2(330, 483); bOption[8] = "C1010"; bGap[8] = 20;
		bPosS[9] = new b2Vec2(85, 529);   bPosE[9] = new b2Vec2(141, 510); bOption[9] = "S1010"; bGap[9] = 20;
		bPosS[10] = new b2Vec2(71, 443);   bPosE[10] = new b2Vec2(225, 488); bOption[10] = "C1000"; bGap[10] = 20;
		bPosS[11] = new b2Vec2(8, 546);   bPosE[11] = new b2Vec2(8, 484); bOption[11] = "S0000"; bGap[11] = 20;
		bPosS[12] = new b2Vec2(0, 384);   bPosE[12] = new b2Vec2(123, 406); bOption[12] = "C0001"; bGap[12] = 20;
		bPosS[13] = new b2Vec2(124, 392); bPosE[13] = new b2Vec2(356, 359); bOption[13] = "S0000"; bGap[13] = 20;
		bPosS[14] = new b2Vec2(181, 420); bPosE[14] = new b2Vec2(218, 435); bOption[14] = "S0100"; bGap[14] = 12;
		bPosS[15] = new b2Vec2(291, 415); bPosE[15] = new b2Vec2(395, 397); bOption[15] = "S1001"; bGap[15] = 8;
		bPosS[16] = new b2Vec2(293, 406); bPosE[16] = new b2Vec2(322, 442); bOption[16] = "S0101"; bGap[16] = 8;
		bPosS[17] = new b2Vec2(309, 440); bPosE[17] = new b2Vec2(401, 421); bOption[17] = "S1001"; bGap[17] = 8;
		bPosS[18] = new b2Vec2(426, 457); bPosE[18] = new b2Vec2(437, 429); bOption[18] = "S1000"; bGap[18] = 5;
		bPosS[19] = new b2Vec2(389, 354); bPosE[19] = new b2Vec2(416, 350); bOption[19] = "S0000"; bGap[19] = 0;
		bPosS[20] = new b2Vec2(299, 318); bPosE[20] = new b2Vec2(450, 296); bOption[20] = "S0000"; bGap[20] = 0;
		bPosS[21] = new b2Vec2(114, 345); bPosE[21] = new b2Vec2(261, 323); bOption[21] = "C0001"; bGap[21] = 8;
		bPosS[22] = new b2Vec2(8, 377); bPosE[22] = new b2Vec2(8, 336); bOption[22] = "S0001"; bGap[22] = 0;
		bPosS[23] = new b2Vec2(25, 268); bPosE[23] = new b2Vec2(210, 320); bOption[23] = "C1000"; bGap[23] = 20;
		bPosS[24] = new b2Vec2(132, 296); bPosE[24] = new b2Vec2(391, 264); bOption[24] = "S1010"; bGap[24] = 20;
		bPosS[25] = new b2Vec2(333, 269); bPosE[25] = new b2Vec2(440, 204); bOption[25] = "S1010"; bGap[25] = 20;
		bPosS[26] = new b2Vec2(0, 217); bPosE[26] = new b2Vec2(51, 223); bOption[26] = "S0001"; bGap[26] = 3;
		bPosS[27] = new b2Vec2(85, 228); bPosE[27] = new b2Vec2(198, 243); bOption[27] = "C1001"; bGap[27] = 10;
		bPosS[28] = new b2Vec2(193, 237); bPosE[28] = new b2Vec2(220, 204); bOption[28] = "S0000"; bGap[28] = 0;
		bPosS[29] = new b2Vec2(275, 222); bPosE[29] = new b2Vec2(363, 203); bOption[29] = "S0001"; bGap[29] = 3;
		bPosS[30] = new b2Vec2(260, 210); bPosE[30] = new b2Vec2(276, 230); bOption[30] = "C0001"; bGap[30] = 7;
		bPosS[31] = new b2Vec2(252, 196); bPosE[31] = new b2Vec2(398, 179); bOption[31] = "C0010"; bGap[31] = 20;
		bPosS[32] = new b2Vec2(444, 207); bPosE[32] = new b2Vec2(444, 185); bOption[32] = "S0000"; bGap[32] = 0;
		bPosS[33] = new b2Vec2(209, 152); bPosE[33] = new b2Vec2(450, 129); bOption[33] = "S0100"; bGap[33] = 20;

		bPosS[34] = new b2Vec2(49, 490); bPosE[34] = new b2Vec2(80, 490); bOption[34] = "S0001"; bGap[34] = 30;

		for ( var i = 0; i < bPosS.length; ++i ) {
			this.addNewBlockS(bPosS[i], bPosE[i], 11, bOption[i], bGap[i]);
		}
		this.addNewBlockS(new b2Vec2(200, 157), new b2Vec2(200, 0), 28, "C1000", 1);
		this.addNewBlockS(new b2Vec2(133, 150), new b2Vec2(133, 0), 9, "C1000", 6);
		this.addNewBlockS(new b2Vec2(124, 150), new b2Vec2(124, 0), 9, "C0100", 6);
		this.addNewBlockS(new b2Vec2(81, 145), new b2Vec2(81, 0), 17, "S1000", 17);
		
		// 障害物の作成②U字
		var bPos = [];
		var bArcStart = [];
		var bArcEnd = [];
		
		bPos[0] = new b2Vec2(418, 592); bArcStart[0] = 0; bArcEnd[0] = 150;
		bPos[1] = new b2Vec2(31, 481);   bArcStart[1] = 0; bArcEnd[1] = 180;
		bPos[2] = new b2Vec2(240, 440); bArcStart[2] = -10; bArcEnd[2] = 140;
		bPos[3] = new b2Vec2(417, 417); bArcStart[3] = -20; bArcEnd[3] = 170;
		bPos[4] = new b2Vec2(278, 313); bArcStart[4] = 10; bArcEnd[4] = 180;
		bPos[5] = new b2Vec2(31, 341); bArcStart[5] = -10; bArcEnd[5] = 180;
		bPos[6] = new b2Vec2(69, 222); bArcStart[6] = 10; bArcEnd[6] = 170;
		bPos[7] = new b2Vec2(238, 218); bArcStart[7] = 30; bArcEnd[7] = 140;
		
		for ( var i = 0; i < bPos.length; ++i ) {
			this.addNewBlockC(bPos[i], 23, bArcStart[i], bArcEnd[i], 5.5);
		}
		
        //Set up sprite

        var mgr = cc.SpriteBatchNode.create(s_coin, 150);
        this.addChild(mgr, 0, TAG_SPRITE_MANAGER);

        // ボールの作成
        //this.addNewCircle(cc.p(screenSize.width / 2 + 100, screenSize.height - 20));
        //this.addNewCircle(cc.p(12, 253));		// 左
        //this.addNewCircle(cc.p(431, 138));	// 右

        this.scheduleUpdate();
    },

///////////////////////////////////////////
// ボールの作成　　　                                   //
///////////////////////////////////////////
    addNewCircle:function (p) {
    
        this.createData();

        //UXLog(L"Add sprite %0.2f x %02.f",p.x,p.y);
        var batch = this.getChildByTag(TAG_SPRITE_MANAGER);

        // ボールの画像を設定する。
        var sprite = cc.Sprite.createWithTexture(batch.getTexture(), cc.rect(0,0, 26, 26));
        batch.addChild(sprite);

        //sprite.setPosition(p.x, p.y);

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.angularDamping=0.4;			// 回転の減衰率
        bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
        bodyDef.userData = sprite;
        
        var circleCount = this.circleBody.length;
        this.circleBody[circleCount] = this.world.CreateBody(bodyDef);

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape(13/PTM_RATIO);
        fixtureDef.density = 1.0;					//密度
        fixtureDef.friction = 0.5;					//摩擦係数
        //fixtureDef.restitution = 0.2;				//反発係数
        this.circleBody[circleCount].CreateFixture(fixtureDef);
    },

///////////////////////////////////////////
// 障害物の作成(U字)　　　                            //
///////////////////////////////////////////    
    addNewBlockC:function (bPos,bR,bArcStart,bArcEnd,bHeight) {
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
            
        // Define the ground body.
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;						//密度
        fixDef.friction = 0.5;						//摩擦係数
        fixDef.restitution = 0.05;				//反発係数
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox( bHeight / PTM_RATIO, 5 / PTM_RATIO);

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        //bodyDef.linearDamping = 0.1;		// 減衰率
        
        var dx;
        var dy;
		
		var blockCount = this.blockBody.length;
		var i = bArcStart;
        while ( i <= bArcEnd ) {
	        dx = bR * Math.cos( i * Math.PI / 180);
	        dy = bR * Math.sin( i * Math.PI / 180);

	        //障害物
	        bodyDef.position.Set(( bPos.x + dx )/ PTM_RATIO, ( bPos.y -dy )/ PTM_RATIO);
	        bodyDef.angle = -i * Math.PI / 180;
			//this.world.CreateBody(bodyDef).CreateFixture(fixDef);
			
			this.blockBody[blockCount] = this.world.CreateBody(bodyDef);
			this.blockBody[blockCount].CreateFixture(fixDef);
			
			i = i + 15;
		}
	},
	
///////////////////////////////////////////
// 障害物の作成(棒状) 　　                             //
///////////////////////////////////////////    
    addNewBlockS:function (bStart,bEnd,bHeight,bOption, bGap) {
        var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
            
        // Define the ground body.
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;						//密度
        fixDef.friction = 0.2;						//摩擦係数
        fixDef.restitution = 0.05;				//反発係数
        fixDef.shape = new b2PolygonShape;

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        //bodyDef.linearDamping = 0.5;		// 減衰率

        //障害物
        bodyDef.position.Set(bStart.x / PTM_RATIO, bStart.y / PTM_RATIO);
        
        //位置を計算する
        var px = bEnd.x - bStart.x;
        var py = bEnd.y - bStart.y;
        var pDistance = Math.sqrt(Math.pow(px,2) + Math.pow(py,2));
        
        var dx = (bHeight/2) * py /pDistance;
        var dy = (bHeight/2) * px /pDistance;
        var dh = new b2Vec2(dx, dy);

		var topL = [ 0 - dh.x, 0 + dh.y ];
		var btmL = [ 0 + dh.x, 0 - dh.y ];
		var topR = [ px - dh.x, py + dh.y ];
		var btmR = [ px + dh.x, py - dh.y ];
		var addPoint = [];

		// 先端を尖らす
		var bGapX = bGap*px/pDistance;
		var bGapY = bGap*py/pDistance;
				
		if(bOption.substr(1,1) == "1"){
			// 左上を縮める
			topL = [ 0 - dh.x + bGapX, 0 + dh.y + bGapY ];
			addPoint[0] = [[ 0 - dh.x*0.6 + bGapX*0.6, 0 + dh.y*0.6 + bGapY*0.6 ],
								[ 0 - dh.x*0.1 + bGapX*0.3, 0 + dh.y*0.1 + bGapY*0.3 ],
								[ 0 - dh.x*(-0.5) + bGapX*0.1, 0 + dh.y*(-0.5) + bGapY*0.1 ]];
		}
		if(bOption.substr(2,1) == "1"){
			// 左下を縮める
			btmL = [ 0 + dh.x+ bGapX, 0 - dh.y + bGapY ];
			addPoint[1] = [[ 0 + dh.x*(-0.5) + bGapX*0.1, 0 - dh.y*(-0.5) + bGapY*0.1 ],
								[ 0 + dh.x*0.1 + bGapX*0.3, 0 - dh.y*0.1 + bGapY*0.3 ],
								[ 0 + dh.x*0.6 + bGapX*0.6, 0 - dh.y*0.6 + bGapY*0.6 ]];			
		}
		if(bOption.substr(3,1) == "1"){
			// 右下を縮める
			btmR = [ px + dh.x - bGapX, py - dh.y -bGapY ];
			addPoint[2] = [[ px + dh.x*0.6 - bGapX*0.6, py - dh.y*0.6 - bGapY*0.6 ],
								[ px + dh.x*0.1 - bGapX*0.3, py - dh.y*0.1 - bGapY*0.3 ],
								[ px + dh.x*(-0.5) - bGapX*0.1, py - dh.y*(-0.5) - bGapY*0.1 ]];			
		}
		if(bOption.substr(4,1) == "1"){
			// 右上を縮める
			topR = [ px - dh.x - bGapX, py + dh.y -bGapY ];
			addPoint[3] = [[ px - dh.x*(-0.5) - bGapX*0.1, py + dh.y*(-0.5) - bGapY*0.1 ],
								[ px - dh.x*0.1 - bGapX*0.3, py + dh.y*0.1 - bGapY*0.3 ],
								[ px - dh.x*0.6 - bGapX*0.6, py + dh.y*0.6 - bGapY*0.6 ]];			
		}

		var v = [ topL, btmL, btmR, topR ];
		
		var vecs = [];
		var j = 0;
		
		for ( var i = 0; i < v.length; i++) {
			var itmp = new Box2D.Common.Math.b2Vec2();
		    itmp.Set(v[i][0] / PTM_RATIO, v[i][1] / PTM_RATIO);
		    if(bOption.substr(0,1) == "C"){
			    // 丸みのある先端にする
			    if( i==0 || i == 2){
				    vecs[j] = itmp;
				    j++;
				}
		    	if(bOption.substr(i+1,1) == "1"){
		    		for ( var k = 0; k < addPoint[i].length; k++) {
		    			var ktmp = new Box2D.Common.Math.b2Vec2();
			    		ktmp.Set(addPoint[i][k][0] / PTM_RATIO, addPoint[i][k][1] / PTM_RATIO);
				    	vecs[j] = ktmp;
				    	j++;		    		
			    	}
		    	}
			    if( i==1 || i == 3){
				    vecs[j] = itmp;
				    j++;
				}
			}else{
			    // 尖った先端にする
			    vecs[j] = itmp;
			    j++;
			}
		}
		fixDef.shape.SetAsArray(vecs, vecs.length);
		this.world.CreateBody(bodyDef).CreateFixture(fixDef);
	},
	
///////////////////////////////////////////
// レバーの回転　　　                                   //
///////////////////////////////////////////
    rotateLever:function (p) {
        var position = this.leverL.getPosition();
        var dx = p.x - position.x;
        var dy = p.y - position.y;
        // レバーの角度
        var angle = cc.RADIANS_TO_DEGREES(Math.atan2(dx , dy));
        if(angle>ROTATION_MAX_R){
        	angle = ROTATION_MAX_R;
        }else if(angle <ROTATION_MAX_L){
        	angle = ROTATION_MAX_L;
        }
		this.leverL.setRotation(angle + ROTATION_DEFAULT);
    },
///////////////////////////////////////////
// ゲームオーバー判定　                                //
///////////////////////////////////////////
    checkGameover:function () {
        for (var i = 0; i < this.blockBody.length; i++) {
            var blockBody = this.blockBody[i];
			for (var j = 0; j < this.circleBody.length; j++) {
	            var circleBody = this.circleBody[j];
	            var cPos = circleBody.GetPosition();
	            var bPos = blockBody.GetPosition();
	            var distance = cc.pDistance(cPos, bPos);

    	        if (distance < 26 / PTM_RATIO || cPos.y < -100 / PTM_RATIO) {
    	        	if(cPos.y < -100 / PTM_RATIO && cPos.x > 80 / PTM_RATIO && cPos.x < 130 / PTM_RATIO && !this.gameover){
						this.gameover = true;
						
						// データ更新
						this.updateData(2);
						
			    	    // 結果画面へ遷移する
			    	    var transition = cc.TransitionFade.create(0, new ResultScene());
			        	cc.Director.getInstance().replaceScene(transition);        	
    	        	}
					if(!this.gameover){
						var sprite = circleBody.GetUserData();
						var sp = this.getChildByTag(TAG_SPRITE_MANAGER);

						this.gameover = true;
						sp.removeChild(sprite);
        		        this.world.DestroyBody(circleBody);

				        // データ更新
				        this.updateData(1);
				        
				        // サウンド出力
				        var audioEngine = cc.AudioEngine.getInstance();
			    	    audioEngine.playEffect(s_fall);

        		        // 初期画面に戻る
			    	    var transition = cc.TransitionFade.create(0, new ShinkansenScene());
			    	    //var transition = cc.TransitionFade.create(0, new ResultScene());
			        	cc.Director.getInstance().replaceScene(transition);
        	        }
        	        
				}
			}
		}
    },
///////////////////////////////////////////
//  データ作成                                              //
///////////////////////////////////////////
    createData:function () {
    	var xhr = new XMLHttpRequest();
    	var game_id = "id=000001";
    	var url = "../api/game_start.php";
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
		    	    var transition = cc.TransitionFade.create(0, new ShinkansenScene());
		        	cc.Director.getInstance().replaceScene(transition);
	            }
	        }
		}
    },
///////////////////////////////////////////
//  データ更新                                              //
///////////////////////////////////////////
    updateData:function (g_status) {
    	var xhr = new XMLHttpRequest();
    	var game_id = "id=000001&status=" + g_status;
    	var url = "../api/game_end.php";
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
		    	    var transition = cc.TransitionFade.create(0, new ShinkansenScene());
		        	cc.Director.getInstance().replaceScene(transition);
	            }
	        }
		}
    },
///////////////////////////////////////////
//  デバッグ表示の準備                                   //
///////////////////////////////////////////
    setBox2dDebug:function () {
		var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(document.getElementById("debugDraw").getContext("2d"));
		debugDraw.SetDrawScale(PTM_RATIO);
		debugDraw.SetFillAlpha(0.5);
		debugDraw.SetAlpha(1);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.world.SetDebugDraw(debugDraw);    
    },
///////////////////////////////////////////
//  画面更新　　　                                         //
///////////////////////////////////////////
    update:function (dt) {
        //It is recommended that a fixed time step is used with Box2D for stability
        //of the simulation, however, we are using a variable time step here.
        //You need to make an informed choice, the following URL is useful
        //http://gafferongames.com/game-physics/fix-your-timestep/
        
        // デバッグ表示
        //this.world.DrawDebugData(); 

        var velocityIterations = 8;
        var positionIterations = 1;

        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        this.world.Step(dt, velocityIterations, positionIterations);

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
                myActor.setPosition(b.GetPosition().x * PTM_RATIO, b.GetPosition().y * PTM_RATIO);
                myActor.setRotation(-1 * cc.RADIANS_TO_DEGREES(b.GetAngle()));
                //console.log(b.GetAngle());
            }
        }
        
        var circleCount = this.circleBody.length;
        
        if(circleCount !=0){
	        // レバーの表示/非表示の切り替え
	        var circlePosition = this.circleBody[0].GetPosition();
	        var screenSize = cc.Director.getInstance().getWinSize();
	        var visibleZone = 0.02 * screenSize.width/PTM_RATIO;
	        var circleAngVec = this.circleBody[0].GetAngularVelocity();	// 角速度
	        var circleYVec = this.circleBody[0].GetLinearVelocity().y;		// 速度(Y方向)
	        
	        if( circlePosition.x < visibleZone && Math.abs(circleAngVec) < 0.5){
	        	//cc.log(circleYVec);
	        	//左向きレバーを表示する設定
	        	this.leverL.setVisible(true);
	        	this.leverL.setScale(1, 1);
	        	ROTATION_MAX_R =-25;
	        	ROTATION_MAX_L = -105;
	        	ROTATION_DEFAULT=25;
	        }else if(circlePosition.x > screenSize.width/PTM_RATIO - visibleZone && Math.abs(circleAngVec) < 0.5){
	        	//右向きレバーを表示する設定
	        	this.leverL.setVisible(true);
	        	this.leverL.setScale(-1, 1);
	        	ROTATION_MAX_R =105;
	        	ROTATION_MAX_L =25;
	        	ROTATION_DEFAULT = -25;
	        }else{
	        	this.leverL.setVisible(false);
	        }
	        
	        // レバーの位置の切り替え
	        if(circlePosition.y < screenSize.height/(PTM_RATIO * 2)){
	        	this.leverL.setPosition(cc.p(screenSize.width / 2, 2 * screenSize.height / 3));
	        }else{
	        	this.leverL.setPosition(cc.p(screenSize.width / 2, screenSize.height / 3));
	        }
	        
	        // ゲームオーバー判定
	        if(circleAngVec == 0 || circlePosition.y < -100/PTM_RATIO){
		        this.checkGameover();
			}
		}
        
    },
    
///////////////////////////////////////////
//  画面タップ時の処理　　                            //
///////////////////////////////////////////
    onTouchesBegan:function(touches){
        var touch = touches[0];
        var circleCount = this.circleBody.length;
        var screenSize = cc.Director.getInstance().getWinSize();
                
        this.touched = touch.getLocation();
        //cc.log(this.touched);
        
        if(circleCount == 0){
			// ボールの作成
        	if(this.touched.y >screenSize.height - 200 && (this.touched.x > screenSize.width* 2 / 3 && this.touched.x < screenSize.width -100)){
		        this.addNewCircle(cc.p(screenSize.width / 2 + 100, screenSize.height - 20));
		        //this.addNewCircle(cc.p(431, 138));	// 右
		        this.arrowR.setVisible(false);
		        this.arrowR.stopAllActions();
			}
		}else{
	        // レバーを回転させる。
    	    this.rotateLever(this.touched);		
		}

    },
    onTouchesMoved:function (touches, event) {
        var touch = touches[0];
        this.touched = touch.getLocation();
        // レバーを回転させる。
        this.rotateLever(this.touched);
    },
    onTouchesEnded:function (touches, event) {
        this.touched = null;
        var angle = this.leverL.getRotation();
        //var k =0.132;
        var k =0.17;
        var F = k * angle;
        // 初期位置に戻す。
        this.leverL.setRotation(0);
        
        if( this.leverL.isVisible() && F !=0){
        	var circlePosition = this.circleBody[0].GetPosition();
	        // ボールをはじく
    	    //var flickPower = new Box2D.Common.Math.b2Vec2((-F)/PTM_RATIO,0.01/PTM_RATIO);
    	    var flickPower = new Box2D.Common.Math.b2Vec2((-F)/PTM_RATIO,0);
        	this.circleBody[0].ApplyImpulse(flickPower,circlePosition);
        	
	        // サウンド出力
	        var audioEngine = cc.AudioEngine.getInstance();
    	    audioEngine.playEffect(s_flick);

        }
    },

    //CREATE_NODE(Box2DTestLayer);
});

var ShinkansenScene = cc.Scene.extend({
    onEnter:function () {
    	this._super();
        var layer = new Shinkansen();
        this.addChild(layer);
    }
});
