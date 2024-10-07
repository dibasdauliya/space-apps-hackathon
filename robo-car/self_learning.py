import RPi.GPIO as GPIO
import time
import cv2  # For camera feed

# GPIO Pin setup for motor control and sensors
in1 = 17
in2 = 18
in3 = 22
in4 = 23
ultrasonic_trig = 27  # Correct pin for Ultrasonic trigger
ultrasonic_echo = 4   # Correct pin for Ultrasonic echo
landscape_servo_pin = 25  # Landscape servo for sensor movement
vertical_servo_pin = 5  # Vertical servo to keep stable

# GPIO Setup
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(in1, GPIO.OUT)
GPIO.setup(in2, GPIO.OUT)
GPIO.setup(in3, GPIO.OUT)
GPIO.setup(in4, GPIO.OUT)
GPIO.setup(ultrasonic_trig, GPIO.OUT)
GPIO.setup(ultrasonic_echo, GPIO.IN)
GPIO.setup(landscape_servo_pin, GPIO.OUT)
GPIO.setup(vertical_servo_pin, GPIO.OUT)

# Initialize PWM for landscape and vertical servos
pwm_landscape_servo = GPIO.PWM(landscape_servo_pin, 50)  # 50Hz frequency for landscape servo motor
pwm_vertical_servo = GPIO.PWM(vertical_servo_pin, 50)  # 50Hz frequency for vertical servo motor
pwm_landscape_servo.start(0)
pwm_vertical_servo.start(0)

# Function to move the servo to a specific angle
def move_servo(pwm, angle):
    duty = angle / 18 + 2  # Calculate duty cycle for the desired angle
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)  # Give servo time to reach the position
    pwm.ChangeDutyCycle(0)

# Set landscape to 130 degrees and vertical to 140 degrees at the start
def initialize_servos():
    move_servo(pwm_landscape_servo, 130)  # Landscape servo starts at 130 degrees (slightly left)
    move_servo(pwm_vertical_servo, 140)   # Vertical servo at 140 degrees
    print("Landscape servo set to 130 degrees (slightly left), Vertical servo set to 140 degrees")

# Camera initialization with reduced resolution for faster frame rate
def start_camera():
    cap = cv2.VideoCapture(0)  # Capture video from the default camera
    if not cap.isOpened():
        print("Error: Could not open camera.")
        return None
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)  # Reduce resolution for better frame rate
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)
    cap.set(cv2.CAP_PROP_FPS, 30)  # Increase FPS to 30 if possible
    return cap

# Display the camera feed
def show_camera(cap):
    ret, frame = cap.read()  # Capture a single frame
    if ret:
        cv2.imshow('Camera Feed', frame)  # Show the frame in a window
    if cv2.waitKey(1) & 0xFF == ord('q'):  # Exit the loop when 'q' is pressed
        return False
    return True

# Ultrasonic sensor function to measure distance
def get_distance():
    GPIO.output(ultrasonic_trig, True)
    time.sleep(0.00001)
    GPIO.output(ultrasonic_trig, False)

    start_time = time.time()
    stop_time = time.time()

    while GPIO.input(ultrasonic_echo) == 0:
        start_time = time.time()

    while GPIO.input(ultrasonic_echo) == 1:
        stop_time = time.time()

    time_elapsed = stop_time - start_time
    distance = (time_elapsed * 34300) / 2  # Calculate distance in cm

    # Print statements for debugging
    if distance < 400:  # Valid distance
        print(f"Sensor detecting object at distance: {distance:.2f} cm")
    else:
        print("No object detected within sensor range.")

    return distance

# Motor control functions with slower speed (small steps)
def motor_forward_step():
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in4, GPIO.LOW)
    print("Car moving forward for a small step")
    time.sleep(0.3)  # Small step forward
    motor_stop()

