export class Enemy {
  constructor(scene, x, y, health) {
    this.scene = scene


    this.health = health
    this.maxHealth = health
    this.speed = 100 + Math.random() * 50 // Velocidad aleatoria entre 100-150

    // Crear el enemigo como un rectángulo rojo
    this.sprite = this.scene.physics.add.sprite(x, y, 'zombie')
    this.sprite.setScale(0.5) // Reduce al 50% del tamaño original
    const newWidth = this.sprite.width - 100
    const newHeight = this.sprite.height - 100

    this.sprite.body.setSize(newWidth, newHeight)
    this.sprite.body.setOffset(10, 10)

    this.sprite.body.setCollideWorldBounds(true)
    this.sprite.body.setBounce(0.2) // Rebote al chocar con los límites del mundo
    this.sprite.setOrigin(0.25, 0.40) // Establecer el origen en el centro del sprite

    // Habilitar físicas para el enemigo
    scene.physics.add.existing(this.sprite)


    // Barra de vida (solo visible si health > 1)
    if (health > 1) {
      this.healthBar = scene.add.rectangle(x, y - 30, 40, 5, 0x00ff00)
    }

    // Marcar como activo
    this.active = true
  }

  update(playerX, playerY) {
    if (!this.active) return


    // Calcular dirección hacia el jugador
    const dx = playerX - this.sprite.x
    const dy = playerY - this.sprite.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    // Normalizar y aplicar velocidad
    if (distance > 0) {
      const speedX = (dx / distance) * this.speed
      const speedY = (dy / distance) * this.speed
      this.sprite.body.setVelocity(speedX, speedY)
    }

    // Actualizar posición de la barra de vida si existe
    if (this.healthBar) {
      this.healthBar.x = this.sprite.x
      this.healthBar.y = this.sprite.y - 30
    }
    this.sprite.rotation = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    )
  }

  takeDamage(damage = 1) {
    this.health -= damage

    // Actualizar barra de vida si existe
    if (this.healthBar) {
      const healthPercent = this.health / this.maxHealth
      this.healthBar.width = 40 * healthPercent
      this.healthBar.fillColor = healthPercent > 0.5 ? 0x00ff00 : 0xff6600
    }

    // Efecto visual de daño
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
    })

    this.scene.sound.play("impact-player")


    // Comprobar si el enemigo ha muerto
    if (this.health <= 0) {
      this.destroy()
      return true // Enemigo eliminado
    }


    return false // Enemigo sigue vivo
  }

  destroy() {
    if (!this.active) return

    // Marcar como inactivo
    this.active = false

    // Eliminar sprite y barra de vida
    this.sprite.destroy()
    if (this.healthBar) {
      this.healthBar.destroy()
    }
  }

  isActive() {
    return this.active
  }
}
