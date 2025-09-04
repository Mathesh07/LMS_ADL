import Phaser from 'phaser'
import { PlayerData } from '../utils/Types'
import { GAME_CONSTANTS } from '../utils/GameConfig'

export class Player extends Phaser.Physics.Arcade.Sprite {
  public playerData: PlayerData
  private nameText: Phaser.GameObjects.Text
  private statusIcon: Phaser.GameObjects.Image | null = null
  private isLocalPlayer: boolean

  constructor(
    scene: Phaser.Scene,
    playerData: PlayerData,
    isLocalPlayer: boolean = false
  ) {
    // Choose sprite based on player type, with fallback
    let spriteKey = 'player-sprite'
    if (!isLocalPlayer) {
      const altKeys = ['player-sprite-alt1', 'player-sprite-alt2']
      spriteKey = altKeys[Math.floor(Math.random() * altKeys.length)]
    }
    
    // Fallback to placeholder if sprite doesn't exist
    if (!scene.textures.exists(spriteKey)) {
      console.warn(`Sprite ${spriteKey} not found, using placeholder`)
      spriteKey = 'placeholder'
    }
    
    super(scene, playerData.x, playerData.y, spriteKey)
    
    this.playerData = playerData
    this.isLocalPlayer = isLocalPlayer
    
    // Add to scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    
    // Set up physics
    this.setSize(GAME_CONSTANTS.PLAYER_SIZE.WIDTH, GAME_CONSTANTS.PLAYER_SIZE.HEIGHT)
    this.setCollideWorldBounds(true)
    
    // Set physics body offset for better collision
    this.body!.setOffset(8, 16) // Offset to match sprite proportions
    
    // Create name text above player
    this.nameText = scene.add.text(
      this.x,
      this.y - 35,
      playerData.name,
      {
        fontSize: '12px',
        color: '#ffffff',
        backgroundColor: '#000000aa',
        padding: { x: 6, y: 3 },
        fontFamily: 'Arial, sans-serif'
      }
    )
    this.nameText.setOrigin(0.5)
    this.nameText.setDepth(1000) // Ensure name is always on top
    
    // Set up animations
    this.createAnimations()
    
    // Start with idle animation (with delay to ensure animations are ready)
    this.scene.time.delayedCall(50, () => {
      const animKey = `${this.texture.key}-idle-down`
      if (this.scene.anims.exists(animKey)) {
        this.play(animKey)
      } else {
        console.warn(`Animation ${animKey} not ready yet`)
        // Try again after a longer delay
        this.scene.time.delayedCall(100, () => {
          if (this.scene.anims.exists(animKey)) {
            this.play(animKey)
          }
        })
      }
    })
    
    // Set depth for proper layering
    this.setDepth(100)
  }

  private createAnimations(): void {
    // Animations are created by the SpriteGenerator
    // They follow the pattern: {spriteKey}-{action}-{direction}
    // Actions: idle, walk
    // Directions: down, left, right, up
    
    // Verify animations exist
    const spriteKey = this.texture.key
    const directions = ['down', 'left', 'right', 'up']
    const actions = ['idle', 'walk']
    
    let animationsExist = true
    for (const action of actions) {
      for (const direction of directions) {
        const animKey = `${spriteKey}-${action}-${direction}`
        if (!this.scene.anims.exists(animKey)) {
          console.warn(`Animation ${animKey} does not exist`)
          animationsExist = false
        }
      }
    }
    
    if (!animationsExist) {
      console.warn('Some animations are missing for sprite:', spriteKey)
    }
  }

  updateMovement(velocity: { x: number; y: number }, direction: 'up' | 'down' | 'left' | 'right', isMoving: boolean): void {
    // Update physics velocity
    this.setVelocity(velocity.x, velocity.y)
    
    // Update player data
    this.playerData.direction = direction
    this.playerData.isMoving = isMoving
    
    // Play appropriate animation
    const spriteKey = this.texture.key
    const action = isMoving ? 'walk' : 'idle'
    const animKey = `${spriteKey}-${action}-${direction}`
    
    if (this.scene.anims.exists(animKey)) {
      this.play(animKey, true)
    } else {
      // Animation not ready yet, try again after a short delay
      this.scene.time.delayedCall(50, () => {
        if (this.scene.anims.exists(animKey)) {
          this.play(animKey, true)
        }
      })
    }
    
    // Update UI positions
    this.updateNamePosition()
  }

  updateNamePosition(): void {
    // Update name text position
    this.nameText.setPosition(this.x, this.y - 35)
    
    // Update status icon position
    if (this.statusIcon) {
      this.statusIcon.setPosition(this.x + 20, this.y - 25)
    }
  }

  updateFromRemoteData(remoteData: Partial<PlayerData>): void {
    if (!this.isLocalPlayer) {
      // Smooth interpolation for remote players
      if (remoteData.x !== undefined && remoteData.y !== undefined) {
        const targetX = remoteData.x
        const targetY = remoteData.y
        
        // Use tweens for smooth movement
        this.scene.tweens.add({
          targets: this,
          x: targetX,
          y: targetY,
          duration: GAME_CONSTANTS.POSITION_UPDATE_RATE,
          ease: 'Linear'
        })
      }
      
      // Update animation if direction or movement state changed
      if (remoteData.direction !== undefined || remoteData.isMoving !== undefined) {
        const direction = remoteData.direction || this.playerData.direction
        const isMoving = remoteData.isMoving !== undefined ? remoteData.isMoving : this.playerData.isMoving
        const action = isMoving ? 'walk' : 'idle'
        const spriteKey = this.texture.key
        const animKey = `${spriteKey}-${action}-${direction}`
        
        if (this.scene.anims.exists(animKey)) {
          this.play(animKey, true)
        } else {
          // Animation not ready yet, try again after a short delay
          this.scene.time.delayedCall(50, () => {
            if (this.scene.anims.exists(animKey)) {
              this.play(animKey, true)
            }
          })
        }
      }
      
      // Update player data
      Object.assign(this.playerData, remoteData)
    }
  }


  setStatus(status: 'online' | 'away' | 'busy'): void {
    this.playerData.status = status
    
    // Remove existing status icon
    if (this.statusIcon) {
      this.statusIcon.destroy()
      this.statusIcon = null
    }
    
    // Add new status icon
    let iconFrame = 0
    switch (status) {
      case 'online':
        iconFrame = 0 // Green dot
        break
      case 'away':
        iconFrame = 1 // Yellow dot
        break
      case 'busy':
        iconFrame = 2 // Red dot
        break
    }
    
    const statusTexture = status === 'online' ? 'status-online' : 
                          status === 'away' ? 'status-away' : 'status-busy'
    
    this.statusIcon = this.scene.add.image(this.x + 15, this.y - 20, statusTexture)
    this.statusIcon.setScale(0.8)
    this.statusIcon.setDepth(1001) // Above name text
  }

  updateStatusIconPosition(): void {
    if (this.statusIcon) {
      this.statusIcon.setPosition(this.x + 15, this.y - 20)
    }
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta)
    
    // Update UI elements position
    this.updateNamePosition()
    this.updateStatusIconPosition()
  }

  destroy(): void {
    if (this.nameText) {
      this.nameText.destroy()
    }
    if (this.statusIcon) {
      this.statusIcon.destroy()
    }
    super.destroy()
  }

  // Getters
  getPlayerData(): PlayerData {
    return { ...this.playerData }
  }

  isLocal(): boolean {
    return this.isLocalPlayer
  }
}
