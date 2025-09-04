export interface PlayerData {
  id: string
  name: string
  x: number
  y: number
  direction: 'up' | 'down' | 'left' | 'right'
  isMoving: boolean
  mapId: string
  avatar: string
  status: 'online' | 'away' | 'busy'
}

export interface GameState {
  currentMap: string
  players: Map<string, PlayerData>
  localPlayer: PlayerData | null
  isConnected: boolean
}

export interface SocketEvents {
  'player-join': (player: PlayerData) => void
  'player-leave': (playerId: string) => void
  'player-move': (playerData: PlayerData) => void
  'player-update': (playerData: Partial<PlayerData> & { id: string }) => void
  'map-change': (playerId: string, mapId: string) => void
  'proximity-update': (nearbyPlayers: string[]) => void
}

export interface InteractiveZone {
  id: string
  type: 'door' | 'teleport' | 'meeting-room' | 'study-area'
  x: number
  y: number
  width: number
  height: number
  targetMap?: string
  targetX?: number
  targetY?: number
  metadata?: Record<string, any>
}

export interface MapConfig {
  id: string
  name: string
  tilesetKey: string
  tilemapKey: string
  spawnPoints: Array<{ x: number; y: number }>
  interactiveZones: InteractiveZone[]
  backgroundMusic?: string
}
