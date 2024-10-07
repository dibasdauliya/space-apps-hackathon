#include <Servo.h>

Servo thumbServo, indexServo, middleServo, ringServo, pinkyServo;

void setup() {
  Serial.begin(9600);
  thumbServo.attach(2);  // Pin for thumb servo
  indexServo.attach(7);  // Pin for index finger servo
  middleServo.attach(4); // Pin for middle finger servo
  ringServo.attach(5);   // Pin for ring finger servo
  pinkyServo.attach(3); // Pin for pinky finger servo
  thumbServo.write(180-0);  // Pin for thumb servo
  indexServo.write(0);  // Pin for index finger servo
  middleServo.write(0); // Pin for middle finger servo
  ringServo.write(0);   // Pin for ring finger servo
  pinkyServo.write(0);
}

void loop() {
  if (Serial.available()) {
    String data = Serial.readStringUntil('\n'); // Read the incoming data until newline
    int commaIndex[4]; // To store positions of commas
    int angles[5] = {0}; // Array to store angles

    // Extract angles from the received data
    for (int i = 0; i < 5; i++) {
      commaIndex[i] = data.indexOf(',', i == 0 ? 0 : commaIndex[i - 1] + 1);
      if (commaIndex[i] == -1) {
        angles[i] = data.substring(i == 0 ? 0 : commaIndex[i - 1] + 1).toInt();
        break;
      } else {
        angles[i] = data.substring(i == 0 ? 0 : commaIndex[i - 1] + 1, commaIndex[i]).toInt();
      }
    }

    // Move servos to the received angles
    thumbServo.write(180-angles[0]);
    indexServo.write(angles[1]);
    middleServo.write(angles[2]);
    ringServo.write(angles[3]);
    pinkyServo.write(angles[4]);
  }
}
