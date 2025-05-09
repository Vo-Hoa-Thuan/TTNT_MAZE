"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export type AlgorithmType = "dfs" | "bfs" | "astar" | "dijkstra" | "bidirectional"

interface AlgorithmSelectorProps {
  onSelectAlgorithm: (algorithm: AlgorithmType) => void
  currentAlgorithm: AlgorithmType
}

export const algorithmOptions = [
  { id: "dfs", name: "Depth-First Search (DFS)" },
  { id: "bfs", name: "Breadth-First Search (BFS)" },
  { id: "astar", name: "A* Search" },
  { id: "dijkstra", name: "Dijkstra" },
  { id: "bidirectional", name: "Bidirectional Search" },
]

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ onSelectAlgorithm, currentAlgorithm }) => {
  const handleAlgorithmChange = (value: string) => {
    onSelectAlgorithm(value as AlgorithmType)
  }

  return (
    <div className="mb-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="algorithm-select">Thuật toán tìm đường</Label>
        <Select value={currentAlgorithm} onValueChange={handleAlgorithmChange}>
          <SelectTrigger id="algorithm-select" className="w-full">
            <SelectValue placeholder="Chọn thuật toán" />
          </SelectTrigger>
          <SelectContent>
            {algorithmOptions.map((algorithm) => (
              <SelectItem key={algorithm.id} value={algorithm.id}>
                {algorithm.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
