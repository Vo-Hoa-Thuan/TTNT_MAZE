# Algorithms.py
import pygame
from Maze import Maze
from pygame.locals import *
from queue import PriorityQueue

def a_star(maze):
    start_node = (maze.start_x, maze.start_y) 
    end_node = (maze.end_x, maze.end_y) 
    frontier = PriorityQueue()  
    frontier.put((0, start_node)) 
    came_from = {}  
    cost_so_far = {}  
    came_from[start_node] = None  
    cost_so_far[start_node] = 0

 
    while not frontier.empty():
        current_priority, current = frontier.get() 
        if current == end_node: 
            break
       
        for next in maze.get_neighbors(current[0], current[1]):
          
            new_cost = cost_so_far[current] + 1  
            
            if next not in cost_so_far or new_cost < cost_so_far[next]:
                cost_so_far[next] = new_cost  
                
               
                priority = new_cost + heuristic(end_node, next)  
                frontier.put((priority, next)) 
                came_from[next] = current  

    current = end_node
    path = []
    while current != start_node:
        path.append(current)
        current = came_from[current]
    path.append(start_node)
    path.reverse()  
    return path

def heuristic(a, b):
   
    return abs(a[0] - b[0]) + abs(a[1] - b[1])  


def play_next_music():

    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
    pygame.mixer.music.play()