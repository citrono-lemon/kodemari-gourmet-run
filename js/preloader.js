var Preloader = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Preloader () {
        Phaser.Scene.call(this, {
            key: 'preloader',
            pack: {
                files: [
                    { type: 'image', key: 'loader', url: 'assets/images/ldg.jpg' },
                ]
            }
        });
    },
    preload: function() {
//                this.scale.startFullscreen()
        this.pre = null

//        this.add.plugin(PhaserSpine.SpinePlugin); 
        this.add.sprite(0, 0, "loader").setOrigin(0 ,0);
        this.load.on('fileprogress', function (file) {
            if (this.pre) {
                this.pre.destroy();
            }
            fsource = file.src.split('/');
            this.pre = this.add.text(640, 364, fsource[fsource.length-1] + " is now loading...", {
                    fontSize: '12px',
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    align: 'right',
                    stroke: '#000000',
                    strokeThickness: 3,
            }).setOrigin(1,0);
    	}, this );


        this.load.setPath('assets/audio/');
        this.load.audio('se-jump', 'jump.wav');
        this.load.audio('se-jump2', 'jump-2.wav');
        this.load.audio('se-itemget', 'pikon.wav');
        this.load.audio('se-damage', 'nyu1.wav');
        this.load.audio('se-enter', 'piron3.wav');
        this.load.audio('se-countdown', 'choin.wav');
        this.load.audio('se-whistle', 'whistle.wav');
        this.load.audio('se-resultshow1', 'kachi.wav');
        this.load.audio('se-resultshow2', 'shuba.wav');
//        this.load.audio('bgm-1', 'bgm-1.ogg');
//        this.load.audio('bgm-2', 'bgm-2.ogg');
        this.load.audio('bgm-1', 'bgm-1.mp3');
        this.load.audio('bgm-2', 'bgm-2.mp3');


        // リソース読み込み
        this.load.setPath('assets/images/');
        let path = {src: 'assets/'};
        path.image = path.src + 'images/';
        path.audio = path.src + 'audio/';

        // thanks https://untiedgames.itch.io/free-grasslands-tileset
//        this.load.atlas('sprites', 'spritesheet.png', 'spritesheet.json');
        this.load.image('loader2', 'ldg2.png');

        this.load.image('title-bg', 'title-bg.png');
        this.load.image('title-bgobj', 'title-bgobj.png');
        this.load.image('title-credit', 'title-credit.png')
        this.load.image('title-logo', 'title-logo.png')
        this.load.image('title-touch', 'title-touch.png')
        this.load.image('title-portrait', 'title-portrait.png')
        this.load.spritesheet('title-mute', 'title-mute.png', { frameWidth: 65, frameHeight: 65});
        this.load.image('title-fullscreen', 'title-fullscreen.png')

        this.load.image('ground', 'ground.png');
        this.load.image('ground-top', 'ground-top.png');

        this.load.image('bgc1', 'bg_c1.png');
        this.load.image('bgc2', 'bg_c2.png');
        this.load.image('bg1', 'bg1.png');
        this.load.image('bg2', 'bg2.png');
        this.load.image('bg3', 'bg3.png');
        this.load.image('bg4', 'bg4.png');

        this.load.image('particle1', 'particle1.png');

        this.load.image('UI-score', 'UI-score2.png');
        this.load.spritesheet('UI-hp', 'hp.png', { frameWidth: 64, frameHeight: 64 });
        this.load.bitmapFont('UI-score-font', 'score-font.png', 'score-font.fnt');
        this.load.image('UI-retire', 'UI-retire.png');

        this.load.image('gameover', 'gameover.png');
        this.load.image('btn-retry', 'btn-retry.png');
        this.load.image('btn-title', 'btn-title.png');
        this.load.image('btn-tweet', 'btn-tweet.png');
        this.load.image('gameover-hiscore', 'gameover-hiscore.png');
        this.load.bitmapFont('UI-resultscore-font', 'resultscore.png', 'resultscore.fnt');

        this.load.spritesheet('countdown', 'countdown.png', { frameWidth: 100, frameHeight: 100 });
        this.load.image('go', 'go.png');
        this.load.spritesheet('foods', 'foods.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player', 'kodemari-sprite.png', { frameWidth: 78, frameHeight: 96 });
        this.load.spritesheet('enemy-slag', 'enemy-slag.png', { frameWidth: 52, frameHeight: 52 })
        this.load.spritesheet('enemy-fly', 'enemy-fly.png', { frameWidth: 52, frameHeight: 52 })

    },
    create: function() {
        if (this.pre) {
            this.pre.destroy();
        }
        this.pre = this.add.text(640, 347, "Loading Complete !!\nLet's Start !!", {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'right',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(1,0);


        this.time.delayedCall(300, function() {
            this.loader2 = this.add.sprite(0, 0, "loader2").setOrigin(0 ,0).setAlpha(0);
            this.tweens.add({
                targets: this.loader2,
                duration: 200,
                alpha: 1,
            })
            this.input.on('pointerdown', function(pointer){
                this.cameras.main.fadeOut(300)
                .on('camerafadeoutcomplete', function() {
                    this.scene.start('title');
                }, this);
            }, this);
        }, null, this)
    },
    update: function() {
    }
});
