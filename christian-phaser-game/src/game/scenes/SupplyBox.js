import Phaser from "phaser"

export class SupplyBox {
  constructor(scene, x, y) {
    this.scene = scene

    // Tipos de suministros
    this.types = ["health", "ammo", "explosion", "doubleshot"]

    // Seleccionar un tipo aleatorio (oculto hasta que se abra)
    this.type = this.types[Phaser.Math.Between(0, this.types.length - 1)]

    // Crear la caja como un rectángulo naranja
    this.sprite = scene.add.rectangle(x, y, 40, 40, 0xff8800)

    // Habilitar físicas para la caja
    scene.physics.add.existing(this.sprite, true) // true = estático

    // Añadir signo de interrogación para indicar contenido desconocido
    this.text = scene.add
      .text(x, y, "?", {
        fontSize: "24px",
        fontFamily: "Arial Black",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)

    // Añadir efecto de brillo
    scene.tweens.add({
      targets: this.sprite,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    })

    // Marcar como no recogida
    this.collected = false
  }

  collect(player) {
    if (this.collected) return false

    // Determinar icono según el tipo
    let icon = ""
    let message = ""

    // Aplicar efecto según el tipo
    switch (this.type) {
      case "health":
        player.lives++
        icon = "❤️"
        message = "¡Vida extra! +1"
        break
      case "ammo":
        player.ammo += 25
        icon = "🔫"
        message = "¡Munición! +25"
        break
      case "explosion":
        if (player.ability) {
          this.scene.showMessage("Ya tienes una habilidad")
          return false
        }
        player.ability = "explosion"
        icon = "💥"
        message = "¡Habilidad: Explosión!"
        break
      case "doubleshot":
        if (player.ability) {
          this.scene.showMessage("Ya tienes una habilidad")
          return false
        }
        player.ability = "doubleshot"
        icon = "🔥"
        message = "¡Habilidad: Doble Disparo!"
        break
    }

    // Mostrar brevemente el contenido antes de desaparecer
    this.text.setText(icon)
    this.scene.showMessage(message)

    // Efecto de apertura
    this.scene.tweens.add({
      targets: [this.sprite, this.text],
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 500,
      onComplete: () => {
        this.sprite.destroy()
        this.text.destroy()
      },
    })

    // Marcar como recogida
    this.collected = true

    return true
  }
}
