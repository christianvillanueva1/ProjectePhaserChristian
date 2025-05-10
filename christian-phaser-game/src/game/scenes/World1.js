import { Scene } from "phaser"
import { Player } from "./Player"
import { SupplyBox } from "./SupplyBox"
import { Enemy } from "./Enemy"
import { Portal } from "./Portal"
import { PauseMenu } from "./PauseMenu"
import { DangerZone } from "./DangerZone"
import { MapBorder } from "./MapBorder"
import Phaser from "phaser"

export class World1 extends Scene {
  constructor() {
    super("World1")

    // Estas variables se inicializarán en init() para asegurar un reinicio correcto
  }

  init() {
    // Inicializar/reiniciar todas las variables de estado
    this.score = 0

    // Configuración de hordas
    this.totalHordes = 5 // Número total de hordas
    this.currentHorde = 0 // Empezamos en 0, la primera horda será la 1
    this.enemiesPerHorde = 5 // Enemigos base en la primera horda
    this.enemiesKilled = 0
    this.enemiesRequired = 0
    this.enemyBaseHealth = 1 // Vida base de los enemigos en el Mundo 1

    // Portal
    this.portal = null

    // Tamaño del mundo
    this.worldWidth = 2000
    this.worldHeight = 2000

    // Arrays para limpiar en reinicio
    this.enemies = []
    this.obstacles = []
    this.supplyBoxes = []
    this.dangerZones = []
  }

  create() {
    // Fondo simple
    this.cameras.main.setBackgroundColor(0x00aa00)

    // Habilitar físicas y establecer límites del mundo
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    // Título del nivel
    this.add
      .text(512, 50, "MUNDO 1", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)

    // Mostrar puntuación
    this.scoreText = this.add
      .text(50, 50, "Puntuación: 0", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)

    // Mostrar vidas y munición
    this.statsText = this.add
      .text(50, 90, "Vidas: 3 | Balas: 45", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0)

    // Mostrar información de horda
    this.hordeText = this.add
      .text(512, 90, "Horda: 0/" + this.totalHordes, {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)

    // Instrucciones
    this.add
      .text(512, 700, "WASD: Mover | CLIC: Disparar\nESPACIO: Recoger caja | E: Usar habilidad", {
        fontFamily: "Arial",
        fontSize: 18,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)

    // Crear el jugador (cuadrado azul)
    this.player = new Player(this, 512, 600)

    // Crear borde del mapa
    this.mapBorder = new MapBorder(this, this.worldWidth, this.worldHeight)

    // Nota: No usamos setupCollision aquí para permitir que el jugador toque el borde
    // y reciba daño, en lugar de ser bloqueado por la colisión física
    // this.mapBorder.setupCollision(this.player);

    // Añadir algunos obstáculos para mostrar el movimiento
    this.obstacles = []
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 100)
      const y = Phaser.Math.Between(100, this.worldHeight - 100)
      const size = Phaser.Math.Between(50, 150)
      const color = Phaser.Math.Between(0x000000, 0xffffff)

      const obstacle = this.add.rectangle(x, y, size, size, color)
      this.physics.add.existing(obstacle, true) // true = estático

      // Colisión con el jugador
      this.physics.add.collider(this.player.sprite, obstacle)

      // Guardar referencia al obstáculo
      this.obstacles.push(obstacle)
    }

    // Añadir cajas de suministros
    this.supplyBoxes = []
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 100)
      const y = Phaser.Math.Between(100, this.worldHeight - 100)

