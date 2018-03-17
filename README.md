# SmartBedBackend
The backends used for socket communication between cloud server and bed server and services around it.

## Installation & running instruction
```
npm install
node app.js (on cloud server)
node app_client.js (on bed server)
```

## Description how its run in Artic IoT Challenge 2018:
`app.js` is to be run with the command `node app.js` on the Google Cloud server (or any cloud server).
`app_client.js` is to be run on the Raspberry pi. It is started with the command: `node app_client.js`

`app.js` starts a socket server and a rest service. This have to run before the client server is started in order to connect. The Rasberry Raspberry Pi is registering as a client to a socket ran on the Google Cloud server. This way we do not have to configure the network with port forwarding as that is a pain in the ass when we do not own the router.
The Raspberry Pi and the Google Cloud server can now communicate seamlessly.

## Services
In addition to the socket communication, both services are running a REST service in order to communicate with different modules both running on the Raspberry Pi and the Google Cloud server respectively.

Our native react app is calling the Google Cloud server, this server is communication the request to the Raspberry Pi via the socket setup. Then the Raspberry Pi calls a rest service that controls the power outlets.

We also have an Arduino connected to 5 sensors, through the Raspberry Pi. This Arduino is runnning the program `sensor_gathering.ino` in order to collect data and writing it to the serial port. This port is being listened to by the Python script `read_arduino_serial.py` and sent to the `app_client.js` server. This server is then sending it via the socket to the Google Cloud server which registers it in the database. The data is available to the dashboard in the app from another endpoint in `app.js`
