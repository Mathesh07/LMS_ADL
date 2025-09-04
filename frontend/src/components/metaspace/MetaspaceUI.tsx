import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Map, 
  Settings, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  MessageCircle,
  Phone,
  PhoneOff
} from 'lucide-react'

interface Player {
  id: string
  name: string
  status: 'online' | 'away' | 'busy'
  currentMap: string
}

interface MetaspaceUIProps {
  players: Player[]
  currentMap: string
  onMapChange: (mapId: string) => void
  onSettingsClick: () => void
  isFullscreen: boolean
  onFullscreenToggle: () => void
  isMuted: boolean
  onMuteToggle: () => void
}

export const MetaspaceUI: React.FC<MetaspaceUIProps> = ({
  players,
  currentMap,
  onMapChange,
  onSettingsClick,
  isFullscreen,
  onFullscreenToggle,
  isMuted,
  onMuteToggle
}) => {
  const [showPlayerList, setShowPlayerList] = useState(true)
  const [showMinimap, setShowMinimap] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getMapDisplayName = (mapId: string) => {
    switch (mapId) {
      case 'office': return 'Office Space'
      case 'library': return 'Library'
      case 'school': return 'School Campus'
      default: return mapId
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm font-medium">
            <Map className="w-4 h-4 mr-2" />
            {getMapDisplayName(currentMap)}
          </Badge>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMapChange('office')}
              className={currentMap === 'office' ? 'bg-blue-100' : ''}
            >
              Office
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMapChange('library')}
              className={currentMap === 'library' ? 'bg-blue-100' : ''}
            >
              Library
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMapChange('school')}
              className={currentMap === 'school' ? 'bg-blue-100' : ''}
            >
              School
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onMuteToggle}
            className={isMuted ? 'bg-red-100' : ''}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onFullscreenToggle}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSettingsClick}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Player List */}
      {showPlayerList && (
        <Card className="absolute top-20 left-4 w-64 max-h-96 overflow-y-auto pointer-events-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Online Players ({players.length})
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlayerList(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(player.status)}`} />
                    <span className="text-sm font-medium">{player.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {getMapDisplayName(player.currentMap)}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MessageCircle className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {players.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-4">
                  No other players online
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Minimap */}
      {showMinimap && (
        <Card className="absolute top-20 right-4 w-48 h-36 pointer-events-auto">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-xs">
              <span>Minimap</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMinimap(false)}
                className="h-4 w-4 p-0"
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="w-full h-20 bg-muted rounded border-2 border-border relative">
              {/* Minimap content would be rendered here */}
              <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                Map Overview
              </div>
              
              {/* Player dots on minimap */}
              {players.filter(p => p.currentMap === currentMap).map((player, index) => (
                <div
                  key={player.id}
                  className={`absolute w-2 h-2 rounded-full ${getStatusColor(player.status)}`}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 3) * 20}%`
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 border">
          <Button variant="outline" size="sm">
            <Phone className="w-4 h-4 mr-2" />
            Voice Chat
          </Button>
          
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4 mr-2" />
            Text Chat
          </Button>
        </div>
      </div>

      {/* Collapsed UI toggles */}
      {!showPlayerList && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPlayerList(true)}
          className="absolute top-20 left-4 pointer-events-auto"
        >
          <Users className="w-4 h-4" />
        </Button>
      )}

      {!showMinimap && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMinimap(true)}
          className="absolute top-20 right-4 pointer-events-auto"
        >
          <Map className="w-4 h-4" />
        </Button>
      )}

      {/* Connection Status */}
      <div className="absolute bottom-4 right-4 pointer-events-auto">
        <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          Connected
        </Badge>
      </div>
    </div>
  )
}
