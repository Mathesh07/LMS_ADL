import Phaser from 'phaser'
import { InputManager } from '../managers/InputManager'
import { SocketManager } from '../managers/SocketManager'
import { Player } from '../entities/Player'
import { SpriteGenerator } from '../utils/SpriteGenerator'
import { MapConfig, PlayerData, InteractiveZone } from '../utils/Types'
import { GAME_CONSTANTS } from '../utils/GameConfig'
import { MapTileData } from '../utils/LibraryMapData'

export abstract class BaseScene extends Phaser.Scene {
  protected inputManager: InputManager | null = null
  protected socketManager: SocketManager | null = null
  protected localPlayer: Player | null = null
  protected players: Map<string, Player> = new Map()
  protected mapConfig: MapConfig | null = null
  protected tilemap: Phaser.Tilemaps.Tilemap | null = null
  protected collisionLayer: Phaser.Tilemaps.TilemapLayer | null = null
  protected interactiveZones: InteractiveZone[] = []
  protected mapData: MapTileData | null = null

  constructor(key: string) {
    super({ key })
  }

  // Abstract methods that must be implemented by child classes
  abstract getMapConfig(): MapConfig
  protected abstract getMapData(): MapTileData | null

  preload(): void {
    // Load common assets
    this.loadCommonAssets()
    // Load map-specific assets
    this.loadMapAssets()
  }

  create(): void {
    console.log('BaseScene create() called')
    this.mapConfig = this.getMapConfig()
    console.log('Map config:', this.mapConfig)
    
    // Generate sprites first
    console.log('Generating sprites...')
    this.generateSprites()
    
    // Create tilemap
    console.log('Creating tilemap...')
    this.createTilemap()
    
    // Set up input
    this.inputManager = new InputManager(this)
    
    // Set up socket connection
    this.setupSocketConnection()
    
    // Create local player
    console.log('Creating local player...')
    this.createLocalPlayer()
    
    // Set up collision detection
    this.setupCollisions()
    
    // Set up interactive zones
    this.setupInteractiveZones()
    
    // Set up camera
    this.setupCamera()
    
    console.log('BaseScene create() completed')
  }

  update(): void {
    if (this.localPlayer && this.inputManager) {
      this.handlePlayerInput()
    }
    
    // Update all players
    this.players.forEach(player => {
      if (player.active) {
        player.updateNamePosition()
      }
    })
    
    // Check for zone interactions
    if (this.localPlayer) {
      this.checkZoneInteractions()
    }
  }

  protected loadCommonAssets(): void {
    // Common assets will be generated programmatically
    console.log('Loading common assets...')
  }

  protected loadMapAssets(): void {
    // Map-specific assets will be generated programmatically
    console.log('Loading map assets...')
  }

  private generateSprites(): void {
    console.log('Generating sprites and tileset...')
    
    const spriteGenerator = new SpriteGenerator(this)
    
    // Generate character sprites
    if (!this.textures.exists('player-sprite')) {
      console.log('Creating player-sprite...')
      spriteGenerator.generateCharacterSprite('player-sprite')
    }
    if (!this.textures.exists('player-sprite-alt1')) {
      console.log('Creating player-sprite-alt1...')
      spriteGenerator.generateCharacterSprite('player-sprite-alt1', 0xD2B48C, 0x8B4513, 0x4169E1)
    }
    if (!this.textures.exists('player-sprite-alt2')) {
      console.log('Creating player-sprite-alt2...')
      spriteGenerator.generateCharacterSprite('player-sprite-alt2', 0x8D5524, 0x000000, 0x228B22)
    }
    
    // Generate library tileset
    if (!this.textures.exists('library-tileset')) {
      console.log('Creating library-tileset...')
      spriteGenerator.generateLibraryTileset('library-tileset')
      console.log('Library tileset created')
    }
    
    // Create placeholder texture as fallback
    if (!this.textures.exists('placeholder')) {
      console.log('Creating placeholder texture...')
      const graphics = this.add.graphics()
      graphics.fillStyle(0x00ff00)
      graphics.fillRect(0, 0, 32, 48)
      graphics.generateTexture('placeholder', 32, 48)
      graphics.destroy()
    }
    
    console.log('Sprites and tileset generation completed')
  }

