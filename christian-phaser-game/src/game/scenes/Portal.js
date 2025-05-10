export class Portal {
    constructor(scene, x, y) {
      this.scene = scene
  
      // Crear el portal como un rectángulo morado
      this.sprite = scene.add.image(x, y, "portal")
  
      // Habilitar físicas para el portal
      scene.physics.add.existing(this.sprite, true) // true = estático
  
      // Añadir efecto de brillo
      scene.tweens.add({
        targets: this.sprite,
        alpha: 0.7,
        duration: 1000,
        yoyo: true,
        repeat: -1,
      })
    }
  }
  