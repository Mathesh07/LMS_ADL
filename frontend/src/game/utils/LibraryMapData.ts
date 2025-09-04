export interface TileData {
  id: number
  hasCollision: boolean
  isInteractive: boolean
  type: string
}

export interface MapTileData {
  width: number
  height: number
  tileSize: number
  backgroundLayer: number[][]
  collisionLayer: number[][]
  decorationLayer: number[][]
  tileProperties: { [key: number]: TileData }
}

export class LibraryMapData {
  static readonly MAP_WIDTH = 40
  static readonly MAP_HEIGHT = 25
  static readonly TILE_SIZE = 32

  // Tile ID constants for easy reference
  static readonly TILES = {
    // Floor tiles (0-7)
    WOOD_FLOOR: 0,
    CARPET_RED: 1,
    CARPET_BLUE: 2,
    MARBLE_FLOOR: 3,
    TILE_FLOOR: 4,
    WOOD_DARK: 5,
    CARPET_GREEN: 6,
    STONE_FLOOR: 7,

    // Wall tiles (8-15)
    WALL_BRICK: 8,
    WALL_WOOD: 9,
    WALL_WHITE: 10,
    WALL_STONE: 11,
    WALL_GLASS: 12,
    WALL_BOOKSHELF: 13,
    WALL_WINDOW: 14,
    WALL_DOOR: 15,

    // Furniture tiles (16-31)
    BOOKSHELF_FULL: 16,
    BOOKSHELF_HALF: 17,
    TABLE_WOOD: 18,
    TABLE_ROUND: 19,
    CHAIR_WOOD: 20,
    CHAIR_OFFICE: 21,
    DESK_COMPUTER: 22,
    SOFA_RED: 23,
    SOFA_BLUE: 24,
    LAMP_FLOOR: 25,
    PLANT_LARGE: 26,
    PLANT_SMALL: 27,
    COMPUTER: 28,
    PRINTER: 29,
    WHITEBOARD: 30,
    PROJECTOR: 31,

    // Decorative tiles (32-47)
    BOOKS_STACK: 32,
    PAPERS: 33,
    COFFEE_CUP: 34,
    CLOCK: 35,
    PAINTING: 36,
    MIRROR: 37,
    TRASH_CAN: 38,
    FIRE_EXTINGUISHER: 39,
    WATER_COOLER: 40,
    VENDING_MACHINE: 41,
    NOTICE_BOARD: 42,
    EXIT_SIGN: 43,
    STAIRS_UP: 44,
    STAIRS_DOWN: 45,
    ELEVATOR: 46,
    RECEPTION_DESK: 47,

    // Special tiles (48-63)
    STUDY_BOOTH: 48,
    READING_NOOK: 49,
    GROUP_TABLE: 50,
    PRESENTATION_SCREEN: 51,
    BOOKCASE_CORNER: 52,
    STUDY_CARREL: 53,
    LOUNGE_CHAIR: 54,
    COFFEE_TABLE: 55,
    MAGAZINE_RACK: 56,
    GLOBE: 57,
    ATLAS_STAND: 58,
    CARD_CATALOG: 59,
    MICROFILM_READER: 60,
    SCANNER: 61,
    PHOTOCOPIER: 62,
    EMPTY: 63
  }

  static generateLibraryMap(): MapTileData {
    const width = this.MAP_WIDTH
    const height = this.MAP_HEIGHT

    // Initialize layers
    const backgroundLayer = this.createEmptyLayer(width, height, this.TILES.WOOD_FLOOR)
    const collisionLayer = this.createEmptyLayer(width, height, 0)
    const decorationLayer = this.createEmptyLayer(width, height, 0)

    // Create tile properties
    const tileProperties = this.createTileProperties()

    // Build the library layout
    this.buildLibraryLayout(backgroundLayer, collisionLayer, decorationLayer, width, height)

    return {
      width,
      height,
      tileSize: this.TILE_SIZE,
      backgroundLayer,
      collisionLayer,
      decorationLayer,
      tileProperties
    }
  }

  private static createEmptyLayer(width: number, height: number, fillValue: number = 0): number[][] {
    return Array(height).fill(null).map(() => Array(width).fill(fillValue))
  }

