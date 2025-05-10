import Phaser from "phaser"

export class SupplyBox {
  constructor(scene, x, y) {
    this.scene = scene

    // Tipos de suministros
    this.types = ["health", "ammo", "explosion", "doubleshot"]

    // Seleccionar un tipo aleatorio (oculto hasta que se abra)
    this.type = this.types[Phaser.Math.Between(0, this.types.length - 1)]

    // Crear la caja como un rectángulo naranja
    this.sprite = this.scene.physics.add.sprite(x, y, 'box')
    this.sprite.setScale(0.15) // Reduce al 50% del tamaño original



    // Habilitar físicas para la caja
    scene.physics.add.existing(this.sprite, true) // true = estático

    // Añadir signo de interrogación para indicar contenido desconocido


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
        // reproducir sonido de vida
        this.scene.sound.play("hearth")
        break
      case "ammo":
        player.ammo += 25
        icon = "🔫"
        message = "¡Munición! +25"
        this.scene.sound.play("reload")
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
    this.scene.showMessage(message)

    this.sprite.destroy()

    // Marcar como recogida
    this.collected = true

    return true
  }
}
