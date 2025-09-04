import Phaser from 'phaser'
import { GAME_CONFIG } from './utils/GameConfig'
import { OfficeScene } from './scenes/OfficeScene'
import { LibraryScene } from './scenes/LibraryScene'
import { SchoolScene } from './scenes/SchoolScene'

export class GameManager {
  private game: Phaser.Game | null = null
  private isInitialized: boolean = false

  constructor(private containerId: string) {}

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Configure scenes
        const config = {
          ...GAME_CONFIG,
          parent: this.containerId,
          scene: [OfficeScene, LibraryScene, SchoolScene]
        }

        // Create game instance
        this.game = new Phaser.Game(config)

        // Wait for game to be ready
        this.game.events.once('ready', () => {
          console.log('Phaser game initialized successfully')
          this.isInitialized = true
          
          // Start with library scene by default (where our enhanced map is)
          this.startScene('library')
          resolve()
        })

        // Add timeout to catch initialization issues
        setTimeout(() => {
          if (!this.isInitialized) {
            console.error('Game initialization timeout - forcing initialization')
            this.isInitialized = true
            this.startScene('library')
            resolve()
          }
        }, 2000)

        // Handle errors
        this.game.events.on('error', (error: Error) => {
          console.error('Phaser game error:', error)
          reject(error)
        })

      } catch (error) {
        console.error('Failed to initialize Phaser game:', error)
        reject(error)
      }
    })
  }

  startScene(sceneKey: string, data?: any): void {
    if (!this.game || !this.isInitialized) {
      console.error('Game not initialized')
      return
    }

    try {
      // Stop current scene and start new one
      this.game.scene.start(sceneKey, data)
      console.log(`Started scene: ${sceneKey}`)
    } catch (error) {
      console.error(`Failed to start scene ${sceneKey}:`, error)
    }
  }

  pauseGame(): void {
    if (this.game && this.isInitialized) {
      const activeScenes = this.game.scene.getScenes(true)
      activeScenes.forEach(scene => this.game?.scene.pause(scene.scene.key))
    }
  }

  resumeGame(): void {
    if (this.game && this.isInitialized) {
      const pausedScenes = this.game.scene.getScenes(false)
      pausedScenes.forEach(scene => this.game?.scene.resume(scene.scene.key))
    }
  }

  resizeGame(width: number, height: number): void {
    if (this.game && this.isInitialized) {
      this.game.scale.resize(width, height)
    }
  }

  destroy(): void {
    if (this.game) {
      this.game.destroy(true)
      this.game = null
      this.isInitialized = false
      console.log('Phaser game destroyed')
    }
  }

  // Getters
  getGame(): Phaser.Game | null {
    return this.game
  }

  isGameInitialized(): boolean {
    return this.isInitialized
  }

  getCurrentScene(): Phaser.Scene | null {
    if (!this.game || !this.isInitialized) return null
    
    const activeScenes = this.game.scene.getScenes(true)
    return activeScenes.length > 0 ? activeScenes[0] : null
  }

  // Event handling
  onSceneReady(callback: (scene: Phaser.Scene) => void): void {
    if (this.game) {
      this.game.events.on('scene-ready', callback)
    }
  }

  onSceneChange(callback: (sceneKey: string) => void): void {
    if (this.game) {
      this.game.events.on('scene-change', callback)
    }
  }
}
