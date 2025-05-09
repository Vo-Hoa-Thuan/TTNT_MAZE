"use client"

import type React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export interface DifficultyLevel {
  id: string
  name: string
  size: number
  wallDensity: number
  timeLimit?: number
}

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: DifficultyLevel) => void
  currentDifficulty: string
}

export const difficultyLevels: DifficultyLevel[] = [
  { id: "easy", name: "Dễ", size: 10, wallDensity: 0.2 },
  { id: "medium", name: "Trung bình", size: 15, wallDensity: 0.3 },
  { id: "hard", name: "Khó", size: 20, wallDensity: 0.35 },
  { id: "expert", name: "Chuyên gia", size: 25, wallDensity: 0.4, timeLimit: 120 },
  { id: "custom", name: "Tùy chỉnh", size: 15, wallDensity: 0.3 },
]

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty, currentDifficulty }) => {
  const handleDifficultyChange = (value: string) => {
    const selectedDifficulty = difficultyLevels.find((level) => level.id === value)
    if (selectedDifficulty) {
      onSelectDifficulty(selectedDifficulty)
    }
  }

  return (
    <div className="mb-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="difficulty-select">Cấp độ khó</Label>
        <Select value={currentDifficulty} onValueChange={handleDifficultyChange}>
          <SelectTrigger id="difficulty-select" className="w-full">
            <SelectValue placeholder="Chọn cấp độ khó" />
          </SelectTrigger>
          <SelectContent>
            {difficultyLevels.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                {level.name} ({level.size}x{level.size})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
