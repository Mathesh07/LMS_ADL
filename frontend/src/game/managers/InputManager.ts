export class InputManager {
  private keys: Map<string, boolean> = new Map()
  private scene: Phaser.Scene
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
  private wasdKeys: any = {}

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.setupKeyboard()
  }

  private setupKeyboard(): void {
    // Create cursor keys
    this.cursors = this.scene.input.keyboard?.createCursorKeys() || null

    // Create WASD keys
    if (this.scene.input.keyboard) {
      this.wasdKeys = this.scene.input.keyboard.addKeys('W,S,A,D')
    }

    // Set up key event listeners
    this.scene.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      this.keys.set(event.code, true)
    })

    this.scene.input.keyboard?.on('keyup', (event: KeyboardEvent) => {
      this.keys.set(event.code, false)
    })
  }

  isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false
  }

  getMovementInput(): { x: number; y: number; isMoving: boolean } {
    let x = 0
    let y = 0

    // Check WASD keys
    if (this.wasdKeys.A?.isDown || this.cursors?.left.isDown) {
      x = -1
    } else if (this.wasdKeys.D?.isDown || this.cursors?.right.isDown) {
      x = 1
    }

    if (this.wasdKeys.W?.isDown || this.cursors?.up.isDown) {
      y = -1
    } else if (this.wasdKeys.S?.isDown || this.cursors?.down.isDown) {
      y = 1
    }

    // Normalize diagonal movement
    if (x !== 0 && y !== 0) {
      x *= 0.707 // Math.sqrt(2) / 2
      y *= 0.707
    }

    return {
      x,
      y,
      isMoving: x !== 0 || y !== 0
    }
  }

  getDirection(): 'up' | 'down' | 'left' | 'right' {
    const input = this.getMovementInput()
    
    if (input.x > 0) return 'right'
    if (input.x < 0) return 'left'
    if (input.y > 0) return 'down'
    if (input.y < 0) return 'up'
    
    return 'down' // Default direction
  }

  destroy(): void {
    this.keys.clear()
    this.scene.input.keyboard?.removeAllListeners()
  }
}
