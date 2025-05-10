export class PauseMenu {
  constructor(scene) {
    this.scene = scene
    this.isActive = false

    // Crear fondo semitransparente
    this.background = scene.add
      .rectangle(0, 0, scene.cameras.main.width, scene.cameras.main.height, 0x000000, 0.7)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(100)
      .setVisible(false)

    // Título del menú
    this.title = scene.add
      .text(scene.cameras.main.width / 2, 200, "PAUSA", {
        fontFamily: "Arial Black",
        fontSize: 48,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101)
      .setVisible(false)

    // Botón de continuar
    this.continueButton = scene.add
      .image(scene.cameras.main.width / 2, 300, "button")
      .setScrollFactor(0)
      .setDepth(101)
      .setInteractive()
      .setVisible(false)

    this.continueText = scene.add
      .text(scene.cameras.main.width / 2, 300, "CONTINUAR", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(102)
      .setVisible(false)

    // Botón de reiniciar nivel
    this.restartButton = scene.add
      .image(scene.cameras.main.width / 2, 400, "button")
      .setScrollFactor(0)
      .setDepth(101)
      .setInteractive()
      .setVisible(false)

    this.restartText = scene.add
      .text(scene.cameras.main.width / 2, 400, "REINICIAR NIVEL", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(102)
      .setVisible(false)



    // Botón de salir al menú principal
    this.exitButton = scene.add
      .image(scene.cameras.main.width / 2, 540, "button")
      .setScrollFactor(0)
      .setDepth(101)
      .setInteractive()
      .setVisible(false).setSize(300, 80);

    this.exitText = scene.add
      .text(scene.cameras.main.width / 2, 540, "MENÚ PRINCIPAL", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(102)
      .setVisible(false)

    // Configurar eventos de botones
    this.continueButton.on("pointerdown", () => {
      this.hide()
    })

    this.restartButton.on("pointerdown", () => {
      this.hide()
      // Reiniciar la escena actual
      const currentScene = scene.scene.key
      scene.scene.start(currentScene)
    })



    this.exitButton.on("pointerdown", () => {
      this.hide()
      scene.scene.start("MainMenu")
    })

    // Añadir efecto hover a los botones
    const buttons = [this.continueButton, this.restartButton, this.exitButton]
    buttons.forEach((button) => {
      button.on("pointerover", () => {
        button.setScale(1.05)
      })
      button.on("pointerout", () => {
        button.setScale(1)
      })
    })
  }

  show() {
    this.isActive = true
    this.background.setVisible(true)
    this.title.setVisible(true)
    this.continueButton.setVisible(true)
    this.continueText.setVisible(true)
    this.restartButton.setVisible(true)
    this.restartText.setVisible(true)
    this.exitButton.setVisible(true)
    this.exitText.setVisible(true)

    // pausar musica
    this.scene.sound.pauseAll()

    // Pausar el juego
    this.scene.physics.pause()
  }

  hide() {
    this.isActive = false
    this.background.setVisible(false)
    this.title.setVisible(false)
    this.continueButton.setVisible(false)
    this.continueText.setVisible(false)
    this.restartButton.setVisible(false)
    this.restartText.setVisible(false)
    this.exitButton.setVisible(false)
    this.exitText.setVisible(false)
    // reanudar musica
    this.scene.sound.resumeAll()

    // Reanudar el juego
    this.scene.physics.resume()
  }

  toggle() {
    if (this.isActive) {
      this.hide()
    } else {
      this.show()
    }
  }
}