  private static createTileProperties(): { [key: number]: TileData } {
    const properties: { [key: number]: TileData } = {}

    // Floor tiles - no collision
    for (let i = 0; i <= 7; i++) {
      properties[i] = { id: i, hasCollision: false, isInteractive: false, type: 'floor' }
    }

    // Wall tiles - have collision
    for (let i = 8; i <= 15; i++) {
      properties[i] = { id: i, hasCollision: true, isInteractive: i === 15, type: 'wall' } // Door is interactive
    }

    // Furniture tiles - have collision
    for (let i = 16; i <= 31; i++) {
      properties[i] = { id: i, hasCollision: true, isInteractive: i === 28 || i === 29, type: 'furniture' } // Computer and printer interactive
    }

    // Decorative tiles - some have collision
    for (let i = 32; i <= 47; i++) {
      const hasCollision = ![32, 33, 34, 35, 36, 37, 42, 43].includes(i) // Small items don't block movement
      properties[i] = { id: i, hasCollision, isInteractive: [40, 41, 44, 45, 46].includes(i), type: 'decoration' }
    }

    // Special tiles - most have collision
    for (let i = 48; i <= 63; i++) {
      properties[i] = { id: i, hasCollision: i !== 63, isInteractive: [48, 49, 50, 51, 53].includes(i), type: 'special' }
    }

    return properties
  }

  private static buildLibraryLayout(
    background: number[][],
    collision: number[][],
    decoration: number[][],
    width: number,
    height: number
  ): void {
    // Create perimeter walls
    this.createPerimeterWalls(collision, width, height)

    // Create main library sections
    this.createEntranceArea(background, decoration, width, height)
    this.createBookshelfSections(background, collision, decoration, width, height)
    this.createStudyAreas(background, collision, decoration, width, height)
    this.createComputerLab(background, collision, decoration, width, height)
    this.createReadingAreas(background, collision, decoration, width, height)
    this.createSpecialAreas(background, collision, decoration, width, height)

    // Add decorative elements
    this.addDecorations(decoration, width, height)
  }

  private static createPerimeterWalls(collision: number[][], width: number, height: number): void {
    // Top and bottom walls
    for (let x = 0; x < width; x++) {
      collision[0][x] = this.TILES.WALL_BRICK
      collision[height - 1][x] = this.TILES.WALL_BRICK
    }

    // Left and right walls
    for (let y = 0; y < height; y++) {
      collision[y][0] = this.TILES.WALL_BRICK
      collision[y][width - 1] = this.TILES.WALL_BRICK
    }

    // Add entrance doors
    collision[height - 1][width / 2] = this.TILES.WALL_DOOR // Main entrance
    collision[height - 1][width / 2 + 1] = this.TILES.WALL_DOOR // Double door
  }

  private static createEntranceArea(background: number[][], decoration: number[][], width: number, height: number): void {
    // Entrance lobby with marble flooring
    for (let y = height - 5; y < height - 1; y++) {
      for (let x = Math.floor(width / 2) - 3; x <= Math.floor(width / 2) + 3; x++) {
        background[y][x] = this.TILES.MARBLE_FLOOR
      }
    }

    // Reception desk
    decoration[height - 3][Math.floor(width / 2) - 1] = this.TILES.RECEPTION_DESK
    decoration[height - 3][Math.floor(width / 2)] = this.TILES.RECEPTION_DESK
    decoration[height - 3][Math.floor(width / 2) + 1] = this.TILES.RECEPTION_DESK

    // Information displays
    decoration[height - 4][Math.floor(width / 2) - 4] = this.TILES.NOTICE_BOARD
    decoration[height - 4][Math.floor(width / 2) + 4] = this.TILES.NOTICE_BOARD
  }

