import { io, Socket } from 'socket.io-client'
import { PlayerData, SocketEvents } from '../utils/Types'
import { GAME_CONSTANTS } from '../utils/GameConfig'

export class SocketManager {
  private socket: Socket | null = null
  private isConnected: boolean = false
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  private positionUpdateTimer: NodeJS.Timeout | null = null

  constructor(private serverUrl: string = 'http://localhost:8000') {}

  async connect(playerData: PlayerData): Promise<void> {
    return new Promise((resolve, reject) => {
      // For now, simulate connection without actual backend
      console.log('Simulating socket connection (backend not available)')
      
      // Create a mock socket for development
      this.socket = {
        id: 'mock-' + Math.random().toString(36).substr(2, 9),
        emit: (event: string, ...args: any[]) => {
          console.log(`Mock emit: ${event}`, args)
        },
        on: (event: string, callback: Function) => {
          console.log(`Mock listener registered for: ${event}`)
        },
        disconnect: () => {
          console.log('Mock socket disconnected')
        }
      } as any
      
      // Simulate successful connection
      setTimeout(() => {
        resolve()
      }, 100)
      
      /* Original WebSocket code - uncomment when backend is ready
      this.socket = io('ws://localhost:8000', {
        transports: ['websocket'],
        timeout: 5000
      })

      this.socket.on('connect', () => {
        console.log('Connected to server')
        this.isConnected = true
        this.reconnectAttempts = 0
        
        // Send initial player data
        this.socket?.emit('player-join', playerData)
        resolve()
      })

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server')
        this.isConnected = false
        this.stopPositionUpdates()
      })

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error)
        this.handleReconnection()
        reject(error)
      })

      // Set connection timeout
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'))
        }
      }, 10000)
      */
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    this.isConnected = false
    this.stopPositionUpdates()
  }

  // Player movement and position updates
  updatePlayerPosition(playerData: PlayerData): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('player-move', playerData)
    }
  }

  startPositionUpdates(getPlayerData: () => PlayerData): void {
    this.stopPositionUpdates()
    
    this.positionUpdateTimer = setInterval(() => {
      if (this.isConnected) {
        const playerData = getPlayerData()
        this.updatePlayerPosition(playerData)
      }
    }, GAME_CONSTANTS.POSITION_UPDATE_RATE)
  }

  stopPositionUpdates(): void {
    if (this.positionUpdateTimer) {
      clearInterval(this.positionUpdateTimer)
      this.positionUpdateTimer = null
    }
  }

  // Map changes
  changeMap(mapId: string): void {
    if (this.isConnected && this.socket) {
      this.socket.emit('map-change', mapId)
    }
  }

  // Event listeners
  onPlayerJoin(callback: (player: PlayerData) => void): void {
    this.socket?.on('player-join', callback)
  }

  onPlayerLeave(callback: (playerId: string) => void): void {
    this.socket?.on('player-leave', callback)
  }

  onPlayerMove(callback: (playerData: PlayerData) => void): void {
    this.socket?.on('player-move', callback)
  }

  onPlayerUpdate(callback: (playerData: Partial<PlayerData> & { id: string }) => void): void {
    this.socket?.on('player-update', callback)
  }

  onMapChange(callback: (playerId: string, mapId: string) => void): void {
    this.socket?.on('map-change', callback)
  }

  onProximityUpdate(callback: (nearbyPlayers: string[]) => void): void {
    this.socket?.on('proximity-update', callback)
  }

  // Connection management
  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        if (!this.isConnected && this.socket) {
          this.socket.connect()
        }
      }, 2000 * this.reconnectAttempts) // Exponential backoff
    } else {
      console.error('Max reconnection attempts reached')
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true
  }

  getSocketId(): string | undefined {
    return this.socket?.id
  }

  // Clean up event listeners
  removeAllListeners(): void {
    this.socket?.removeAllListeners()
  }
}
