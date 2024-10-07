import RPi.GPIO as GPIO
import time
import curses  # For keyboard input

# GPIO Pin setup for motor control and sensors
in1 = 17
in2 = 18
in3 = 22
in4 = 23

# GPIO Setup
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(in1, GPIO.OUT)
GPIO.setup(in2, GPIO.OUT)
GPIO.setup(in3, GPIO.OUT)
GPIO.setup(in4, GPIO.OUT)

# Array to store movements, speed, and delays
movement_data = []
recording = False  # Flag to track if we're recording
speed = 50  # Set default speed to 50% PWM
start_time = None  # Track when a movement starts

# Motor control functions
def motor_forward(speed):
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in4, GPIO.LOW)
    print(f"Car moving forward at speed {speed}%")

def motor_backward(speed):
    GPIO.output(in2, GPIO.HIGH)
    GPIO.output(in4, GPIO.HIGH)
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    print(f"Car moving backward at speed {speed}%")

def motor_left(speed):
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in3, GPIO.LOW)
    print(f"Car turning left at speed {speed}%")

def motor_right(speed):
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in1, GPIO.LOW)
    print(f"Car turning right at speed {speed}%")

def motor_stop():
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.LOW)
    print("Car stopped")

# Replay recorded movements with stored speed
def replay_movements():
    print("Replaying recorded movements...")
    print("Stored Array:", movement_data)  # Print the array before replay
    for action, recorded_speed, duration in movement_data:
        print(f"Executing action: {action} at speed {recorded_speed}% for {duration:.2f} seconds")  # Print action being executed
        if action == 'forward':
            motor_forward(recorded_speed)
        elif action == 'backward':
            motor_backward(recorded_speed)
        elif action == 'left':
            motor_left(recorded_speed)
        elif action == 'right':
            motor_right(recorded_speed)
        time.sleep(duration)  # Add delay based on recorded duration
        motor_stop()  # Stop after each action
    print("Finished replaying.")

# Function to record the action, speed, and duration
def record_action(action, duration):
    if recording:
        print(f"Recording {action} at speed {speed}% for {duration:.2f} seconds.")
        movement_data.append((action, speed, duration))  # Store action, speed, and duration

# Function to control the car with curses
def control_car(screen):
    global recording, start_time, speed
    curses.cbreak()
    screen.keypad(True)
    screen.nodelay(True)
    motor_is_running = {'forward': False, 'backward': False, 'left': False, 'right': False}

    try:
        while True:
            key = screen.getch()

            # Press 'w' to move forward, keep running until release
            if key == ord('w'):
                if not motor_is_running['forward']:
                    motor_forward(speed)
                    motor_is_running['forward'] = True
                    start_time = time.time()  # Start timing the movement
            elif motor_is_running['forward'] and key != ord('w'):
                motor_stop()
                motor_is_running['forward'] = False
                duration = time.time() - start_time  # Calculate movement duration
                record_action('forward', duration)  # Record forward movement

            # Press 's' to move backward, keep running until release
            if key == ord('s'):
                if not motor_is_running['backward']:
                    motor_backward(speed)
                    motor_is_running['backward'] = True
                    start_time = time.time()
            elif motor_is_running['backward'] and key != ord('s'):
                motor_stop()
                motor_is_running['backward'] = False
                duration = time.time() - start_time
                record_action('backward', duration)

            # Press 'a' to move left, keep running until release
            if key == ord('a'):
                if not motor_is_running['left']:
                    motor_left(speed)
                    motor_is_running['left'] = True
                    start_time = time.time()
            elif motor_is_running['left'] and key != ord('a'):
                motor_stop()
                motor_is_running['left'] = False
                duration = time.time() - start_time
                record_action('left', duration)

            # Press 'd' to move right, keep running until release
            if key == ord('d'):
                if not motor_is_running['right']:
                    motor_right(speed)
                    motor_is_running['right'] = True
                    start_time = time.time()
            elif motor_is_running['right'] and key != ord('d'):
                motor_stop()
                motor_is_running['right'] = False
                duration = time.time() - start_time
                record_action('right', duration)

            # Toggle recording with 'p'
            if key == ord('p'):
                recording = not recording
                if recording:
                    print("Recording movements...")
                    movement_data.clear()  # Clear previous recordings
                else:
                    print("Stopped recording movements.")
                print("Current Array after recording:", movement_data)  # Print array after recording

            # Press 'o' to replay actions
            if key == ord('o'):
                replay_movements()

            # Adjust speed: Press '+' to increase speed, '-' to decrease
            if key == ord('+'):
                speed = min(100, speed + 10)
                print(f"Speed increased to {speed}%")
            elif key == ord('-'):
                speed = max(10, speed - 10)
                print(f"Speed decreased to {speed}%")

            # Press 'q' to quit
            if key == ord('q'):
                break

            time.sleep(0.01)  # Reduce sleep time to minimize delay

    finally:
        motor_stop()  # Stop motors if script exits
        GPIO.cleanup()

# Main function to run everything
def main():
    # Use curses to control the car
    curses.wrapper(control_car)

if __name__ == "__main__":
    main()
