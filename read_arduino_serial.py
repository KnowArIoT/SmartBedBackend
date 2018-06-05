import serial
import json
import requests

url = 'http://localhost:8080/registerSensorData'
# url = 'http://localhost:8080'
FLEX_THRESHOLD = 25

ser = serial.Serial('/dev/ttyACM0',9600)
while True:
    read_serial=ser.readline()
    print read_serial
    if (len(read_serial) > 8):
        data = {}
        sensor_value_array = read_serial.split(',')
        if len(sensor_value_array) == 5:
              data['pressure'] = sensor_value_array[0]
              data['light'] = sensor_value_array[1]
              data['flex'] = sensor_value_array[2]
              data['temperature'] = sensor_value_array[3]
              data['humidity'] = sensor_value_array[4]
              print data
              if sensor_value_array[2] > FLEX_THRESHOLD:
                  try:
                      r = requests.post(url, data = data, timeout=3)#, data=data)
                  except Exception as e:
                      print e
                      print "Something went wrong when calling " + url
                      pass
