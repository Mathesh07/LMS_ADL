import { BaseScene } from './BaseScene'
import { MapConfig } from '../utils/Types'

export class SchoolScene extends BaseScene {
  constructor() {
    super('school')
  }

  getMapConfig(): MapConfig {
    return {
      id: 'school',
      name: 'School Campus',
      tilesetKey: 'school-tileset',
      tilemapKey: 'school-tilemap',
      spawnPoints: [
        { x: 100, y: 400 }, // Main hallway
        { x: 150, y: 400 }, // Near entrance
        { x: 200, y: 400 }  // Alternative spawn
      ],
      interactiveZones: [
        {
          id: 'classroom-1',
          type: 'study-area',
          x: 800,
          y: 150,
          width: 200,
          height: 150,
          metadata: { capacity: 25, hasProjector: true, subject: 'Computer Science' }
        },
        {
          id: 'classroom-2',
          type: 'study-area',
          x: 800,
          y: 350,
          width: 200,
          height: 150,
          metadata: { capacity: 25, hasProjector: true, subject: 'Mathematics' }
        },
        {
          id: 'classroom-3',
          type: 'study-area',
          x: 800,
          y: 550,
          width: 200,
          height: 150,
          metadata: { capacity: 25, hasProjector: true, subject: 'Physics' }
        },
        {
          id: 'common-area',
          type: 'study-area',
          x: 200,
          y: 200,
          width: 300,
          height: 200,
          metadata: { type: 'social', capacity: 50, amenities: ['vending', 'seating'] }
        },
        {
          id: 'library-corner',
          type: 'study-area',
          x: 200,
          y: 450,
          width: 250,
          height: 150,
          metadata: { type: 'quiet', books: true, capacity: 15 }
        },
        {
          id: 'science-lab',
          type: 'study-area',
          x: 200,
          y: 650,
          width: 300,
          height: 120,
          metadata: { type: 'laboratory', equipment: true, capacity: 20 }
        },
        {
          id: 'office-door',
          type: 'teleport',
          x: 1150,
          y: 300,
          width: 32,
          height: 64,
          targetMap: 'office',
          targetX: 1150,
          targetY: 300
        },
        {
          id: 'library-door',
          type: 'teleport',
          x: 50,
          y: 400,
          width: 32,
          height: 64,
          targetMap: 'library',
          targetX: 50,
          targetY: 400
        }
      ],
      backgroundMusic: 'school-ambient'
    }
  }

  protected loadMapAssets(): void {
    // Load school-specific assets
    this.load.image('school-tileset', '/assets/maps/school-tileset.png')
    this.load.tilemapTiledJSON('school-tilemap', '/assets/maps/school-map.json')
    
    // Load school-specific objects
    this.load.image('student-desk', '/assets/objects/student-desk.png')
    this.load.image('teacher-desk', '/assets/objects/teacher-desk.png')
    this.load.image('blackboard', '/assets/objects/blackboard.png')
    this.load.image('lab-table', '/assets/objects/lab-table.png')
    this.load.image('vending-machine', '/assets/objects/vending-machine.png')
    this.load.image('locker', '/assets/objects/locker.png')
    
    // Load audio
    this.load.audio('school-ambient', '/assets/audio/school-ambient.mp3')
  }

  create(): void {
    super.create()
    
    // Add school-specific decorations
    this.createSchoolDecorations()
    
    // Start background music
    this.sound.play('school-ambient', { loop: true, volume: 0.25 })
  }

  private createSchoolDecorations(): void {
    // Add lockers along hallway
    for (let i = 0; i < 10; i++) {
      this.add.image(120, 100 + i * 60, 'locker').setScale(0.6)
      this.add.image(580, 100 + i * 60, 'locker').setScale(0.6)
    }
    
    // Add classroom furniture
    // Classroom 1 - Computer Science
    this.add.image(900, 130, 'blackboard').setScale(0.8)
    this.add.image(950, 130, 'teacher-desk').setScale(0.6)
    for (let i = 0; i < 15; i++) {
      const x = 820 + (i % 5) * 40
      const y = 180 + Math.floor(i / 5) * 40
      this.add.image(x, y, 'student-desk').setScale(0.5)
    }
    
    // Classroom 2 - Mathematics
    this.add.image(900, 330, 'blackboard').setScale(0.8)
    this.add.image(950, 330, 'teacher-desk').setScale(0.6)
    for (let i = 0; i < 15; i++) {
      const x = 820 + (i % 5) * 40
      const y = 380 + Math.floor(i / 5) * 40
      this.add.image(x, y, 'student-desk').setScale(0.5)
    }
    
    // Classroom 3 - Physics
    this.add.image(900, 530, 'blackboard').setScale(0.8)
    this.add.image(950, 530, 'teacher-desk').setScale(0.6)
    for (let i = 0; i < 15; i++) {
      const x = 820 + (i % 5) * 40
      const y = 580 + Math.floor(i / 5) * 40
      this.add.image(x, y, 'student-desk').setScale(0.5)
    }
    
    // Add vending machines in common area
    this.add.image(480, 220, 'vending-machine').setScale(0.7)
    this.add.image(480, 280, 'vending-machine').setScale(0.7)
    
    // Add lab tables in science lab
    for (let i = 0; i < 6; i++) {
      const x = 250 + (i % 3) * 100
      const y = 680 + Math.floor(i / 3) * 60
      this.add.image(x, y, 'lab-table').setScale(0.7)
    }
    
    // Add zone labels
    this.add.text(900, 100, 'Computer Science', {
      fontSize: '12px',
      color: '#1e40af',
      backgroundColor: '#dbeafe',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
    
    this.add.text(900, 300, 'Mathematics', {
      fontSize: '12px',
      color: '#dc2626',
      backgroundColor: '#fecaca',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
    
    this.add.text(900, 500, 'Physics Lab', {
      fontSize: '12px',
      color: '#059669',
      backgroundColor: '#d1fae5',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
    
    this.add.text(350, 150, 'Common Area', {
      fontSize: '14px',
      color: '#7c2d12',
      backgroundColor: '#fed7aa',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5)
    
    this.add.text(325, 420, 'Library Corner', {
      fontSize: '12px',
      color: '#581c87',
      backgroundColor: '#e9d5ff',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
    
    this.add.text(350, 620, 'Science Laboratory', {
      fontSize: '12px',
      color: '#166534',
      backgroundColor: '#bbf7d0',
      padding: { x: 6, y: 3 }
    }).setOrigin(0.5)
  }
}
