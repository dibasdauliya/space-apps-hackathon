import cv2
import numpy as np
def get_color_name(hue_value):
    if hue_value < 5:
        return "RED"
    elif hue_value < 22:
        return "ORANGE"
    elif hue_value < 33:
        return "YELLOW"
    elif hue_value < 78:
        return "GREEN"
    elif hue_value < 131:
        return "BLUE"
    elif hue_value < 170:
        return "VIOLET"
    else:
        return "RED"
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    # Convert the BGR frame to HSV
    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # Identify the center of the screen
    height, width, _ = frame.shape
    cx = int(width / 2)
    cy = int(height / 2)

    # Pick pixel value at the center of the screen
    pixel_center = hsv_frame[cy, cx]
    hue_value = pixel_center[0]

    # Get the color name based on hue value
    color_name = get_color_name(hue_value)

    # Get BGR values of the pixel at the center
    pixel_center_bgr = frame[cy, cx]
    b, g, r = int(pixel_center_bgr[0]), int(pixel_center_bgr[1]), int(pixel_center_bgr[2])

    # Draw a rectangle and put text on the frame
    cv2.rectangle(frame, (cx - 220, 10), (cx + 200, 120), (255, 255, 255), -1)
    cv2.putText(frame, color_name, (cx - 200, 100), cv2.FONT_HERSHEY_SIMPLEX, 3, (b, g, r), 5)
    cv2.circle(frame, (cx, cy), 5, (25, 25, 25), 3)

    # Display the frame
    cv2.imshow("Frame", frame)

    # Break the loop if the ESC key is pressed
    key = cv2.waitKey(1)
    if key == 27:
        break

# Release the video capture and destroy all windows
cap.release()
cv2.destroyAllWindows()
