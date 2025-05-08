import pygame
from Maze import Maze
from pygame.locals import *
from queue import PriorityQueue
import time
from ControlPanel import ControlPanel
from AI import AI
from Algorithms import a_star, heuristic

font_path = "D:/TTNT_MAZE/src/Font/Minecraft.ttf"

def main():
    pygame.init()
    
    width, height = 1000, 500
    screen = pygame.display.set_mode((width, height))
    pygame.mixer.init()
    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
    pygame.mixer.music.set_volume(0.5)
    music_start_time = None
    control_panel = ControlPanel(300, 500)
    maze = Maze(35, 25)
    ai = AI(maze)
    auto_play = False
    shortest_path = None
    ai.maze = maze
    start_time = None
    countdown_time = 59
    running = True
    game_over = False
    game_over_time = None
    maze_completed = False
    congrats_display_time = None
    game_over_display_time = None

    while running:
        current_time = pygame.time.get_ticks()
        if ai.x == maze.end_x and ai.y == maze.end_y:
            maze_completed = True
        for event in pygame.event.get():
            if event.type == QUIT:
                running = False
            elif event.type == MOUSEBUTTONDOWN:
                maze, ai = control_panel.handle_event(event, maze, ai) 
                mouse_x, mouse_y = pygame.mouse.get_pos()
                if 750 <= mouse_x <= 950 and 50 <= mouse_y <= 100:
                    auto_play = True
                    start_time = time.time()
                    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
                    pygame.mixer.music.play()
                elif 750 <= mouse_x <= 950 and 150 <= mouse_y <= 200:
                    auto_play = True
                    shortest_path = a_star(maze)
                    start_time = time.time()
                    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
                    pygame.mixer.music.play()
                elif 750 <= mouse_x <= 950 and 250 <= mouse_y <= 300:
                    maze = Maze(35, 25)
                    ai = AI(maze)
                    auto_play = False
                    shortest_path = None
                    start_time = None
                    game_over = False
                    game_over_time = None
                    pygame.mixer.music.stop()
                elif 750 <= mouse_x <= 950 and 350 <= mouse_y <= 400:
                    running = False

            elif event.type == KEYDOWN and auto_play:
                if not game_over:
                    if event.key == K_UP:
                        ai.move_towards(ai.x, ai.y - 1)
                    elif event.key == K_DOWN:
                        ai.move_towards(ai.x, ai.y + 1)
                    elif event.key == K_LEFT:
                        ai.move_towards(ai.x - 1, ai.y)
                    elif event.key == K_RIGHT:
                        ai.move_towards(ai.x + 1, ai.y)

            if ai.x == maze.end_x and ai.y == maze.end_y:
                if not game_over:
                    game_over_time = time.time()
                    game_over = True
                    total_time = game_over_time - start_time
                    start_time = None
                    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/dendich.mp3")
                    pygame.mixer.music.play()
                    congrats_display_time = pygame.time.get_ticks()

        screen.fill((0, 0, 0))
        maze.display_maze(screen, ai)
        control_panel.display(screen)

        if auto_play:
            if shortest_path:
                if len(shortest_path) > 1:
                    next_step = shortest_path.pop(1)
                    ai.move_towards(next_step[0], next_step[1])
            player_image = pygame.image.load("D:/TTNT_MAZE/src/Picture/icon.png").convert_alpha()
            player_image.set_colorkey((0, 0, 0))
            cell_size = 20
            player_image = pygame.transform.scale(player_image, (cell_size, cell_size))
            screen.blit(player_image, (ai.x * cell_size, ai.y * cell_size))

        rewards_to_remove = []
        play_reward_music = False

        for reward in maze.rewards:
            if (ai.x, ai.y) == reward:
                start_time = time.time()
                start_time += 3
                rewards_to_remove.append(reward)
                play_reward_music = True

        for reward in rewards_to_remove:
            maze.rewards.remove(reward)

        if play_reward_music:
            pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/trungthuong.mp3")
            pygame.mixer.music.play()
            pygame.mixer.music.set_endevent(pygame.USEREVENT)
            pygame.mixer.music.queue("D:/TTNT_MAZE/src/Music/nhac.mp3")

        if start_time is not None and not game_over:
            elapsed_time = countdown_time - int(time.time() - start_time)
            elapsed_time = max(0, elapsed_time)
            font = pygame.font.Font(None, 36)
            time_text = font.render(f"TIME: {elapsed_time} S", True, (0, 0, 0))
            text_rect = time_text.get_rect()
            text_rect.topright = (width - 100, 10)
            screen.blit(time_text, text_rect)

            if elapsed_time == 0 and not maze_completed:
                game_over = True
                game_over_time = time.time()
                game_over_display_time = pygame.time.get_ticks()
                pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/gameover.mp3")
                pygame.mixer.music.play()

        if congrats_display_time is not None:
            elapsed_congrats_time = current_time - congrats_display_time
            if elapsed_congrats_time < 10000:
                pygame.draw.rect(screen, (0, 100, 0), (width // 2 - 200, height // 2 - 100, 400, 200), border_radius=15)
                mouse_pos = pygame.mouse.get_pos()
                font = pygame.font.Font(None, 48)
                congrats_text = font.render("Congratulations !!", True, (255, 255, 255))
                text_rect = congrats_text.get_rect(center=(width // 2, height // 2 - 50))
                screen.blit(congrats_text, text_rect)

                continue_button_rect = pygame.Rect(width // 2 - 150, height // 2 + 10, 120, 40)
                pygame.draw.rect(screen, (0, 100, 0), continue_button_rect, border_radius=10)
                pygame.draw.rect(screen, (0, 50, 0), continue_button_rect.move(3, 3), border_radius=10)
                continue_font = pygame.font.Font(None, 32)
                continue_text = continue_font.render("New Maze", True, (255, 255, 255))
                continue_rect = continue_text.get_rect(center=(width // 2 - 90, height // 2 + 30))
                screen.blit(continue_text, continue_rect)

                quit_button_rect = pygame.Rect(width // 2 + 30, height // 2 + 10, 120, 40)
                pygame.draw.rect(screen, (150, 0, 0), quit_button_rect, border_radius=10)
                pygame.draw.rect(screen, (100, 0, 0), quit_button_rect.move(3, 3), border_radius=10)
                quit_text = continue_font.render("Exit Game !", True, (255, 255, 255))
                quit_rect = quit_text.get_rect(center=(width // 2 + 90, height // 2 + 30))
                screen.blit(quit_text, quit_rect)

                if continue_button_rect.collidepoint(mouse_pos):
                    pygame.draw.rect(screen, (0, 200, 0), continue_button_rect, border_radius=10)
                if quit_button_rect.collidepoint(mouse_pos):
                    pygame.draw.rect(screen, (200, 0, 0), quit_button_rect, border_radius=10)
            else:
                congrats_display_time = None

            if congrats_display_time is not None:
                mouse_x, mouse_y = pygame.mouse.get_pos()
                if (width // 2 - 150 <= mouse_x <= width // 2 - 30) and (height // 2 + 10 <= mouse_y <= height // 2 + 50):
                    maze = Maze(35, 25)
                    ai = AI(maze)
                    auto_play = False
                    shortest_path = None
                    start_time = None
                    game_over = False
                    maze_completed = False
                    congrats_display_time = None
                    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
                    pygame.mixer.music.play()
                elif (width // 2 + 30 <= mouse_x <= width // 2 + 150) and (height // 2 + 10 <= mouse_y <= height // 2 + 50):
                    running = False

        if game_over_display_time is not None:
            elapsed_game_over_time = current_time - game_over_display_time
            if elapsed_game_over_time < 3000:
                pygame.draw.rect(screen, (0, 0, 0), (width // 2 - 150, height // 2 - 50, 300, 100), border_radius=15)
                font = pygame.font.Font(None, 48)
                game_over_text = font.render("Game Over!", True, (255, 255, 255))
                text_rect = game_over_text.get_rect(center=(width // 2, height // 2))
                screen.blit(game_over_text, text_rect)

                restart_button_rect = pygame.Rect(width // 2 - 150, height // 2 + 20, 120, 40)
                pygame.draw.rect(screen, (0, 100, 0), restart_button_rect, border_radius=10)
                pygame.draw.rect(screen, (0, 50, 0), restart_button_rect.move(3, 3), border_radius=10)
                restart_font = pygame.font.Font(None, 32)
                restart_text = restart_font.render("Restart", True, (255, 255, 255))
                restart_rect = restart_text.get_rect(center=(width // 2 - 90, height // 2 + 40))
                screen.blit(restart_text, restart_rect)

                quit_button_rect = pygame.Rect(width // 2 + 30, height // 2 + 20, 120, 40)
                pygame.draw.rect(screen, (150, 0, 0), quit_button_rect, border_radius=10)
                pygame.draw.rect(screen, (100, 0, 0), quit_button_rect.move(3, 3), border_radius=10)
                quit_text = restart_font.render("Exit Game", True, (255, 255, 255))
                quit_rect = quit_text.get_rect(center=(width // 2 + 90, height // 2 + 40))
                screen.blit(quit_text, quit_rect)
            else:
                game_over_display_time = None

        if game_over_display_time is not None:
            mouse_x, mouse_y = pygame.mouse.get_pos()
            if (width // 2 - 150 <= mouse_x <= width // 2 - 30) and (height // 2 + 20 <= mouse_y <= height // 2 + 60):
                ai = AI(maze)
                auto_play = False
                shortest_path = None
                start_time = None
                game_over = False
                maze_completed = False
                game_over_display_time = None
                pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")
                pygame.mixer.music.play()
            elif (width // 2 + 30 <= mouse_x <= width // 2 + 150) and (height // 2 + 20 <= mouse_y <= height // 2 + 60):
                running = False

        pygame.display.flip()
        pygame.time.delay(100)

    pygame.quit()

if __name__ == "__main__":
    main()
