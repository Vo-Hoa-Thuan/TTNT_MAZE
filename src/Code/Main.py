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
    pygame.init()  # Khởi tạo pygame
    
    width, height = 1000, 500  # Đặt kích thước cửa sổ game
    screen = pygame.display.set_mode((width, height))  # Tạo cửa sổ game với kích thước đã định
    pygame.mixer.init()  # Khởi tạo mixer cho âm thanh
    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")  # Tải nhạc từ đường dẫn cụ thể
    pygame.mixer.music.set_volume(0.5)  # Đặt âm lượng của nhạc
    music_start_time = None  # Khởi tạo biến để lưu thời gian bắt đầu phát nhạc
    control_panel = ControlPanel(300, 500)  # Khởi tạo ControlPanel với kích thước
    maze = Maze(35, 25)  # Khởi tạo mê cung với số hàng và số cột
    ai = AI(maze)  # Khởi tạo trí tuệ nhân tạo (AI) với mê cung đã tạo
    auto_play = False  # Biến để theo dõi trạng thái tự động chơi
    shortest_path = None  # Biến để lưu đường đi ngắn nhất
    ai.maze = maze  # Thiết lập mê cung cho đối tượng AI
    start_time = None  # Biến để lưu thời gian bắt đầu chơi
    countdown_time = 59  # Thời gian đếm ngược ban đầu là 59 giây
    running = True  # Biến để theo dõi trạng thái của trò chơi (chạy hoặc dừng)
    game_over = False  # Biến để theo dõi trạng thái kết thúc của trò chơi
    game_over_time = None  # Biến để lưu thời gian khi trò chơi kết thúc
    maze_completed = False  # Biến để theo dõi trạng thái hoàn thành của mê cung
    congrats_display_time = None  # Biến để lưu thời gian hiển thị thông báo chúc mừng
    game_over_display_time = None  # Biến để lưu thời gian hiển thị thông báo game over

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
                    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")  # Tải nhạc từ đường dẫn
                    pygame.mixer.music.play()  # Phát nhạc khi người dùng nhấn vào Auto Play
                elif 750 <= mouse_x <= 950 and 150 <= mouse_y <= 200:
                    auto_play = True
                    shortest_path = a_star(maze)
                    start_time = time.time()
                    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")  # Tải nhạc từ đường dẫn
                    pygame.mixer.music.play()  # Phát nhạc khi người dùng nhấn vào AI Play
                elif 750 <= mouse_x <= 950 and 250 <= mouse_y <= 300:
                    maze = Maze(35, 25)
                    ai = AI(maze)  # Cập nhật đối tượng AI cho mê cung mới
                    auto_play = False
                    shortest_path = None
                    start_time = None  # Đặt lại thời gian về None khi reset mê cung
                    game_over = False  # Đặt lại trạng thái game_over về False khi reset mê cung
                    game_over_time = None  # Đặt lại thời gian kết thúc về None khi reset mê cung
                    pygame.mixer.music.stop()
                elif 750 <= mouse_x <= 950 and 350 <= mouse_y <= 400:
                    running = False


            elif event.type == KEYDOWN and auto_play:
                if not game_over:  # Thêm điều kiện này để ngăn chặn di chuyển sau khi game over
                    if event.key == K_UP:
                        ai.move_towards(ai.x, ai.y - 1)
                    elif event.key == K_DOWN:
                        ai.move_towards(ai.x, ai.y + 1)
                    elif event.key == K_LEFT:
                        ai.move_towards(ai.x - 1, ai.y)
                    elif event.key == K_RIGHT:
                        ai.move_towards(ai.x + 1, ai.y)
            
          # Kiểm tra xem người chơi hoặc con AI đã đến điểm cuối hay chưa
            if ai.x == maze.end_x and ai.y == maze.end_y:
                if not game_over:
                    game_over_time = time.time()  # Lưu thời điểm khi đạt đến điểm cuối
                    game_over = True  # Đặt trạng thái game_over thành True
                    total_time = game_over_time - start_time  # Tính tổng thời gian chơi
                    start_time = None  # Dừng đếm thời gian

                    # Tải và phát nhạc khi đến đích
                    pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/dendich.mp3")
                    pygame.mixer.music.play()

                    # Bắt đầu hiển thị thông báo chúc mừng
                    congrats_display_time = pygame.time.get_ticks()
                

        screen.fill((0, 0, 0))
        maze.display_maze(screen, ai)
        control_panel.display(screen)

         # Thay vì vẽ hình tròn, bạn sẽ vẽ hình ảnh mới tại vị trí hiện tại của đối tượng di chuyển
        if auto_play:
            if shortest_path:
                if len(shortest_path) > 1:
                    next_step = shortest_path.pop(1)
                    ai.move_towards(next_step[0], next_step[1])
            # Vẽ lại icon tại vị trí mới
            player_image = pygame.image.load("D:/TTNT_MAZE/src/Picture/icon.png").convert_alpha()
            player_image.set_colorkey((0, 0, 0))  # loại bỏ màu đen
            cell_size = 20
            player_image = pygame.transform.scale(player_image, (cell_size, cell_size))
            screen.blit(player_image, (ai.x * cell_size, ai.y * cell_size))

        rewards_to_remove = []  # Danh sách để lưu các phần tử cần loại bỏ
        play_reward_music = False  # Biến đánh dấu khi cần phát nhạc khi di chuyển trúng phần thưởng

        for reward in maze.rewards:
            if (ai.x, ai.y) == reward:
                start_time = time.time()
                start_time += 3  # Cộng thêm 3 giây vào thời gian đếm ngược
                rewards_to_remove.append(reward)  # Thêm phần tử cần loại bỏ vào danh sách tạm thời
                play_reward_music = True  # Đặt biến đánh dấu để phát nhạc khi di chuyển trúng phần thưởng

        # Loại bỏ các phần tử đã xử lý khỏi maze.rewards
        for reward in rewards_to_remove:
            maze.rewards.remove(reward)
        
        # Phát nhạc khi di chuyển trúng phần thưởng
        # Phát nhạc khi di chuyển trúng phần thưởng
        if play_reward_music:
            pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/trungthuong.mp3")
            pygame.mixer.music.play()
            # Gán sự kiện kết thúc nhạc
            pygame.mixer.music.set_endevent(pygame.USEREVENT)
            # Thêm hàm callback để phát nhạc tiếp theo sau khi nhạc hiện tại kết thúc
            pygame.mixer.music.queue("D:/TTNT_MAZE/src/Music/nhac.mp3")
            
        if start_time is not None and not game_over:
            elapsed_time = countdown_time - int(time.time() - start_time)  # Thời gian còn lại được tính bằng cách trừ thời gian đã trôi qua từ 60
            elapsed_time = max(0, elapsed_time)  # Đảm bảo thời gian không bị âm

            # Hiển thị thời gian đếm ngược
            font = pygame.font.Font(None, 36)
            time_text = font.render(f"TIME: {elapsed_time} S", True, (0, 0, 0))
            text_rect = time_text.get_rect()
            text_rect.topright = (width - 100, 10)  # Đặt vị trí của thời gian
            screen.blit(time_text, text_rect)

            # Kiểm tra và thông báo game over nếu hết thời gian mà icon không đạt đến điểm cuối
            if elapsed_time == 0 and not maze_completed:
                game_over = True
                game_over_time = time.time()  # Lưu thời điểm khi game over
                game_over_display_time = pygame.time.get_ticks()  # Lưu thời điểm hiển thị thông báo game over

                # Tải và phát nhạc khi game over
                pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/gameover.mp3")
                pygame.mixer.music.play()
                
            # Kiểm tra và vẽ thông báo chúc mừng nếu cần
        # Trong phần hiển thị thông báo Chúc mừng
        if congrats_display_time is not None:
            elapsed_congrats_time = current_time - congrats_display_time
            if elapsed_congrats_time < 10000:  # Hiển thị trong 10 giây
                # Vẽ nền thông báo
                pygame.draw.rect(screen, (0, 100, 0), (width // 2 - 200, height // 2 - 100, 400, 200), border_radius=15)

                mouse_pos = pygame.mouse.get_pos()

                # Hiển thị dòng chữ "Congratulations!"
                font = pygame.font.Font(None, 48)
                congrats_text = font.render("Congratulations !!", True, (255, 255, 255))
                text_rect = congrats_text.get_rect(center=(width // 2, height // 2 - 50))
                screen.blit(congrats_text, text_rect)

                # Nút "Chơi tiếp"
                continue_button_rect = pygame.Rect(width // 2 - 150, height // 2 + 10, 120, 40)
                # Thêm bóng đổ cho nút
                pygame.draw.rect(screen, (0, 100, 0), continue_button_rect, border_radius=10)  # Nút màu xanh
                pygame.draw.rect(screen, (0, 50, 0), continue_button_rect.move(3, 3), border_radius=10)  # Bóng đổ
                continue_font = pygame.font.Font(None, 32)
                continue_text = continue_font.render("New Maze", True, (255, 255, 255))
                continue_rect = continue_text.get_rect(center=(width // 2 - 90, height // 2 + 30))
                screen.blit(continue_text, continue_rect)

                # Nút "Thoát game"
                quit_button_rect = pygame.Rect(width // 2 + 30, height // 2 + 10, 120, 40)
                # Thêm bóng đổ cho nút
                pygame.draw.rect(screen, (150, 0, 0), quit_button_rect, border_radius=10)  # Nút màu đỏ
                pygame.draw.rect(screen, (100, 0, 0), quit_button_rect.move(3, 3), border_radius=10)  # Bóng đổ
                quit_text = continue_font.render("Exit Game !", True, (255, 255, 255))
                quit_rect = quit_text.get_rect(center=(width // 2 + 90, height // 2 + 30))
                screen.blit(quit_text, quit_rect)

                # Hiệu ứng hover: thay đổi màu khi di chuột vào nút
                if continue_button_rect.collidepoint(mouse_pos):
                    pygame.draw.rect(screen, (0, 200, 0), continue_button_rect, border_radius=10)  # Màu sáng khi hover
                if quit_button_rect.collidepoint(mouse_pos):
                    pygame.draw.rect(screen, (200, 0, 0), quit_button_rect, border_radius=10)  # Màu sáng khi hover

            else:
                congrats_display_time = None

            # Nếu đang hiển thị chúc mừng thì xử lý click vào nút
            if congrats_display_time is not None:
                mouse_x, mouse_y = pygame.mouse.get_pos()
                if (width // 2 - 150 <= mouse_x <= width // 2 - 30) and (height // 2 + 10 <= mouse_y <= height // 2 + 50):
                    # Chơi tiếp
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
                    # Thoát game
                    running = False


       # Kiểm tra và vẽ thông báo game over nếu cần
        if game_over_display_time is not None:
            elapsed_game_over_time = current_time - game_over_display_time
            if elapsed_game_over_time < 3000:  # Hiển thị thông báo trong 3 giây
                # Tạo hình nền màu đẹp hơn
                pygame.draw.rect(screen, (0, 0, 0), (width // 2 - 150, height // 2 - 50, 300, 100), border_radius=15)  # Màu đen, bo góc

                font = pygame.font.Font(None, 48)  # Kích thước chữ lớn hơn
                game_over_text = font.render("Game Over!", True, (255, 255, 255))  # Chữ trắng trên nền đen
                text_rect = game_over_text.get_rect(center=(width // 2, height // 2))
                screen.blit(game_over_text, text_rect)

                # Vẽ nút "Chơi lại"
                restart_button_rect = pygame.Rect(width // 2 - 150, height // 2 + 20, 120, 40)
                pygame.draw.rect(screen, (0, 100, 0), restart_button_rect, border_radius=10)  # Nút màu xanh
                pygame.draw.rect(screen, (0, 50, 0), restart_button_rect.move(3, 3), border_radius=10)  # Bóng đổ
                restart_font = pygame.font.Font(None, 32)
                restart_text = restart_font.render("Restart", True, (255, 255, 255))
                restart_rect = restart_text.get_rect(center=(width // 2 - 90, height // 2 + 40))
                screen.blit(restart_text, restart_rect)

                # Vẽ nút "Thoát game"
                quit_button_rect = pygame.Rect(width // 2 + 30, height // 2 + 20, 120, 40)
                pygame.draw.rect(screen, (150, 0, 0), quit_button_rect, border_radius=10)  # Nút màu đỏ
                pygame.draw.rect(screen, (100, 0, 0), quit_button_rect.move(3, 3), border_radius=10)  # Bóng đổ
                quit_text = restart_font.render("Exit Game", True, (255, 255, 255))
                quit_rect = quit_text.get_rect(center=(width // 2 + 90, height // 2 + 40))
                screen.blit(quit_text, quit_rect)

            else:
                game_over_display_time = None  # Ẩn thông báo sau khi đã hiển thị trong khoảng thời gian nhất định

        # Kiểm tra click vào nút khi game over
        if game_over_display_time is not None:
            mouse_x, mouse_y = pygame.mouse.get_pos()
            if (width // 2 - 150 <= mouse_x <= width // 2 - 30) and (height // 2 + 20 <= mouse_y <= height // 2 + 60):
                # Chơi lại
                ai = AI(maze)
                auto_play = False
                shortest_path = None
                start_time = None
                game_over = False
                maze_completed = False
                game_over_display_time = None
                pygame.mixer.music.load("D:/TTNT_MAZE/src/Music/nhac.mp3")  # Phát lại nhạc
                pygame.mixer.music.play()
            elif (width // 2 + 30 <= mouse_x <= width // 2 + 150) and (height // 2 + 20 <= mouse_y <= height // 2 + 60):
                # Thoát game
                running = False

        pygame.display.flip()
        pygame.time.delay(100)

    pygame.quit()

if __name__ == "__main__":
    main()
    
    
    
    
    
    
    