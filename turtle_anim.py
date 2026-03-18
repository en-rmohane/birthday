import turtle
import colorsys
import time
import random

def draw():
    screen = turtle.Screen()
    screen.setup(width=900, height=800)
    screen.title("A Special Surprise Desktop Animation! 🐢✨")
    screen.bgcolor("black")
    
    t = turtle.Turtle()
    t.speed(0)
    t.hideturtle()
    
    # Draw a mesmerizing colorful spiral
    t.penup()
    t.goto(0, 50)
    t.pendown()
    
    n = 180
    for i in range(n):
        c = colorsys.hsv_to_rgb(i / n, 0.9, 1.0)
        t.color(c)
        t.pensize(2)
        t.forward(i * 2 + 10)
        t.left(59)
        
    # Add scattered stars
    def draw_star(x, y, color, size):
        t.penup()
        t.goto(x, y)
        t.pendown()
        t.color(color)
        t.begin_fill()
        for _ in range(5):
            t.forward(size)
            t.right(144)
        t.end_fill()

    for _ in range(25):
        x = random.randint(-400, 400)
        y = random.randint(-350, 350)
        c = colorsys.hsv_to_rgb(random.random(), 0.8, 1.0)
        s = random.randint(10, 30)
        draw_star(x, y, c, s)

    # Write Birthday Message
    t.penup()
    t.goto(0, -320)
    t.pendown()
    t.color("#ffd700") # Gold
    t.write("Happy Birthday Mansi! 🎂", align="center", font=("Arial", 40, "bold"))
    
    t.penup()
    t.goto(0, -370)
    t.color("#ff6b9e")
    t.write("Keep smiling always! ✨", align="center", font=("Arial", 22, "italic"))

    time.sleep(8)

if __name__ == "__main__":
    try:
        draw()
    except Exception:
        pass
