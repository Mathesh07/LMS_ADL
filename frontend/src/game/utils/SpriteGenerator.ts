import Phaser from 'phaser'

export class SpriteGenerator {
  private scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  /**
   * Generate a detailed character sprite with realistic proportions
   * Creates a 4-direction sprite sheet (down, left, right, up) with 4 frames each
   */
  generateCharacterSprite(
    key: string,
    skinTone: number = 0xFDBCB4,
    hairColor: number = 0x8B4513,
    shirtColor: number = 0x4169E1,
    pantsColor: number = 0x2F4F4F
  ): void {
    // Check if texture already exists
    if (this.scene.textures.exists(key)) {
      console.log(`Texture ${key} already exists, skipping generation`)
      return
    }
    const spriteWidth = 32
    const spriteHeight = 48
    const frameWidth = spriteWidth
    const frameHeight = spriteHeight
    const totalFrames = 16 // 4 directions × 4 frames each

    // Create canvas for sprite sheet
    const canvas = this.scene.add.renderTexture(0, 0, frameWidth * 4, frameHeight * 4)
    canvas.setVisible(false)

    // Generate sprites for each direction and frame
    const directions = ['down', 'left', 'right', 'up']
    
    directions.forEach((direction, dirIndex) => {
      for (let frame = 0; frame < 4; frame++) {
        const x = frame * frameWidth
        const y = dirIndex * frameHeight
        
        // Clear the area
        canvas.fill(0x000000, 0, x, y, frameWidth, frameHeight)
        
        // Create character graphics
        const graphics = this.scene.add.graphics()
        
        // Calculate animation offset for walking
        const walkOffset = frame === 1 || frame === 3 ? 1 : 0
        const armSwing = frame === 1 ? -2 : frame === 3 ? 2 : 0
        
        // Draw character based on direction
        this.drawCharacterFrame(
          graphics, 
          direction, 
          skinTone, 
          hairColor, 
          shirtColor, 
          pantsColor,
          walkOffset,
          armSwing
        )
        
        // Render to canvas
        canvas.draw(graphics, x, y)
        graphics.destroy()
      }
    })

    // Generate texture from canvas
    canvas.saveTexture(key)
    canvas.destroy()

    // Wait for next frame to ensure texture is ready, then create animations
    this.scene.time.delayedCall(10, () => {
      this.createCharacterAnimations(key)
    })
  }

  private drawCharacterFrame(
    graphics: Phaser.GameObjects.Graphics,
    direction: string,
    skinTone: number,
    hairColor: number,
    shirtColor: number,
    pantsColor: number,
    walkOffset: number,
    armSwing: number
  ): void {
    const centerX = 16
    const centerY = 24

    // Head
    graphics.fillStyle(skinTone)
    graphics.fillCircle(centerX, centerY - 12, 8)

    // Hair
    graphics.fillStyle(hairColor)
    switch (direction) {
      case 'down':
        graphics.fillRect(centerX - 8, centerY - 20, 16, 8)
        graphics.fillRect(centerX - 6, centerY - 22, 12, 4)
        break
      case 'up':
        graphics.fillRect(centerX - 8, centerY - 20, 16, 8)
        graphics.fillRect(centerX - 6, centerY - 18, 12, 4)
        break
      case 'left':
      case 'right':
        graphics.fillRect(centerX - 8, centerY - 20, 16, 8)
        graphics.fillRect(centerX - 7, centerY - 22, 14, 4)
        break
    }

    // Eyes
    graphics.fillStyle(0x000000)
    if (direction === 'down') {
      graphics.fillCircle(centerX - 3, centerY - 14, 1)
      graphics.fillCircle(centerX + 3, centerY - 14, 1)
    } else if (direction === 'left') {
      graphics.fillCircle(centerX - 2, centerY - 14, 1)
      graphics.fillCircle(centerX + 2, centerY - 14, 1)
    } else if (direction === 'right') {
      graphics.fillCircle(centerX - 2, centerY - 14, 1)
      graphics.fillCircle(centerX + 2, centerY - 14, 1)
    }

    // Body (shirt)
    graphics.fillStyle(shirtColor)
    graphics.fillRect(centerX - 6, centerY - 4, 12, 16)

    // Arms
    graphics.fillStyle(skinTone)
    if (direction === 'down' || direction === 'up') {
      // Arms at sides
      graphics.fillRect(centerX - 10 + armSwing, centerY - 2, 4, 12)
      graphics.fillRect(centerX + 6 - armSwing, centerY - 2, 4, 12)
    } else if (direction === 'left') {
      // Left arm forward, right arm back
      graphics.fillRect(centerX - 10, centerY - 2 + walkOffset, 4, 12)
      graphics.fillRect(centerX + 6, centerY - 2 - walkOffset, 4, 12)
    } else if (direction === 'right') {
      // Right arm forward, left arm back
      graphics.fillRect(centerX - 10, centerY - 2 - walkOffset, 4, 12)
      graphics.fillRect(centerX + 6, centerY - 2 + walkOffset, 4, 12)
    }

    // Legs (pants)
    graphics.fillStyle(pantsColor)
    if (direction === 'down' || direction === 'up') {
      graphics.fillRect(centerX - 5, centerY + 12, 4, 12 + walkOffset)
      graphics.fillRect(centerX + 1, centerY + 12, 4, 12 - walkOffset)
    } else {
      graphics.fillRect(centerX - 5, centerY + 12, 4, 12 + walkOffset)
      graphics.fillRect(centerX + 1, centerY + 12, 4, 12 - walkOffset)
    }

    // Feet
    graphics.fillStyle(0x8B4513) // Brown shoes
    graphics.fillRect(centerX - 6, centerY + 22, 5, 4)
    graphics.fillRect(centerX + 1, centerY + 22, 5, 4)
  }

