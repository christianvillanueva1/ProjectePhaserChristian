export class Enemy {
    constructor(scene, x, y, health) {
      this.scene = scene
      this.health = health
      this.maxHealth = health
      this.speed = 100 + Math.random() * 50 // Velocidad aleatoria entre 100-150
  
      // Crear el enemigo como un rectángulo rojo
      this.sprite = scene.add.rectangle(x, y, 40, 40, 0xff0000)
  
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
  