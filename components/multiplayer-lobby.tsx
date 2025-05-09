"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Play, Plus, X } from "lucide-react"

export interface Player {
  id: string
  name: string
  avatar?: string
  isReady: boolean
  isHost: boolean
}

interface MultiplayerLobbyProps {
  players: Player[]
  onStartGame: () => void
  onAddPlayer: (name: string) => void
  onRemovePlayer: (id: string) => void
  onToggleReady: (id: string) => void
  isHost: boolean
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  players,
  onStartGame,
  onAddPlayer,
  onRemovePlayer,
  onToggleReady,
  isHost,
}) => {
  const [newPlayerName, setNewPlayerName] = useState("")
  const [canStart, setCanStart] = useState(false)

  useEffect(() => {
    // Check if all players are ready and there are at least 2 players
    const allReady = players.length >= 2 && players.every((player) => player.isReady)
    setCanStart(allReady)
  }, [players])

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim())
      setNewPlayerName("")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2" />
          Phòng chơi nhiều người ({players.length}/4)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Tên người chơi mới"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPlayer()}
              disabled={players.length >= 4}
            />
            <Button onClick={handleAddPlayer} disabled={players.length >= 4 || !newPlayerName.trim()} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {players.map((player) => (
              <div key={player.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={player.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    {player.isHost && <Badge variant="outline">Chủ phòng</Badge>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={player.isReady ? "success" : "secondary"}>
                    {player.isReady ? "Sẵn sàng" : "Chưa sẵn sàng"}
                  </Badge>
                  {!player.isHost && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemovePlayer(player.id)}
                      disabled={!isHost && !player.isHost}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleReady(player.id)}
                    disabled={isHost && !player.isHost}
                  >
                    {player.isReady ? "Hủy sẵn sàng" : "Sẵn sàng"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {isHost && (
            <Button className="w-full" disabled={!canStart} onClick={onStartGame}>
              <Play className="mr-2 h-4 w-4" />
              Bắt đầu trò chơi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
