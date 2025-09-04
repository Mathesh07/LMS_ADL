import { BaseScene } from './BaseScene'
import { MapConfig } from '../utils/Types'

export class OfficeScene extends BaseScene {
  constructor() {
    super('office')
  }

  getMapConfig(): MapConfig {
    return {
      id: 'office',
      name: 'Office Space',
      tilesetKey: 'office-tileset',
      tilemapKey: 'office-tilemap',
      spawnPoints: [
        { x: 100, y: 400 }, // Reception area
        { x: 200, y: 400 }, // Near entrance
        { x: 300, y: 400 }  // Alternative spawn
      ],
      interactiveZones: [
        {
          id: 'meeting-room-1',
          type: 'meeting-room',
          x: 800,
          y: 200,
          width: 200,
          height: 150,
          metadata: { capacity: 8, hasProjector: true }
        },
        {
          id: 'meeting-room-2',
          type: 'meeting-room',
          x: 800,
          y: 400,
          width: 200,
          height: 150,
          metadata: { capacity: 6, hasWhiteboard: true }
        },
        {
          id: 'coffee-area',
          type: 'study-area',
          x: 200,
          y: 600,
          width: 150,
          height: 100,
          metadata: { type: 'casual', amenities: ['coffee', 'snacks'] }
        },
        {
          id: 'open-desk-area',
          type: 'study-area',
          x: 400,
          y: 600,
          width: 300,
          height: 150,
          metadata: { type: 'collaborative', desks: 6 }
        },
        {
          id: 'library-door',
          type: 'teleport',
          x: 50,
          y: 300,
          width: 32,
          height: 64,
          targetMap: 'library',
          targetX: 1150,
          targetY: 300
        },
        {
          id: 'school-door',
          type: 'teleport',
          x: 1150,
          y: 300,
          width: 32,
          height: 64,
          targetMap: 'school',
          targetX: 50,
          targetY: 300
        }
      ],
      backgroundMusic: 'office-ambient'
    }
  }

  protected loadMapAssets(): void {
    // Create simple placeholder assets programmatically
    this.load.on('complete', () => {
      // Create desk sprite
      const deskGraphics = this.add.graphics()
      deskGraphics.fillStyle(0x8B4513) // Brown
      deskGraphics.fillRect(0, 0, 64, 32)
      deskGraphics.generateTexture('desk', 64, 32)
      deskGraphics.destroy()
      
      // Create chair sprite
      const chairGraphics = this.add.graphics()
      chairGraphics.fillStyle(0x654321) // Dark brown
      chairGraphics.fillRect(0, 0, 24, 24)
      chairGraphics.generateTexture('chair', 24, 24)
      chairGraphics.destroy()
      
      // Create coffee machine sprite
      const coffeeGraphics = this.add.graphics()
      coffeeGraphics.fillStyle(0x2F4F4F) // Dark slate gray
      coffeeGraphics.fillRect(0, 0, 32, 48)
      coffeeGraphics.generateTexture('coffee-machine', 32, 48)
      coffeeGraphics.destroy()
      
      // Create projector sprite
      const projectorGraphics = this.add.graphics()
      projectorGraphics.fillStyle(0x696969) // Dim gray
      projectorGraphics.fillRect(0, 0, 40, 24)
      projectorGraphics.generateTexture('projector', 40, 24)
      projectorGraphics.destroy()
    })
  }

  create(): void {
    super.create()
    
    // Add office-specific decorations
    this.createOfficeDecorations()
  }

  private createOfficeDecorations(): void {
    // Add desks in open area
    for (let i = 0; i < 6; i++) {
      const x = 450 + (i % 3) * 100
      const y = 650 + Math.floor(i / 3) * 80
      this.add.image(x, y, 'desk').setScale(0.8)
      this.add.image(x, y + 20, 'chair').setScale(0.6)
    }
    
    // Add coffee machine
    this.add.image(250, 650, 'coffee-machine').setScale(0.7)
    
    // Add projectors in meeting rooms
    this.add.image(900, 180, 'projector').setScale(0.5)
    this.add.image(900, 380, 'projector').setScale(0.5)
    
    // Add zone labels
    this.add.text(900, 120, 'Meeting Room 1', {
      fontSize: '14px',
      color: '#333333',
      backgroundColor: '#ffffff',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5)
    
    this.add.text(900, 320, 'Meeting Room 2', {
      fontSize: '14px',
      color: '#333333',
      backgroundColor: '#ffffff',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5)
    
    this.add.text(275, 580, 'Coffee Area', {
      fontSize: '12px',
      color: '#654321',
      backgroundColor: '#f4e4c1',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
    
    this.add.text(550, 580, 'Open Workspace', {
      fontSize: '12px',
      color: '#2c3e50',
      backgroundColor: '#ecf0f1',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
  }
}
