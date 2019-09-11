var Title = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Title () {
        Phaser.Scene.call(this, { key: 'title' });
    },
    preload: function() {
        // BOOT
        this.audio = {music: { }};

        this.canvas = this.sys.game.canvas;
    },
    create: function() {
        flag = false;
        title = {};
        this.audio.music.bgm1 = this.sound.add('bgm-1', {volume: 0.2, rate: 1.0, loop: true})
        this.audio.music.bgm1.play({seek: 2});
        title.enter = this.sound.add('se-enter');
//        this.audio.music.bgm1.stop();
        touchField = this.add.sprite(0, 0, "title-bg").setOrigin(0 ,0);
        title.bgobj = this.add.sprite(320, 200, "title-bgobj").setAlpha(0);
        this.tweens.add({
            targets: title.bgobj,
            duration: 1500,
            alpha: 0.85,
            ease: 'Power2'
        });
        this.tweens.add({
            targets: title.bgobj,
            duration: 1800,
            repeat: -1,
            rotation: '+= 0.01',
//            alpha: 1,
            y: '+= 20',
            ease: 'Sine.easeInOut',
            yoyo: true
        })
        title.portrait = this.add.sprite(200, 200, "title-portrait").setAlpha(0);
        this.tweens.add({
            targets: title.portrait,
            alpha: 1,
            ease: 'Power2'
        }, title);
        this.tweens.add({
            targets: title.portrait,
            duration: 1500,
            repeat: -1,
            y: '+= 20',
            ease: 'Sine.easeInOut',
            yoyo: true
        })
        this.add.sprite(320, 50, "title-logo");
        title.touchText = this.add.sprite(320, 220, "title-touch").setAlpha(0);
        this.tweens.add({
            targets: title.touchText,
            duration: 1000,
            alpha: 1,
            repeat: -1,
            ease: 'Expo.easeInOut',
            yoyo: true
        })
        this.add.sprite(480, 360, "title-credit");
        this.cameras.main.fadeIn(700)
        .on('camerafadeincomplete', function() {
            touchField.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
                title.enter.play();
                this.cameras.main.fadeOut(300)
                .on('camerafadeoutcomplete', function() {
                    environment.seek = this.audio.music.bgm1.seek;
                    this.audio.music.bgm1.stop();
                    this.scene.start('mainscene');
                }, this);
            }, this);
        }, this);
        /*
        function() {
            touchField.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
                if (!flag) {
                    flag = true;
                    this.cameras.main.fadeOut(700, 0, 0, 0, function() {
                        environment.seek = this.audio.music.bgm1.seek;
                        this.audio.music.bgm1.stop();
                        this.scene.start('mainscene');
                    });
                }
            }, this);
        }, this);
        */
/*
        this.input.on('pointerdown', function(){
            console.log(this.scene);
            this.scene.start('mainscene');
        });
        */
        console.log('Title Created');
        console.log(this.canvas);
//        this.scene.start('mainscene');
    }
});
