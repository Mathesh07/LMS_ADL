import Phaser from 'phaser'

export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  backgroundColor: '#2c3e50',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [] // Will be populated dynamically
}

export const GAME_CONSTANTS = {
  PLAYER_SPEED: 160,
  TILE_SIZE: 32,
  MAP_WIDTH: 40,
  MAP_HEIGHT: 25,
  PROXIMITY_THRESHOLD: 100,
  POSITION_UPDATE_RATE: 50, // milliseconds (20fps)
  PLAYER_SIZE: {
    WIDTH: 32,
    HEIGHT: 48
  }
}

export const MAPS = {
  OFFICE: 'office',
  LIBRARY: 'library',
  SCHOOL: 'school'
} as const

export type MapType = typeof MAPS[keyof typeof MAPS]
