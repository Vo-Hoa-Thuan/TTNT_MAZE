// A* Algorithm implementation
export class AStarAlgorithm {
  private openSet: Cell[] = []
  private closedSet: Set<string> = new Set()
  private cameFrom: Map<string, Cell> = new Map()
  private gScore: Map<string, number> = new Map()
  private fScore: Map<string, number> = new Map()
  private maze: number[][]
  private start: Cell
  private end: Cell
  private path: Cell[] = []
  private visitedCells: Cell[] = []
  private isRunning = false
  private isFinished = false

  constructor(maze: number[][], start: Cell, end: Cell) {
    this.maze = maze
    this.start = start
    this.end = end
    this.initialize()
  }

  private initialize() {
    this.openSet = [this.start]
    this.closedSet.clear()
    this.cameFrom.clear()
    this.gScore.clear()
    this.fScore.clear()
    this.path = []
    this.visitedCells = []
    this.isRunning = false
    this.isFinished = false

    // Initialize scores
    for (let i = 0; i < this.maze.length; i++) {
      for (let j = 0; j < this.maze[0].length; j++) {
        const cellKey = `${i},${j}`
        this.gScore.set(cellKey, Number.POSITIVE_INFINITY)
        this.fScore.set(cellKey, Number.POSITIVE_INFINITY)
      }
    }

    const startKey = `${this.start.row},${this.start.col}`
    this.gScore.set(startKey, 0)
    this.fScore.set(startKey, this.heuristic(this.start, this.end))
  }

  private heuristic(a: Cell, b: Cell): number {
    // Manhattan distance
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col)
  }

  private getNeighbors(cell: Cell): Cell[] {
    const { row, col } = cell
    const neighbors: Cell[] = []
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 }, // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 }, // right
    ]

    for (const dir of directions) {
      const newRow = row + dir.row
      const newCol = col + dir.col

      // Check if the neighbor is valid
      if (
        newRow >= 0 &&
        newRow < this.maze.length &&
        newCol >= 0 &&
        newCol < this.maze[0].length &&
        this.maze[newRow][newCol] !== 1 // Not a wall
      ) {
        neighbors.push({ row: newRow, col: newCol })
      }
    }

    return neighbors
  }

  public step(): boolean {
    if (this.openSet.length === 0 || this.isFinished) {
      this.isRunning = false
      return false
    }

    this.isRunning = true

    // Find the node with the lowest fScore
    let lowestIndex = 0
    for (let i = 0; i < this.openSet.length; i++) {
      const currentKey = `${this.openSet[i].row},${this.openSet[i].col}`
      const lowestKey = `${this.openSet[lowestIndex].row},${this.openSet[lowestIndex].col}`

      if (this.fScore.get(currentKey)! < this.fScore.get(lowestKey)!) {
        lowestIndex = i
      }
    }

    const current = this.openSet[lowestIndex]
    this.visitedCells.push(current)

    // Check if we reached the end
    if (current.row === this.end.row && current.col === this.end.col) {
      // Reconstruct path
      this.reconstructPath()
      this.isFinished = true
      return false
    }

    // Remove current from openSet
    this.openSet.splice(lowestIndex, 1)

    // Add current to closedSet
    const currentKey = `${current.row},${current.col}`
    this.closedSet.add(currentKey)

    // Check all neighbors
    const neighbors = this.getNeighbors(current)
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`

      // Skip if neighbor is in closedSet
      if (this.closedSet.has(neighborKey)) continue

      // Calculate tentative gScore
      const tentativeGScore = this.gScore.get(currentKey)! + 1

      // Add neighbor to openSet if not there
      if (!this.openSet.some((cell) => cell.row === neighbor.row && cell.col === neighbor.col)) {
        this.openSet.push(neighbor)
      } else if (tentativeGScore >= this.gScore.get(neighborKey)!) {
        // This is not a better path
        continue
      }

      // This path is the best until now, record it
      this.cameFrom.set(neighborKey, current)
      this.gScore.set(neighborKey, tentativeGScore)
      this.fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, this.end))
    }

    return true
  }

  private reconstructPath() {
    let current = this.end
    this.path = [current]

    while (true) {
      const currentKey = `${current.row},${current.col}`
      const previous = this.cameFrom.get(currentKey)

      if (!previous) break

      this.path.unshift(previous)
      current = previous

      if (current.row === this.start.row && current.col === this.start.col) {
        break
      }
    }
  }

  public run(): { path: Cell[]; visited: Cell[] } {
    while (this.step()) {}
    return { path: this.path, visited: this.visitedCells }
  }

  public getPath(): Cell[] {
    return this.path
  }

  public getVisited(): Cell[] {
    return this.visitedCells
  }

  public isComplete(): boolean {
    return this.isFinished
  }

  public reset(maze: number[][], start: Cell, end: Cell) {
    this.maze = maze
    this.start = start
    this.end = end
    this.initialize()
  }
}

export interface Cell {
  row: number
  col: number
}
