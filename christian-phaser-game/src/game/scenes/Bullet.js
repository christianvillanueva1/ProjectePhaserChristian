export class Bullet {
    constructor(scene, x, y, directionX, directionY) {
      this.scene = scene
  
      // Crear la bala como un rectángulo negro
      this.sprite = scene.add.rectangle(x, y, 20, 10, 0x000000)
  
      // Habilitar físicas para la bala
      scene.physics.add.existing(this.sprite)
  
      // Velocidad de la bala
      this.speed = 500
  
      // Normalizar la dirección para mantener la velocidad constante
      const length = Math.sqrt(directionX * directionX + directionY * directionY)
      this.directionX = directionX / length
      this.directionY = directionY / length
  
      // Rotar la bala hacia la dirección del movimiento
      this.sprite.rotation = Math.atan2(directionY, directionX)
  
      // Establecer la velocidad de la bala
      this.sprite.body.setVelocity(this.directionX * this.speed, this.directionY * this.speed)
  
      // Destruir la bala después de 2 segundos
      this.lifespan = 2000 // milisegundos
      this.createTime = Date.now()
    }
  
    update() {
      // Comprobar si la bala debe ser destruida
      if (Date.now() - this.createTime > this.lifespan) {
        this.destroy()
        return false
      }
      return true
    }
  
    destroy() {
      if (this.sprite && this.sprite.body) {
        this.sprite.destroy()
      }
    }
  }
  