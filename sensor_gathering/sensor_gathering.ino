#include <dht.h>

dht DHT;

#define DHT11_PIN 7

int photocellPin = 0;
int photocellReading;
int fsrAnalogPin = 1;
int fsrReading;
int flexPin = 2;
int flexReading;
int hygrometerPin = 3;
int hygrometerReading;
int timeBetweenReadings = 1000;

void setup(){
  Serial.begin(9600);
}

void loop()
{
  hygrometerReading = analogRead(hygrometerPin);
  //fsrReading = analogRead(fsrAnalogPin);
  //photocellReading = analogRead(photocellPin);
  //flexReading = analogRead(flexPin);
  //int chk = DHT.read11(DHT11_PIN);

  //photocellReading = map(photocellReading, 670, 1000, 0, 100);
  //flexReading = map(flexReading, 700, 900, 0, 100);
  hygrometerReading = constrain(hygrometerReading,400,1023);
  hygrometerReading = map(hygrometerReading,400,1023,100,0);

  /*
  Serial.print(fsrReading);
  Serial.print(",");
  Serial.print(photocellReading);
  Serial.print(",");
  Serial.print(flexReading);
  Serial.print(",");
  Serial.print(DHT.temperature);
  Serial.print(",");
  Serial.println(DHT.humidity);
  */
  //Serial.print(",");
  Serial.println(hygrometerReading);
  delay(timeBetweenReadings);
}
