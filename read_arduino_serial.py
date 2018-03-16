import serial
import json
import urllib2
import requests


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
      try:
          requests.request(method='get', url='localhost/registerSensorData/', data=data)
      except:
        pass