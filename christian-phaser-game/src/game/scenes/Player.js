import { Bullet } from "./Bullet"
import Phaser from "phaser"

export class Player {
  constructor(scene, x, y) {
    this.scene = scene

    // Crear el personaje como un cuadrado azul
    const centerX = this.scene.cameras.main.width / 2
    const centerY = this.scene.cameras.main.height / 2

    this.sprite = this.scene.physics.add.sprite(centerX, centerY, 'player')
    this.sprite.setScale(0.5) // Reduce al 50% del tamaño original

    const newWidth = this.sprite.width - 150
    const newHeight = this.sprite.height - 60

    this.sprite.body.setSize(newWidth, newHeight)
    this.sprite.body.setOffset(10, 10)

    // Ajustar propiedades físicas
    this.sprite.body.setCollideWorldBounds(true)
    this.sprite.body.setBounce(0.2) // Rebote al chocar con los límites del mundo
    this.sprite.setOrigin(0.25, 0.40) // Establecer el origen en el centro del sprite

    const abilityUse = false;

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
    scene.cameras.main.setBounds(0, 0, scene.physics.world.bounds.width, scene.physics.world.bounds.height)

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
      .text(scene.cameras.main.width - 150, scene.cameras.main.height - 150, "", {
        fontFamily: "Arial",
        fontSize: 60,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0).setDepth(100)
    this.inscruction = scene.add
      .text(scene.cameras.main.width - 150, scene.cameras.main.height - 200, "", {
        fontFamily: "Arial",
        fontSize: 12,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0).setDepth(100)

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
      this.abilityText.setText(abilityIcon)
      this.inscruction.setText("(E)")
    } else {
      this.abilityText.setText("")
      this.inscruction.setText("")

    }

    // Usar habilidad con E
    if (this.keys.ability.isDown && this.ability && Date.now() - this.lastAbilityUse > this.abilityCooldown) {
      this.useAbility()
    }

    // Hacer que el jugador gire hacia el puntero del mouse
    this.rotateTowardsPointer()
  }

  rotateTowardsPointer() {
    // Obtener la posición del puntero del mouse en el mundo
    const pointer = this.scene.input.activePointer
    const mouseX = pointer.worldX
    const mouseY = pointer.worldY

    // Calcular el ángulo entre el jugador y el puntero
    const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, mouseX, mouseY)

    // Establecer la rotación del jugador hacia el puntero
    this.sprite.rotation = angle
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
    // reproducir sonido de disparo
    this.scene.sound.play("bullet", { volume: 0.5 })


    // Reducir munición
    this.ammo--

    // Si tiene habilidad de doble disparo, crear una segunda bala con ligera desviación
    if (this.ability === "doubleshot" && this.ammo > 0 && this.abilityUse) {
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
      this.abilityUse = true

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
        // Reproducir sonido de explosión
        this.scene.sound.play("explosion")
      }

      // Consumir la habilidad después de usarla
      this.ability = null
      this.abilityUse = false
      this.scene.showMessage("¡Explosión activada!")
    } else if (this.ability === "doubleshot") {
      if (!this.abilityUse) {
        this.abilityUse = true


        this.scene.showMessage("¡Doble disparo activado por 10 segundos!")

        const duration = 10000 // duración total en milisegundos
        const currentAbility = this.ability
        let remainingTime = duration / 1000 // 10 segundos

        // Mostrar cuenta regresiva en pantalla
        const countdownText = this.scene.add.text(
          this.scene.cameras.main.width / 2,
          80,
          `Doble disparo: ${remainingTime}s`,
          {
            fontFamily: "Arial",
            fontSize: 20,
            color: "#ffff00",
            stroke: "#000000",
            strokeThickness: 3,
          }
        ).setOrigin(0.5).setScrollFactor(0)

        const countdownInterval = setInterval(() => {
          remainingTime--
          countdownText.setText(`Doble disparo: ${remainingTime}s`)

          if (remainingTime <= 0) {
            clearInterval(countdownInterval)
            countdownText.destroy()

            if (this.ability === currentAbility) {
              this.ability = null
              this.abilityUse = false

              this.scene.showMessage("¡Doble disparo ha terminado!")
            }
          }
        }, 1000)
      }

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

    // Reproducir sonido de impacto
    this.scene.sound.play("impact-player")

    return this.lives <= 0
  }
}