  private createCharacterAnimations(spriteKey: string): void {
    // Verify texture exists before creating animations
    if (!this.scene.textures.exists(spriteKey)) {
      console.warn(`Texture ${spriteKey} does not exist, cannot create animations`)
      return
    }
    
    // Create animations for each direction
    const directions = ['down', 'left', 'right', 'up']
    
    directions.forEach((direction, dirIndex) => {
      try {
        // Idle animation (just the first frame)
        if (!this.scene.anims.exists(`${spriteKey}-idle-${direction}`)) {
          this.scene.anims.create({
            key: `${spriteKey}-idle-${direction}`,
            frames: this.scene.anims.generateFrameNumbers(spriteKey, {
              start: dirIndex * 4,
              end: dirIndex * 4
            }),
            frameRate: 1,
            repeat: -1
          })
        }

        // Walking animation (all 4 frames)
        if (!this.scene.anims.exists(`${spriteKey}-walk-${direction}`)) {
          this.scene.anims.create({
            key: `${spriteKey}-walk-${direction}`,
            frames: this.scene.anims.generateFrameNumbers(spriteKey, {
              start: dirIndex * 4,
              end: dirIndex * 4 + 3
            }),
            frameRate: 8,
            repeat: -1
          })
        }
      } catch (error) {
        console.error(`Failed to create animation for ${spriteKey}-${direction}:`, error)
      }
    })
    
    console.log(`Created animations for ${spriteKey}`)
  }

