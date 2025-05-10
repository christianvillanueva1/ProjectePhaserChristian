import { Scene } from "phaser"

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu")
  }

  create() {
    // quitar todos los sonidos y poner music1
    this.sound.stopAll()
    this.sound.play("music1", {
      loop: true,
      volume: 0.5,
    })
    // Fondo simple
    const bg = this.add.image(0, 0, "main-bg").setOrigin(0)

    // Obtener tamaño de la pantalla
    const { width, height } = this.scale

    // Calcular escala proporcional para cubrir toda la pantalla
    const scaleX = width / bg.width
    const scaleY = height / bg.height
    const scale = Math.max(scaleX, scaleY) // Elige el mayor para cubrir

    bg.setScale(scale)
    bg.setPosition((width - bg.width * scale) / 2, (height - bg.height * scale) / 2)

    const logo = this.add.image(width / 2, height / 2 - 200, "text-logo")
    logo.setOrigin(0.5) // Centrar desde el centro del logo


    // Botón para comenzar
    const startButton = this.add.image(width / 2, height / 2 + 200, "button")
    const startText = this.add
      .text(width / 2, height / 2 + 200, "COMENZAR", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    startButton.on("pointerover", () => {
      startButton.setScale(1.05)
    })
    startButton.on("pointerout", () => {
      startButton.setScale(1)
    })

    // Hacer el botón interactivo
    startButton.setInteractive()
    startButton.on("pointerdown", () => {
      this.scene.start("WorldSelect")
    })

    // Instrucciones

    const cam = this.cameras.main
    const camButtonWidth = 250
    const camButtonHeight = 60

    const camX = cam.width - camButtonWidth / 2 - 20 // 20px de margen derecho
    const camY = cam.height - camButtonHeight / 2 - 20 // 20px de margen inferior

    const resetButton = this.add.image(camX, camY, "button")

    const resetText = this.add
      .text(camX, camY, "REINICIAR PROGRESO", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    resetButton.setInteractive()
    resetButton.on("pointerdown", () => {
      localStorage.removeItem("world1_completed")
      localStorage.removeItem("world2_completed")
      this.showMessage("¡Progreso reiniciado!")
    })

    resetButton.setScrollFactor(0)
    resetText.setScrollFactor(0)


  }



  // Método para mostrar un mensaje temporal
  showMessage(text) {
    const { width, height } = this.scale

    const message = this.add
      .text(width / 2, height / 2 + 100, text, {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
        backgroundColor: "#aa0000",
        padding: {
          left: 15,
          right: 15,
          top: 10,
          bottom: 10,
        },
      })
      .setOrigin(0.5)

    // Hacer que el mensaje desaparezca después de 2 segundos
    this.tweens.add({
      targets: message,
      alpha: 0,
      duration: 500,
      delay: 1500,
      onComplete: () => {
        message.destroy()
      },
    })
  }
}
