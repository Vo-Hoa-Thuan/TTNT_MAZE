# Algorithms.py
import pygame
from Maze import Maze
from pygame.locals import *
from queue import PriorityQueue

def a_star(maze):
    # Thuật toán A* để tìm đường đi ngắn nhất trong mê cung
    start_node = (maze.start_x, maze.start_y)  # Điểm bắt đầu
    end_node = (maze.end_x, maze.end_y)  # Điểm kết thúc
    frontier = PriorityQueue()  # Hàng đợi ưu tiên để lưu các đỉnh cần kiểm tra
    frontier.put((0, start_node))  # Thêm điểm bắt đầu vào hàng đợi với độ ưu tiên ban đầu là 0
    came_from = {}  # Dùng để lưu lại đỉnh trước của mỗi đỉnh
    cost_so_far = {}  # Dùng để lưu lại chi phí tới mỗi đỉnh
    came_from[start_node] = None  # Khởi tạo điểm bắt đầu không có điểm trước đó
    cost_so_far[start_node] = 0  # Khởi tạo chi phí tới điểm bắt đầu là 0

    # Bắt đầu vòng lặp chính của thuật toán
    while not frontier.empty():
        current_priority, current = frontier.get()  # Lấy ra đỉnh có độ ưu tiên nhỏ nhất từ hàng đợi
        if current == end_node:  # Nếu đỉnh hiện tại là điểm kết thúc, thoát khỏi vòng lặp
            break
        # Duyệt qua các đỉnh kề của đỉnh hiện tại
        for next in maze.get_neighbors(current[0], current[1]):
            # Tính chi phí mới đến đỉnh kề
            new_cost = cost_so_far[current] + 1  # Chi phí đi đến ô tiếp theo (giả sử tất cả các cạnh có chi phí 1)
            
            # Kiểm tra nếu đỉnh kề chưa được duyệt hoặc chi phí mới là nhỏ hơn chi phí hiện tại
            if next not in cost_so_far or new_cost < cost_so_far[next]:
                cost_so_far[next] = new_cost  # Cập nhật chi phí mới cho đỉnh kề
                
                # Ước lượng chi phí từ đỉnh kề đến điểm đích
                priority = new_cost + heuristic(end_node, next)  # Hàm heuristic tính độ ưu tiên
                frontier.put((priority, next))  # Thêm đỉnh kề vào hàng đợi với độ ưu tiên mới
                came_from[next] = current  # Lưu lại đỉnh trước của đỉnh kề

    # Sau khi thuật toán kết thúc, ta lấy đường đi từ điểm kết thúc về điểm bắt đầu
    current = end_node
    path = []
    while current != start_node:
        path.append(current)
        current = came_from[current]
    path.append(start_node)
    path.reverse()  # Đảo ngược đường đi để được theo thứ tự từ điểm bắt đầu đến điểm kết thúc
    return path

def heuristic(a, b):
    # Hàm heuristic để ước lượng khoảng cách từ một điểm đến điểm khác
    return abs(a[0] - b[0]) + abs(a[1] - b[1])  # Sử dụng khoảng cách Manhattan


def play_next_music():
    # Hàm để phát nhạc tiếp theo
    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
    pygame.mixer.music.play()