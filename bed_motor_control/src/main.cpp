#include "Arduino.h"

int n;
String readString;

void setup(){
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);

  digitalWrite(2, LOW);
  digitalWrite(3, LOW);
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);

  Serial.begin(9600);
  n = 0;
}

void loop()
{

  // Control signal received from Serial connection
  while (Serial.available()) {
    delay(3);  //delay to allow buffer to fill
    if (Serial.available() > 0) {
      char c = Serial.read();  //gets one byte from serial buffer
      readString += c;
    }
  }
  if (readString.length() > 0) {
      n = readString.toInt();
      readString="";
      if (n < 5) {
        digitalWrite(n + 1, LOW);
      }
      else {
        digitalWrite(n - 3, HIGH);
      }
  }
