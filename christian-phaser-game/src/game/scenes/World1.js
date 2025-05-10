import { Scene } from "phaser"
import { Player } from "./Player"
import { SupplyBox } from "./SupplyBox"
import { Enemy } from "./Enemy"
import { Portal } from "./Portal"
import { PauseMenu } from "./PauseMenu"
import { DangerZone } from "./DangerZone"
import Phaser from "phaser"

export class World1 extends Scene {
  constructor() {
    super("World1")

    // Estas variables se inicializarán en init() para asegurar un reinicio correcto
  }

  init() {
    this.sound.stopAll()
    this.sound.play("music2", {
      loop: true,
      volume: 0.5,
    })
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
    this.worldWidth = 4000
    this.worldHeight = 4000

    // Arrays para limpiar en reinicio
    this.enemies = []
    this.obstacles = []
    this.supplyBoxes = []
    this.dangerZones = []
  }

  create() {

    const { width, height } = this.cameras.main


    // Fondo simple
    const bg = this.add.tileSprite(0, 0, this.worldWidth, this.worldHeight, 'planet1bg');
    bg.setOrigin(0, 0);

    // Habilitar físicas y establecer límites del mundo
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    // Título del nivel
    this.add
      .text(width / 2, 50, "MUNDO 1", {
        fontFamily: "Arial Black",
        fontSize: 32,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0).setDepth(100)

    // Mostrar puntuación
    this.scoreText = this.add
      .text(50, 50, "Puntuación: 0", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0).setDepth(100)

    this.livesText = this.add
      .text(50, 90, "♥ ♥ ♥", {
        fontFamily: "Arial",
        fontSize: 60,
        // color red
        color: "#ff0000",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setScrollFactor(0).setDepth(100)
    // Mostrar vidas y munición
    this.bulletsText = this.add
      .text(50, height - 90, "45", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
      })
      .setScrollFactor(0).setDepth(100)

    // Mostrar información de horda
    this.hordeText = this.add
      .text(width - 200, 40, "Horda: 0/" + this.totalHordes, {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0).setDepth(100)
    this.enemiesText = this.add
      .text(width - 220, 70, "Enemigos: 0/", {
        fontFamily: "Arial",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0).setDepth(100)

    // Instrucciones
    this.add
      .text(width / 2, height / 2 + 300, "WASD: Mover | CLIC: Disparar\nESPACIO: Recoger caja | E: Usar habilidad", {
        fontFamily: "Arial",
        fontSize: 18,
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
        zindex: 100,
      })
      .setOrigin(0.5)
      .setScrollFactor(0).setDepth(100)

    // eliminar el texto de instrucciones después de 5 segundos
    this.time.delayedCall(5000, () => {
      this.tweens.add({
        targets: this.children.list.filter((child) => child.text === "WASD: Mover | CLIC: Disparar\nESPACIO: Recoger caja | E: Usar habilidad"),
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.children.list.filter((child) => child.text === "WASD: Mover | CLIC: Disparar\nESPACIO: Recoger caja | E: Usar habilidad").forEach((child) => child.destroy())
        },
      })
    })

    // Crear el jugador (cuadrado azul)
    this.player = new Player(this, 512, 600)

    // Crear borde del mapa

    // Nota: No usamos setupCollision aquí para permitir que el jugador toque el borde
    // y reciba daño, en lugar de ser bloqueado por la colisión física

    // Añadir algunos obstáculos para mostrar el movimiento
    this.obstacles = []

    const exclusionObstacleRange = 500 // Puedes cambiar este valor para hacerlo más grande

    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 100)
      const y = Phaser.Math.Between(100, this.worldHeight - 100)

      let tooCloseToPlayer = x > 512 - exclusionObstacleRange && x < 512 + exclusionObstacleRange &&
        y > 600 - exclusionObstacleRange && y < 600 + exclusionObstacleRange

      let tooCloseToObstacles = this.obstacles.some(obstacle => {
        const distance = Phaser.Math.Distance.Between(x, y, obstacle.x, obstacle.y)
        return distance < 500
      })

      let tooCloseToDangerZones = this.dangerZones.some(zone => {
        const distance = Phaser.Math.Distance.Between(x, y, zone.sprite.x, zone.sprite.y)
        return distance < 500
      })

      if (!tooCloseToPlayer && !tooCloseToObstacles && !tooCloseToDangerZones) {

        const randomImage = Phaser.Math.Between(0, 1) === 0 ? "stone" : "tree"
        const obstacle = this.add.image(x, y, randomImage)
        obstacle.setOrigin(0.5, 0.5)
        obstacle.setDisplaySize(210, 175) // Tamaño del obstáculo
        this.physics.add.existing(obstacle, true)

        // Colisión con el jugador
        this.physics.add.collider(this.player.sprite, obstacle)

        // Guardar referencia al obstáculo
        this.obstacles.push(obstacle)
      } else {
        console.log("Obstáculo demasiado cerca de otro objeto, reintentando...")
        i-- // Reintenta si la zona está demasiado cerca de otro objeto
      }
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

    const exclusionRange = 500 // Puedes cambiar este valor para hacerlo más grande

    for (let i = 0; i < 12; i++) {
      const x = Phaser.Math.Between(100, this.worldWidth - 100)
      const y = Phaser.Math.Between(100, this.worldHeight - 100)

      // Asegurar que no está dentro del área de exclusión centrada en (512, 600)
      let tooCloseToPlayer = x > 512 - exclusionRange && x < 512 + exclusionRange &&
        y > 600 - exclusionRange && y < 600 + exclusionRange

      let tooCloseToObstacles = this.obstacles.some(obstacle => {
        const distance = Phaser.Math.Distance.Between(x, y, obstacle.x, obstacle.y)
        return distance < 500
      })

      let tooCloseToDangerZones = this.dangerZones.some(zone => {
        const distance = Phaser.Math.Distance.Between(x, y, zone.sprite.x, zone.sprite.y)
        return distance < 500
      })

      if (!tooCloseToPlayer && !tooCloseToObstacles && !tooCloseToDangerZones) {
        const zone = new DangerZone(this, x, y)
        this.dangerZones.push(zone)
      } else {
        console.log("Zona de peligro demasiado cerca de otro objeto, reintentando...")
        i-- // Reintenta si la zona está demasiado cerca de otro objeto
      }
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
      .text(this.cameras.main.width - 50, 50, "⏸", {
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

  }

  update() {
    // No actualizar si el juego está pausado
    if (this.pauseMenu && this.pauseMenu.isActive) return

    // Actualizar el jugador
    this.player.update()

    // Actualizar la puntuación y estadísticas
    this.scoreText.setText("Puntuación: " + this.score)
    this.bulletsText.setText(`${this.player.ammo}`)
    this.livesText.setText(
      "♥ ".repeat(this.player.lives),
      0,
    )

    // Actualizar información de horda
    if (this.currentHorde <= this.totalHordes) {
      this.hordeText.setText(
        `Horda: ${this.currentHorde}/${this.totalHordes}`,
      )
      this.enemiesText.setText(`Enemigos: ${this.enemiesKilled}/${this.enemiesRequired}`)
    } else {
      this.hordeText.setText(`Horda: ${this.currentHorde - 1}/${this.totalHordes}`)
      this.enemiesText.setText("Enemigos: " + this.enemiesKilled + "/" + this.enemiesRequired)
    }


    // Comprobar colisión con el borde del mapa


    // Comprobar zonas de peligro
    for (const zone of this.dangerZones) {
      if (zone.checkCollision(this.player)) {
        // Game over si el jugador ha muerto
        this.sound.play("gameover")
        this.scene.start("GameOver", { score: this.score, fromScene: "World1" })
      }
    }

    // Actualizar enemigos
    const playerPos = this.player.getPosition()
    this.enemies.forEach((enemy) => {
      if (enemy.isActive()) {
        enemy.update(playerPos.x, playerPos.y)

        // otra forma de comprobar colisión con el jugador mas eficiente
        if (this.physics.overlap(this.player.sprite, enemy.sprite)) {
          // El jugador pierde una vida si no está inmune
          if (this.player.takeDamage()) {
            // Game over si no quedan vidas
            this.sound.play("gameover")

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
              if (this.physics.overlap(bullet.sprite, enemy.sprite)) {
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
        this.sound.play("level-complete")
        this.scene.start("Victory", { score: this.score, fromScene: "World1" })
      }
    }

    // Comprobar si el jugador ha perdido todas las vidas
    if (this.player.lives <= 0) {
      this.sound.play("gameover")

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

      for (const obstacle of this.obstacles) {
        // Comprobar colisión con obstáculos
        this.physics.add.collider(enemy.sprite, obstacle)
      }
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
    // sonido portal
    this.sound.play("portal-open")
    // generar el portal a 500 pixeles del j
    let x = this.player.sprite.x + Phaser.Math.Between(300, 500)
    let y = this.player.sprite.y + Phaser.Math.Between(300, 500)
    // Asegurarse de que el portal no esté fuera de los límites del mundo
    if (x < 100) x = 100
    if (x > this.worldWidth - 100) x = this.worldWidth - 100
    if (y < 100) y = 100
    if (y > this.worldHeight - 100) y = this.worldHeight - 100

    // Asegurarse de que el portal no esté dentro de una zona de peligro
    for (const zone of this.dangerZones) {
      const distanceToZone = Phaser.Math.Distance.Between(x, y, zone.sprite.x, zone.sprite.y)
      if (distanceToZone < 200) {
        // Si está demasiado cerca de una zona de peligro
        x = this.player.sprite.x + Phaser.Math.Between(300, 500)
        y = this.player.sprite.y + Phaser.Math.Between(300, 500)
      }
    }
    // Asegurarse de que el portal no esté dentro de un obstáculo
    for (const obstacle of this.obstacles) {
      const distanceToObstacle = Phaser.Math.Distance.Between(x, y, obstacle.x, obstacle.y)
      if (distanceToObstacle < 200) {
        // Si está demasiado cerca de un obstáculo
        x = this.player.sprite.x + Phaser.Math.Between(300, 500)
        y = this.player.sprite.y + Phaser.Math.Between(300, 500)
      }
    }


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
    const { width, height } = this.cameras.main;

    // Calcular el desplazamiento (Y) dependiendo de cuántos mensajes estén activos
    let offsetY = 0;
    if (this.activeMessages && this.activeMessages.length > 0) {
      // Si ya hay mensajes, calculamos el espacio total que ocupan
      offsetY = this.activeMessages.reduce((totalHeight, message) => totalHeight + message.height + 20, 0); // 20 es el espacio entre los mensajes
    }

    // Crear el nuevo mensaje
    const message = this.add
      .text(width / 2, height / 2 + offsetY - 350, text, {
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
      .setDepth(99);

    // Añadir el mensaje al array de mensajes activos
    if (!this.activeMessages) {
      this.activeMessages = [];
    }
    this.activeMessages.push(message);

    // Hacer que el mensaje desaparezca después de 2 segundos
    this.tweens.add({
      targets: message,
      alpha: 0,
      duration: 500,
      delay: 1500,
      onComplete: () => {
        message.destroy();
        // Limpiar el mensaje de la lista de mensajes activos
        this.activeMessages = this.activeMessages.filter(m => m !== message);
      },
    });
  }


}