      const box = new SupplyBox(this, x, y)
      this.supplyBoxes.push(box)
    }

    // Añadir zonas de peligro (cuadrados rojos)
    this.dangerZones = []
    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 100)
      const y = Phaser.Math.Between(100, this.worldHeight - 100)
      const size = Phaser.Math.Between(60, 120)

      const zone = new DangerZone(this, x, y, size, size)
      this.dangerZones.push(zone)
    }

    // Inicializar array de enemigos
    this.enemies = []

    // Iniciar la primera horda
    this.startNextHorde()

    // Crear botón de pausa en el HUD
    this.pauseButton = this.add
      .rectangle(this.cameras.main.width - 50, 50, 60, 60, 0x333333)
      .setScrollFactor(0)
      .setInteractive()
      .setDepth(90)

    this.pauseIcon = this.add
      .text(this.cameras.main.width - 50, 50, "⏸️", {
        fontSize: "30px",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(91)

    // Crear menú de pausa
    this.pauseMenu = new PauseMenu(this)

    // Configurar eventos de pausa
    this.pauseButton.on("pointerdown", () => {
      this.pauseMenu.toggle()
    })

    // Tecla Escape para pausar
    this.input.keyboard.on("keydown-ESC", () => {
      this.pauseMenu.toggle()
    })

    // Mensaje inicial para advertir sobre los bordes
    this.showMessage("¡Cuidado con los bordes amarillos! Causan daño.")
  }

  update() {
    // No actualizar si el juego está pausado
    if (this.pauseMenu && this.pauseMenu.isActive) return

    // Actualizar el jugador
    this.player.update()

    // Actualizar la puntuación y estadísticas
    this.scoreText.setText("Puntuación: " + this.score)
    this.statsText.setText(`Vidas: ${this.player.lives} | Balas: ${this.player.ammo}`)

    // Actualizar información de horda
    if (this.currentHorde <= this.totalHordes) {
      this.hordeText.setText(
        `Horda: ${this.currentHorde}/${this.totalHordes} - Enemigos: ${this.enemiesKilled}/${this.enemiesRequired}`,
      )
    } else {
      this.hordeText.setText("¡Todas las hordas completadas!")
    }

    // Comprobar colisión con el borde del mapa
    if (this.mapBorder && this.mapBorder.checkCollision(this.player)) {
      // Game over si el jugador ha muerto
      this.scene.start("GameOver", { score: this.score, fromScene: "World1" })
    }

    // Comprobar zonas de peligro
    for (const zone of this.dangerZones) {
      if (zone.checkCollision(this.player)) {
        // Game over si el jugador ha muerto
        this.scene.start("GameOver", { score: this.score, fromScene: "World1" })
      }
    }

    // Actualizar enemigos
    const playerPos = this.player.getPosition()
    this.enemies.forEach((enemy) => {
      if (enemy.isActive()) {
        enemy.update(playerPos.x, playerPos.y)

        // Comprobar colisión con el jugador
        if (Phaser.Geom.Rectangle.Overlaps(this.player.sprite.getBounds(), enemy.sprite.getBounds())) {
          // El jugador pierde una vida si no está inmune
          if (this.player.takeDamage()) {
            // Game over si no quedan vidas
            this.scene.start("GameOver", { score: this.score, fromScene: "World1" })
          }
        }
      }
    })

    // Comprobar colisiones entre balas y enemigos
    if (this.player.bullets && this.player.bullets.length > 0) {
      for (const bullet of this.player.bullets) {
        if (bullet.sprite && bullet.sprite.body) {
          // Colisión con obstáculos
          for (const obstacle of this.obstacles) {
            this.physics.add.collider(bullet.sprite, obstacle, () => {
              bullet.destroy()
            })
          }

          // Colisión con enemigos
          for (const enemy of this.enemies) {
            if (enemy.isActive() && bullet.sprite.active) {
              if (Phaser.Geom.Rectangle.Overlaps(bullet.sprite.getBounds(), enemy.sprite.getBounds())) {
                // Dañar al enemigo
                if (enemy.takeDamage()) {
                  // Enemigo eliminado
                  this.score += 10
                  this.enemiesKilled++

                  // Comprobar si se ha completado la horda
                  this.checkHordeCompletion()
                }

                // Destruir la bala
                bullet.destroy()
              }
            }
          }
        }
      }
    }

    // Comprobar si el jugador está sobre una caja y pulsa espacio
    if (Phaser.Input.Keyboard.JustDown(this.player.keys.space)) {
      for (const box of this.supplyBoxes) {
        if (box.collected) continue

        const distance = Phaser.Math.Distance.Between(
          this.player.sprite.x,
          this.player.sprite.y,
          box.sprite.x,
          box.sprite.y,
        )

        if (distance < 70) {
          // Distancia para recoger
          box.collect(this.player)
          break
        }
      }
    }

    // Comprobar si el jugador ha llegado al portal
    if (this.portal) {
      const distance = Phaser.Math.Distance.Between(
        this.player.sprite.x,
        this.player.sprite.y,
        this.portal.sprite.x,
        this.portal.sprite.y,
      )

      if (distance < 60) {
        // Victoria
        this.scene.start("Victory", { score: this.score, fromScene: "World1" })
      }
    }

    // Comprobar si el jugador ha perdido todas las vidas
    if (this.player.lives <= 0) {
      this.scene.start("GameOver", { score: this.score, fromScene: "World1" })
    }
  }

  startNextHorde() {
    // Incrementar contador de horda
    this.currentHorde++

    // Comprobar si hemos completado todas las hordas
    if (this.currentHorde > this.totalHordes) {
      this.showMessage("¡Todas las hordas completadas!")
      this.spawnPortal()
      return
    }

    // Calcular número de enemigos para esta horda
    const enemiesInThisHorde = this.enemiesPerHorde + (this.currentHorde - 1) * 2
    this.enemiesRequired = this.enemiesKilled + enemiesInThisHorde

    // Calcular vida de los enemigos para esta horda
    const enemyHealth = this.enemyBaseHealth + Math.floor((this.currentHorde - 1) / 2)

    // Mostrar mensaje
    this.showMessage(`¡Horda ${this.currentHorde}/${this.totalHordes}!`)

    // Generar enemigos
    for (let i = 0; i < enemiesInThisHorde; i++) {
      // Generar posición aleatoria lejos del jugador
      let x, y
      let tooClose = true

      while (tooClose) {
        x = Phaser.Math.Between(100, this.worldWidth - 100)
        y = Phaser.Math.Between(100, this.worldHeight - 100)

        const distance = Phaser.Math.Distance.Between(this.player.sprite.x, this.player.sprite.y, x, y)

        if (distance > 300) {
          tooClose = false
        }
      }

      // Crear enemigo
      const enemy = new Enemy(this, x, y, enemyHealth)
      this.enemies.push(enemy)
    }
  }

  checkHordeCompletion() {
    // Comprobar si se han eliminado todos los enemigos de la horda actual
    if (this.enemiesKilled >= this.enemiesRequired && this.currentHorde <= this.totalHordes) {
      // Iniciar siguiente horda
      this.startNextHorde()
    }
  }

  spawnPortal() {
    // Generar posición aleatoria para el portal
    const x = Phaser.Math.Between(500, this.worldWidth - 500)
    const y = Phaser.Math.Between(500, this.worldHeight - 500)

    // Crear portal
    this.portal = new Portal(this, x, y)

    // Mostrar mensaje
    this.showMessage("¡Portal abierto! Escapa para ganar.")
  }

  // Método para teletransportar al jugador al inicio
  respawnPlayerAtStart() {
    if (this.player) {
      this.player.sprite.x = 512
      this.player.sprite.y = 600
      this.showMessage("¡Volviendo al inicio!")
    }
  }

  // Método para mostrar mensajes temporales
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
      .setScrollFactor(0)
      .setDepth(99)

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
