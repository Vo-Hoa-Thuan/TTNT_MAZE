import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Clock, Footprints, Award, TrendingUp, BarChart2 } from "lucide-react"

export interface MazeStatistics {
  totalMoves: number
  optimalPathLength: number
  timeElapsed: number
  completionRate: number
  difficulty: string
  algorithm: string
  mazeSize: number
}

interface MazeStatisticsProps {
  statistics: MazeStatistics
}

export const MazeStatisticsDisplay: React.FC<MazeStatisticsProps> = ({ statistics }) => {
  const { totalMoves, optimalPathLength, timeElapsed, completionRate, difficulty, algorithm, mazeSize } = statistics

  // Calculate efficiency score (lower is better)
  const efficiency = optimalPathLength > 0 ? Math.round((optimalPathLength / totalMoves) * 100) : 0

  // Format time elapsed
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5" />
          Thống kê mê cung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Footprints className="mr-2 h-4 w-4" />
                <span>Số bước đi</span>
              </div>
              <span className="font-bold">{totalMoves}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Đường đi tối ưu</span>
              </div>
              <span className="font-bold">{optimalPathLength}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>Thời gian hoàn thành</span>
              </div>
              <span className="font-bold">{formatTime(timeElapsed)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                <span>Hiệu quả</span>
              </div>
              <span className="font-bold">{efficiency}%</span>
            </div>
            <Progress value={efficiency} className="h-2" />

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                <span>Tỷ lệ hoàn thành</span>
              </div>
              <span className="font-bold">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Cấp độ:</span>
              <div className="font-medium">{difficulty}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Thuật toán:</span>
              <div className="font-medium">{algorithm}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Kích thước:</span>
              <div className="font-medium">
                {mazeSize}x{mazeSize}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
