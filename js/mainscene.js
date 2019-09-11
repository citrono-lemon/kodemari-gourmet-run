var MainScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function MainScene () {
        Phaser.Scene.call(this, { key: 'mainscene' });
    },
    preload: function() {
        console.log('preload in MainScene. ');
        this.canvas = this.sys.game.canvas;
        /*
        this.objs = {empty: 0,
                    ground: 1,
                    ground_top: 2
                };
                */
        this.objs = {bgs:{}};
        this.info = {order: 0,
                    score: 0
                };
        this.stageMap = [];
    },
    create: function() {
        console.log('MainScene. ');
        this.camera = this.cameras.main;
        this.camera.fadeIn(300);
        // 背景
        
//        this.add.image(this.canvas.width / 2, this.canvas.height / 2, 'background') .setScale(2.0);
        this.objs.bgs.bg4 = this.add.tileSprite(0, 0, cell.s * cell.xLen, cell.s * cell.yLen, 'bg4')
        .setOrigin(0, 0)
        .setScale(2)
        .setScrollFactor(0);
        this.objs.bgs.bg3 = this.add.tileSprite(0, 0, cell.s * cell.xLen, cell.s * cell.yLen, 'bg3')
        .setOrigin(0, 0)
        .setScale(2)
        .setScrollFactor(0);
        this.objs.bgs.bg2 = this.add.tileSprite(0, cell.s/2, cell.s * cell.xLen, cell.s * (cell.yLen), 'bg2')
        .setOrigin(0, 0)
        .setScale(2)
        .setScrollFactor(0);
        /*
        this.objs.bgs.bg1 = this.add.tileSprite(0, 0, cell.s * cell.xLen, cell.s * cell.yLen, 'bg1')
        .setOrigin(0, 0)
        .setScale(2)
        .setScrollFactor(0);
        */

        // パーティクルエフェクトの登録
        this.effects = {};

        let landing = this.add.particles('particle1');
        this.effects.landing = landing.createEmitter({
            quantity: 15,
            scale: {start: 2.0, end: 0},
            on: false,
            speed: 200,
            gravity: {x: 0, y:100},
            lifespan: 200,
        });
//        this.effects.landing.setDepth(100)

        this.objs.dummy = {array: []};        // オーダーする専用
        this.objs.ground = {group: this.physics.add.staticGroup(), array: []};
        this.objs.enemy = {};
        this.objs.enemy.slag = {group: this.physics.add.group(), array: []};
        this.objs.items = {group: this.physics.add.staticGroup(), array: []}
        this.objs.items.getFrame = function() { 
            let array = [7,11,32,38,40,47,48,51,53,62,67,73,75,85,88,91,94,96,102,110,111,117,118,121,128,138,140,152,154,174,176,178,180,182,184,186,188,191,199,212];
            return array[Math.floor(Math.random() * array.length)];
        }

//        this.add.image( 0, 0, 'tile').setOrigin(0 ,0).setAlpha(0.5);
//        this.add.image(cell.s * 3 / 2, cell.s * 3 / 2 , 'tile');
//        this.player2 = this.add.spine(0, 0, 'pl2', 'Walk');
//        console.log(this.player2);
//        this.dddd = this.add.spine(0, 0, 'donuts');

        this.player = this.physics.add.sprite(80, 250, 'player',0).setScale(1);
        this.player.speed = 300;
        this.player.lastSector = 0;
        this.environment = {time: 0, score: 0, gameSpeed: 1.0, speedUpFlag: 0};
        console.log(this.environment)

//        this.spineboy = this.add.spine(150, 250, 'kodemari', 'Run');

        this.anims.create({
                key: 'player-run',
//                frames: this.anims.generateFrameNumbers('player', {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]}),
                frames: this.anims.generateFrameNumbers('player', {frames:[10,11,12,13,14,15,16,17,18,19,
                                                                            10,11,12,13,14,15,16,19]}),
                frameRate: 20,
                repeat: -1,
        });
        this.anims.create({
            key: 'player-jump',
//                frames: this.anims.generateFrameNumbers('player', {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]}),
            frames: this.anims.generateFrameNumbers('player', {frames:[5,6,7,8,9]}),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'player-jump2',
//                frames: this.anims.generateFrameNumbers('player', {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]}),
            frames: this.anims.generateFrameNumbers('player', {frames:[0,1,2,3,4]}),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
                key: 'slag-anim',
                frames: this.anims.generateFrameNumbers('enemy-slag', {frames:[0,1,2,1]}),
                frameRate: 8,
                repeat: -1
        });

        console.log(this.textures.get('foods'));
//        this.player.body.center.x = 0;
        this.player.setSize(20, 70, true);
        this.player.body.setOffset(20, 20);
        this.player.hpMax = 3;
        this.player.hp = this.player.hpMax;

        this.player.anims.play('player-run', true);
        this.player.gameState = {now: 2, stand: 1, jump:2, jump2:3, damage: 4, death: 5};
        this.player.setMaxVelocity(this.player.speed * this.environment.gameSpeed, 999999)
        this.player.setVelocityX(this.player.speed * this.environment.gameSpeed);
        this.player.body.setAcceleration(300,0);
        this.player.distanceToCameraX = cell.s * 3;

//        this.player.body.setOffset(20,40);
//        this.player.body.setSize(20,40);
//        this.audio = {};
        this.audio = {music: { }};
        this.audio.jump = this.sound.add('se-jump');
        this.audio.jump2 = this.sound.add('se-jump2');
        this.audio.itemget = this.sound.add('se-itemget');
        this.audio.damage = this.sound.add('se-damage');
        this.audio.music.bgm2 = this.sound.add('bgm-2', {volume: 0.2, rate: 1.0, loop: true})
        console.log(this.audio.music.bgm2)
        console.log(this.audio.music.seek);
        this.audio.music.bgm2.play({seek: environment.seek})


        // マップを作るんだ～（1回目）
        this.generateField(this.info.order++);
        this.generateField(this.info.order++);

        //
        // 子リジョン
        //
        // 床とプレイヤー
        this.physics.add.collider(this.objs.ground.group, this.player, function(gnd, plyr){
            if (this.player.gameState.now != this.player.gameState.death
            && this.player.gameState.now != this.player.gameState.stand) {
                this.player.gameState.now = this.player.gameState.stand;
                this.player.anims.play('player-run', true);
//                this.player.body.setOffset(20, 20);
                this.effects.landing.setPosition(this.player.x, this.player.y + 40);
                this.effects.landing.explode();
            }
//            this.onCollideGround();
        }, null, this);
        // プレイヤーとアイテム
        this.physics.add.overlap(this.objs.items.group, this.player, function(plyr, item){
            this.effects.landing.setPosition(item.x, item.y);
            this.effects.landing.explode();
            this.audio.itemget.play();
            this.tweens.add({
                targets: item,
                alpha: { from: 1, to: 0 },

                ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
            item.body.destroy();
            this.environment.score += 300;
            this.environment.speedUpFlag += 300;

        }, null, this);
        // プレイやｔ－と敵
        this.physics.add.overlap(this.objs.enemy.slag.group, this.player, function(plyr, enmy){
            this.tweens.add({
                targets: enmy,
                alpha: { from: 1, to: 0 },

                ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false // ハイパーヨーヨー？なにこれ
            });
            plyr.body.setVelocity(-150, -300);
            this.tweens.add({
                targets: enmy,
                alpha: { from: 1, to: 0 },

                ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 100,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
            if (this.player.hp > 1 ) {
                this.tweens.add({
                    targets: plyr,
                    alpha: 0.4,
                    ease: 'Cubic.easeOut',  
                    duration: 60,
                    repeat: 2,
                    yoyo: true
                  });
                this.ui.hp[this.player.hp - 1].visible = false;
                this.player.hp -= 1;
            }
            else {
//                       this.scene.start('title');
            }
            enmy.body.destroy();
            this.audio.damage.play();
        }, null, this);
        // 敵と床（いらんだろ）
        this.physics.add.collider(this.objs.ground.group, this.objs.enemy.slag.group, function(gnd, slag){
        }, null, this);

        //
        // タッチイベントの処理
        //
        this.input.on('pointerdown', function(){
            if (this.player.gameState.now == this.player.gameState.stand) {
                this.audio.jump.play();
                this.player.setVelocityY(-600);
                this.player.anims.play('player-jump', true);
//                console.log(this.player)
//                this.player.height = 50
                //                this.player.anims.setOffset(0, -200);
                //                this.player.setSize(20, 50, true);
//                this.player.body.setOffset(20, 20);
                this.player.gameState.now = this.player.gameState.jump;
                    }
            else if (this.player.gameState.now == this.player.gameState.jump) {
                this.audio.jump2.play();
                this.player.setVelocityY(-500);
                this.player.anims.play('player-jump2', true);
                this.player.gameState.now = this.player.gameState.jump2;
            }
        }, this);

        this.camera.startFollow(this.player, true, 1, 0, -cell.s * (cell.xLen / 2 - 3), cell.s * 2);

        ///
        // UI
        //
        this.ui = {};
        this.ui.scoreSprite = this.add.sprite(520, 5, 'UI-score')
        .setOrigin(0, 0)
        .setScale(1)
        this.ui.scoreSprite.setScrollFactor(0);
        this.ui.scoreSprite.fixedToCamera = true;
        this.ui.hp = [];

        for (let i = 0; i < this.player.hpMax; i ++) {
            this.ui.hp[i] = this.add.sprite(5 + i * 35, 15, 'UI-hp', 1)
            .setOrigin(0, 0)
            .setScale(0.5);
            this.ui.hp[i].setScrollFactor(0);
            this.ui.hp[i].fixedToCamera = true;

            this.ui.hp[i].cover = this.add.sprite(5 + i * 35, 15, 'UI-hp', 0)
            .setOrigin(0, 0)
            .setScale(0.5);
            this.ui.hp[i].cover.setScrollFactor(0);
            this.ui.hp[i].cover.fixedToCamera = true;
        }
        // なんで右寄せにするために中央寄せにしてんねんこれ
        this.ui.score = this.make.bitmapText({
            x: 625, y: 90, text: '0123456789', font: 'UI-score-font', size: false, align: 0, add: true,
        }).setOrigin(1).setCenterAlign();
        this.ui.score.setScrollFactor(0);
//        this.ui.score


    //        this.ui.scoreSprite.cameraOffset.setTo(200, 500);
        this.objs.enemy.slag.group.create

        console.log(50000 * (1.0 + 0.1 * this.environment.gameSpeed - 0.9));
    },

    update: function() {
        this.ui.score.text = String(this.environment.score).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
//        this.ui.score.text = this.environment.score;
        if (this.player.x / (cell.s * 1) > this.player.lastSector ) {
            this.environment.score += 10 * (Math.floor(this.player.x / (cell.s)) - (this.player.lastSector - 1) );
            this.environment.speedUpFlag += 10;
            this.player.lastSector += 1;
        }
        // x(1 + 0.1p + a) = 5000 + 5000p)
        // x = 50000, a = -0.9
        if (this.environment.speedUpFlag > 5000) {
            this.environment.gameSpeed += 0.1;
            this.player.setMaxVelocity(this.player.speed * this.environment.gameSpeed, 999999)
            this.environment.speedUpFlag = 0;

            console.log(this.environment.score);
        }

//        this.objs.bgs.bg4.tilePositionX = this.camera.scrollX * .3;
        this.objs.bgs.bg3.tilePositionX = this.camera.scrollX * 0.16;
        this.objs.bgs.bg2.tilePositionX = this.camera.scrollX * 0.22;
//        this.objs.bgs.bg1.tilePositionX = this.camera.scrollX * 0.3;
//        this.camera.scrollX = this.player.x - this.player.distanceToCameraX;

//        this.objs.enemy.slag.array.forEach(function(v) {
//            f.
//        });

        if (this.objs.dummy.array[0] < this.camera.scrollX) {
            this.generateField(this.info.order++);
            this.objs.dummy.array.shift();
//            console.log(this.objs.ground.array[0]);
        }
        // 画面外に出たオブジェの削除処理
        if (this.objs.enemy.slag.array.length > 0 &&
            this.objs.enemy.slag.array[0].x < this.camera.scrollX - cell.s * 4) {
            this.objs.enemy.slag.array[0].destroy();
            this.objs.enemy.slag.array.shift();
//            console.log(this.objs.ground.array[0]);
        }
        if (this.objs.ground.array.length > 0 &&
            this.objs.ground.array[0].x < this.camera.scrollX - cell.s * 4) {
            this.objs.ground.array[0].destroy();
            this.objs.ground.array.shift();
//            console.log(this.objs.ground.array[0]);
        }
        if (this.objs.items.array.length > 0 &&
            this.objs.items.array[0].x < this.camera.scrollX - cell.s * 4) {
            this.objs.items.array[0].destroy();
            this.objs.items.array.shift();
//            console.log(this.objs.ground.array[0]);
        }
//        this.camera.setPosition(-this.player.x, 0);


//        console.log(this.player);
            this.environment.time += 1;

    },

    onCollideGround: function() {
        console.log(this.player);

    },

    // マップフィールドを生成
    // マルコフ状態過程とか考えるの面倒空佐いのでいい感じの見た目を作るために一気に全マス分を生成してくれるすごいゴリ押し奴
    // orderNumが増えるほど難化したマップの生成を行う
    // 当初と比べてだいぶん密結合になったけどいいよね別に・・・
    generateField: function(orderNum) {
//        console.log("Order submit :" + this.info.order);

        let topLeft = orderNum *  cell.xLen;
        // 最初のオーダーは空だけつくる
        if (orderNum == 0) {
            this.objs.dummy.array.push(cell.s * (cell.xLen - 2 + 0.5));
            for (i = 0; i < cell.xLen; i ++) {
                this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (i + 0.5), cell.s * (cell.yLen - 2 + 0.5), 'ground-top'));
                this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (i + 0.5), cell.s * (cell.yLen - 1 + 0.5), 'ground'));
            }
        }
        else {
            this.objs.dummy.array.push(cell.s * (topLeft + cell.xLen - 2 + 0.5));
            for (i = 0; i < cell.xLen; i ++) {
                this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (topLeft + i + 0.5), cell.s * (cell.yLen - 2 + 0.5), 'ground-top'));
                this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (topLeft + i + 0.5), cell.s * (cell.yLen - 1 + 0.5), 'ground'));
            }
            let tmp = this.objs.enemy.slag.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 4 + 0.5), 'enemy-slag');
            tmp.anims.play('slag-anim', true);
            tmp.setVelocityX(-100);
