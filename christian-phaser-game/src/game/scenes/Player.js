import { Bullet } from "./Bullet"
import Phaser from "phaser"

export class Player {
  constructor(scene, x, y) {
    this.scene = scene

    // Crear el personaje como un cuadrado azul
    this.sprite = scene.add.rectangle(x, y, 50, 50, 0x0088ff)

    // Habilitar físicas para el personaje
    scene.physics.add.existing(this.sprite)

    // Ajustar propiedades físicas
    this.sprite.body.setCollideWorldBounds(true)

    // Velocidad de movimiento
    this.speed = 200

    // Crear controles WASD y espacio
    this.keys = scene.input.keyboard.addKeys({
      up: "W",
      left: "A",
      down: "S",
      right: "D",
      space: "SPACE",
      ability: "E",
    })

    // Hacer que la cámara siga al personaje
    scene.cameras.main.startFollow(this.sprite)
    scene.cameras.main.setFollowOffset(-this.sprite.width, -this.sprite.height)

    // Array para almacenar las balas
    this.bullets = []

    // Configurar el disparo con clic del mouse
    scene.input.on("pointerdown", (pointer) => {
      if (!this.isImmune) {
        this.shoot(pointer)
      }
    })

    // Tiempo mínimo entre disparos (en milisegundos)
    this.fireRate = 300
    this.lastFired = 0

    // Sistema de vidas y munición
    this.lives = 3
    this.ammo = 45

    // Habilidad actual (null, 'explosion', 'doubleshot')
    this.ability = null

    // Indicador de habilidad
    this.abilityText = scene.add
      .text(scene.cameras.main.width - 150, 50, "", {
        fontFamily: "Arial",
        fontSize: 18,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)

    // Último uso de habilidad
    this.lastAbilityUse = 0
    this.abilityCooldown = 1000 // 1 segundo de cooldown

    // Sistema de inmunidad
    this.isImmune = false
    this.immunityTime = 2000 // 2 segundos
    this.blinkInterval = null
  }

  update() {
    // Reiniciar la velocidad
    this.sprite.body.setVelocity(0)

    // Movimiento horizontal
    if (this.keys.left.isDown) {
      this.sprite.body.setVelocityX(-this.speed)
    } else if (this.keys.right.isDown) {
      this.sprite.body.setVelocityX(this.speed)
    }

    // Movimiento vertical
    if (this.keys.up.isDown) {
      this.sprite.body.setVelocityY(-this.speed)
    } else if (this.keys.down.isDown) {
      this.sprite.body.setVelocityY(this.speed)
    }

    // Actualizar las balas y eliminar las que ya no están activas
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (!this.bullets[i].update()) {
        this.bullets.splice(i, 1)
      }
    }

    // Actualizar texto de habilidad
    if (this.ability) {
      const abilityIcon = this.ability === "explosion" ? "💥" : "🔥"
      this.abilityText.setText(`Habilidad: ${abilityIcon} (E)`)
    } else {
      this.abilityText.setText("")
    }

    // Usar habilidad con E
    if (this.keys.ability.isDown && this.ability && Date.now() - this.lastAbilityUse > this.abilityCooldown) {
      this.useAbility()
    }
  }

  shoot(pointer) {
    // No disparar si está inmune
    if (this.isImmune) return

    // Comprobar si ha pasado suficiente tiempo desde el último disparo
    const currentTime = Date.now()
    if (currentTime - this.lastFired < this.fireRate) {
      return
    }

    // Comprobar si hay munición
    if (this.ammo <= 0) {
      this.scene.showMessage("¡Sin munición!")
      return
    }

    this.lastFired = currentTime

    // Obtener la posición del jugador
    const x = this.sprite.x
    const y = this.sprite.y

    // Convertir la posición del puntero a coordenadas del mundo
    const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y)

    // Calcular la dirección hacia el puntero
    const directionX = worldPoint.x - x
    const directionY = worldPoint.y - y

    // Crear una nueva bala
    const bullet = new Bullet(this.scene, x, y, directionX, directionY)
    this.bullets.push(bullet)

    // Reducir munición
    this.ammo--

    // Si tiene habilidad de doble disparo, crear una segunda bala con ligera desviación
    if (this.ability === "doubleshot" && this.ammo > 0) {
      // Añadir una pequeña desviación para la segunda bala
      const angle = Math.atan2(directionY, directionX)
      const offsetAngle = angle + Math.PI / 20 // Desviación de ~9 grados
      const offsetDirX = Math.cos(offsetAngle)
      const offsetDirY = Math.sin(offsetAngle)

      const bullet2 = new Bullet(this.scene, x, y, offsetDirX, offsetDirY)
      this.bullets.push(bullet2)

      // Reducir munición para la segunda bala
      this.ammo--
    }
  }

  useAbility() {
    if (!this.ability) return

    this.lastAbilityUse = Date.now()

    if (this.ability === "explosion") {
      // Crear una explosión en un radio alrededor del jugador
      const explosionRadius = 200

      // Efecto visual de la explosión
      const explosion = this.scene.add.circle(this.sprite.x, this.sprite.y, explosionRadius, 0xff0000, 0.5)

      // Hacer que la explosión desaparezca gradualmente
      this.scene.tweens.add({
        targets: explosion,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          explosion.destroy()
        },
      })

      // Dañar a los enemigos en el radio de explosión
      if (this.scene.enemies) {
        this.scene.enemies.forEach((enemy) => {
          if (enemy.isActive()) {
            const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, enemy.sprite.x, enemy.sprite.y)

            if (distance < explosionRadius + enemy.sprite.width / 2) {
              // Dañar al enemigo con la explosión (3 puntos de daño)
              if (enemy.takeDamage(3)) {
                this.scene.score += 20
                this.scene.enemiesKilled++
              }
            }
          }
        })
      }

      // Consumir la habilidad después de usarla
      this.ability = null
      this.scene.showMessage("¡Explosión activada!")
    } else if (this.ability === "doubleshot") {
      // El doble disparo se maneja en el método shoot
      // Aquí solo mostramos un mensaje y consumimos la habilidad
      this.scene.showMessage("¡Doble disparo activado!")

      // Consumir la habilidad después de usarla
      this.ability = null
    }
  }

  getPosition() {
    return {
      x: this.sprite.x,
      y: this.sprite.y,
    }
  }

  takeDamage() {
    // No tomar daño si ya está inmune
    if (this.isImmune) return false

    this.lives--

    // Activar inmunidad
    this.isImmune = true

    // Efecto visual de daño
    this.scene.cameras.main.shake(200, 0.01)

    // Efecto de parpadeo
    let visible = false
    this.blinkInterval = setInterval(() => {
      visible = !visible
      this.sprite.alpha = visible ? 1 : 0.3
    }, 100)

    // Desactivar inmunidad después de un tiempo
    setTimeout(() => {
      this.isImmune = false
      clearInterval(this.blinkInterval)
      this.sprite.alpha = 1
    }, this.immunityTime)

    return this.lives <= 0
  }
}