  private static createBookshelfSections(
    background: number[][],
    collision: number[][],
    decoration: number[][],
    width: number,
    height: number
  ): void {
    // Left bookshelf section
    for (let y = 2; y < height - 6; y++) {
      for (let x = 2; x < 12; x += 3) {
        if (y % 4 === 2) { // Create aisles every 4 rows
          continue
        }
        collision[y][x] = this.TILES.BOOKSHELF_FULL
        collision[y][x + 1] = this.TILES.BOOKSHELF_FULL
      }
    }

    // Right bookshelf section
    for (let y = 2; y < height - 6; y++) {
      for (let x = width - 12; x < width - 2; x += 3) {
        if (y % 4 === 2) { // Create aisles every 4 rows
          continue
        }
        collision[y][x] = this.TILES.BOOKSHELF_FULL
        collision[y][x + 1] = this.TILES.BOOKSHELF_FULL
      }
    }

    // Central bookshelf island
    for (let y = 8; y < 16; y++) {
      for (let x = Math.floor(width / 2) - 2; x <= Math.floor(width / 2) + 2; x++) {
        if (y === 12) continue // Leave gap for walking through
        collision[y][x] = this.TILES.BOOKSHELF_FULL
      }
    }
  }

  private static createStudyAreas(
    background: number[][],
    collision: number[][],
    decoration: number[][],
    width: number,
    height: number
  ): void {
    // Individual study carrels along walls
    const carrelPositions = [
      { x: 1, y: 2 }, { x: 1, y: 4 }, { x: 1, y: 6 }, { x: 1, y: 8 },
      { x: width - 2, y: 2 }, { x: width - 2, y: 4 }, { x: width - 2, y: 6 }, { x: width - 2, y: 8 }
    ]

    carrelPositions.forEach(pos => {
      collision[pos.y][pos.x] = this.TILES.STUDY_CARREL
      decoration[pos.y + 1][pos.x] = this.TILES.CHAIR_WOOD
    })

    // Group study tables in center area
    const groupTablePositions = [
      { x: Math.floor(width / 2) - 6, y: 4 },
      { x: Math.floor(width / 2) + 4, y: 4 },
      { x: Math.floor(width / 2) - 6, y: 18 },
      { x: Math.floor(width / 2) + 4, y: 18 }
    ]

    groupTablePositions.forEach(pos => {
      // Create 2x2 group study table
      collision[pos.y][pos.x] = this.TILES.GROUP_TABLE
      collision[pos.y][pos.x + 1] = this.TILES.GROUP_TABLE
      collision[pos.y + 1][pos.x] = this.TILES.GROUP_TABLE
      collision[pos.y + 1][pos.x + 1] = this.TILES.GROUP_TABLE

      // Add chairs around the table
      decoration[pos.y - 1][pos.x] = this.TILES.CHAIR_WOOD
      decoration[pos.y - 1][pos.x + 1] = this.TILES.CHAIR_WOOD
      decoration[pos.y + 2][pos.x] = this.TILES.CHAIR_WOOD
      decoration[pos.y + 2][pos.x + 1] = this.TILES.CHAIR_WOOD
      decoration[pos.y][pos.x - 1] = this.TILES.CHAIR_WOOD
      decoration[pos.y + 1][pos.x - 1] = this.TILES.CHAIR_WOOD
      decoration[pos.y][pos.x + 2] = this.TILES.CHAIR_WOOD
      decoration[pos.y + 1][pos.x + 2] = this.TILES.CHAIR_WOOD
    })
  }

  private static createComputerLab(
    background: number[][],
    collision: number[][],
    decoration: number[][],
    width: number,
    height: number
  ): void {
    // Computer lab area with special flooring
    const labStartX = 14
    const labEndX = 26
    const labStartY = 2
    const labEndY = 8

    // Special flooring for computer lab
    for (let y = labStartY; y <= labEndY; y++) {
      for (let x = labStartX; x <= labEndX; x++) {
        background[y][x] = this.TILES.TILE_FLOOR
      }
    }

    // Computer desks in rows
    for (let y = labStartY + 1; y < labEndY; y += 2) {
      for (let x = labStartX + 1; x < labEndX; x += 3) {
        collision[y][x] = this.TILES.DESK_COMPUTER
        decoration[y][x] = this.TILES.COMPUTER
        decoration[y + 1][x] = this.TILES.CHAIR_OFFICE
      }
    }

    // Printers and scanner station
    collision[labStartY + 1][labEndX - 1] = this.TILES.PRINTER
    collision[labStartY + 3][labEndX - 1] = this.TILES.SCANNER
    collision[labStartY + 5][labEndX - 1] = this.TILES.PHOTOCOPIER
  }

