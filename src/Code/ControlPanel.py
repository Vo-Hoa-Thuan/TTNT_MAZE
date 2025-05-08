# ControlPanel.py
import pygame
from Maze import Maze
from pygame.locals import *
from queue import PriorityQueue

font_path = "D:/TTNT_MAZE/src/Font/Minecraft.ttf"

class ControlPanel:
    def __init__(self, width, height):
        self.background_image = pygame.image.load("D:/TTNT_MAZE/src/Picture/background.png")
        self.background_image = pygame.transform.scale(self.background_image, (300, 500)) 
        self.font = pygame.font.Font(font_path, 24)
        self.direction_keys = {K_UP: (0, -1), K_DOWN: (0, 1), K_LEFT: (-1, 0), K_RIGHT: (1, 0)}
        self.current_direction = None
        self.move_continuous = False
        self.auto_play = False 
        self.levels_displayed = False  
        
    def reset_icon_position(self, ai):
        ai.x, ai.y = ai.start_x, ai.start_y 
    def handle_continuous_movement(self, maze, ai):
        if self.move_continuous and self.current_direction:
            dx, dy = self.current_direction
            
            if maze.grid[ai.y + dy][ai.x + dx] == 0:
                ai.move_towards(ai.x + dx, ai.y + dy)  
        return maze, ai


    def display(self, screen):
      
        bg_width, bg_height = self.background_image.get_size()  
        x = 700 
        y = 0  

        screen.blit(self.background_image, (x, y)) 
        text_color = (255, 255, 255) 

        auto_play_text = self.font.render("Auto Play", True, text_color)  
        ai_play_text = self.font.render("AI Play", True, text_color)
        reset_text = self.font.render("Reset Maze", True, text_color) 
        exit_text = self.font.render("Exit", True, text_color) 

 
        button_color = (0, 153, 204)  
        hover_color = (0, 102, 153)  
    
        buttons = [
            (750, 50, 200, 50, auto_play_text),  
            (750, 150, 200, 50, ai_play_text),  
            (750, 250, 200, 50, reset_text), 
            (750, 350, 200, 50, exit_text),  
        ]
        mouse_x, mouse_y = pygame.mouse.get_pos()  

       
        for button in buttons:
            x, y, width, height, text = button
           
            if x < mouse_x < x + width and y < mouse_y < y + height:
                pygame.draw.rect(screen, hover_color, (x, y, width, height))  
            else:
                pygame.draw.rect(screen, button_color, (x, y, width, height))  

            pygame.draw.rect(screen, (255, 255, 255), (x, y, width, height), 3)

            text_rect = text.get_rect(center=(x + width // 2, y + height // 2))
            screen.blit(text, text_rect)

    def handle_event(self, event, maze, ai):
        if event.type == pygame.MOUSEBUTTONDOWN:
            mouse_x, mouse_y = pygame.mouse.get_pos()  
   
            if 750 < mouse_x < 950 and 50 < mouse_y < 100:  
                self.auto_play = True  
                self.reset_icon_position(ai) 
       
            elif 750 < mouse_x < 950 and 150 < mouse_y < 200:  
                self.auto_play = False  
                self.reset_icon_position(ai)  

        elif event.type == KEYDOWN:
            if event.key in self.direction_keys:
                dx, dy = self.direction_keys[event.key]
               
                if maze.grid[ai.y + dy][ai.x + dx] == 0:
                    self.current_direction = (dx, dy)
                    self.move_continuous = True
                    if self.auto_play:  
                        maze, ai = self.handle_continuous_movement(maze, ai) 

        elif event.type == KEYUP:
            if event.key in self.direction_keys:
                if self.current_direction == self.direction_keys[event.key]:
                    self.move_continuous = False
                    self.current_direction = None

        return maze, ai

