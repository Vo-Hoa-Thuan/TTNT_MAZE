// Bidirectional Search Algorithm implementation
export class BidirectionalSearch {
  private forwardQueue: Cell[] = []
  private backwardQueue: Cell[] = []
  private forwardVisited: Set<string> = new Set()
  private backwardVisited: Set<string> = new Set()
  private forwardParent: Map<string, Cell> = new Map()
  private backwardParent: Map<string, Cell> = new Map()
  private maze: number[][]
  private start: Cell
  private end: Cell
  private path: Cell[] = []
  private visitedCells: Cell[] = []
  private meetingPoint: Cell | null = null
  private isFinished = false

  constructor(maze: number[][], start: Cell, end: Cell) {
    this.maze = maze
    this.start = start
    this.end = end
    this.initialize()
  }

  private initialize() {
    this.forwardQueue = [this.start]
    this.backwardQueue = [this.end]
    this.forwardVisited.clear()
    this.backwardVisited.clear()
    this.forwardParent.clear()
    this.backwardParent.clear()
    this.path = []
    this.visitedCells = []
    this.meetingPoint = null
    this.isFinished = false

    // Mark start and end as visited
    this.forwardVisited.add(`${this.start.row},${this.start.col}`)
    this.backwardVisited.add(`${this.end.row},${this.end.col}`)
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
    if (this.isFinished || (this.forwardQueue.length === 0 && this.backwardQueue.length === 0)) {
      return false
    }

    // Forward search step
    if (this.forwardQueue.length > 0) {
      const current = this.forwardQueue.shift()!
      this.visitedCells.push(current)

      const neighbors = this.getNeighbors(current)
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`

        // Skip if already visited in forward search
        if (this.forwardVisited.has(neighborKey)) continue

        // Add to forward queue and mark as visited
        this.forwardQueue.push(neighbor)
        this.forwardVisited.add(neighborKey)
        this.forwardParent.set(neighborKey, current)

        // Check if this node has been visited by backward search
        if (this.backwardVisited.has(neighborKey)) {
          this.meetingPoint = neighbor
          this.reconstructPath()
          this.isFinished = true
          return false
        }
      }
    }

    // Backward search step
    if (this.backwardQueue.length > 0) {
      const current = this.backwardQueue.shift()!
      this.visitedCells.push(current)

      const neighbors = this.getNeighbors(current)
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`

        // Skip if already visited in backward search
        if (this.backwardVisited.has(neighborKey)) continue

        // Add to backward queue and mark as visited
        this.backwardQueue.push(neighbor)
        this.backwardVisited.add(neighborKey)
        this.backwardParent.set(neighborKey, current)

        // Check if this node has been visited by forward search
        if (this.forwardVisited.has(neighborKey)) {
          this.meetingPoint = neighbor
          this.reconstructPath()
          this.isFinished = true
          return false
        }
      }
    }

    return true
  }

  private reconstructPath() {
    if (!this.meetingPoint) return

    // Reconstruct path from start to meeting point
    let current: Cell | undefined = this.meetingPoint
    const forwardPath: Cell[] = [current]

    while (current) {
      const currentKey = `${current.row},${current.col}`
      const parent = this.forwardParent.get(currentKey)

      if (!parent) break

      forwardPath.unshift(parent)
      current = parent
    }

    // Reconstruct path from meeting point to end
    current = this.meetingPoint
    const backwardPath: Cell[] = []

    while (current) {
      const currentKey = `${current.row},${current.col}`
      const parent = this.backwardParent.get(currentKey)

      if (!parent) break

      backwardPath.push(parent)
      current = parent
    }

    // Combine paths
    this.path = [...forwardPath, ...backwardPath]
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
