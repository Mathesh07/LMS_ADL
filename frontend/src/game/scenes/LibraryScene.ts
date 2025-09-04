import { BaseScene } from './BaseScene'
import { MapConfig } from '../utils/Types'
import { LibraryMapData, MapTileData } from '../utils/LibraryMapData'

export class LibraryScene extends BaseScene {
  constructor() {
    super('library')
  }

  protected getMapData(): MapTileData | null {
    return LibraryMapData.generateLibraryMap()
  }

  getMapConfig(): MapConfig {
    return {
      id: 'library',
      name: 'Library',
      tilesetKey: 'library-tileset',
      tilemapKey: 'library-tilemap',
      spawnPoints: [
        { x: 20 * 32, y: 23 * 32 }, // Main entrance
        { x: 19 * 32, y: 23 * 32 }, // Near entrance
        { x: 21 * 32, y: 23 * 32 }  // Alternative spawn
      ],
      interactiveZones: [
        {
          id: 'study-room-1',
          type: 'study-area',
          x: 800,
          y: 150,
          width: 150,
          height: 120,
          metadata: { capacity: 4, hasWhiteboard: true, quiet: true }
        },
        {
          id: 'study-room-2',
          type: 'study-area',
          x: 800,
          y: 300,
          width: 150,
          height: 120,
          metadata: { capacity: 4, hasWhiteboard: true, quiet: true }
        },
        {
          id: 'study-room-3',
          type: 'study-area',
          x: 800,
          y: 450,
          width: 150,
          height: 120,
          metadata: { capacity: 4, hasWhiteboard: true, quiet: true }
        },
        {
          id: 'reading-area',
          type: 'study-area',
          x: 200,
          y: 200,
          width: 300,
          height: 200,
          metadata: { type: 'quiet', chairs: 12, tables: 4 }
        },
        {
          id: 'group-study',
          type: 'study-area',
          x: 200,
          y: 450,
          width: 300,
          height: 150,
          metadata: { type: 'collaborative', capacity: 8, hasProjector: true }
        },
        {
          id: 'computer-lab',
          type: 'study-area',
          x: 200,
          y: 650,
          width: 300,
          height: 120,
          metadata: { type: 'digital', computers: 10, printers: 2 }
        },
        {
          id: 'office-door',
          type: 'teleport',
          x: 1150,
          y: 300,
          width: 32,
          height: 64,
          targetMap: 'office',
          targetX: 50,
          targetY: 300
        },
        {
          id: 'school-door',
          type: 'teleport',
          x: 50,
          y: 400,
          width: 32,
          height: 64,
          targetMap: 'school',
          targetX: 1150,
          targetY: 400
        }
      ],
      backgroundMusic: 'library-ambient'
    }
  }

  protected loadMapAssets(): void {
    // Library-specific assets are now generated programmatically
    // The tileset is created by SpriteGenerator in BaseScene
    
    // Load audio if available (optional)
    // this.load.audio('library-ambient', '/assets/audio/library-ambient.mp3')
  }

  create(): void {
    super.create()
    
    // Add library-specific decorations and labels
    this.createLibraryLabels()
    
    // Start background music if available
    if (this.sound.exists('library-ambient')) {
      this.sound.play('library-ambient', { loop: true, volume: 0.2 })
    }
  }

  private createLibraryLabels(): void {
    // Add informational labels for different areas
    // These are positioned based on the generated map layout
    
    // Computer Lab label
    this.add.text(20 * 32, 5 * 32, 'Computer Lab', {
      fontSize: '14px',
      color: '#1e3a8a',
      backgroundColor: '#dbeafe',
      padding: { x: 8, y: 4 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
    
    // Reading Area label
    this.add.text(20 * 32, 19 * 32, 'Quiet Reading Area', {
      fontSize: '14px',
      color: '#8b4513',
      backgroundColor: '#f5f5dc',
      padding: { x: 8, y: 4 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
    
    // Study Areas labels
    this.add.text(15 * 32, 6 * 32, 'Group Study', {
      fontSize: '12px',
      color: '#4a4a4a',
      backgroundColor: '#e8e8e8',
      padding: { x: 6, y: 3 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
    
    this.add.text(25 * 32, 6 * 32, 'Group Study', {
      fontSize: '12px',
      color: '#4a4a4a',
      backgroundColor: '#e8e8e8',
      padding: { x: 6, y: 3 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
    
    // Entrance label
    this.add.text(20 * 32, 22 * 32, 'Main Entrance', {
      fontSize: '12px',
      color: '#2c3e50',
      backgroundColor: '#ecf0f1',
      padding: { x: 6, y: 3 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
    
    // Bookshelf sections labels
    this.add.text(7 * 32, 8 * 32, 'Fiction', {
      fontSize: '10px',
      color: '#8b4513',
      backgroundColor: '#f5f5dcaa',
      padding: { x: 4, y: 2 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
    
    this.add.text(33 * 32, 8 * 32, 'Non-Fiction', {
      fontSize: '10px',
      color: '#8b4513',
      backgroundColor: '#f5f5dcaa',
      padding: { x: 4, y: 2 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
    
    // Reference section
    this.add.text(5 * 32, 20 * 32, 'Reference', {
      fontSize: '10px',
      color: '#8b4513',
      backgroundColor: '#f5f5dcaa',
      padding: { x: 4, y: 2 },
      fontFamily: 'Arial, sans-serif'
    }).setOrigin(0.5).setDepth(1000)
  }
}
