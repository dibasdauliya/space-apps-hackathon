import cv2
import mediapipe as mp
import time
import numpy as np

# Initialize MediaPipe Hands and drawing utilities
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Define indices for finger tips and wrist (landmark 0)
FINGER_TIP_LANDMARKS = [4, 8, 12, 16, 20]  # Thumb, Index, Middle, Ring, Pinky
WRIST_LANDMARK = 0

# Variables to store calibration data
open_distances = np.zeros(5)
close_distances = np.zeros(5)

# Function to calculate Euclidean distance between two landmarks
def calc_distance(landmark1, landmark2):
    return np.sqrt((landmark1.x - landmark2.x)**2 + (landmark1.y - landmark2.y)**2 + (landmark1.z - landmark2.z)**2)

# Function to calculate openness percentage for each finger
def calculate_openness(current_distances, open_distances, close_distances):
    return np.clip(100 * (current_distances - close_distances) / (open_distances - close_distances), 0, 100)

# Initialize webcam
cap = cv2.VideoCapture(0)

# Stage: 'calibration_open', 'calibration_close', 'operational'
stage = 'calibration_open'
start_time = time.time()

with mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7) as hands:
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        # Flip and process the image
        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = hands.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            # Get wrist and finger tip landmarks
            wrist = hand_landmarks.landmark[WRIST_LANDMARK]
            current_distances = np.array([
                calc_distance(hand_landmarks.landmark[tip], wrist) for tip in FINGER_TIP_LANDMARKS
            ])

            # Calibration Open: Store the 100% distance for each finger
            if stage == 'calibration_open':
                cv2.putText(image, "Open your palm! Calibrating 100% openness...", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
                if time.time() - start_time > 5:
                    open_distances = current_distances
                    stage = 'calibration_close'
                    start_time = time.time()

            # Calibration Close: Store the 0% distance for each finger
            elif stage == 'calibration_close':
                cv2.putText(image, "Close your hand! Calibrating 0% openness...", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
                if time.time() - start_time > 5:
                    close_distances = current_distances
                    stage = 'operational'

            # Operational Phase: Calculate and display the openness percentage
            elif stage == 'operational':
                openness_percentage = calculate_openness(current_distances, open_distances, close_distances)

                # Display openness percentage for each finger
                for i, finger_tip in enumerate(FINGER_TIP_LANDMARKS):
                    text = f"Finger {i+1}: {int(openness_percentage[i])}%"
                    cv2.putText(image, text, (10, 30 + i*30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # Show the image with results
        cv2.imshow('Finger Openness Calibration', image)

        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
