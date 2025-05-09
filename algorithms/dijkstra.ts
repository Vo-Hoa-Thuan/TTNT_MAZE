// Dijkstra Algorithm implementation
export class DijkstraAlgorithm {
  private unvisited: Cell[] = []
  private visited: Set<string> = new Set()
  private distances: Map<string, number> = new Map()
  private previous: Map<string, Cell | null> = new Map()
  private maze: number[][]
  private start: Cell
  private end: Cell
  private path: Cell[] = []
  private visitedCells: Cell[] = []
  private isFinished = false

  constructor(maze: number[][], start: Cell, end: Cell) {
    this.maze = maze
    this.start = start
    this.end = end
    this.initialize()
  }

  private initialize() {
    this.unvisited = []
    this.visited.clear()
    this.distances.clear()
    this.previous.clear()
    this.path = []
    this.visitedCells = []
    this.isFinished = false

    // Initialize distances
    for (let i = 0; i < this.maze.length; i++) {
      for (let j = 0; j < this.maze[0].length; j++) {
        const cell: Cell = { row: i, col: j }
        const cellKey = `${i},${j}`

        if (this.maze[i][j] !== 1) {
          // Not a wall
          this.unvisited.push(cell)
          this.distances.set(cellKey, Number.POSITIVE_INFINITY)
          this.previous.set(cellKey, null)
        }
      }
    }

    // Set distance to start as 0
    const startKey = `${this.start.row},${this.start.col}`
    this.distances.set(startKey, 0)
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

  private getCellWithMinDistance(): Cell | null {
    let minDistance = Number.POSITIVE_INFINITY
    let minCell: Cell | null = null

    for (const cell of this.unvisited) {
      const cellKey = `${cell.row},${cell.col}`
      const distance = this.distances.get(cellKey) || Number.POSITIVE_INFINITY

      if (distance < minDistance) {
        minDistance = distance
        minCell = cell
      }
    }

    return minCell
  }

  public step(): boolean {
    if (this.isFinished || this.unvisited.length === 0) {
      return false
    }

    // Get the cell with the minimum distance
    const current = this.getCellWithMinDistance()
    if (!current) return false

    const currentKey = `${current.row},${current.col}`
    const currentDistance = this.distances.get(currentKey) || Number.POSITIVE_INFINITY

    // If we reached the end or the current distance is infinity (unreachable)
    if (current.row === this.end.row && current.col === this.end.col) {
      this.reconstructPath()
      this.isFinished = true
      return false
    }

    if (currentDistance === Number.POSITIVE_INFINITY) {
      this.isFinished = true
      return false
    }

    // Remove current from unvisited
    this.unvisited = this.unvisited.filter((cell) => !(cell.row === current.row && cell.col === current.col))

    // Add current to visited
    this.visited.add(currentKey)
    this.visitedCells.push(current)

    // Check all neighbors
    const neighbors = this.getNeighbors(current)
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`

      // Skip if neighbor is already visited
      if (this.visited.has(neighborKey)) continue

      // Calculate new distance
      const newDistance = currentDistance + 1 // Assuming all steps cost 1
      const currentNeighborDistance = this.distances.get(neighborKey) || Number.POSITIVE_INFINITY

      if (newDistance < currentNeighborDistance) {
        // Update distance and previous
        this.distances.set(neighborKey, newDistance)
        this.previous.set(neighborKey, current)
      }
    }

    return true
  }

  private reconstructPath() {
    let current: Cell | null = this.end
    this.path = []

    while (current) {
      this.path.unshift(current)
      const currentKey = `${current.row},${current.col}`
      current = this.previous.get(currentKey) || null
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
