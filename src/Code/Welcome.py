import pygame
import sys
import subprocess

pygame.init()

music_path = "D:/TTNT_MAZE/src/Music/nenstart.mp3"
font_path = "D:/TTNT_MAZE/src/Font/Minecraft.ttf"

SCREEN_WIDTH = 1000
SCREEN_HEIGHT = 500
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("WELCOME THE MAZE GAME")

pygame.mixer.music.load(music_path)
pygame.mixer.music.play(-1)

WHITE = (255, 255, 255)
GREY = (128, 128, 128)
BLACK = (0, 0, 0)

font = pygame.font.Font(font_path, 52)
button_font = pygame.font.Font(font_path, 24)

button_width = 200
button_height = 70
start_button = pygame.Rect(
    (SCREEN_WIDTH - button_width) // 2,
    (SCREEN_HEIGHT - button_height) // 2 + 30,
    button_width,
    button_height
)

def draw_outlined_text(surface, text, font, x, y, text_color, outline_color):
    outline_range = 2
    for dx in [-outline_range, 0, outline_range]:
        for dy in [-outline_range, 0, outline_range]:
            if dx != 0 or dy != 0:
                outline = font.render(text, True, outline_color)
                surface.blit(outline, (x + dx, y + dy))
    text_surface = font.render(text, True, text_color)
    surface.blit(text_surface, (x, y))

def draw_start_screen():
    background = pygame.image.load("D:/TTNT_MAZE/src/Picture/wellcome.jpg").convert()
    background = pygame.transform.scale(background, (SCREEN_WIDTH, SCREEN_HEIGHT))
    screen.blit(background, (0, 0))

    title_text = "Welcome to the maze game"
    text_width, text_height = font.size(title_text)
    x = (SCREEN_WIDTH - text_width) // 2
    y = SCREEN_HEIGHT // 2 - 100
    draw_outlined_text(screen, title_text, font, x, y, GREY, BLACK)

    pygame.draw.rect(screen, GREY, start_button, border_radius=8)
    start_text = button_font.render("START", True, WHITE)
    start_text_rect = start_text.get_rect(center=start_button.center)
    screen.blit(start_text, start_text_rect)

    pygame.display.flip()

def main():
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if start_button.collidepoint(event.pos):
                    main_py_path = r"D:\TTNT_MAZE\src\Code\Main.py"
                    subprocess.Popen(["python", "-u", main_py_path])
                    pygame.quit()
                    sys.exit()
        draw_start_screen()
    pygame.quit()

if __name__ == "__main__":
    main()
