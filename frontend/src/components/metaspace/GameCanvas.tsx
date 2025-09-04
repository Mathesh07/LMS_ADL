import React, { useEffect, useRef, useState } from 'react'
import { GameManager } from '../../game/GameManager'

interface GameCanvasProps {
  onGameReady?: (gameManager: GameManager) => void
  onSceneChange?: (sceneKey: string) => void
  className?: string
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onGameReady,
  onSceneChange,
  className = ''
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const gameManagerRef = useRef<GameManager | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const initializeGame = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create unique container ID
        const containerId = `phaser-game-${Date.now()}`
        canvasRef.current.id = containerId

        // Initialize game manager
        const gameManager = new GameManager(containerId)
        gameManagerRef.current = gameManager

        // Set up event listeners
        gameManager.onSceneChange((sceneKey) => {
          onSceneChange?.(sceneKey)
        })

        // Initialize the game
        await gameManager.initialize()

        // Notify parent component
        onGameReady?.(gameManager)

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to initialize game:', err)
        setError(err instanceof Error ? err.message : 'Failed to initialize game')
        setIsLoading(false)
      }
    }

    initializeGame()

    // Cleanup on unmount
    return () => {
      if (gameManagerRef.current) {
        gameManagerRef.current.destroy()
        gameManagerRef.current = null
      }
    }
  }, [onGameReady, onSceneChange])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (gameManagerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = canvasRef.current
        gameManagerRef.current.resizeGame(clientWidth, clientHeight)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Game Error</div>
          <div className="text-red-500 text-sm">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 font-medium">Loading Metaspace...</div>
            <div className="text-gray-500 text-sm mt-2">Initializing game engine</div>
          </div>
        </div>
      )}
      
      <div
        ref={canvasRef}
        className="w-full h-full rounded-lg overflow-hidden bg-gray-900"
        style={{ minHeight: '600px' }}
      />
    </div>
  )
}
