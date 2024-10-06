from flask import Flask, request
from flask_cors import CORS
import os

# Check if running on macOS
if os.uname().sysname == 'Darwin':  # macOS
    from mock_gpio import GPIO
else:
    print('Running on Raspberry Pi')
    import RPi.GPIO as GPIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Setup GPIO pins
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)  # Example GPIO pin

@app.route('/hand_signal', methods=['POST'])
def hand_signal():
    data = request.json
    distances = data['distances']
    
    # Process the distances and send commands to the robotic hand
    # Example: If the first finger is open, turn on the GPIO pin
    if distances[0] > 50:  # Example threshold
        GPIO.output(18, GPIO.HIGH)
    else:
        GPIO.output(18, GPIO.LOW)
    
    return {'status': 'signal received'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)  # Change the port to 8000