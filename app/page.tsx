"use client"

import { useState, useEffect, useRef } from "react"

// Định nghĩa các interface cần thiết
interface Position {
  row: number
  col: number
}

// Constants
const CELL_SIZE = 30
const WALL_COLOR = "#1a1a1a"
const PATH_COLOR = "#ffffff"
const START_COLOR = "#22c55e"
const END_COLOR = "#ef4444"
const PLAYER_COLOR = "#3b82f6"

export default function MazePage() {
  // State
  const [mazeSize, setMazeSize] = useState(10)
  const [maze, setMaze] = useState<number[][]>([])
  const [start, setStart] = useState<Position>({ row: 0, col: 0 })
  const [end, setEnd] = useState<Position>({ row: 0, col: 0 })
  const [playerPosition, setPlayerPosition] = useState<Position>({ row: 0, col: 0 })
  const [isRunning, setIsRunning] = useState(false)
  const [moves, setMoves] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize maze
  useEffect(() => {
    generateMaze()
  }, [])

  // Draw maze when it changes
  useEffect(() => {
    if (maze.length > 0) {
      drawMaze()
    }
  }, [maze, playerPosition])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRunning) return

      let newRow = playerPosition.row
      let newCol = playerPosition.col

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

      // Check if valid move
      if (
        newRow >= 0 &&
        newRow < maze.length &&
        newCol >= 0 &&
        newCol < maze[0].length &&
        maze[newRow][newCol] !== 1 // Not a wall
      ) {
        setPlayerPosition({ row: newRow, col: newCol })
        setMoves((prev) => prev + 1)

        // Check if reached end
        if (newRow === end.row && newCol === end.col) {
          setIsRunning(false)
          alert(`Bạn đã hoàn thành mê cung trong ${moves + 1} bước!`)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isRunning, playerPosition, maze, end, moves])

  // Generate maze
  const generateMaze = () => {
    // Create empty maze
    const newMaze: number[][] = Array(mazeSize)
      .fill(0)
      .map(() => Array(mazeSize).fill(0))

    // Add random walls (30% chance)
    for (let i = 0; i < mazeSize; i++) {
      for (let j = 0; j < mazeSize; j++) {
        if (Math.random() < 0.3) {
          newMaze[i][j] = 1 // Wall
        }
      }
    }

    // Set start and end
    const newStart = { row: 0, col: 0 }
    const newEnd = { row: mazeSize - 1, col: mazeSize - 1 }

    // Ensure start and end are not walls
    newMaze[newStart.row][newStart.col] = 0
    newMaze[newEnd.row][newEnd.col] = 0

    // Ensure path exists (simple implementation)
    for (let i = 0; i < mazeSize; i++) {
      newMaze[0][i] = 0 // Clear top row
      newMaze[i][mazeSize - 1] = 0 // Clear rightmost column
    }

    setMaze(newMaze)
    setStart(newStart)
    setEnd(newEnd)
    setPlayerPosition(newStart)
    setMoves(0)
  }

  // Draw maze
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

    // Draw cells
    for (let i = 0; i < maze.length; i++) {
      for (let j = 0; j < maze[i].length; j++) {
        const x = j * CELL_SIZE
        const y = i * CELL_SIZE

        // Draw cell
        ctx.fillStyle = maze[i][j] === 1 ? WALL_COLOR : PATH_COLOR
        ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
        ctx.strokeStyle = "#e5e5e5"
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE)
      }
    }

    // Draw start
    const startX = start.col * CELL_SIZE
    const startY = start.row * CELL_SIZE
    ctx.fillStyle = START_COLOR
    ctx.fillRect(startX, startY, CELL_SIZE, CELL_SIZE)

    // Draw end
    const endX = end.col * CELL_SIZE
    const endY = end.row * CELL_SIZE
    ctx.fillStyle = END_COLOR
    ctx.fillRect(endX, endY, CELL_SIZE, CELL_SIZE)

    // Draw player
    const playerX = playerPosition.col * CELL_SIZE
    const playerY = playerPosition.row * CELL_SIZE
    ctx.fillStyle = PLAYER_COLOR
    ctx.beginPath()
    ctx.arc(playerX + CELL_SIZE / 2, playerY + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Start game
  const startGame = () => {
    setIsRunning(true)
  }

  // Reset game
  const resetGame = () => {
    setPlayerPosition(start)
    setMoves(0)
    setIsRunning(false)
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Mê Cung Đơn Giản</h1>

      <div className="mb-4">
        <canvas ref={canvasRef} className="border border-gray-300" />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={startGame}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Bắt đầu
        </button>

        <button onClick={resetGame} className="px-4 py-2 bg-gray-500 text-white rounded">
          Đặt lại
        </button>

        <button onClick={generateMaze} className="px-4 py-2 bg-green-500 text-white rounded">
          Tạo mê cung mới
        </button>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block mb-1">Kích thước:</label>
          <input
            type="range"
            min="5"
            max="20"
            value={mazeSize}
            onChange={(e) => setMazeSize(Number.parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center">
            {mazeSize}x{mazeSize}
          </div>
        </div>

        <div>
          <div>Số bước: {moves}</div>
          <div>Trạng thái: {isRunning ? "Đang chơi" : "Tạm dừng"}</div>
        </div>
      </div>

      <div className="mt-4 text-sm">
        <p>Sử dụng các phím mũi tên để di chuyển.</p>
        <p>Tìm đường đi từ ô xanh lá (góc trên bên trái) đến ô đỏ (góc dưới bên phải).</p>
      </div>
    </div>
  )
}
