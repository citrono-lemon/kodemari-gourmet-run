var Title = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Title () {
        Phaser.Scene.call(this, { key: 'title' });
    },
    preload: function() {
        // BOOT
        this.audio = {music: { }};

        console.log(environment);
        this.canvas = this.sys.game.canvas;
    },
    create: function() {
        flag = false;
        title = {};
        if (!environment.music.bgm1) {
            environment.music.bgm1 = this.sound.add('bgm-1', {volume: environment.music.volume, mute: environment.mute, rate: 1.0, loop: true})
            environment.music.bgm1.play({seek: environment.seek});
        }
        title.enter = this.sound.add('se-enter', {mute: environment.mute});
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
//        this.add.sprite(320, 50, "title-logo");
        this.add.sprite(320, 60, "title-logo");
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
        this.add.text(5, 1, "HI-Score: " + String(environment.hiscore).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'), {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'right',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0,0);

        title.rankText = this.add.text(10, 21, "", {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'right',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0,0);

        if (environment.hiscore != 0) {
//            environment.rank = getRank(environment.hiscore);
            getRank(environment.hiscore);
        }

        title.mutebtn = this.add.sprite(36, 350, 'title-mute', environment.mute ? 1 : 0);
        title.fullscreenbtn = this.add.sprite(240, 365, 'title-fullscreen');

        this.cameras.main.fadeIn(700)
        .on('camerafadeincomplete', function() {
            
            title.mutebtn.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
                if (!environment.mute) {
                    title.mutebtn.setFrame(1);
                    environment.mute = true;
                    environment.music.bgm1.mute = true;
                    title.enter.mute = true;
                    $.cookie('audio-mute', true, { expires: 365*3});
                }
                else {
                    title.mutebtn.setFrame(0);
                    environment.mute = false;
                    environment.music.bgm1.mute = false;
                    title.enter.mute = false;
                    $.cookie('audio-mute', false, { expires: 365*3});
                }
            }, this);
            
            title.fullscreenbtn.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
                this.scale.toggleFullscreen();
            }, this);
            touchField.setInteractive().on('pointerdown', function(pointer, localX, localY, event){
                title.enter.play();
                this.cameras.main.fadeOut(300)
                .on('camerafadeoutcomplete', function() {
                    environment.seek = environment.music.bgm1.seek;
                    this.scene.start('mainscene');
                }, this);
            }, this);
        }, this);
    },
    update: function() {
        if (environment.hiscore != 0) {
            title.rankText.text = String(environment.rank).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + "位！";
        }
    }
});