  private createFallbackTileset(): void {
    console.log('Creating fallback tileset...')
    
    // Create a simple colored tileset as fallback
    const graphics = this.add.graphics()
    const canvas = this.add.renderTexture(0, 0, 256, 256)
    
    // Create basic tiles
    const tileSize = 32
    const tilesPerRow = 8
    
    for (let i = 0; i < 64; i++) {
      const x = (i % tilesPerRow) * tileSize
      const y = Math.floor(i / tilesPerRow) * tileSize
      
      graphics.clear()
      
      // Different colors for different tile types
      if (i < 8) {
        graphics.fillStyle(0x8B4513) // Brown for floors
      } else if (i < 16) {
        graphics.fillStyle(0x654321) // Dark brown for walls
      } else if (i < 24) {
        graphics.fillStyle(0x228B22) // Green for decorations
      } else {
        graphics.fillStyle(0x4169E1) // Blue for furniture
      }
      
      graphics.fillRect(0, 0, tileSize, tileSize)
      graphics.lineStyle(1, 0x000000, 0.3)
      graphics.strokeRect(0, 0, tileSize, tileSize)
      
      canvas.draw(graphics, x, y)
    }
    
    canvas.saveTexture('library-tileset')
    canvas.destroy()
    graphics.destroy()
    
    console.log('Created fallback tileset')
  }

  private setupSocketConnection(): void {
    console.log('Setting up socket connection...')
    this.socketManager = new SocketManager()
    
    // Set up socket event listeners
    this.socketManager.on('player-joined', (playerData: PlayerData) => {
      this.addRemotePlayer(playerData)
    })
    
    this.socketManager.on('player-left', (playerId: string) => {
      this.removePlayer(playerId)
    })
    
    this.socketManager.on('player-moved', (data: { id: string; x: number; y: number }) => {
      this.updatePlayerPosition(data.id, data.x, data.y)
    })
    
    console.log('Socket connection set up')
  }

  private createLocalPlayer(): void {
    if (!this.mapConfig) return
    
    const playerData: PlayerData = {
      id: 'local-player',
      name: 'Player',
      x: this.mapConfig.spawnPoint?.x || 100,
      y: this.mapConfig.spawnPoint?.y || 100,
      status: 'online'
    }
    
    this.localPlayer = new Player(this, playerData, true)
    this.players.set(playerData.id, this.localPlayer)
    
    // Notify other players about new player
    this.socketManager?.emit('player-joined', playerData)
  }

  private setupCollisions(): void {
    if (!this.localPlayer || !this.collisionLayer) return
    
    // Set up collision between player and collision layer
    this.physics.add.collider(this.localPlayer, this.collisionLayer)
    
    // Set up collision for all players
    this.players.forEach(player => {
      if (player !== this.localPlayer) {
        this.physics.add.collider(player, this.collisionLayer)
      }
    })
  }

  private setupInteractiveZones(): void {
    // Set up interactive zones based on map config
    if (this.mapConfig?.interactiveZones) {
      this.interactiveZones = this.mapConfig.interactiveZones
      
      this.interactiveZones.forEach(zone => {
        const zoneSprite = this.add.rectangle(
          zone.x,
          zone.y,
          zone.width,
          zone.height,
          0x0000ff,
          0.3
        )
        
        // Make interactive
        zoneSprite.setInteractive()
        this.physics.add.existing(zoneSprite, true)
        
        // Add pointer events
        zoneSprite.on('pointerover', () => {
          zoneSprite.setFillStyle(0x00ff00, 0.3)
        })
        
        zoneSprite.on('pointerout', () => {
          zoneSprite.setFillStyle(0x0000ff, 0.3)
        })
      })
    }
  }

  private setupCamera(): void {
    if (!this.localPlayer) return
    
    // Make camera follow the local player
    this.cameras.main.startFollow(this.localPlayer)
    
    // Set bounds to prevent camera from going outside the map
    if (this.tilemap) {
      this.cameras.main.setBounds(
        0,
        0,
        this.tilemap.widthInPixels,
        this.tilemap.heightInPixels
      )
    }
    
    // Set zoom level
    this.cameras.main.setZoom(1)
  }

  private handlePlayerInput(): void {
    if (!this.localPlayer || !this.inputManager) return
    
    const input = this.inputManager.getInput()
    
    // Reset velocity
    let velocityX = 0
    let velocityY = 0
    
    // Update velocity based on input
    if (input.left) velocityX = -GAME_CONSTANTS.PLAYER_SPEED
    if (input.right) velocityX = GAME_CONSTANTS.PLAYER_SPEED
    if (input.up) velocityY = -GAME_CONSTANTS.PLAYER_SPEED
    if (input.down) velocityY = GAME_CONSTANTS.PLAYER_SPEED
    
    // Apply velocity to player
    this.localPlayer.setVelocity(velocityX, velocityY)
    
    // Update player animation based on movement
    if (velocityX !== 0 || velocityY !== 0) {
      this.localPlayer.playWalkAnimation(velocityX, velocityY)
      
      // Notify other players about movement
      this.socketManager?.emit('player-moved', {
        id: 'local-player',
        x: this.localPlayer.x,
        y: this.localPlayer.y
      })
    } else {
      this.localPlayer.playIdleAnimation()
    }
  }

