import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.image('player', 'assets/player.png')
        this.load.image('bullet', 'assets/bullet.png')
        this.load.image('zombie', 'assets/zombie.png')
        this.load.image('box', 'assets/box.png')
        this.load.image('main-bg', 'assets/main-bg.png')
        this.load.image('text-logo', 'assets/text-logo.png')
        this.load.image('button', 'assets/button.png')
        this.load.image('button2', 'assets/button2.png')
        this.load.image('planet1', 'assets/planet1.png')
        this.load.image('planet2', 'assets/planet2.png')
        this.load.image('portal', 'assets/portal.png')
        this.load.image('stone', 'assets/stone.png')
        this.load.image('tree', 'assets/tree.png')
        this.load.image('planet1bg', 'assets/planet1bg.png')
        this.load.image('planet2bg', 'assets/planet2bg.jpg')
        this.load.image('rock1', 'assets/rock1.png')
        this.load.image('rock2', 'assets/rock2.png')
        this.load.image('rock3', 'assets/rock3.png')
        this.load.image('rock4', 'assets/rock4.png')
        this.load.audio('bullet', 'assets/bullet.wav')
        this.load.audio('explosion', 'assets/explosion.wav')
        this.load.audio('gameover', 'assets/gameover.wav')
        this.load.audio('hearth', 'assets/hearth.wav')
        this.load.audio('impact-player', 'assets/impact-player.ogg')
        this.load.audio('impact-zombie', 'assets/impact-zombie.ogg')
        this.load.audio('level-complete', 'assets/level-complete.wav')
        this.load.audio('music1', 'assets/music1.mp3')
        this.load.audio('music2', 'assets/music2.mp3')
        this.load.audio('music3', 'assets/music3.mp3')
        this.load.audio('portal-open', 'assets/portal-open.wav')
        this.load.audio('reload', 'assets/reload.wav')
    }

    create() {
        this.scene.start('Preloader');
    }
}
