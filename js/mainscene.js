var MainScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function MainScene () {
        Phaser.Scene.call(this, { key: 'mainscene' });
    },
    preload: function() {
        environment.rank = "";
        this.canvas = this.sys.game.canvas;
        this.objs = {bgs:{}};
        this.info = {order: 0,
                    score: 0
                };
        this.stageMap = [];
    },
    create: function() {
        this.camera = this.cameras.main;
        this.camera.fadeIn(300);

        // 背景
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
       this.objs.bgs.bgc2 = this.add.tileSprite(0, -cell.s/2, cell.s * cell.xLen * 1.5, cell.s * (cell.yLen), 'bgc2')
       .setOrigin(0, 0)
       .setScale(2)
       .setScrollFactor(0);
       this.objs.bgs.bgc1 = this.add.tileSprite(0, -cell.s/2, cell.s * cell.xLen * 1.5, cell.s * (cell.yLen), 'bgc1')
       .setOrigin(0, 0)
       .setScale(2)
       .setScrollFactor(0);

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


        this.objs.dummy = {array: []};        // オーダーする専用
        this.objs.ground = {group: this.physics.add.staticGroup(), array: []};
        this.objs.enemy = {};
        this.objs.enemy.slag = {group: this.physics.add.group(), array: []};
        this.objs.enemy.fly = {group: this.physics.add.group(), array: []};
        this.objs.enemy.enemyQueue = ["empty", "empty"];
        this.objs.items = {group: this.physics.add.staticGroup(), array: []}
        this.objs.items.getFrame = function() { 
            let array = [7,11,32,38,40,47,48,51,53,62,67,73,75,85,88,91,94,96,102,110,111,117,118,121,128,138,140,152,154,174,176,178,180,182,184,186,188,191,199,212];
            return array[Math.floor(Math.random() * array.length)];
        }


        this.player = this.physics.add.sprite(80, 250, 'player',0).setScale(1);
        this.player.speed = 300;
        this.player.lastSector = 0;
        this.environment = {time: 0, score: 0, itemscore: 0, gameSpeed: 1.0, speedUpFlag: 0, startFlag: false, order: 0, gameoverFlag: false};

        this.player.animRun = this.anims.create({
                key: 'player-run',
                frames: this.anims.generateFrameNumbers('player', {frames:[10,11,12,13,14,15,16,17,18,19,
                                                                            10,11,12,13,14,15,16,19]}),
                frameRate: 20,
                repeat: -1,
        });
        this.anims.create({
            key: 'player-jump',
            frames: this.anims.generateFrameNumbers('player', {frames:[5,6,7,8,9]}),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'player-jump2',
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
        this.anims.create({
            key: 'fly-anim',
            frames: this.anims.generateFrameNumbers('enemy-fly', {frames:[0,1,2,1]}),
            frameRate: 12,
            repeat: -1
    });
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


        this.audio = {music: { }};
        this.audio.jump = this.sound.add('se-jump', {mute: environment.mute});
        this.audio.jump2 = this.sound.add('se-jump2', {mute: environment.mute});
        this.audio.itemget = this.sound.add('se-itemget', {mute: environment.mute});
        this.audio.damage = this.sound.add('se-damage', {mute: environment.mute});
        this.audio.countdown = this.sound.add('se-countdown', {mute: environment.mute})
        this.audio.whistle = this.sound.add('se-whistle', {mute: environment.mute});
        this.audio.enter = this.sound.add('se-enter', {mute: environment.mute});
        this.audio.resultshow1 = this.sound.add('se-resultshow1', {mute: environment.mute});
        this.audio.resultshow2 = this.sound.add('se-resultshow2', {mute: environment.mute});
        environment.music.bgm2 = this.sound.add('bgm-2', {volume: environment.music.volume, mute: environment.mute, rate: 1.0, loop: true})


        // マップを作るんだ～（1回目）
        this.generateField(this.environment.order++);
        this.generateField(this.environment.order++);

        //
        // 子リジョン
        //
        // 床とプレイヤー
        this.physics.add.collider(this.objs.ground.group, this.player, function(gnd, plyr){
            if (this.player.gameState.now != this.player.gameState.death
            && this.player.gameState.now != this.player.gameState.stand) {
                this.player.gameState.now = this.player.gameState.stand;
                this.player.anims.play('player-run', true);
                this.effects.landing.setPosition(this.player.x, this.player.y + 40);
                this.effects.landing.explode();
            }
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
            item.body.y = -100;
//            item.body.destroy(); // なぜかエラーになる？？？
            this.environment.score += 300;
            this.environment.itemscore += 1;
            this.environment.speedUpFlag += 300;
    }, null, this);
        
        function collisionWithEnemy(plyr, enmy){
            this.camera.shake(100);
//            this.camera.flash(0xfffffff, 500);
            this.camera.flash(100, 250, 80, 140, true);
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
                this.camera.stopFollow();
                this.tweens.add({
                    targets: plyr,
                    alpha: 0.4,
                    ease: 'Cubic.easeOut',
                    duration: 60,
                    repeat: 10,
                    yoyo: true
                  });
                this.ui.hp[this.player.hp - 1].visible = false;
                this.player.hp -= 1;
                this.player.body.destroy();
                this.tweens.add({
                    targets: plyr,
                    y: "+= 300",
                    x: "-= 50",
                    ease: 'Cubic.Out',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 600,
                    repeat: 0,            // -1: infinity
                    yoyo: false
                });
    //                       this.scene.start('title');
            }
            enmy.body.destroy();
            this.audio.damage.play();
        }
        // プレイやｔ－と敵


        this.physics.add.overlap(this.objs.enemy.slag.group, this.player, collisionWithEnemy, null, this);
        this.physics.add.overlap(this.objs.enemy.fly.group, this.player, collisionWithEnemy, null, this);
        // 敵と床（いらんだろ）
        this.physics.add.collider(this.objs.ground.group, this.objs.enemy.slag.group, function(gnd, slag){
        }, null, this);

        this.encrint = false;
        //
        // タッチイベントの処理
        //
        this.input.on('pointerdown', function(pointer){
            if ((pointer.y < 60 && (pointer.x > 220 && pointer.x < 410))
            || this.environment.gameoverFlag) {
                return;
            }
            if (this.player.gameState.now == this.player.gameState.stand) {
                this.audio.jump.play();
                this.player.setVelocityY(-600);
                this.player.anims.play('player-jump', true);
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
        this.ui.retireButton = this.add.sprite(cell.s * cell.xLen / 2,0, 'UI-retire')
        .setOrigin(0.5,0)
        .setScrollFactor(0)
        .setAlpha(0.7);
        this.ui.retireButton.isRetire = false;
        this.ui.retireButton.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
            if (!this.environment.startFlag || this.environment.gameoverFlag) {
                return;
            }
            this.camera.shake(100);
            this.camera.flash(100, 250, 80, 140, true);
            this.player.body.setVelocity(-150, -300);
            this.player.hp = 0;
            this.camera.stopFollow();
            this.ui.retireButton.isRetire = true;
            this.tweens.add({
                targets: this.player,
                alpha: 0.4,
                ease: 'Cubic.easeOut',
                duration: 60,
                repeat: 10,
                yoyo: true
            });
            for (i = 0; i < this.player.hpMax; i++) {
                this.ui.hp[i].visible = false;
            }
            this.player.body.destroy();
            this.tweens.add({
                alpha: 0,
                targets: this.player,
                y: "+= 300",
                x: "-= 50",
                ease: 'Cubic.Out',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 600,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
            this.audio.damage.play();
        }, this);
        this.ui.hiscore = this.add.text(620, 0, "HI-Score: " + String(environment.hiscore).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'right',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(1,0).setScrollFactor(0).setDepth(10);

        this.ui.scoreSprite = this.add.sprite(520, 30, 'UI-score')
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
            x: 625, y: 115, text: '0123456789', font: 'UI-score-font', size: false, align: 0, add: true,
        }).setOrigin(1).setCenterAlign();
        this.ui.score.setScrollFactor(0);


        this.objs.enemy.slag.group.create
        this.objs.enemy.fly.group.create


        this.ui.countdown = [];
        for (i = 0; i < 3; i++) {
            this.ui.countdown[i] = this.add.sprite(330, 180, "countdown", i).setAlpha(0).setScrollFactor(0)
        }
        this.ui.countgo = this.add.sprite(330, 180, 'go').setAlpha(0).setScrollFactor(0);
        this.ui.countgo2 = this.add.sprite(330, 180, 'go').setAlpha(0).setScrollFactor(0);

        // カウントダウン（ながい）
        this.ui.countdownTimer = this.time.addEvent({
            delay: 600,
            callback: function() {
                if (this.ui.countdownTimer.getRepeatCount() > 0) {
                    this.tweens.timeline({
                        targets: this.ui.countdown[3-this.ui.countdownTimer.getRepeatCount()],
                        duration: 400,
                        loop: 0, 
                        tweens: [
                            {scale: 2, alpha: 1, ease: 'Expo.In'},
                            {scale: 3, alpha: 0, ease: 'Expo.Out'}
                        ]
                    });
                    this.time.delayedCall(200, function() {
                        if (this.ui.countdownTimer.getRepeatCount() == 1) {
                        }
                        this.audio.countdown.play();
                    }, null, this)                    
                }
                else {
                    
                    this.environment.startFlag = true;
                    // START!!!
                    this.tweens.timeline({
                        targets: this.ui.countgo,
                        duration: 600,
                        loop: 0, 
                        
                        tweens: [
                            {scale: 2, alpha: 0.5, rotation: 3.14159, ease: 'Expo.In'},
                            {scale: 3, alpha: 0, rotation: 3.14159*2, ease: 'Expo.Out'}
                        ]
                    });
                    this.tweens.timeline({
                        targets: this.ui.countgo2,
                        duration: 600,
                        loop: 0, 
                        
                        tweens: [
                            {scale: 2, alpha: 1, ease: 'Expo.In'},
                            {scale: 3, alpha: 0, ease: 'Expo.Out'}
                        ]
                    });
                    this.time.delayedCall(300, function() {
                        this.camera.fadeOut(100, 255, 255, 255)
                        .on('camerafadeoutcomplete', function() {
                            this.camera.fadeIn(100, 255, 255, 255);
                        }, this);
//                        this.camera.flash(300);
                        this.audio.whistle.play();
                        environment.seek = environment.music.bgm1.seek;
                        environment.music.bgm1.stop();
                        environment.music.bgm2.play({seek: environment.seek});
                    }, null, this)
                }
            },
            callbackScope: this,
            repeat: 3
        });
    },

    update: function() {
        this.ui.score.text = String(this.environment.score).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')

//        this.ui.score.text = this.environment.score;
        if (this.environment.time % 20 == 0) {
            if (this.environment.startFlag && !this.environment.gameoverFlag) {
                this.environment.score += 100;
                this.environment.speedUpFlag += 100;
            }
        }

        if (this.player.hp == 0 && this.environment.gameoverFlag == false) {
            this.environment.gameoverFlag = true;
            
            this.time.delayedCall(800, function() {
                environment.seek = environment.music.bgm2.seek;
                environment.music.bgm2.stop();
                this.camera.flash(2000)
                this.audio.whistle.play();

                this.time.delayedCall(2000, this.startGameOver, null, this);
            }, null, this)
        }
        // x(1 + 0.1p + a) = 5000 + 5000p)
        // x = 50000, a = -0.9
        if (this.environment.speedUpFlag > 5000) {
            if (this.environment.score < 20000) {
                this.environment.gameSpeed += 0.3;
                this.player.animRun.frameRate += 6;
            }
            else if (this.environment.score < 50000) {
                this.environment.gameSpeed += 0.2;
                this.player.animRun.frameRate += 4;
            }
            else if (this.environment.score < 75000) {
                this.environment.gameSpeed += 0.1;
                this.player.animRun.frameRate += 2;
            }
            this.player.setMaxVelocity(this.player.speed * this.environment.gameSpeed, 999999)
            this.environment.speedUpFlag = 0;
        }

//        this.objs.bgs.bg4.tilePositionX = this.camera.scrollX * .3;
        this.objs.bgs.bgc2.tilePositionX = this.camera.scrollX * 0.08;
        this.objs.bgs.bgc1.tilePositionX = this.camera.scrollX * 0.1;
        this.objs.bgs.bg3.tilePositionX = this.camera.scrollX * 0.16;
        this.objs.bgs.bg2.tilePositionX = this.camera.scrollX * 0.22;

        if (this.objs.dummy.array[0] < this.camera.scrollX) {
            this.generateField(this.environment.order++);
            this.objs.dummy.array.shift();
        }
        // 画面外に出たオブジェの削除処理
        if (this.objs.enemy.slag.array.length > 0 &&
            this.objs.enemy.slag.array[0].x < this.camera.scrollX - cell.s * 4) {
            this.objs.enemy.slag.array[0].destroy();
            this.objs.enemy.slag.array.shift();
        }
        if (this.objs.enemy.fly.array.length > 0 &&
            this.objs.enemy.fly.array[0].x < this.camera.scrollX - cell.s * 4) {
            this.objs.enemy.fly.array[0].destroy();
            this.objs.enemy.fly.array.shift();
        }
        if (this.objs.ground.array.length > 0 &&
            this.objs.ground.array[0].x < this.camera.scrollX - cell.s * 4) {
            this.objs.ground.array[0].destroy();
            this.objs.ground.array.shift();
        }
        if (this.objs.items.array.length > 0 &&
            this.objs.items.array[0].x < this.camera.scrollX - cell.s * 4) {
            this.objs.items.array[0].destroy();
            this.objs.items.array.shift();
        }


            this.environment.time += 1;

    },


    startGameOver: function() {
        environment.music.bgm1.play({seek: environment.seek});
        if (!this.ui.retireButton.isRetire) {
            result = postScore(this.environment.score, this.environment.itemscore);
        }

        this.gameover = {}
        this.gameover.gameover = this.add.sprite(0, -400, "gameover").setOrigin(0, 0).setScrollFactor(0).setRotation(1.0);
        this.audio.resultshow1.play()
        this.tweens.add({
            targets: this.gameover.gameover,
            rotation: 0,
            y: 0,
            duration: 500,
            ease: 'Back.easeOut'
        });

        this.time.delayedCall(1000, function() {
            if (!this.ui.retireButton.isRetire) {

                this.environment.rank = getRank(this.environment.score);
            }
            this.audio.resultshow1.play()
            this.gameover.itemscore = this.make.bitmapText({
                x: 250, y: 160, text: String(this.environment.itemscore).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'), font: 'UI-resultscore-font', size: false, align: 0, add: true,
            }).setOrigin(0, 0.5).setLeftAlign(0).setScrollFactor(0).setAlpha(0);
            this.tweens.add({
                targets: this.gameover.itemscore,
                rotation: 0,
                x: 280,
                duration: 500,
                alpha: 1,
                ease: 'Cubic.easeOut'
            });
        }, null, this);
        this.time.delayedCall(1200, function() {
            console.log(environment.rank);
            this.audio.resultshow1.play()
            this.gameover.score = this.make.bitmapText({
                x: 250, y: 210, text: String(this.environment.score).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'), font: 'UI-resultscore-font', size: false, align: 0, add: true,
            }).setOrigin(0, 0.5).setLeftAlign(0).setScrollFactor(0).setAlpha(0);
            this.tweens.add({
                targets: this.gameover.score,
                rotation: 0,
                x: 280,
                duration: 500,
                alpha: 1,
                ease: 'Cubic.easeOut'
            });
            if (environment.rank != "") {
                this.gameover.rank = this.add.text(300, 220, "(" + String(environment.rank).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + "位)", {
                    fontSize: '20px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    align: 'right',
                    stroke: '#000000',
                    strokeThickness: 3,
                }).setOrigin(0,0).setScrollFactor(0).setAlpha(0);
                this.tweens.add({
                    targets: this.gameover.rank,
                    duration: 500,
                    x: 330,
                    alpha: 1,
                    ease: 'Cubic.easeOut'
                });
            }

            if (this.environment.score > environment.hiscore) {
                console.log("HISCORE!")
                this.gameover.gameoverHiscore = this.add.sprite(345, 185, "gameover-hiscore").setScrollFactor(0);
                this.tweens.add({
                    targets: this.gameover.gameoverHiscore,
                    rotation: 0,
                    duration: 2000,
                    y: 165,
                    alpha: 0,
                    ease: 'Cubic.easeOut'
                });            
                environment.hiscore = this.environment.score;
                $.cookie('hiscore', this.environment.score, { expires: 365*3});
                document.cookie = "hiscore=" + this.environment.score;
            }

        }, null, this);



        // 190 280
        this.gameover.titleButton = this.add.sprite(190, 300, 'btn-title')
        .setScrollFactor(0)
        .setAlpha(0);
        this.gameover.retryButton = this.add.sprite(370, 300, 'btn-retry')
        .setScrollFactor(0)
        .setAlpha(0);
        this.time.delayedCall(1600, function() {
            this.audio.resultshow1.play()
            this.tweens.add({
                targets: this.gameover.titleButton,
                y: 280,
                duration: 1000,
                alpha: 1,
                ease: 'Back.easeOut'
            });
            this.gameover.titleButton.setInteractive().on('pointerup', function() {
                this.audio.enter.play();
                this.cameras.main.fadeOut(300)
                .on('camerafadeoutcomplete', function() {
                    environment.seek = environment.music.bgm1.seek;
//                    this.audio.music.bgm1.stop();
                    this.scene.start('title');
                }, this);
            }, this);
        }, null, this);
        this.time.delayedCall(1800, function() {
            this.audio.resultshow1.play()
            this.tweens.add({
                targets: this.gameover.retryButton,
                y: 280,
                duration: 1000,
                alpha: 1,
                ease: 'Back.easeOut'
            });
            this.gameover.retryButton.setInteractive().on('pointerup', function() {
                this.audio.enter.play();
                this.cameras.main.fadeOut(300)
                .on('camerafadeoutcomplete', function() {
                    environment.seek = environment.music.bgm1.seek;
//                    this.audio.music.bgm1.stop();
                    this.scene.start('mainscene');
                }, this);
            }, this)
        }, null, this);

        // 320, 540
        this.gameover.tweetButton = this.add.sprite(0, 320, 'btn-tweet').setOrigin(0.5,0.5)
        .setScrollFactor(0)
        .setAlpha(0);
        this.time.delayedCall(2300, function() {
            this.audio.resultshow2.play()
            this.tweens.add({
                targets: this.gameover.tweetButton,
                rotation: 3.14159*2*3 + (Math.random()-0.5),
                x: 540,
                y: 320,
                duration: 1500,
                alpha: 1,
                ease: 'Back.easeOut'
            });
            this.gameover.tweetButton.setInteractive().on('pointerup', function() {
                let tweet = "食べた食べ物の数: " + String(this.environment.itemscore).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + 
                            "\n獲得スコア: " + String(this.environment.score).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + 
                            "\nhttps://game.lemonkobo.com/kodemari-gourmet-run #コデマリグルメラン";
                let url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(tweet);
                let s = window.open(url, '_blank');

                if (s && s.focus) {
                    s.focus();
                }
                else if (!s) {
                    window.location.href = url;
                }
            }, this);
        }, null, this);
        
    },

    // マップフィールドを生成
    // マルコフ状態過程とか考えるの面倒空佐いのでいい感じの見た目を作るために一気に全マス分を生成してくれるすごいゴリ押し奴
    // orderNumが増えるほど難化したマップの生成を行う
    // 当初と比べてだいぶん密結合になったけどいいよね別に・・・
    generateField: function(orderNum) {

        let topLeft = orderNum *  cell.xLen;
        // 最初のオーダーは空だけつくる
        if (!this.environment.startFlag) {
            this.objs.dummy.array.push(cell.s * (topLeft + cell.xLen - 2 + 0.5));
            for (i = 0; i < cell.xLen; i ++) {
                this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (topLeft + i + 0.5), cell.s * (cell.yLen - 2 + 0.5), 'ground-top'));
                this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (topLeft + i + 0.5), cell.s * (cell.yLen - 1 + 0.5), 'ground'));
            }
            return;
        }
        // 地面をつくる
        this.objs.dummy.array.push(cell.s * (topLeft + cell.xLen - 2 + 0.5));
        for (i = 0; i < cell.xLen; i ++) {
            this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (topLeft + i + 0.5), cell.s * (cell.yLen - 2 + 0.5), 'ground-top'));
            this.objs.ground.array.push(this.objs.ground.group.create(cell.s * (topLeft + i + 0.5), cell.s * (cell.yLen - 1 + 0.5), 'ground'));
        }

        
        again = true;
        doAgain = function(name, scope) {
            if (scope.objs.enemy.enemyQueue[0] == name && scope.objs.enemy.enemyQueue[0] == name) {
                return true
            }
            else {
                scope.objs.enemy.enemyQueue.push(name);
                return false;
            }
        }
        while (again) {
            rnd = Math.random();
            if (rnd < 0.2) {
                if (again = doAgain("empty", this)) continue;
                /*
                let tmp = this.objs.enemy.slag.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 20 + 0.5), 'enemy-slag');
                tmp.anims.play('slag-anim', true);
                tmp.setVelocityX(-60);
                tmp.setScale(1.5)
                tmp.body.center.x = 0;
                tmp.setSize(10, 20, true);
                tmp.body.setGravityY(50 * this.environment.gameSpeed);

                tmp.body.setOffset(10, 25);
                this.objs.enemy.slag.array.push(tmp);
                */
            }
            else if (rnd < 0.5) {
                if (again = doAgain("slag", this)) continue;
                let tmp = this.objs.enemy.slag.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 4 + 0.5), 'enemy-slag');
                tmp.anims.play('slag-anim', true);
                tmp.setVelocityX(-100 + (Math.random()-0.5) * 20);
                tmp.setScale(1.5)
                tmp.body.center.x = 0;
                tmp.setSize(10, 20, true);
                tmp.body.setOffset(10, 25);
                this.objs.enemy.slag.array.push(tmp);
            }
            else if (rnd < 0.7) {
                if (again = doAgain("fly-up", this)) continue;
                let tmp = this.objs.enemy.fly.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 4 + 0.5), 'enemy-fly');
                tmp.anims.play('fly-anim', true);
                tmp.setVelocity(-50, -40*this.environment.gameSpeed);
                tmp.setScale(1.5)
                tmp.body.center.x = 0;
                tmp.setSize(10, 20, true);
                tmp.body.setOffset(10, 25);
                tmp.body.setGravityY(0);
                tmp.body.setAllowGravity(false);
                this.objs.enemy.fly.array.push(tmp);
            }
            else {
                if (again = doAgain("fly", this)) continue;
                let tmp = this.objs.enemy.fly.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 6), 'enemy-fly');
                tmp.anims.play('fly-anim', true);
                tmp.setVelocityX(-100);
                tmp.setScale(1.5)
                tmp.body.center.x = 0;
                tmp.setSize(10, 20, true);
                tmp.body.setOffset(10, 25);
                tmp.body.setGravityY(0);
                tmp.body.setAllowGravity(false);
                this.objs.enemy.fly.array.push(tmp);
            }
        }
        this.objs.enemy.enemyQueue.shift();

        rnd = Math.random();
        if (rnd < 0.3) {
            let item = this.objs.items.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 8 + 0.5), 'foods', this.objs.items.getFrame()).setScale(1.5);
            let item2 = this.objs.items.group.create(cell.s * (topLeft + 6 + 0.5), cell.s * (cell.yLen - 8 + 0.5), 'foods', item.frame.name).setScale(1.5);
            this.objs.items.array.push(item);
            this.objs.items.array.push(item2);
        }
        else if (rnd < 0.6) {
            let item = this.objs.items.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 6 + 0.5), 'foods', this.objs.items.getFrame()).setScale(1.5);
            let item2 = this.objs.items.group.create(cell.s * (topLeft + 6 + 0.5), cell.s * (cell.yLen - 6 + 0.5), 'foods', item.frame.name).setScale(1.5);
            this.objs.items.array.push(item);
            this.objs.items.array.push(item2);
        }
        else if (rnd < 0.9) {
            let item = this.objs.items.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 4 + 0.5), 'foods', this.objs.items.getFrame()).setScale(1.5);
            let item2 = this.objs.items.group.create(cell.s * (topLeft + 6 + 0.5), cell.s * (cell.yLen - 4 + 0.5), 'foods', item.frame.name).setScale(1.5);
            this.objs.items.array.push(item);
            this.objs.items.array.push(item2);
        }
        else {
            let item = this.objs.items.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 5 + 0.5), 'foods', this.objs.items.getFrame()).setScale(1.5);
            let item2 = this.objs.items.group.create(cell.s * (topLeft + 5 + 0.5), cell.s * (cell.yLen - 7 + 0.5), 'foods', item.frame.name).setScale(1.5);
            this.objs.items.array.push(item);
            this.objs.items.array.push(item2);
        }
    }
});
