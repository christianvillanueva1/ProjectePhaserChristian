import { Scene } from "phaser"

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu")
  }

  create() {
    // Fondo simple
    this.cameras.main.setBackgroundColor(0x0088ff)

    // Título del juego
    this.add
      .text(512, 200, "MI JUEGO PHASER", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)

    // Botón para comenzar
    const startButton = this.add.rectangle(512, 400, 300, 80, 0x00aa00)
    const startText = this.add
      .text(512, 400, "COMENZAR", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    // Hacer el botón interactivo
    startButton.setInteractive()
    startButton.on("pointerdown", () => {
      this.scene.start("WorldSelect")
    })

    // Instrucciones
    this.add
      .text(512, 600, "Haz clic en COMENZAR para jugar", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    // Botón para reiniciar progreso (opcional)
    const resetButton = this.add.rectangle(512, 500, 250, 60, 0xaa0000)
    const resetText = this.add
      .text(512, 500, "REINICIAR PROGRESO", {
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
  }

  // Método para mostrar un mensaje temporal
  showMessage(text) {
    const message = this.add
      .text(512, 300, text, {
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