  /**
   * Generate a comprehensive library tileset with various furniture and decorations
   */
  generateLibraryTileset(key: string): void {
    // Check if texture already exists
    if (this.scene.textures.exists(key)) {
      console.log(`Tileset ${key} already exists, skipping generation`)
      return
    }
    
    const tileSize = 32
    const tilesPerRow = 8
    const totalTiles = 64 // 8x8 grid of different tiles

    // Create canvas for tileset
    const canvas = this.scene.add.renderTexture(0, 0, tileSize * tilesPerRow, tileSize * tilesPerRow)
    canvas.setVisible(false)

    // Define tile types and their properties
    const tileTypes = [
      // Floor tiles (0-7)
      { type: 'wood-floor', color: 0xDEB887, pattern: 'wood' },
      { type: 'carpet-red', color: 0xDC143C, pattern: 'solid' },
      { type: 'carpet-blue', color: 0x4169E1, pattern: 'solid' },
      { type: 'marble-floor', color: 0xF5F5DC, pattern: 'marble' },
      { type: 'tile-floor', color: 0xE6E6FA, pattern: 'tile' },
      { type: 'wood-dark', color: 0x8B4513, pattern: 'wood' },
      { type: 'carpet-green', color: 0x228B22, pattern: 'solid' },
      { type: 'stone-floor', color: 0x708090, pattern: 'stone' },

      // Wall tiles (8-15)
      { type: 'wall-brick', color: 0xCD853F, pattern: 'brick' },
      { type: 'wall-wood', color: 0xD2691E, pattern: 'wood' },
      { type: 'wall-white', color: 0xF5F5F5, pattern: 'solid' },
      { type: 'wall-stone', color: 0x696969, pattern: 'stone' },
      { type: 'wall-glass', color: 0xE0FFFF, pattern: 'glass' },
      { type: 'wall-bookshelf', color: 0x8B4513, pattern: 'bookshelf' },
      { type: 'wall-window', color: 0x87CEEB, pattern: 'window' },
      { type: 'wall-door', color: 0xA0522D, pattern: 'door' },

      // Furniture tiles (16-31)
      { type: 'bookshelf-full', color: 0x8B4513, pattern: 'bookshelf-full' },
      { type: 'bookshelf-half', color: 0x8B4513, pattern: 'bookshelf-half' },
      { type: 'table-wood', color: 0xDEB887, pattern: 'table' },
      { type: 'table-round', color: 0xDEB887, pattern: 'table-round' },
      { type: 'chair-wood', color: 0x8B4513, pattern: 'chair' },
      { type: 'chair-office', color: 0x000000, pattern: 'chair-office' },
      { type: 'desk-computer', color: 0xA9A9A9, pattern: 'desk' },
      { type: 'sofa-red', color: 0xDC143C, pattern: 'sofa' },
      { type: 'sofa-blue', color: 0x4169E1, pattern: 'sofa' },
      { type: 'lamp-floor', color: 0xFFD700, pattern: 'lamp' },
      { type: 'plant-large', color: 0x228B22, pattern: 'plant' },
      { type: 'plant-small', color: 0x32CD32, pattern: 'plant-small' },
      { type: 'computer', color: 0x2F4F4F, pattern: 'computer' },
      { type: 'printer', color: 0xD3D3D3, pattern: 'printer' },
      { type: 'whiteboard', color: 0xF5F5F5, pattern: 'whiteboard' },
      { type: 'projector', color: 0x2F4F4F, pattern: 'projector' },

      // Decorative tiles (32-47)
      { type: 'books-stack', color: 0x8B4513, pattern: 'books' },
      { type: 'papers', color: 0xF5F5F5, pattern: 'papers' },
      { type: 'coffee-cup', color: 0x8B4513, pattern: 'coffee' },
      { type: 'clock', color: 0xFFD700, pattern: 'clock' },
      { type: 'painting', color: 0x4169E1, pattern: 'painting' },
      { type: 'mirror', color: 0xE0FFFF, pattern: 'mirror' },
      { type: 'trash-can', color: 0x696969, pattern: 'trash' },
      { type: 'fire-extinguisher', color: 0xFF0000, pattern: 'extinguisher' },
      { type: 'water-cooler', color: 0x87CEEB, pattern: 'cooler' },
      { type: 'vending-machine', color: 0xFF4500, pattern: 'vending' },
      { type: 'notice-board', color: 0xF5DEB3, pattern: 'board' },
      { type: 'exit-sign', color: 0x00FF00, pattern: 'exit' },
      { type: 'stairs-up', color: 0x8B4513, pattern: 'stairs' },
      { type: 'stairs-down', color: 0x8B4513, pattern: 'stairs' },
      { type: 'elevator', color: 0xC0C0C0, pattern: 'elevator' },
      { type: 'reception-desk', color: 0xDEB887, pattern: 'reception' },

      // Special tiles (48-63)
      { type: 'study-booth', color: 0x8B4513, pattern: 'booth' },
      { type: 'reading-nook', color: 0xDEB887, pattern: 'nook' },
      { type: 'group-table', color: 0xDEB887, pattern: 'group-table' },
      { type: 'presentation-screen', color: 0x2F4F4F, pattern: 'screen' },
      { type: 'bookcase-corner', color: 0x8B4513, pattern: 'corner' },
      { type: 'study-carrel', color: 0x8B4513, pattern: 'carrel' },
      { type: 'lounge-chair', color: 0x4169E1, pattern: 'lounge' },
      { type: 'coffee-table', color: 0xDEB887, pattern: 'coffee-table' },
      { type: 'magazine-rack', color: 0x8B4513, pattern: 'magazine' },
      { type: 'globe', color: 0x4169E1, pattern: 'globe' },
      { type: 'atlas-stand', color: 0x8B4513, pattern: 'atlas' },
      { type: 'card-catalog', color: 0x8B4513, pattern: 'catalog' },
      { type: 'microfilm-reader', color: 0x2F4F4F, pattern: 'microfilm' },
      { type: 'scanner', color: 0xD3D3D3, pattern: 'scanner' },
      { type: 'photocopier', color: 0xD3D3D3, pattern: 'copier' },
      { type: 'empty', color: 0x000000, pattern: 'empty' }
    ]

    // Generate each tile
    tileTypes.forEach((tile, index) => {
      const x = (index % tilesPerRow) * tileSize
      const y = Math.floor(index / tilesPerRow) * tileSize
      
      const graphics = this.scene.add.graphics()
      this.drawTile(graphics, tile.type, tile.color, tile.pattern, tileSize)
      
      canvas.draw(graphics, x, y)
      graphics.destroy()
    })

    // Generate texture from canvas
    canvas.saveTexture(key)
    canvas.destroy()
  }

