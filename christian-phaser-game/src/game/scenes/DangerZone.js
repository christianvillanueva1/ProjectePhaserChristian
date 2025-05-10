export class DangerZone {
    constructor(scene, x, y) {
      this.scene = scene
  
      // Crear la zona de peligro como un rectángulo rojo
      this.sprite = scene.add.circle(x, y, 50, 0x000000, 1)
  
      // Habilitar físicas para la zona
      scene.physics.add.existing(this.sprite, true) // true = estático
  
  
      // Último daño causado (para evitar daño continuo)
      this.lastDamageTime = 0
      this.damageInterval = 1000 // 1 segundo entre daños
    }
  
    checkCollision(player) {
      const currentTime = Date.now()
  
      // Comprobar si el jugador está tocando la zona y si ha pasado suficiente tiempo desde el último daño
      if (
        this.scene.physics.overlap(player.sprite, this.sprite) &&
        currentTime - this.lastDamageTime > this.damageInterval &&
        !player.isImmune
      ) {
        this.lastDamageTime = currentTime
  
        // Causar daño al jugador
        if (player.takeDamage()) {
          // Game over si no quedan vidas
          return true // Indica que el jugador ha muerto
        }
  
        // Mostrar mensaje
        this.scene.showMessage("Es un agujero!")
      }
  
      return false // El jugador sigue vivo
    }
  }
  