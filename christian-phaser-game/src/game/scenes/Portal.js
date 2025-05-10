export class Portal {
    constructor(scene, x, y) {
      this.scene = scene
  
      // Crear el portal como un rectángulo morado
      this.sprite = scene.add.rectangle(x, y, 80, 80, 0x8800ff)
  
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
  
      // Añadir texto
      this.text = scene.add
        .text(x, y, "PORTAL", {
          fontFamily: "Arial Black",
          fontSize: 14,
          color: "#ffffff",
        })
        .setOrigin(0.5)
  
      // Añadir efecto de rotación al texto
      scene.tweens.add({
        targets: this.text,
        angle: 360,
        duration: 6000,
        repeat: -1,
      })
    }
  }
  