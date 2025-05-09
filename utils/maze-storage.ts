// Utility for saving and loading mazes
import { v4 as uuidv4 } from "uuid"

export interface SavedMaze {
  id: string
  name: string
  maze: number[][]
  start: { row: number; col: number }
  end: { row: number; col: number }
  createdAt: string
  size: number
  difficulty: string
}

export interface MazeMetadata {
  id: string
  name: string
  size: number
  difficulty: string
  createdAt: string
}

const STORAGE_KEY = "ttnt_maze_saved_mazes"

// Save a maze to local storage
export const saveMaze = (
  maze: number[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
  name: string,
  difficulty: string,
): SavedMaze => {
  const savedMazes = getSavedMazes()

  const newMaze: SavedMaze = {
    id: uuidv4(),
    name,
    maze,
    start,
    end,
    createdAt: new Date().toISOString(),
    size: maze.length,
    difficulty,
  }

  savedMazes.push(newMaze)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMazes))

  return newMaze
}

// Get all saved mazes from local storage
export const getSavedMazes = (): SavedMaze[] => {
  const savedMazesJson = localStorage.getItem(STORAGE_KEY)
  if (!savedMazesJson) return []

  try {
    return JSON.parse(savedMazesJson)
  } catch (error) {
    console.error("Error parsing saved mazes:", error)
    return []
  }
}

// Get maze metadata (without the full maze data)
export const getMazeMetadata = (): MazeMetadata[] => {
  const savedMazes = getSavedMazes()
  return savedMazes.map(({ id, name, size, difficulty, createdAt }) => ({
    id,
    name,
    size,
    difficulty,
    createdAt,
  }))
}

// Get a specific maze by ID
export const getMazeById = (id: string): SavedMaze | null => {
  const savedMazes = getSavedMazes()
  const maze = savedMazes.find((maze) => maze.id === id)
  return maze || null
}

// Delete a maze by ID
export const deleteMazeById = (id: string): boolean => {
  const savedMazes = getSavedMazes()
  const filteredMazes = savedMazes.filter((maze) => maze.id !== id)

  if (filteredMazes.length === savedMazes.length) {
    return false // Maze not found
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMazes))
  return true
}

// Update a maze by ID
export const updateMazeById = (id: string, updates: Partial<Omit<SavedMaze, "id" | "createdAt">>): SavedMaze | null => {
  const savedMazes = getSavedMazes()
  const mazeIndex = savedMazes.findIndex((maze) => maze.id === id)

  if (mazeIndex === -1) {
    return null // Maze not found
  }

  const updatedMaze = {
    ...savedMazes[mazeIndex],
    ...updates,
  }

  savedMazes[mazeIndex] = updatedMaze
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMazes))

  return updatedMaze
}
