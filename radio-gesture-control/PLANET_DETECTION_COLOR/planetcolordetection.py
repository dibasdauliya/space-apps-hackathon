import cv2
import numpy as np

def get_planet_name(hue_value):
    if hue_value < 5 or hue_value > 170:
        return "MARS"
    elif hue_value < 22:
        return "JUPITER"
    elif hue_value < 33:
        return "SATURN"
    elif hue_value < 78:
        return "EARTH"
    elif hue_value < 131:
        return "NEPTUNE"
    elif hue_value < 170:
        return "URANUS"
    else:
        return "VENUS"

cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    height, width, _ = frame.shape
    cx = int(width / 2)
    cy = int(height / 2)

    pixel_center = hsv_frame[cy, cx]
    hue_value = pixel_center[0]

    planet_name = get_planet_name(hue_value)

    cv2.rectangle(frame, (cx - 220, 10), (cx + 200, 120), (255, 255, 255), -1)
    cv2.putText(frame, planet_name, (cx - 200, 100), cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 0, 0), 5)
    cv2.circle(frame, (cx, cy), 5, (25, 25, 25), 3)

    cv2.imshow("Frame", frame)

    key = cv2.waitKey(1)
    if key == 27:
        break

cap.release()
cv2.destroyAllWindows()
