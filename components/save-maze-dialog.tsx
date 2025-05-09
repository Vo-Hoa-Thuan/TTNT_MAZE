"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Save } from "lucide-react"
import { saveMaze } from "../utils/maze-storage"

interface SaveMazeDialogProps {
  maze: number[][]
  start: { row: number; col: number }
  end: { row: number; col: number }
  difficulty: string
  onSave: () => void
}

export const SaveMazeDialog: React.FC<SaveMazeDialogProps> = ({ maze, start, end, difficulty, onSave }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [mazeName, setMazeName] = useState("")
  const [error, setError] = useState("")

  const handleSave = () => {
    if (!mazeName.trim()) {
      setError("Vui lòng nhập tên cho mê cung")
      return
    }

    try {
      saveMaze(maze, start, end, mazeName, difficulty)
      setIsOpen(false)
      setMazeName("")
      setError("")
      onSave()
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu mê cung")
      console.error(err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          Lưu mê cung
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lưu mê cung</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="maze-name">Tên mê cung</Label>
            <Input
              id="maze-name"
              placeholder="Nhập tên cho mê cung"
              value={mazeName}
              onChange={(e) => {
                setMazeName(e.target.value)
                setError("")
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <div className="text-sm text-muted-foreground">
            Mê cung sẽ được lưu với kích thước {maze.length}x{maze.length} và cấp độ {difficulty}.
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
