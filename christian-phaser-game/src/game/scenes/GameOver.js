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
        const bg = this.add.image(0, 0, "main-bg").setOrigin(0)

        // Obtener tamaño de la pantalla
        const { width, height } = this.scale

        // Calcular escala proporcional para cubrir toda la pantalla
        const scaleX = width / bg.width
        const scaleY = height / bg.height
        const scale = Math.max(scaleX, scaleY) // Elige el mayor para cubrir

        bg.setScale(scale)
        bg.setPosition((width - bg.width * scale) / 2, (height - bg.height * scale) / 2)
        // Fondo simple

        // Mensaje de game over
        this.add.text(width / 2, 200, 'GAME OVER', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Mostrar puntuación
        this.add.text(width / 2, 300, 'Puntuación: ' + this.score, {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Botón para reintentar el nivel
        const retryButton = this.add.image(width / 2, 400, "button");
        const retryText = this.add.text(width / 2, 400, 'REINTENTAR', {
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
        const worldsButton = this.add.image(width / 2, 500, "button");
        const worldsText = this.add.text(width / 2, 500, 'MUNDOS', {
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
        const menuButton = this.add.image(width / 2, 600, "button");
        const menuText = this.add.text(width / 2, 600, 'MENÚ PRINCIPAL', {
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