  private static createReadingAreas(
    background: number[][],
    collision: number[][],
    decoration: number[][],
    width: number,
    height: number
  ): void {
    // Quiet reading area with comfortable seating
    const readingStartX = 14
    const readingEndX = 26
    const readingStartY = 16
    const readingEndY = 22

    // Carpet for reading area
    for (let y = readingStartY; y <= readingEndY; y++) {
      for (let x = readingStartX; x <= readingEndX; x++) {
        background[y][x] = this.TILES.CARPET_BLUE
      }
    }

    // Reading nooks with comfortable chairs
    const nookPositions = [
      { x: readingStartX + 1, y: readingStartY + 1 },
      { x: readingStartX + 4, y: readingStartY + 1 },
      { x: readingStartX + 7, y: readingStartY + 1 },
      { x: readingStartX + 10, y: readingStartY + 1 },
      { x: readingStartX + 1, y: readingStartY + 4 },
      { x: readingStartX + 4, y: readingStartY + 4 },
      { x: readingStartX + 7, y: readingStartY + 4 },
      { x: readingStartX + 10, y: readingStartY + 4 }
    ]

    nookPositions.forEach(pos => {
      decoration[pos.y][pos.x] = this.TILES.LOUNGE_CHAIR
      decoration[pos.y + 1][pos.x] = this.TILES.COFFEE_TABLE
    })

    // Magazine and newspaper racks
    decoration[readingStartY][readingStartX + 6] = this.TILES.MAGAZINE_RACK
    decoration[readingEndY][readingStartX + 6] = this.TILES.ATLAS_STAND
  }

  private static createSpecialAreas(
    background: number[][],
    collision: number[][],
    decoration: number[][],
    width: number,
    height: number
  ): void {
    // Reference section
    for (let x = 2; x < 8; x++) {
      collision[height - 8][x] = this.TILES.BOOKCASE_CORNER
    }
    decoration[height - 7][4] = this.TILES.GLOBE
    decoration[height - 7][6] = this.TILES.ATLAS_STAND

    // Presentation area
    collision[2][Math.floor(width / 2) - 8] = this.TILES.PRESENTATION_SCREEN
    decoration[3][Math.floor(width / 2) - 8] = this.TILES.PROJECTOR

    // Study booths for private study
    const boothPositions = [
      { x: width - 8, y: height - 8 },
      { x: width - 8, y: height - 6 },
      { x: width - 6, y: height - 8 },
      { x: width - 6, y: height - 6 }
    ]

    boothPositions.forEach(pos => {
      collision[pos.y][pos.x] = this.TILES.STUDY_BOOTH
    })
  }

  private static addDecorations(decoration: number[][], width: number, height: number): void {
    // Plants for ambiance
    const plantPositions = [
      { x: 3, y: 3 }, { x: width - 4, y: 3 },
      { x: 3, y: height - 4 }, { x: width - 4, y: height - 4 },
      { x: Math.floor(width / 2), y: 6 },
      { x: Math.floor(width / 2), y: height - 8 }
    ]

    plantPositions.forEach((pos, index) => {
      decoration[pos.y][pos.x] = index % 2 === 0 ? this.TILES.PLANT_LARGE : this.TILES.PLANT_SMALL
    })

    // Floor lamps for lighting
    decoration[5][8] = this.TILES.LAMP_FLOOR
    decoration[5][width - 9] = this.TILES.LAMP_FLOOR
    decoration[height - 9][8] = this.TILES.LAMP_FLOOR
    decoration[height - 9][width - 9] = this.TILES.LAMP_FLOOR

    // Utility items
    decoration[2][2] = this.TILES.FIRE_EXTINGUISHER
    decoration[2][width - 3] = this.TILES.FIRE_EXTINGUISHER
    decoration[height - 3][2] = this.TILES.WATER_COOLER
    decoration[height - 3][width - 3] = this.TILES.VENDING_MACHINE

    // Trash cans
    decoration[6][6] = this.TILES.TRASH_CAN
    decoration[6][width - 7] = this.TILES.TRASH_CAN
    decoration[height - 7][6] = this.TILES.TRASH_CAN
    decoration[height - 7][width - 7] = this.TILES.TRASH_CAN

    // Exit signs
    decoration[1][Math.floor(width / 2)] = this.TILES.EXIT_SIGN
    decoration[height - 2][Math.floor(width / 2)] = this.TILES.EXIT_SIGN
  }
}
