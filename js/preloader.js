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

//        this.add.plugin(PhaserSpine.SpinePlugin); 
        this.load.on('fileprogress', function (file) {
//    		debugger;
//    		assetText.setText('onFileProgress: file.key=' + file.key);
            console.log('onFileProgress: file.key=' + file.key);
    	}, this );
        this.add.sprite(0, 0, "loader").setOrigin(0 ,0);


        this.load.setPath('assets/audio/');
        this.load.audio('se-jump', 'jump.wav');
        this.load.audio('se-jump2', 'jump-2.wav');
        this.load.audio('se-itemget', 'pikon.wav');
        this.load.audio('se-damage', 'nyu1.wav');
        this.load.audio('se-enter', 'piron3.wav');
        this.load.audio('se-countdown', 'choin.wav');
        this.load.audio('se-whistle', 'whistle.wav');
        this.load.audio('bgm-1', 'bgm-12.ogg');
        this.load.audio('bgm-2', 'bgm-2.ogg');


        // リソース読み込み
        this.load.setPath('assets/images/');
        let path = {src: 'assets/'};
        path.image = path.src + 'images/';
        path.audio = path.src + 'audio/';

        // thanks https://untiedgames.itch.io/free-grasslands-tileset
//        this.load.atlas('sprites', 'spritesheet.png', 'spritesheet.json');
        this.load.image('title-bg', 'title-bg.png');
        this.load.image('title-bgobj', 'title-bgobj.png');
        this.load.image('title-credit', 'title-credit.png')
        this.load.image('title-logo', 'title-logo.png')
        this.load.image('title-touch', 'title-touch.png')
        this.load.image('title-portrait', 'title-portrait.png')

        this.load.image('ground', 'ground.png');
        this.load.image('ground-top', 'ground-top.png');

        this.load.image('bg1', 'bg1.png');
        this.load.image('bg2', 'bg2.png');
        this.load.image('bg3', 'bg3.png');
        this.load.image('bg4', 'bg4.png');

        this.load.image('particle1', 'particle1.png');

        this.load.image('background', 'background.png');
        this.load.image('tile', 'res.png');

        this.load.image('UI-score', 'UI-score2.png');
        this.load.spritesheet('UI-hp', 'hp.png', { frameWidth: 64, frameHeight: 64 });
        this.load.bitmapFont('UI-score-font', 'score-font.png', 'score-font.fnt');

        this.load.spritesheet('countdown', 'countdown.png', { frameWidth: 100, frameHeight: 100 });
        this.load.image('go', 'go.png');
        this.load.spritesheet('foods', 'foods.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player', 'kodemari-sprite.png', { frameWidth: 78, frameHeight: 96 });
//        this.load.spritesheet('player', 'player.png', { frameWidth: 48, frameHeight: 80 });
        this.load.spritesheet('enemy-slag', 'enemy-slag.png', { frameWidth: 52, frameHeight: 52 })

//        this.load.setPath('assets/spine/coin');

//        this.load.spine('coin', 'coin-pro.json', 'coin.atlas');
//        res = this.load.spine('kodemari', 'kodemari.json', 'kodemari.atlas');
//       console.log(res);

    },
    create: function() {
        console.log('preload create')
        this.time.delayedCall(500, function() {
            this.cameras.main.fadeOut(300)
            .on('camerafadeoutcomplete', function() {
                this.scene.start('title');
            }, this);
        }, null, this)
    }
});