  private drawTile(
    graphics: Phaser.GameObjects.Graphics,
    type: string,
    baseColor: number,
    pattern: string,
    size: number
  ): void {
    // Fill base color
    graphics.fillStyle(baseColor)
    graphics.fillRect(0, 0, size, size)

    // Add pattern details based on type
    switch (pattern) {
      case 'wood':
        this.drawWoodPattern(graphics, size)
        break
      case 'brick':
        this.drawBrickPattern(graphics, size)
        break
      case 'bookshelf':
        this.drawBookshelfPattern(graphics, size)
        break
      case 'bookshelf-full':
        this.drawFullBookshelf(graphics, size)
        break
      case 'table':
        this.drawTable(graphics, size)
        break
      case 'chair':
        this.drawChair(graphics, size)
        break
      case 'computer':
        this.drawComputer(graphics, size)
        break
      case 'plant':
        this.drawPlant(graphics, size)
        break
      case 'door':
        this.drawDoor(graphics, size)
        break
      case 'window':
        this.drawWindow(graphics, size)
        break
      // Add more patterns as needed
    }

    // Add border for definition
    graphics.lineStyle(1, 0x000000, 0.3)
    graphics.strokeRect(0, 0, size, size)
  }

  private drawWoodPattern(graphics: Phaser.GameObjects.Graphics, size: number): void {
    graphics.lineStyle(1, 0x8B4513, 0.5)
    for (let i = 0; i < size; i += 4) {
      graphics.lineBetween(0, i, size, i)
    }
  }

  private drawBrickPattern(graphics: Phaser.GameObjects.Graphics, size: number): void {
    graphics.lineStyle(1, 0x8B4513, 0.7)
    const brickHeight = size / 4
    for (let i = 0; i < 4; i++) {
      const y = i * brickHeight
      graphics.lineBetween(0, y, size, y)
      if (i % 2 === 0) {
        graphics.lineBetween(size / 2, y, size / 2, y + brickHeight)
      } else {
        graphics.lineBetween(size / 4, y, size / 4, y + brickHeight)
        graphics.lineBetween(3 * size / 4, y, 3 * size / 4, y + brickHeight)
      }
    }
  }

