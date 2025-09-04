import React, { useState, useCallback } from 'react'
import { GameCanvas } from './GameCanvas'
import { MetaspaceUI } from './MetaspaceUI'
import { GameManager } from '../../game/GameManager'

interface Player {
  id: string
  name: string
  status: 'online' | 'away' | 'busy'
  currentMap: string
}

export const MetaspaceContainer: React.FC = () => {
  const [gameManager, setGameManager] = useState<GameManager | null>(null)
  const [currentMap, setCurrentMap] = useState('office')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Alice Johnson', status: 'online', currentMap: 'office' },
    { id: '2', name: 'Bob Smith', status: 'away', currentMap: 'library' },
    { id: '3', name: 'Carol Davis', status: 'busy', currentMap: 'office' },
    { id: '4', name: 'David Wilson', status: 'online', currentMap: 'school' }
  ])

  const handleGameReady = useCallback((manager: GameManager) => {
    setGameManager(manager)
    console.log('Game manager ready')
  }, [])

  const handleSceneChange = useCallback((sceneKey: string) => {
    setCurrentMap(sceneKey)
    console.log(`Scene changed to: ${sceneKey}`)
  }, [])

  const handleMapChange = useCallback((mapId: string) => {
    if (gameManager) {
      gameManager.startScene(mapId)
      setCurrentMap(mapId)
    }
  }, [gameManager])

  const handleSettingsClick = useCallback(() => {
    console.log('Settings clicked')
    // TODO: Implement settings modal
  }, [])

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted)
    // TODO: Implement actual audio muting
  }, [isMuted])

  return (
    <div className="relative w-full h-screen bg-gray-900">
      <GameCanvas
        onGameReady={handleGameReady}
        onSceneChange={handleSceneChange}
        className="w-full h-full"
      />
      
      <MetaspaceUI
        players={players}
        currentMap={currentMap}
        onMapChange={handleMapChange}
        onSettingsClick={handleSettingsClick}
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        isMuted={isMuted}
        onMuteToggle={handleMuteToggle}
      />
    </div>
  )
}
