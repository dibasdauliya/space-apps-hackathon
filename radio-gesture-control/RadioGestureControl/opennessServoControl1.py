import cv2
import mediapipe as mp
import time
import numpy as np
import serial

arduino = serial.Serial(port='COM13', baudrate=9600, timeout=1)

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

FINGER_TIP_LANDMARKS = [4, 8, 12, 16, 20]
WRIST_LANDMARK = 0

open_distances = np.zeros(5)
close_distances = np.zeros(5)

def calc_distance(landmark1, landmark2):
    return np.sqrt((landmark1.x - landmark2.x)**2 + (landmark1.y - landmark2.y)**2 + (landmark1.z - landmark2.z)**2)

def calculate_openness(current_distances, open_distances, close_distances):
    return np.clip(100 * (current_distances - close_distances) / (open_distances - close_distances), 0, 100)

def openness_to_servo_angle(openness_percentage):
    return np.clip((openness_percentage / 100) * 180, 0, 180)

def send_servo_angles(servo_angles):
    data = ','.join([str(int(angle)) for angle in servo_angles]) + '\n'
    arduino.write(data.encode())

cap = cv2.VideoCapture(0)

stage = 'calibration_open'
start_time = time.time()

finger_names = ["Thumb", "Index", "Middle", "Ring", "Pinky"]

with mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7) as hands:
    while cap.isOpened():
        success, image = cap.read()
        if not success:
            print("Ignoring empty camera frame.")
            continue

        image = cv2.cvtColor(cv2.flip(image, 1), cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = hands.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.multi_hand_landmarks:
            hand_landmarks = results.multi_hand_landmarks[0]
            mp_drawing.draw_landmarks(image, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            wrist = hand_landmarks.landmark[WRIST_LANDMARK]
            current_distances = np.array([
                calc_distance(hand_landmarks.landmark[tip], wrist) for tip in FINGER_TIP_LANDMARKS
            ])

            if stage == 'calibration_open':
                cv2.putText(image, "Open your palm! Calibrating 100% openness...", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                if time.time() - start_time > 5:
                    close_distances = current_distances
                    stage = 'calibration_close'
                    start_time = time.time()

            elif stage == 'calibration_close':
                cv2.putText(image, "Close your hand! Calibrating 100% openness...", (10, 30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                if time.time() - start_time > 5:
                    open_distances = current_distances
                    stage = 'operational'

            elif stage == 'operational':
                openness_percentage = calculate_openness(current_distances, open_distances, close_distances)
                servo_angles = openness_to_servo_angle(openness_percentage)

                for i, finger_name in enumerate(finger_names):
                    text = f"{finger_name}: {int(openness_percentage[i])}% (Servo: {int(servo_angles[i])}°)"
                    cv2.putText(image, text, (10, 30 + i*30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)

                send_servo_angles(servo_angles)

        cv2.imshow('Finger Openness Calibration', image)

        if cv2.waitKey(5) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
arduino.close()