//            tmp.body.center = Phaser.Math.vector2({x: 10, y: tmp.center.y});
            tmp.setScale(1.5)
            tmp.body.center.x = 0;
            tmp.setSize(10, 20, true);
            tmp.body.setOffset(10, 25);
            this.objs.enemy.slag.array.push(tmp);
//            this.objs.enemy.slag.array.push(this.objs.enemy.slag.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 4 + 0.5), 'enemy-slag').anims.play('slag-anim', true));
//            console.log(tmp);

            let item = this.objs.items.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 8 + 0.5), 'foods', this.objs.items.getFrame()).setScale(1.5);
            let item2 = this.objs.items.group.create(cell.s * (topLeft + 6 + 0.5), cell.s * (cell.yLen - 8 + 0.5), 'foods', item.frame.name).setScale(1.5);
//            item.frame.name でフレーム名を取得できるからコピペ可能だ！
//            console.log(item);

        }

        /*
        let field = [];
        if (orderNum == 0) {
            for (i = 0; i < cell.xLen; i ++) {
                var tmp = new Array(cell.yLen);
                tmp.fill({name: 'empty'});
//                tmp[cell.yLen - 2] = {id: this.objs.ground_top, x: cell.s * (i + 0.5), y: cell.s * (cell.yLen - 2 + 0.5), name: 'ground_top'};
//                tmp[cell.yLen - 1] = {id: this.objs.ground, x: cell.s * (i + 0.5), y: cell.s * (cell.yLen - 1 + 0.5), name: 'ground'};
                tmp[cell.yLen - 2] = {x: cell.s * (i + 0.5), y: cell.s * (cell.yLen - 2 + 0.5), name: 'ground-top'};
                tmp[cell.yLen - 1] = {x: cell.s * (i + 0.5), y: cell.s * (cell.yLen - 1 + 0.5), name: 'ground'};
                field.push(tmp);
            }
        }
*/
//        return field;
    }
});
