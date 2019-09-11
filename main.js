// PIXI.jsむずい～～～
// Unityママに甘えすぎた結果がこれだよ１
$(window).on("load", function(){

let cell = {s: 32, xLen: 20, yLen: 12};
let game = {w: cell.s * cell.xLen, h: cell.s * cell.yLen};
let path = {src: 'assets/'};
path.image = path.src + 'images/';
path.audio = path.src + 'audio/';

var config = {
    type: Phaser.AUTO,
    width: game.w,
    height: game.h,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var app = new Phaser.Game(config);
var player;


function preload () {
    this.load.image('background', path.image + 'test.png');
    this.load.image('tile', path.image + 'roof.png');
    this.load.spritesheet('player', path.image + 'player.png', { frameWidth: 48, frameHeight: 320 });
}

function create () {
    this.add.image(game.w / 2, game.h / 2, 'background');
    this.add.image( 0, 0, 'tile').setOrigin(0 ,0).setAlpha(0.5);
    this.add.image(cell.s * 3 / 2, cell.s * 3 / 2 , 'tile');
    player = this.physics.add.sprite(100, 100, 'player');
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 5,
    });
}

function update ()
{
}

});
