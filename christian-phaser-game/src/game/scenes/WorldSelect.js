import { Scene } from "phaser"

export class WorldSelect extends Scene {
  constructor() {
    super("WorldSelect")
  }

  create() {
    const { width, height } = this.scale

    // Fondo simple
    const bg = this.add.image(0, 0, "main-bg").setOrigin(0)
    // Calcular escala proporcional para cubrir toda la pantalla
    const scaleX = width / bg.width
    const scaleY = height / bg.height
    const scale = Math.max(scaleX, scaleY) // Elige el mayor para cubrir
    bg.setScale(scale)
    bg.setPosition((width - bg.width * scale) / 2, (height - bg.height * scale) / 2)

    // Título centrado arriba
    this.add
      .text(width / 2, 150, "SELECCIONA UN MUNDO", {
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

    // Crear grupo de botones de mundos
    const buttonGroup = this.add.group()

    // Mundo 1 (con botón interactivo)
    const world1Button = this.add.image(width / 2 - 250, height / 2, "planet1")
      .setScale(0.2)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.start("World1")
      })

    const world1Text = this.add
      .text(width / 2 - 250, height / 2, "MUNDO 1", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    // Mundo 2 (con botón interactivo, pero bloqueado si Mundo 1 no está completado)
    const world2Button = this.add.image(width / 2 + 250, height / 2, "planet2")
      .setScale(0.3)
      .setInteractive({ useHandCursor: true })

    const world2Text = this.add
      .text(width / 2 + 250, height / 2, "MUNDO 2", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    if (isWorld1Completed) {
      world2Button.on("pointerdown", () => {
        this.scene.start("World2")
      })
    } else {
      world2Button.setAlpha(0.5) // Mundo 2 bloqueado con color grisáceo
      world2Text.setAlpha(0.5)

    }

    // Agregar los botones al grupo
    buttonGroup.add(world1Button)
    buttonGroup.add(world1Text)
    buttonGroup.add(world2Button)
    buttonGroup.add(world2Text)

    // Añadir evento hover para agrandar y mostrar candado
    this.addHoverEffect(world1Button, world1Text, world2Button, world2Text)

    // Botón de volver con flecha (arriba a la izquierda)
    const backButton = this.add.text(20, 20, "<") // Usa la imagen de flecha
      .setOrigin(0)
      .setFontSize(48)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        this.scene.start("MainMenu")
      })

    // Título de texto que solo aparece al pasar el ratón por encima
    const lockText = this.add
      .text(width / 2 + 250, height / 2 + 50, "Completa el Mundo 1 para desbloquear", {
        fontFamily: "Arial",
        fontSize: 16,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // Mostrar candado solo al hacer hover sobre el Mundo 2
    world2Button.on("pointerover", () => {
      if (!isWorld1Completed) {
        lockText.setAlpha(1) // Mostrar texto del candado
      }
      world2Button.setScale(0.35) // Aumentar el tamaño del planeta
    })

    world2Button.on("pointerout", () => {
      lockText.setAlpha(0) // Ocultar texto del candado
      world2Button.setScale(0.3) // Restaurar tamaño original
    })
  }

  // Método para agregar efectos de hover
  addHoverEffect(world1Button, world1Text, world2Button, world2Text) {
    // Hover sobre el botón de Mundo 1
    world1Button.on("pointerover", () => {
      world1Button.setScale(0.25) // Aumentar tamaño
      world1Text.setFontSize(36) // Aumentar tamaño del texto
    })

    world1Button.on("pointerout", () => {
      world1Button.setScale(0.2) // Restaurar tamaño
      world1Text.setFontSize(32) // Restaurar tamaño del texto
    })

    // Hover sobre el botón de Mundo 2
    world2Button.on("pointerover", () => {
      world2Button.setScale(0.35) // Aumentar tamaño
      world2Text.setFontSize(36) // Aumentar tamaño del texto
    })

    world2Button.on("pointerout", () => {
      world2Button.setScale(0.3) // Restaurar tamaño
      world2Text.setFontSize(32) // Restaurar tamaño del texto
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
