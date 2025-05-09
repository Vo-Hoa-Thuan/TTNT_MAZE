"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"

// Định nghĩa các interface cần thiết
interface Position {
  row: number
  col: number
}

interface Cell {
  row: number
  col: number
}

// Constants
const CELL_SIZE = 30
const WALL_COLOR = "#1a1a1a"
const PATH_COLOR = "#4f46e5"
const START_COLOR = "#22c55e"
const END_COLOR = "#ef4444"
const PLAYER_COLORS = ["#3b82f6", "#f97316", "#a855f7", "#ec4899"]

const Page = () => {
  // State for maze configuration
  const [mazeSize, setMazeSize] = useState(15)
  const [maze, setMaze] = useState<number[][]>([])
  const [start, setStart] = useState<Position>({ row: 0, col: 0 })
  const [end, setEnd] = useState<Position>({ row: 0, col: 0 })
  const [currentPosition, setCurrentPosition] = useState<Position>({ row: 0, col: 0 })
  const [path, setPath] = useState<Position[]>([])
  const [visitedCells, setVisitedCells] = useState<Position[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [wallDensity, setWallDensity] = useState(0.3)
  const [currentTab, setCurrentTab] = useState("single")
  const [difficulty, setDifficulty] = useState<any>(null)
  const [algorithm, setAlgorithm] = useState<any>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)
  const [moves, setMoves] = useState(0)
  const [statistics, setStatistics] = useState<any>(null)
  const [showStats, setShowStats] = useState(false)

  // Multiplayer state
  const [players, setPlayers] = useState<any[]>([])
  const [isMultiplayerStarted, setIsMultiplayerStarted] = useState(false)
  const [currentPlayerId, setCurrentPlayerId] = useState("")

  // Canvas ref
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Initialize maze
  useEffect(() => {
    generateMaze()
  }, [])

  // Update maze when difficulty changes
  useEffect(() => {
    if (difficulty) {
      setMazeSize(difficulty.size)
      setWallDensity(difficulty.wallDensity)
      generateMaze(difficulty.size, difficulty.wallDensity)
    }
  }, [difficulty])

  // Draw maze
  useEffect(() => {
    if (maze.length > 0) {
      drawMaze()
    }
  }, [maze, start, end, currentPosition, path, visitedCells, currentTab, players])

  // Timer for single player
  useEffect(() => {
    if (isRunning && !isFinished && currentTab === "single") {
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
      setTimerInterval(interval)
      return () => clearInterval(interval)
    } else if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }, [isRunning, isFinished, currentTab])

  // Timer for multiplayer
  useEffect(() => {
    if (isMultiplayerStarted && currentTab === "multiplayer") {
      const interval = setInterval(() => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.isFinished ? player : { ...player, timeElapsed: player.timeElapsed + 1 },
          ),
        )
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isMultiplayerStarted, currentTab])

  // Generate maze
  const generateMaze = useCallback(() => {
    setIsGenerating(true)
    setIsRunning(false)
    setIsFinished(false)
    setPath([])
    setVisitedCells([])
    setTimeElapsed(0)
    setMoves(0)

    // Create empty maze
    const newMaze: number[][] = Array(mazeSize)
      .fill(0)
      .map(() => Array(mazeSize).fill(0))

    // Add random walls
    for (let i = 0; i < mazeSize; i++) {
      for (let j = 0; j < mazeSize; j++) {
        if (Math.random() < wallDensity) {
          newMaze[i][j] = 1 // 1 represents a wall
        }
      }
    }

    // Set start and end positions
    const newStart = { row: 0, col: 0 }
    const newEnd = { row: mazeSize - 1, col: mazeSize - 1 }

    // Ensure start and end are not walls
    newMaze[newStart.row][newStart.col] = 0
    newMaze[newEnd.row][newEnd.col] = 0

    // Ensure there's a path from start to end
    ensurePath(newMaze, newStart, newEnd)

    setMaze(newMaze)
    setStart(newStart)
    setEnd(newEnd)
    setCurrentPosition(newStart)
    setIsGenerating(false)
  }, [mazeSize, wallDensity])

  // Ensure there's a path from start to end
  const ensurePath = (maze: number[][], start: Position, end: Position) => {
    // Simple implementation: clear a direct path
    const rowStart = Math.min(start.row, end.row)
    const rowEnd = Math.max(start.row, end.row)
    const colStart = Math.min(start.col, end.col)
    const colEnd = Math.max(start.col, end.col)

    // Clear horizontal path
    for (let col = colStart; col <= colEnd; col++) {
      maze[start.row][col] = 0
    }

    // Clear vertical path
    for (let row = rowStart; row <= rowEnd; row++) {
      maze[row][end.col] = 0
    }
  }

  // Draw maze on canvas
  const drawMaze = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = maze[0].length * CELL_SIZE
    canvas.height = maze.length * CELL_SIZE

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw maze
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        const x = j * CELL_SIZE
        const y = i * CELL_SIZE

        // Draw cell
        if (maze[i][j] === 1) {
          // Wall
          ctx.fillStyle = WALL_COLOR
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        } else {
          // Path
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
          ctx.strokeStyle = "#e5e5e5"
          ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
        }
      }
    }

    // Draw visited cells
    visitedCells.forEach((cell) => {
      const x = cell.col * CELL_SIZE
      const y = cell.row * CELL_SIZE
      ctx.fillStyle = "rgba(147, 197, 253, 0.3)" // Light blue
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    })

    // Draw path
    path.forEach((cell) => {
      const x = cell.col * CELL_SIZE
      const y = cell.row * CELL_SIZE
      ctx.fillStyle = "rgba(79, 70, 229, 0.3)" // Indigo
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
    })

    // Draw start and end
    const startX = start.col * CELL_SIZE
    const startY = start.row * CELL_SIZE
    ctx.fillStyle = START_COLOR
    ctx.fillRect(startX, startY, CELL_SIZE, CELL_SIZE)

    const endX = end.col * CELL_SIZE
    const endY = end.row * CELL_SIZE
    ctx.fillStyle = END_COLOR
    ctx.fillRect(endX, endY, CELL_SIZE, CELL_SIZE)

    // Draw current position
    const currentX = currentPosition.col * CELL_SIZE
    const currentY = currentPosition.row * CELL_SIZE
    ctx.fillStyle = "rgba(59, 130, 246, 0.7)" // Blue
    ctx.beginPath()
    ctx.arc(currentX + CELL_SIZE / 2, currentY + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Handle key press for movement
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isRunning || isFinished) return

      let newRow = currentPosition.row
      let newCol = currentPosition.col

      switch (e.key) {
        case "ArrowUp":
          newRow--
          break
        case "ArrowDown":
          newRow++
          break
        case "ArrowLeft":
          newCol--
          break
        case "ArrowRight":
          newCol++
          break
        default:
          return
      }

      // Check if the new position is valid
      if (
        newRow >= 0 &&
        newRow < maze.length &&
        newCol >= 0 &&
        newCol < maze[0].length &&
        maze[newRow][newCol] !== 1 // Not a wall
      ) {
        setCurrentPosition({ row: newRow, col: newCol })
        setPath((prev) => [...prev, { row: newRow, col: newCol }])
        setMoves((prev) => prev + 1)

        // Check if reached the end
        if (newRow === end.row && newCol === end.col) {
          setIsFinished(true)
          setIsRunning(false)
        }
      }
    },
    [isRunning, isFinished, currentPosition, maze, end],
  )

  // Add key event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  // Start game
  const startGame = () => {
    setIsRunning(true)
    setIsFinished(false)
    setPath([])
    setVisitedCells([])
    setTimeElapsed(0)
    setMoves(0)
    setCurrentPosition(start)
  }

  // Reset game
  const resetGame = () => {
    setIsRunning(false)
    setIsFinished(false)
    setPath([])
    setVisitedCells([])
    setTimeElapsed(0)
    setMoves(0)
    setCurrentPosition(start)
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Mê Cung Thông Minh</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-center mb-4">
                <canvas ref={canvasRef} className="border border-gray-300" />
              </div>

              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  {!isRunning ? (
                    <Button onClick={startGame} disabled={isGenerating || isFinished}>
                      <Play className="mr-2 h-4 w-4" />
                      Bắt đầu
                    </Button>
                  ) : (
                    <Button onClick={() => setIsRunning(false)}>
                      <Pause className="mr-2 h-4 w-4" />
                      Tạm dừng
                    </Button>
                  )}
                  <Button onClick={resetGame} variant="outline" disabled={isGenerating}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Đặt lại
                  </Button>
                  <Button onClick={generateMaze} variant="outline" disabled={isGenerating}>
                    Tạo mê cung mới
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Thời gian:</span>
                    <span className="ml-2 font-mono">{formatTime(timeElapsed)}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Bước đi:</span>
                    <span className="ml-2 font-mono">{moves}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Kích thước mê cung</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={mazeSize}
                    onChange={(e) => setMazeSize(Number.parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span>
                    {mazeSize}x{mazeSize}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Mật độ tường</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="0.1"
                    max="0.6"
                    step="0.05"
                    value={wallDensity}
                    onChange={(e) => setWallDensity(Number.parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span>{Math.round(wallDensity * 100)}%</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Hướng dẫn</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Sử dụng các phím mũi tên để di chuyển</li>
                  <li>Tìm đường đi từ ô xanh lá đến ô đỏ</li>
                  <li>Điều chỉnh kích thước và mật độ tường để thay đổi độ khó</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