  private drawBookshelfPattern(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Draw shelf lines
    graphics.lineStyle(2, 0x654321)
    graphics.lineBetween(0, size / 3, size, size / 3)
    graphics.lineBetween(0, 2 * size / 3, size, 2 * size / 3)
    
    // Draw book spines
    const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF]
    for (let i = 0; i < 5; i++) {
      graphics.fillStyle(colors[i % colors.length])
      graphics.fillRect(i * (size / 5), 2, size / 5 - 1, size / 3 - 4)
      graphics.fillRect(i * (size / 5), size / 3 + 2, size / 5 - 1, size / 3 - 4)
      graphics.fillRect(i * (size / 5), 2 * size / 3 + 2, size / 5 - 1, size / 3 - 4)
    }
  }

  private drawFullBookshelf(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Draw multiple shelves with books
    const shelfCount = 4
    const shelfHeight = size / shelfCount
    
    for (let shelf = 0; shelf < shelfCount; shelf++) {
      const y = shelf * shelfHeight
      
      // Draw shelf
      graphics.fillStyle(0x8B4513)
      graphics.fillRect(0, y + shelfHeight - 3, size, 3)
      
      // Draw books
      const bookColors = [0xFF0000, 0x00AA00, 0x0066FF, 0xFFAA00, 0xAA00FF, 0x00AAAA]
      const bookCount = 6
      const bookWidth = size / bookCount
      
      for (let book = 0; book < bookCount; book++) {
        graphics.fillStyle(bookColors[book % bookColors.length])
        graphics.fillRect(
          book * bookWidth + 1, 
          y + 2, 
          bookWidth - 2, 
          shelfHeight - 6
        )
      }
    }
  }

  private drawTable(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Table top
    graphics.fillStyle(0xDEB887)
    graphics.fillRect(2, 2, size - 4, size - 4)
    
    // Table legs
    graphics.fillStyle(0x8B4513)
    graphics.fillRect(4, 4, 3, size - 8)
    graphics.fillRect(size - 7, 4, 3, size - 8)
    graphics.fillRect(4, size - 7, 3, 3)
    graphics.fillRect(size - 7, size - 7, 3, 3)
  }

  private drawChair(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Chair seat
    graphics.fillStyle(0x8B4513)
    graphics.fillRect(6, size / 2, size - 12, size / 3)
    
    // Chair back
    graphics.fillRect(6, 4, size - 12, size / 3)
    
    // Chair legs
    graphics.fillRect(8, size / 2 + size / 3, 2, size / 6)
    graphics.fillRect(size - 10, size / 2 + size / 3, 2, size / 6)
  }

  private drawComputer(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Monitor
    graphics.fillStyle(0x2F2F2F)
    graphics.fillRect(4, 4, size - 8, size / 2)
    
    // Screen
    graphics.fillStyle(0x87CEEB)
    graphics.fillRect(6, 6, size - 12, size / 2 - 4)
    
    // Base
    graphics.fillStyle(0x696969)
    graphics.fillRect(size / 3, size / 2 + 2, size / 3, 4)
    
    // Keyboard
    graphics.fillStyle(0xD3D3D3)
    graphics.fillRect(2, size - 8, size - 4, 6)
  }

  private drawPlant(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Pot
    graphics.fillStyle(0x8B4513)
    graphics.fillRect(size / 4, 3 * size / 4, size / 2, size / 4)
    
    // Plant
    graphics.fillStyle(0x228B22)
    graphics.fillCircle(size / 2, size / 2, size / 3)
    
    // Leaves
    graphics.fillStyle(0x32CD32)
    graphics.fillCircle(size / 3, size / 3, size / 6)
    graphics.fillCircle(2 * size / 3, size / 3, size / 6)
  }

  private drawDoor(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Door frame
    graphics.fillStyle(0x8B4513)
    graphics.fillRect(0, 0, size, size)
    
    // Door panel
    graphics.fillStyle(0xA0522D)
    graphics.fillRect(2, 2, size - 4, size - 4)
    
    // Door handle
    graphics.fillStyle(0xFFD700)
    graphics.fillCircle(size - 8, size / 2, 2)
  }

  private drawWindow(graphics: Phaser.GameObjects.Graphics, size: number): void {
    // Window frame
    graphics.fillStyle(0x8B4513)
    graphics.fillRect(0, 0, size, size)
    
    // Glass
    graphics.fillStyle(0x87CEEB)
    graphics.fillRect(2, 2, size - 4, size - 4)
    
    // Window cross
    graphics.lineStyle(2, 0x8B4513)
    graphics.lineBetween(size / 2, 2, size / 2, size - 2)
    graphics.lineBetween(2, size / 2, size - 2, size / 2)
  }
}
