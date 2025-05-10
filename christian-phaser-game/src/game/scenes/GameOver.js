import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score || 0;
        this.fromScene = data.fromScene || 'World1';
    }

    create() {
        // Fondo simple
        this.cameras.main.setBackgroundColor(0xff0000);

        // Mensaje de game over
        this.add.text(512, 200, 'GAME OVER', {
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Mostrar puntuación
        this.add.text(512, 300, 'Puntuación: ' + this.score, {
            fontFamily: 'Arial Black', 
            fontSize: 48, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Botón para reintentar el nivel
        const retryButton = this.add.rectangle(512, 400, 300, 70, 0x00aa00);
        const retryText = this.add.text(512, 400, 'REINTENTAR', {
            fontFamily: 'Arial Black', 
            fontSize: 28, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        retryButton.setInteractive();
        retryButton.on('pointerdown', () => {
            this.scene.start(this.fromScene);
        });

        // Botón para volver a la selección de mundos
        const worldsButton = this.add.rectangle(512, 500, 350, 70, 0x0088ff);
        const worldsText = this.add.text(512, 500, 'SELECCIONAR MUNDO', {
            fontFamily: 'Arial Black', 
            fontSize: 28, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        worldsButton.setInteractive();
        worldsButton.on('pointerdown', () => {
            this.scene.start('WorldSelect');
        });

        // Botón para volver al menú principal
        const menuButton = this.add.rectangle(512, 600, 350, 70, 0x0000aa);
        const menuText = this.add.text(512, 600, 'MENÚ PRINCIPAL', {
            fontFamily: 'Arial Black', 
            fontSize: 28, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        menuButton.setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}