def motor_backward_step():
    GPIO.output(in2, GPIO.HIGH)
    GPIO.output(in4, GPIO.HIGH)
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    print("Car moving backward slightly")
    time.sleep(0.3)  # Small step backward
    motor_stop()

def motor_left_step():
    GPIO.output(in1, GPIO.HIGH)
    GPIO.output(in3, GPIO.LOW)
    print("Car turning left slightly")
    time.sleep(0.3)  # Small turn left
    motor_stop()

def motor_right_step():
    GPIO.output(in3, GPIO.HIGH)
    GPIO.output(in1, GPIO.LOW)
    print("Car turning right slightly")
    time.sleep(0.09)  # Reduce right turn by 70%
    motor_stop()

def motor_stop():
    GPIO.output(in1, GPIO.LOW)
    GPIO.output(in2, GPIO.LOW)
    GPIO.output(in3, GPIO.LOW)
    GPIO.output(in4, GPIO.LOW)
    print("Car stopped")

# Function to take steps based on the distance measured
def take_steps_based_on_distance(distance):
    if distance > 100:
        print("Taking 3 steps as the path is clear for more than 100 cm.")
        motor_forward_step()
        motor_forward_step()
        motor_forward_step()
    elif distance > 50:
        print("Taking 2 steps as the path is clear for more than 50 cm.")
        motor_forward_step()
        motor_forward_step()
    else:
        print("Taking 1 step.")
        motor_forward_step()

# Autonomous obstacle avoidance loop with dynamic steps and slight right correction
def autonomous_navigation():
    try:
        # Start the camera
        cap = start_camera()
        if cap is None:
            return

        while True:
            # Show the camera feed
            if not show_camera(cap):
                break

            # Step 1: Check the distance in front
            distance = get_distance()
            print(f"Center distance: {distance:.2f} cm")

            # Step 2: If an obstacle is detected within 20 cm, handle avoidance
            if distance < 20:
                print("Obstacle detected! Checking surroundings...")
                motor_stop()

                # Move backward slightly to avoid the obstacle
                motor_backward_step()

                # Step 3: Check left and right
                move_servo(pwm_landscape_servo, 180)  # Check left (180 degrees)
                left_distance = get_distance()
                print(f"Left distance: {left_distance:.2f} cm")

                move_servo(pwm_landscape_servo, 0)  # Check right (0 degrees)
                right_distance = get_distance()
                print(f"Right distance: {right_distance:.2f} cm")

                # Step 4: Decide direction based on readings
                if left_distance > 20 and right_distance < 20:
                    print("Turning left to avoid obstacle")
                    motor_left_step()
                elif right_distance > 20 and left_distance < 20:
                    print("Turning right to avoid obstacle")
                    motor_right_step()
                elif left_distance > 20 and right_distance > 20:
                    print("Both sides are clear, choosing left...")
                    motor_left_step()
                else:
                    print("No clear path, backing up further")
                    motor_backward_step()
            else:
                # Step 5: Take steps based on the distance in front
                take_steps_based_on_distance(distance)

                # After moving forward, turn slightly right to correct direction
                print("Correcting path by turning slightly right after forward movement.")
                motor_right_step()

            # Reset the landscape servo to 130 degrees after each check
            move_servo(pwm_landscape_servo, 130)

            # Ensure vertical servo stays at 140 degrees
            move_servo(pwm_vertical_servo, 140)

            time.sleep(0.1)  # Short delay before next step

        # Release the camera and close all windows
        cap.release()
        cv2.destroyAllWindows()

    except KeyboardInterrupt:
        # Clean up GPIO settings on exit
        motor_stop()
        pwm_landscape_servo.stop()
        pwm_vertical_servo.stop()
        GPIO.cleanup()
        print("Autonomous navigation stopped.")

# Start the autonomous navigation
if __name__ == "__main__":
    print("Starting autonomous navigation with dynamic steps based on distance...")
    initialize_servos()  # Initialize both servos (landscape to 130, vertical to 140)
    autonomous_navigation()
