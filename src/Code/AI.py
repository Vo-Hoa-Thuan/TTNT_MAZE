import pygame
from Maze import Maze
from pygame.locals import *
import threading

class AI:
    
    def __init__(self, maze):
        self.maze = maze
        self.x, self.y = maze.start_x, maze.start_y
        self.start_x = maze.start_x 
        self.start_y = maze.start_y 
        self.path = []  
        self.move_history = []  
    def move_towards(self, target_x, target_y):
        dx = target_x - self.x
        dy = target_y - self.y
        if dx != 0:
            dx //= abs(dx)
        if dy != 0:
            dy //= abs(dy)

        next_x = self.x + dx
        next_y = self.y + dy

       
        if self.maze.grid[next_y][next_x] == 0 or (next_x, next_y) in self.maze.obstacles:
         
            if (next_x, next_y) in self.maze.obstacles:
                
                if len(self.move_history) >= 4:
                
                    for i in range(3):
                        x, y = self.move_history.pop()
                        self.path.remove((x, y))
                        self.maze.grid[y][x] = 0
                    next_x, next_y = self.move_history[-1]  
                else:
                   
                    next_x, next_y = self.maze.start_x, self.maze.start_y

                
                self.x = next_x
                self.y = next_y
                self.path.append((self.x, self.y))
                self.move_history.append((self.x, self.y))

               
                threading.Thread(target=self.play_sound_after_reverse).start()

                return 

            
            self.x = next_x
            self.y = next_y
            self.path.append((self.x, self.y))
            self.move_history.append((self.x, self.y))

    def play_sound_after_reverse(self):
       
        pygame.mixer.init()
        pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/trungchuongngaivat.mp3")
        pygame.mixer.music.play()

 
        pygame.time.wait(3000)  
        pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
        pygame.mixer.music.play()

        