"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Save, Trash2, MoreVertical, Play } from "lucide-react"
import { getMazeMetadata, deleteMazeById, type MazeMetadata } from "../utils/maze-storage"

interface SavedMazesListProps {
  onLoadMaze: (mazeId: string) => void
}

export const SavedMazesList: React.FC<SavedMazesListProps> = ({ onLoadMaze }) => {
  const [mazes, setMazes] = useState<MazeMetadata[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [mazeToDelete, setMazeToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    loadMazes()
  }, [])

  const loadMazes = () => {
    const savedMazes = getMazeMetadata()
    setMazes(savedMazes)
  }

  const handleDeleteMaze = (id: string) => {
    setMazeToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (mazeToDelete) {
      deleteMazeById(mazeToDelete)
      loadMazes()
      setIsDeleteDialogOpen(false)
      setMazeToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const filteredMazes = mazes.filter(
    (maze) =>
      maze.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maze.difficulty.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Save className="mr-2 h-5 w-5" />
          Mê cung đã lưu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mê cung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredMazes.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Kích thước</TableHead>
                    <TableHead>Cấp độ</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMazes.map((maze) => (
                    <TableRow key={maze.id}>
                      <TableCell className="font-medium">{maze.name}</TableCell>
                      <TableCell>
                        {maze.size}x{maze.size}
                      </TableCell>
                      <TableCell>{maze.difficulty}</TableCell>
                      <TableCell>{formatDate(maze.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onLoadMaze(maze.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Tải
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMaze(maze.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              {searchTerm ? "Không tìm thấy mê cung nào phù hợp" : "Chưa có mê cung nào được lưu"}
            </div>
          )}
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <p>Bạn có chắc chắn muốn xóa mê cung này không? Hành động này không thể hoàn tác.</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button variant="destructive" onClick={confirmDelete}>
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
