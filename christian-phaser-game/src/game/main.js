import { Boot } from "./scenes/Boot"
import { Preloader } from "./scenes/Preloader"
import { MainMenu } from "./scenes/MainMenu"
import { WorldSelect } from "./scenes/WorldSelect"
import { World1 } from "./scenes/World1"
import { World2 } from "./scenes/World2"
import { Victory } from "./scenes/Victory"
import { GameOver } from "./scenes/GameOver"
import { AUTO, Game, Scale } from "phaser"

const config = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  // Añadir configuración de físicas
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }, // Sin gravedad para movimiento en todas direcciones
      debug: false,
    },
  },
  scene: [Boot, Preloader, MainMenu, WorldSelect, World1, World2, Victory, GameOver],
}

const StartGame = (parent) => {
  return new Game({ ...config, parent })
}

export default StartGame
