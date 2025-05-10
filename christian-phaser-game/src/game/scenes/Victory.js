import { Scene } from "phaser"

export class Victory extends Scene {
  constructor() {
    super("Victory")
  }

  init(data) {
    this.score = data.score || 0
    this.fromScene = data.fromScene || "World1"
  }

  create() {
    // Registrar que el nivel ha sido completado
    if (this.fromScene === "World1") {
      localStorage.setItem("world1_completed", "true")
    } else if (this.fromScene === "World2") {
      localStorage.setItem("world2_completed", "true")
    }

    // Fondo simple
    this.cameras.main.setBackgroundColor(0x00ff00)

    // Mensaje de victoria
    this.add
      .text(512, 200, "¡VICTORIA!", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)

    // Mostrar puntuación
    this.add
      .text(512, 300, "Puntuación: " + this.score, {
        fontFamily: "Arial Black",
        fontSize: 48,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
        align: "center",
      })
      .setOrigin(0.5)

    // Mostrar mensaje de mundo completado
    const worldName = this.fromScene === "World1" ? "MUNDO 1" : "MUNDO 2"
    this.add
      .text(512, 370, `¡${worldName} COMPLETADO!`, {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffff00",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)

    // Botón para volver a la selección de mundos
    const worldsButton = this.add.rectangle(512, 450, 350, 70, 0x0088ff)
    const worldsText = this.add
      .text(512, 450, "SELECCIONAR MUNDO", {
        fontFamily: "Arial Black",
        fontSize: 28,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    worldsButton.setInteractive()
    worldsButton.on("pointerdown", () => {
      this.scene.start("WorldSelect")
    })

    // Botón para volver al menú principal
    const menuButton = this.add.rectangle(512, 550, 350, 70, 0x0000aa)
    const menuText = this.add
      .text(512, 550, "MENÚ PRINCIPAL", {
        fontFamily: "Arial Black",
        fontSize: 28,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    menuButton.setInteractive()
    menuButton.on("pointerdown", () => {
      this.scene.start("MainMenu")
    })
  }
}
