import Phaser from "phaser"

export class MapBorder {
  constructor(scene, width, height) {
    this.scene = scene
    this.width = width
    this.height = height

    // Grosor del borde
    this.borderThickness = 30

    // Crear los cuatro bordes del mapa
    this.borders = []

    // Borde superior
    const topBorder = scene.add.rectangle(width / 2, this.borderThickness / 2, width, this.borderThickness, 0xffff00)
    scene.physics.add.existing(topBorder, true)
    this.borders.push(topBorder)

    // Borde inferior
    const bottomBorder = scene.add.rectangle(
      width / 2,
      height - this.borderThickness / 2,
      width,
      this.borderThickness,
      0xffff00,
    )
    scene.physics.add.existing(bottomBorder, true)
    this.borders.push(bottomBorder)

    // Borde izquierdo
    const leftBorder = scene.add.rectangle(this.borderThickness / 2, height / 2, this.borderThickness, height, 0xffff00)
    scene.physics.add.existing(leftBorder, true)
    this.borders.push(leftBorder)

    // Borde derecho
    const rightBorder = scene.add.rectangle(
      width - this.borderThickness / 2,
      height / 2,
      this.borderThickness,
      height,
      0xffff00,
    )
    scene.physics.add.existing(rightBorder, true)
    this.borders.push(rightBorder)

    // Añadir efecto de parpadeo a los bordes
    scene.tweens.add({
      targets: this.borders,
      alpha: 0.7,
      duration: 800,
      yoyo: true,
      repeat: -1,
    })

    // Último daño causado (para evitar daño continuo)
    this.lastDamageTime = 0
    this.damageInterval = 1000 // 1 segundo entre daños
  }

  setupCollision(player) {
    // Configurar colisión física con el jugador
    for (const border of this.borders) {
      this.scene.physics.add.collider(player.sprite, border)
    }
  }

  checkCollision(player) {
    const currentTime = Date.now()
    let isColliding = false

    // Comprobar si el jugador está tocando algún borde
    for (const border of this.borders) {
      // Usar una detección de colisión más directa
      const playerBounds = player.sprite.getBounds()
      const borderBounds = border.getBounds()

      if (Phaser.Geom.Rectangle.Overlaps(playerBounds, borderBounds)) {
        isColliding = true
        break
      }
    }

    // Si está colisionando y ha pasado suficiente tiempo desde el último daño y no está inmune
    if (isColliding && currentTime - this.lastDamageTime > this.damageInterval && !player.isImmune) {
      this.lastDamageTime = currentTime

      // Causar daño al jugador
      if (player.takeDamage()) {
        // Game over si no quedan vidas
        return true // Indica que el jugador ha muerto
      }

      // Mostrar mensaje
      this.scene.showMessage("¡Peligro! Borde del mapa")
    }

    return false // El jugador sigue vivo
  }
}
