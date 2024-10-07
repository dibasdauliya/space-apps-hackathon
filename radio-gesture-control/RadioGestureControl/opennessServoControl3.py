import cv2
import mediapipe as mp
import time
import numpy as np
import serial

# Setup serial connection to Arduino
arduino = serial.Serial(port='COM13', baudrate=9600, timeout=1)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Constants for hand landmarks
FINGER_TIP_LANDMARKS = [4, 8, 12, 16, 20]
WRIST_LANDMARK = 0
INDEX_BASE = 5

# Arrays to store distance measurements
open_distances = np.zeros(5)
close_distances = np.zeros(5)

# Variables for wrist position
neutral_hand_x = 0

def calc_distance(landmark1, landmark2):
    """Calculate Euclidean distance between two landmarks."""
    return np.sqrt((landmark1.x - landmark2.x)**2 + 
                   (landmark1.y - landmark2.y)**2 + 
                   (landmark1.z - landmark2.z)**2)

def calculate_openness(current_distances, open_distances, close_distances):
    """Calculate openness percentage based on distance measurements."""
    return np.clip(100 * (current_distances - close_distances) / (open_distances - close_distances), 0, 100)

def openness_to_servo_angle(openness_percentage):
    """Convert openness percentage to servo angle (0 to 60 degrees) starting from 30 degrees."""
    return np.clip(30 + (openness_percentage / 100) * 60, 30, 90)  # Angle range: 30 to 90

def map_wrist_angle(hand_x, neutral_x):
    """Map hand's x-coordinate to wrist angle."""
    return np.clip((hand_x - neutral_x) * 360, -180, 180)

def send_servo_angles(servo_angles, wrist_angle):
    """Send servo angles to Arduino."""
    data = ','.join([str(int(angle)) for angle in servo_angles]) + f',{int(wrist_angle)}\n'
    arduino.write(data.encode())

# Open video capture
cap = cv2.VideoCapture(0)

# Calibration stage variables
stage = 'calibration_open'
start_time = time.time()

finger_names = ["Thumb", "Index", "Middle", "Ring", "Pinky"]

with mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7) as hands:
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            continue

        # Process the image
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = hands.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            wrist = hand_landmarks.landmark[WRIST_LANDMARK]
            current_distances = np.array([calc_distance(hand_landmarks.landmark[tip], wrist) for tip in FINGER_TIP_LANDMARKS])

            hand_x = hand_landmarks.landmark[WRIST_LANDMARK].x

            if stage == 'calibration_open':
                cv2.putText(image, "Open your palm! Calibrating 0% openness...", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                if time.time() - start_time > 3:
                    close_distances = current_distances
                    neutral_hand_x = hand_x
                    stage = 'calibration_close'
                    start_time = time.time()

            elif stage == 'calibration_close':
                cv2.putText(image, "Close your hand! Calibrating 100% openness...", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                if time.time() - start_time > 3:
                    open_distances = current_distances
                    stage = 'operational'

            elif stage == 'operational':
                openness_percentage = calculate_openness(current_distances, open_distances, close_distances)
                servo_angles = openness_to_servo_angle(openness_percentage)

                wrist_angle = map_wrist_angle(hand_x, neutral_hand_x)

                # Display the finger openness percentages and servo angles
                for i, finger_name in enumerate(finger_names):
                    text = f"{finger_name}: {int(openness_percentage[i])}% (Servo: {int(servo_angles[i])}°)"
                    cv2.putText(image, text, (10, 30 + i*30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)

                cv2.putText(image, f"Wrist Angle: {int(wrist_angle)}°", (10, 180), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                send_servo_angles(servo_angles, wrist_angle)

        # Show the processed image
        cv2.imshow('Finger and Wrist Movement', image)

        if cv2.waitKey(5) & 0xFF == 27:  # Exit on 'Esc' key
            break

cap.release()
cv2.destroyAllWindows()
arduino.close()
