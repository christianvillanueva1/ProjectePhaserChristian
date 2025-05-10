import { Scene } from "phaser"

export class WorldSelect extends Scene {
  constructor() {
    super("WorldSelect")
  }

  create() {
    // Fondo simple
    this.cameras.main.setBackgroundColor(0x88aaff)

    // Título
    this.add
      .text(512, 150, "SELECCIONA UN MUNDO", {
        fontFamily: "Arial Black",
        fontSize: 48,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        align: "center",
      })
      .setOrigin(0.5)

    // Verificar si el Mundo 1 ha sido completado
    const isWorld1Completed = localStorage.getItem("world1_completed") === "true"

    // Botón para Mundo 1
    const world1Button = this.add.rectangle(300, 350, 250, 200, 0x00aa00)
    const world1Text = this.add
      .text(300, 350, "MUNDO 1", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    // Botón para Mundo 2 (color diferente según disponibilidad)
    const world2Color = isWorld1Completed ? 0xaa0000 : 0x888888
    const world2Button = this.add.rectangle(724, 350, 250, 200, world2Color)
    const world2Text = this.add
      .text(724, 350, "MUNDO 2", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    // Añadir indicador de bloqueado si el Mundo 1 no está completado
    if (!isWorld1Completed) {
      const lockIcon = this.add
        .text(724, 400, "🔒", {
          fontSize: 40,
        })
        .setOrigin(0.5)

      // Texto de información
      this.add
        .text(724, 450, "Completa el Mundo 1\npara desbloquear", {
          fontFamily: "Arial",
          fontSize: 16,
          color: "#ffffff",
          align: "center",
        })
        .setOrigin(0.5)
    }

    // Hacer los botones interactivos
    world1Button.setInteractive()
    world1Button.on("pointerdown", () => {
      this.scene.start("World1")
    })

    // Solo hacer interactivo el Mundo 2 si el Mundo 1 está completado
    if (isWorld1Completed) {
      world2Button.setInteractive()
      world2Button.on("pointerdown", () => {
        this.scene.start("World2")
      })
    } else {
      // Añadir efecto de "sacudida" al hacer clic en un mundo bloqueado
      world2Button.setInteractive()
      world2Button.on("pointerdown", () => {
        this.showMessage("¡Completa el Mundo 1 primero!")
      })
    }

    // Botón para volver al menú principal
    const backButton = this.add.rectangle(512, 600, 200, 60, 0x0000aa)
    const backText = this.add
      .text(512, 600, "VOLVER", {
        fontFamily: "Arial Black",
        fontSize: 24,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    backButton.setInteractive()
    backButton.on("pointerdown", () => {
      this.scene.start("MainMenu")
    })
  }

  // Método para mostrar un mensaje temporal
  showMessage(text) {
    const message = this.add
      .text(512, 250, text, {
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