  private checkZoneInteractions(): void {
    if (!this.localPlayer) return
    
    this.interactiveZones.forEach(zone => {
      // Simple distance check for interaction
      const distance = Phaser.Math.Distance.Between(
        this.localPlayer!.x,
        this.localPlayer!.y,
        zone.x,
        zone.y
      )
      
      if (distance < zone.radius) {
        // Player is in interaction zone
        this.handleZoneInteraction(zone)
      }
    })
  }

  private handleZoneInteraction(zone: InteractiveZone): void {
    console.log(`Interacting with zone: ${zone.type}`, zone)
    
    // Handle different zone types
    switch (zone.type) {
      case 'info':
        // Show info popup
        console.log('Showing info:', zone.data?.text || 'No info available')
        break
        
      case 'teleport':
        // Teleport player to target location
        if (zone.data?.target) {
          this.localPlayer?.setPosition(zone.data.target.x, zone.data.target.y)
        }
        break
        
      case 'trigger':
        // Trigger custom event
        this.events.emit(zone.data?.event || 'zone-triggered', zone)
        break
    }
  }

  public addRemotePlayer(playerData: PlayerData): void {
    // Don't add if it's the local player or already exists
    if (playerData.id === 'local-player' || this.players.has(playerData.id)) {
      return
    }
    
    console.log('Adding remote player:', playerData.id)
    const player = new Player(this, playerData, false)
    this.players.set(playerData.id, player)
    
    // Set up collision for remote players
    if (this.collisionLayer) {
      this.physics.add.collider(player, this.collisionLayer)
    }
  }

  public removePlayer(playerId: string): void {
    const player = this.players.get(playerId)
    if (player) {
      console.log('Removing player:', playerId)
      player.destroy()
      this.players.delete(playerId)
    }
  }

  public updatePlayerPosition(playerId: string, x: number, y: number): void {
    const player = this.players.get(playerId)
    if (player && playerId !== 'local-player') {
      player.updatePosition(x, y)
    }
  }

  private createTilemap(): void {
    console.log('Creating tilemap...')
    this.mapData = this.getMapData()
    
    if (!this.mapData) {
      console.error('No map data available')
      return
    }

    // Create tilemap from data
    this.tilemap = this.make.tilemap({
      width: this.mapData.width,
      height: this.mapData.height,
      tileWidth: GAME_CONSTANTS.TILE_SIZE,
      tileHeight: GAME_CONSTANTS.TILE_SIZE
    })

    // Add tileset to the map
    const tileset = this.tilemap.addTilesetImage('library-tileset', 'library-tileset', 
      GAME_CONSTANTS.TILE_SIZE, GAME_CONSTANTS.TILE_SIZE, 0, 0)
    
    if (!tileset) {
      console.error('Failed to load tileset')
      return
    }

    // Create ground layer
    const groundLayer = this.tilemap.createBlankLayer('ground', tileset, 0, 0)
    if (groundLayer) {
      // Fill ground layer with default tile (0)
      groundLayer.fill(0, 0, 0, this.mapData.width, this.mapData.height)
    }

    // Create collision layer
    this.collisionLayer = this.tilemap.createBlankLayer('collision', tileset, 0, 0)
    if (this.collisionLayer) {
      // Set collision for specific tiles if needed
      this.collisionLayer.setCollisionByProperty({ collides: true })
    }

    // Set world bounds
    this.physics.world.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    )

    console.log('Tilemap created successfully')
  }

  private handleSpecialAreaInteraction(zone: InteractiveZone): void {
    // Emit event for UI to show interaction options
    this.events.emit('zone-interaction', zone)
  }

  protected changeMap(mapId: string, x: number, y: number): void {
    // Notify server of map change (mock mode for now)
    console.log(`Map change requested: ${mapId}`)
    
    // Change scene
    this.scene.start(mapId, { x, y, playerData: this.localPlayer?.getPlayerData() })
  }

  shutdown(): void {
    // Clean up resources when the scene is shut down
    console.log('Shutting down BaseScene...')
    
    // Clean up players
    this.players.forEach(player => player.destroy())
    this.players.clear()
    
    // Clean up tilemap
    if (this.tilemap) {
      this.tilemap.destroy()
      this.tilemap = null
    }
    
    // Reset other properties
    this.localPlayer = null
    this.collisionLayer = null
    this.interactiveZones = []
    this.mapData = null
    
    // Clean up input
    if (this.inputManager) {
      this.inputManager.destroy()
      this.inputManager = null
    }
    
    // Clean up socket connection
    if (this.socketManager) {
      this.socketManager.disconnect()
      this.socketManager = null
    }
    
    console.log('BaseScene shutdown complete')
  }

}
